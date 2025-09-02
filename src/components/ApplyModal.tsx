/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { Job } from '../lib/supabase';

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setCvFile(file);
      } else {
        alert('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('jobId', job.id);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('coverLetter', formData.coverLetter);
      if (cvFile) {
        formDataToSend.append('cv', cvFile);
      }

      const response = await fetch('/.netlify/functions/applyJob', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        setSubmitMessage('Application submitted successfully! We\'ll be in touch soon.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      setSubmitMessage('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Apply for Position</h2>
            <p className="text-slate-600 mt-1">{job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        {/* Job Image & Description */}
        <div className="p-6 border-b border-slate-100">
          {job.image_url && (
            <img src={job.image_url} alt={job.title} className="w-full h-48 object-cover rounded-lg mb-4" />
          )}
          <p className="text-slate-700 whitespace-pre-line mb-2"><strong>Description:</strong></p>
          <p className="text-slate-700 whitespace-pre-line mb-2">{job.description}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload CV (PDF or DOCX)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label 
                htmlFor="cv-upload" 
                className="cursor-pointer flex flex-col items-center"
              >
                {cvFile ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <FileText className="h-6 w-6" />
                    <span>{cvFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-slate-600">Click to upload your CV</span>
                    <span className="text-sm text-slate-500 mt-1">PDF or DOCX files only</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {submitMessage && (
            <div className={`p-4 rounded-lg ${
              submitMessage.includes('success') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;