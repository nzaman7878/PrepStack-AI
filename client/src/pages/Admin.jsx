import { useState } from 'react';
import { Database, Layout, BookOpen, FileText } from 'lucide-react';
import TrackManager from '../components/admin/TrackManager';
import TopicManager from '../components/admin/TopicManager';
import ContentManager from '../components/admin/ContentManager';
import RoadmapManager from '../components/admin/RoadmapManager';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('tracks');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Database className="h-8 w-8 text-slate-700" />
          Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-500">Manage learning tracks, topics, and AI generated content.</p>
      </div>

      <div className="mb-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'tracks'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Tracks
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('topics')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'topics'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Topics
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('content')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'content'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content Management
            </div>
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'roadmaps'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Roadmaps
            </div>
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'tracks' && <TrackManager />}
        {activeTab === 'topics' && <TopicManager />}
        {activeTab === 'content' && <ContentManager />}
        {activeTab === 'roadmaps' && <RoadmapManager />}
      </div>
    </div>
  );
}
