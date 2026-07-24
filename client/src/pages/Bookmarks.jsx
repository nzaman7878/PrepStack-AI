import { useQuery } from '@tanstack/react-query';
import { getBookmarks } from '../lib/api';
import { Link } from 'react-router';
import { Bookmark as BookmarkIcon, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Bookmarks() {
  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
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
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Bookmarks</h1>
          <p className="mt-2 text-slate-500">Quick access to your saved topics and questions.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <BookmarkIcon className="h-6 w-6" />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error?.response?.status === 401 ? 'Please log in to view bookmarks.' : 'Failed to load bookmarks.'}
        </div>
      ) : bookmarks?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <BookmarkIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No bookmarks yet</h3>
          <p className="mt-1 text-slate-500">Save important topics and questions to review them later.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks?.map((bookmark, idx) => {
            let metadata = { title: 'Unknown', link: '#' };
            try {
              if (bookmark.notes) metadata = JSON.parse(bookmark.notes);
            } catch (e) {}
            
            return (
              <motion.div
                key={bookmark._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={metadata.link}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600">
                      <BookmarkIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                        {metadata.title}
                      </h3>
                      <p className="text-sm text-slate-500 capitalize">{bookmark.itemType}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-300 group-hover:text-blue-500" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
