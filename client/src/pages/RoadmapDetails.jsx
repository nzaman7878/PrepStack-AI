import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getRoadmap } from '../lib/api';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import RoadmapNode from '../components/roadmap/RoadmapNode';
import TopicDetailPanel from '../components/roadmap/TopicDetailPanel';

export default function RoadmapDetails() {
  const { roadmapSlug } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const { data: roadmapData, isLoading } = useQuery({
    queryKey: ['roadmap', roadmapSlug],
    queryFn: () => getRoadmap(roadmapSlug),
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!roadmapData?.roadmap) {
    return (
      <div className="text-center py-20 h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900">Roadmap not found</h2>
        <Link to="/roadmap" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Roadmaps</Link>
      </div>
    );
  }

  const { roadmap, progressMap } = roadmapData;

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const getTopicStatus = (topic) => {
    if (progressMap?.[topic.slug] === 'completed') return 'completed';
    if (progressMap?.[topic.slug] === 'in-progress') return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="relative h-screen w-full bg-slate-50 overflow-hidden flex flex-col">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/roadmap" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{roadmap.title}</h1>
            <p className="text-xs font-medium text-slate-500">{roadmap.role}</p>
          </div>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="flex-1 w-full h-full pt-20">
        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={2}
          centerOnInit={true}
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Floating Controls */}
              <div className="absolute bottom-8 left-8 z-30 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200">
                <button onClick={() => zoomIn()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Zoom In">
                  <ZoomIn className="w-5 h-5 text-slate-700" />
                </button>
                <div className="w-full h-px bg-slate-200 my-1" />
                <button onClick={() => zoomOut()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Zoom Out">
                  <ZoomOut className="w-5 h-5 text-slate-700" />
                </button>
                <div className="w-full h-px bg-slate-200 my-1" />
                <button onClick={() => resetTransform()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Reset View">
                  <Maximize className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <TransformComponent wrapperClass="w-full h-full cursor-grab active:cursor-grabbing !bg-slate-50">
                <div className="relative min-w-max p-32 flex flex-col items-center">
                  
                  {/* The Central Spine */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-slate-200 rounded-full" />

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="flex flex-col items-center gap-y-24 w-full"
                  >
                    {roadmap.phases?.map((phase, pIdx) => (
                      <div key={phase._id} className="relative flex flex-col items-center w-full">
                        
                        {/* Phase Header */}
                        <div className="relative z-10 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg shadow-indigo-600/30 border-4 border-white mb-16">
                          <h2 className="text-xl font-black uppercase tracking-widest">Phase {pIdx + 1}: {phase.name}</h2>
                        </div>

                        {/* Milestones inside Phase */}
                        <div className="flex flex-col items-center gap-y-32 w-full">
                          {phase.milestones?.map((milestone, mIdx) => (
                            <div key={milestone._id} className="relative w-full flex flex-col items-center">
                              
                              {/* Milestone Node on spine */}
                              <div className="relative z-10 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 shadow-md flex items-center justify-center mb-8">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                              </div>
                              
                              {/* Milestone Label */}
                              <div className="absolute top-0 left-1/2 ml-6 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 max-w-[200px] z-10">
                                <h3 className="text-sm font-bold text-slate-800">{milestone.title}</h3>
                              </div>

                              {/* Topics Grid/Tree */}
                              <div className="relative w-full flex flex-col items-center gap-y-12 mt-8">
                                {milestone.topics?.map((topic, tIdx) => {
                                  const isLeft = tIdx % 2 === 0;
                                  
                                  return (
                                    <div key={topic._id} className={`w-full flex ${isLeft ? 'justify-end pr-[50%] mr-12' : 'justify-start pl-[50%] ml-12'} relative`}>
                                      <RoadmapNode
                                        topic={topic}
                                        status={getTopicStatus(topic)}
                                        onClick={handleTopicClick}
                                        isLeft={isLeft}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  
                  {/* End of Roadmap Node */}
                  <div className="relative z-10 bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-500/30 border-4 border-white mt-16 flex items-center justify-center">
                    <span className="font-bold uppercase tracking-wider">Completion</span>
                  </div>

                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      <TopicDetailPanel 
        topic={selectedTopic} 
        isOpen={!!selectedTopic} 
        onClose={() => setSelectedTopic(null)} 
      />
    </div>
  );
}
