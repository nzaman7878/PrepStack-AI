import { Check, Lock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoadmapNode({ topic, status, onClick, isLeft }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white border-green-600 shadow-green-500/30';
      case 'in-progress':
        return 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-500/40';
      default: // locked / not started
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-white" />;
      case 'in-progress':
        return <BookOpen className="w-5 h-5 text-white" />;
      default:
        return <Lock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(topic)}
      className={`
        relative group cursor-pointer 
        flex items-center justify-center p-4 
        w-48 sm:w-56 rounded-xl border-2 shadow-sm
        transition-colors duration-200 z-10
        ${getStatusStyles()}
      `}
    >
      {/* Connecting line to spine */}
      <div 
        className={`
          absolute top-1/2 -translate-y-1/2 h-1 transition-colors duration-500
          ${isLeft ? '-right-8 w-8' : '-left-8 w-8'}
          ${status === 'completed' ? 'bg-green-500' : status === 'in-progress' ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-300'}
        `}
      />

      <div className="flex items-center gap-3 w-full">
        <div className={`
          flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors
          ${status === 'completed' ? 'bg-green-600' : status === 'in-progress' ? 'bg-indigo-500' : 'bg-slate-200 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
        `}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate leading-tight">
            {topic.name}
          </p>
          {topic.estimatedTime && (
            <p className={`text-[10px] mt-0.5 opacity-80 ${status === 'not-started' ? 'text-slate-400' : 'text-white/80'}`}>
              {topic.estimatedTime}
            </p>
          )}
        </div>
      </div>
      
      {/* In progress pulse effect */}
      {status === 'in-progress' && (
        <span className="absolute -inset-1 rounded-xl border-2 border-indigo-400/50 animate-ping -z-10" />
      )}
    </motion.div>
  );
}
