import { useQuery } from '@tanstack/react-query';
import { getTracks } from '../lib/api';
import { Link } from 'react-router';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Roadmap() {
  const { data: tracks, isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: getTracks,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Interactive Roadmap
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Your step-by-step guide to mastering full-stack engineering.
        </p>
      </div>

      <div className="relative border-l-4 border-slate-200 ml-3 md:ml-6 space-y-12 pb-8">
        {tracks?.map((track, index) => (
          <motion.div 
            key={track._id} 
            className="relative pl-8 md:pl-12"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div 
              className="absolute -left-[14px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white"
              style={{ backgroundColor: track.color }}
            ></div>
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">{track.name}</h2>
                <Link 
                  to={`/tracks/${track.slug}`}
                  className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                >
                  View Track
                </Link>
              </div>
              <p className="mb-6 text-slate-600">{track.description}</p>
              
              <div className="space-y-3">
                {track.topics?.map((topic, topicIdx) => (
                  <Link 
                    key={topic._id}
                    to={`/tracks/${track.slug}/${topic.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-center">
                      {/* For now, assuming not started. Real app would check Progress model */}
                      <Circle className="mr-3 h-5 w-5 text-slate-300 group-hover:text-blue-400" />
                      <span className="font-medium text-slate-700 group-hover:text-blue-700">
                        {topicIdx + 1}. {topic.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400 group-hover:text-blue-500">
                      {topic.difficulty}
                    </span>
                  </Link>
                ))}
                {(!track.topics || track.topics.length === 0) && (
                  <div className="p-4 text-sm text-slate-500 italic text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Topics coming soon...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
