import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Job } from '../lib/supabase';

interface JobCardProps {
  job: Job;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const isLong = job.description.length > 200;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <div className="space-y-4">
        {job.image_url && (
          <div className="mb-4">
            <img src={job.image_url} alt={job.title} className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-slate-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Posted: {new Date(job.created_at).toLocaleDateString()}
          </div>
        </div>

        <div>
          <p className={`text-slate-700 leading-relaxed ${!showFullDesc ? 'line-clamp-3' : ''}`}>
            {showFullDesc || !isLong ? job.description : job.description.slice(0, 200) + '...'}
          </p>
          {isLong && (
            <button
              className="text-blue-600 hover:underline mt-2 text-sm"
              onClick={() => setShowFullDesc((v) => !v)}
            >
              {showFullDesc ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onApply}
            className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 group"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;