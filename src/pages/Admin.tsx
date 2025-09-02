import React, { useState, useEffect } from 'react';
import { signIn, signOut, getCurrentUser } from '../lib/supabase';
import { LogOut, Plus, Trash2, Briefcase, MapPin } from 'lucide-react';
import JobForm from '../components/JobForm';
import { Job } from '../lib/supabase';
import logo from "../assets/logo.png"

const Admin: React.FC = () => {
  interface SupabaseUser {
    email?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await getCurrentUser();
      setUser(data?.user || null);
      setLoading(false);
      if (data?.user) {
        fetchJobs();
      }
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setLoginError('Invalid email or password');
      } else {
        // Refresh user state
        const { data } = await getCurrentUser();
        setUser(data?.user || null);
        fetchJobs();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/.netlify/functions/getJobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleJobAdded = () => {
    setShowJobForm(false);
    fetchJobs();
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch('/.netlify/functions/deleteJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId })
      });

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
             <div>
              <img src={logo} alt="Dunamis Power logo" className='w-20 rounded-2xl' />
              </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-slate-600 mt-2">Access the job management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="admin@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
                 <div>
                            <img src={logo} alt="Dunamis Power logo" className='w-40 rounded-2xl' />
                          </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage job postings</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Job Management</h2>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Job</span>
          </button>
        </div>

        {/* Jobs List */}
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{job.title}</h3>
                  <div className="flex items-center text-slate-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{job.description}</p>
                  <p className="text-sm text-slate-500 mt-4">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete job"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs posted yet</h3>
            <p className="text-slate-600">Start by adding your first job posting!</p>
          </div>
        )}
      </main>

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          onClose={() => setShowJobForm(false)}
          onJobAdded={handleJobAdded}
        />
      )}
    </div>
  );
};

export default Admin;