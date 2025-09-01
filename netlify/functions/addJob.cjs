const { createClient } = require('@supabase/supabase-js');
const Busboy = require('busboy');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const fields = {};
    let imageBuffer = null;
    let imageFilename = null;
    let imageMimeType = null;

    await new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: event.headers,
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB
      });

      // ✅ Parse text fields
      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val;
      });

      // ✅ Parse files
      busboy.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        if (fieldname === 'image' && mimeType && mimeType.startsWith('image/')) {
          const chunks = [];
          file.on('data', (data) => chunks.push(data));
          file.on('end', () => {
            imageBuffer = Buffer.concat(chunks);
            imageFilename = filename;
            imageMimeType = mimeType;
          });
        } else {
          file.resume();
        }
      });

      busboy.on('finish', resolve);
      busboy.on('error', reject);

      const body = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : Buffer.from(event.body, 'utf8');
      busboy.end(body);
    });

    const { title, description, location } = fields;

    if (!title || !description || !location) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    let image_url = null;
    if (imageBuffer && imageFilename) {
      const fileName = `${Date.now()}-${imageFilename}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-image')
        .upload(fileName, imageBuffer, { contentType: imageMimeType });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('job-image')
          .getPublicUrl(fileName);
        image_url = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([{ title, description, location, image_url }])
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ job: data })
    };
  } catch (error) {
    console.error('Error adding job:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to add job' })
    };
  }
};
