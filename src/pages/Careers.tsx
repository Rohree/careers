import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { Job } from '../lib/supabase';
import logo from '../assets/logo.png';
import hero from '../assets/hero-career.png';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/.netlify/functions/getJobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <img src={logo} alt="Dunamis Power logo" className='w-40 rounded-2xl' />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Join Our Team</h1>
              {/* <p className="text-slate-600 mt-1">Discover exciting career opportunities here at Dunamis Power</p> */}
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section
        className="w-full h-[600px] flex items-center justify-center relative mb-12"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Careers at Dunamis Power</h1>
          <p className="text-xl max-w-2xl mx-auto drop-shadow-md">
            Empower your future with us. Explore opportunities to grow, innovate, and make an impact.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No job openings</h3>
            <p className="text-slate-600">Check back soon for new opportunities!</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Current Openings</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                We're looking for talented individuals to join our growing team. 
                Explore the roles below and find your perfect match.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onApply={() => handleApply(job)} 
                />
              ))}
            </div>
          </>
        )}
      </main>
      <section>
        <Testimonials />
        <Footer />
      </section>
    

      {/* Apply Modal */}
      {isModalOpen && selectedJob && (
        <ApplyModal
          job={selectedJob}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Careers;