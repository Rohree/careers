const { createClient } = require('@supabase/supabase-js');
const Busboy = require('busboy');
const { Resend } = require('resend');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure Resend
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse multipart form data using Busboy
    const fields = {};
    const files = {};
    let cvBuffer = null;
    let cvFilename = null;
    let cvMimeType = null;

    try {
      await new Promise((resolve, reject) => {
        const busboy = Busboy({
          headers: event.headers,
          limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        });

        busboy.on('field', (fieldname, val) => {
          fields[fieldname] = val;
        });

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
          if (
            fieldname === 'cv' &&
            (mimetype === 'application/pdf' ||
              mimetype ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
          ) {
            const chunks = [];
            file.on('data', (data) => chunks.push(data));
            file.on('end', () => {
              cvBuffer = Buffer.concat(chunks);
              cvFilename = filename;
              cvMimeType = mimetype;
              files.cv = { buffer: cvBuffer, filename: cvFilename, mimetype: cvMimeType };
            });
          } else {
            file.resume(); // skip other files
          }
        });

        busboy.on('finish', resolve);
        busboy.on('error', (err) => reject(new Error('Error parsing form data: ' + err.message)));

        const body = event.isBase64Encoded
          ? Buffer.from(event.body, 'base64')
          : Buffer.from(event.body, 'utf8');
        busboy.end(body);
      });
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Error parsing form data: ' + err.message }),
      };
    }

    const jobId = fields.jobId;
    const fullName = fields.fullName;
    const email = fields.email;
    const phone = fields.phone;
    const coverLetter = fields.coverLetter;

    if (!jobId || !fullName || !email || !phone || !coverLetter) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: jobId, fullName, email, phone, coverLetter are required.' }),
      };
    }

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: jobError ? `Job fetch error: ${jobError.message}` : 'Job not found' }),
      };
    }

    // Upload CV if present
    let cvUrl = null;
    if (files.cv && files.cv.buffer) {
      const fileName = `${Date.now()}-${files.cv.filename || 'cv.pdf'}`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, files.cv.buffer, {
          contentType: files.cv.mimetype,
        });
      if (uploadError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: `CV upload error: ${uploadError.message}` }),
        };
      }
      const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(fileName);
      cvUrl = urlData.publicUrl;
    }

    // Save application to database
    const { data: application, error: dbError } = await supabase
      .from('applications')
      .insert([
        {
          job_id: jobId,
          full_name: fullName,
          email,
          phone,
          cover_letter: coverLetter,
          cv_url: cvUrl,
        },
      ])
      .select()
      .single();

    if (dbError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Database error: ${dbError.message}` }),
      };
    }

    // Send email via Resend
    let resendAttachments = [];
    if (cvBuffer && cvFilename) {
      resendAttachments.push({
        filename: cvFilename,
        content: cvBuffer,
      });
    }

    try {
      await resend.emails.send({
        from: 'mail.hellorory.dev',
        to: 'rorisangpetja07@gmail.com',
        subject: `New Job Application: ${job.title}`,
        html: `
          <h2>New Job Application Received</h2>
          <p><strong>Position:</strong> ${job.title}</p>
          <p><strong>Applicant:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Cover Letter:</strong></p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
            ${coverLetter.replace(/\n/g, '<br>')}
          </div>
          ${cvUrl ? `<p><strong>CV:</strong> <a href="${cvUrl}">View CV</a></p>` : '<p>No CV uploaded</p>'}
        `,
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
      });
    } catch (emailError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Email send error: ${emailError.message}` }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Application submitted successfully',
        application,
      }),
    };
  } catch (error) {
    console.error('Error processing application:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process application' }),
    };
  }
};
