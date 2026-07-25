import { X, Clock, PlayCircle, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

export default function TopicDetailPanel({ topic, isOpen, onClose }) {
  if (!topic) return null;

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'article': 
      case 'documentation': return <BookOpen className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-slate-200"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Topic Details</h3>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{topic.name}</h2>
                {topic.estimatedTime && (
                  <span className="inline-flex items-center text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {topic.estimatedTime}
                  </span>
                )}
              </div>

              <div className="prose prose-slate prose-sm max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed text-base">{topic.description}</p>
              </div>

              {topic.prerequisites?.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Prerequisites</h4>
                  <ul className="space-y-2">
                    {topic.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-start text-slate-600 text-sm">
                        <span className="mr-2 text-indigo-400">•</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {topic.resources?.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Recommended Resources</h4>
                  <div className="space-y-3">
                    {topic.resources.map((res, idx) => (
                      <a 
                        key={idx} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors group"
                      >
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {getResourceIcon(res.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{res.title}</p>
                          <p className="text-xs text-slate-500 capitalize">{res.type}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 bg-white">
              {topic.topicRef && topic.topicRef.track ? (
                <Link 
                  to={`/tracks/${topic.topicRef.track.slug}/${topic.topicRef.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Start Learning <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-500 rounded-xl font-medium border border-slate-200">
                  Theory Only - No Exercises
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
