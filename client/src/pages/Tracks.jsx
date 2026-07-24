import { useQuery } from '@tanstack/react-query';
import { getTracks } from '../lib/api';
import { Link } from 'react-router';
import { Layout, Server, Cpu, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  layout: Layout,
  server: Server,
  cpu: Cpu,
  database: Database,
};

export default function Tracks() {
  const { data: tracks, isLoading, error } = useQuery({
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

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-600">
        Error loading tracks: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Interview Tracks
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Choose a path to start your personalized interview preparation.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tracks?.map((track, index) => {
          const Icon = iconMap[track.icon] || Layout;
          
          return (
            <motion.div
              key={track._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/tracks/${track.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-lg hover:ring-blue-500"
              >
                <div 
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${track.color}20`, color: track.color }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {track.name}
                </h3>
                
                <p className="mb-6 flex-grow text-slate-600">
                  {track.description}
                </p>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm font-medium text-slate-500">
                    {track.topics?.length || 0} topics
                  </span>
                  <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-500">
                    Explore path
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
