import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getRoadmap } from '../lib/api';
import { CheckCircle2, Circle, Clock, ArrowLeft, ExternalLink, PlayCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoadmapDetails() {
  const { roadmapSlug } = useParams();

  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ['roadmap', roadmapSlug],
    queryFn: () => getRoadmap(roadmapSlug),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!roadmapData?.roadmap) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900">Roadmap not found</h2>
        <Link to="/roadmap" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Roadmaps</Link>
      </div>
    );
  }

  const { roadmap, progressMap } = roadmapData;

  const getResourceIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'article': 
      case 'documentation': return <BookOpen className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/roadmap" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roadmaps
        </Link>
      </div>
      
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
          {roadmap.title}
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl">
          {roadmap.description}
        </p>
      </div>

      <div className="relative border-l-4 border-slate-200 ml-4 md:ml-8 space-y-16 pb-12">
        {roadmap.phases?.map((phase, phaseIdx) => (
          <div key={phase._id} className="relative pl-8 md:pl-12">
            <div className="absolute -left-[14px] top-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-indigo-500"></div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Phase {phaseIdx + 1}: {phase.name}</h2>
            <p className="text-slate-600 mb-8 max-w-3xl">{phase.description}</p>
            
            <div className="space-y-10">
              {phase.milestones?.map((milestone, msIdx) => (
                <div key={milestone._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                  <p className="text-slate-600 mb-6">{milestone.description}</p>
                  
                  <div className="space-y-4">
                    {milestone.topics?.map(topic => {
                      const isCompleted = progressMap?.[topic.slug] === 'completed';
                      
                      return (
                        <div key={topic._id} className={`rounded-xl border ${isCompleted ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'} p-5 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50`}>
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex items-start flex-1">
                              {isCompleted ? (
                                <CheckCircle2 className="mr-3 h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <Circle className="mr-3 h-6 w-6 text-slate-300 mt-0.5 flex-shrink-0" />
                              )}
                              
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                  {topic.name}
                                  {topic.estimatedTime && (
                                    <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {topic.estimatedTime}
                                    </span>
                                  )}
                                </h4>
                                <p className="mt-1 text-slate-600 text-sm leading-relaxed">{topic.description}</p>
                                
                                {topic.resources?.length > 0 && (
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {topic.resources.map((res, rIdx) => (
                                      <a 
                                        key={rIdx} 
                                        href={res.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-full hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                      >
                                        {getResourceIcon(res.type)}
                                        {res.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="md:w-auto w-full md:pl-4 md:border-l md:border-slate-200 flex md:flex-col items-center md:items-end justify-between md:justify-center">
                              {topic.topicRef && topic.topicRef.track ? (
                                <Link 
                                  to={`/tracks/${topic.topicRef.track.slug}/${topic.topicRef.slug}`}
                                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 w-full text-center"
                                >
                                  Take Quiz / Practice
                                </Link>
                              ) : (
                                <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                                  Theory Only
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
