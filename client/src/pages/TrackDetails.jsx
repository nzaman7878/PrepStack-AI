import { useQuery } from '@tanstack/react-query';
import { getTrack } from '../lib/api';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Clock, BarChart, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function TrackDetails() {
  const { trackSlug } = useParams();

  const { data: track, isLoading, error } = useQuery({
    queryKey: ['track', trackSlug],
    queryFn: () => getTrack(trackSlug),
  });

  useDocumentTitle(track ? `${track.name} Track` : 'Track Details');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        Error loading track details.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/tracks" className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tracks
      </Link>

      <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">{track.name}</h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-600">{track.description}</p>
        </div>
        <Link 
          to={`/tracks/${trackSlug}/interview`}
          className="inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
        >
          <Bot className="mr-2 h-5 w-5" />
          Mock Interview
        </Link>
      </div>

      <div className="space-y-6">
        {track.topics?.map((topic, index) => (
          <motion.div
            key={topic._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={`/tracks/${track.slug}/${topic.slug}`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {topic.order}
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                      {topic.name}
                    </h3>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <BarChart className="mr-1.5 h-4 w-4" />
                      <span className="capitalize">{topic.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4" />
                      {topic.estimatedTime} mins
                    </div>
                    
                    <div className="flex gap-2">
                      {topic.tags?.map(tag => (
                        <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    Start Learning
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        
        {(!track.topics || track.topics.length === 0) && (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <h3 className="text-lg font-medium text-slate-900">No topics yet</h3>
            <p className="mt-1 text-slate-500">Topics for this track are coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
