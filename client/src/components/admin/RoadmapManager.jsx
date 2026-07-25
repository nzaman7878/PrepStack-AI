import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoadmaps, generateAdminRoadmap, createRoadmap, deleteRoadmap, updateRoadmap } from '../../lib/api';
import { Bot, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RoadmapManager() {
  const queryClient = useQueryClient();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ['admin-roadmaps'],
    queryFn: () => getRoadmaps(true) // Get all roadmaps including unpublished
  });

  const generateMutation = useMutation({
    mutationFn: () => generateAdminRoadmap(role, difficulty),
    onSuccess: (generatedData) => {
      // Save it automatically as a draft
      createMutation.mutate(generatedData);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to generate roadmap');
      setIsGenerating(false);
    }
  });

  const createMutation = useMutation({
    mutationFn: (data) => createRoadmap(data),
    onSuccess: () => {
      toast.success('Roadmap generated and saved as draft!');
      queryClient.invalidateQueries(['admin-roadmaps']);
      setRole('');
      setIsGenerating(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save roadmap');
      setIsGenerating(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteRoadmap(id),
    onSuccess: () => {
      toast.success('Roadmap deleted');
      queryClient.invalidateQueries(['admin-roadmaps']);
    },
    onError: (error) => {
      toast.error('Failed to delete roadmap');
    }
  });

  const handleGenerate = () => {
    if (!role.trim()) {
      toast.error('Please enter a role (e.g. Full Stack Developer)');
      return;
    }
    setIsGenerating(true);
    generateMutation.mutate();
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRoadmap(id, data),
    onSuccess: () => {
      toast.success('Roadmap updated');
      queryClient.invalidateQueries(['admin-roadmaps']);
    },
    onError: () => {
      toast.error('Failed to update roadmap');
    }
  });

  const togglePublish = (roadmap) => {
    updateMutation.mutate({ id: roadmap._id, data: { isPublished: !roadmap.isPublished } });
  };

  if (isLoading) {
    return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* AI Generation Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          Generate New Roadmap with AI
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-slate-700">Target Role / Domain</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer, Data Engineer..."
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="w-full md:w-48 space-y-2">
            <label className="block text-sm font-medium text-slate-700">Difficulty</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isGenerating}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
            ) : (
              <><Bot className="w-5 h-5" /> Generate Roadmap</>
            )}
          </button>
        </div>
      </div>

      {/* Roadmaps List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Manage Roadmaps</h3>
        </div>
        
        {roadmaps?.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No roadmaps found. Generate one above!
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {roadmaps?.map(roadmap => (
              <div key={roadmap._id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-bold text-slate-900">{roadmap.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roadmap.isPublished ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {roadmap.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{roadmap.description}</p>
                  <div className="mt-3 flex gap-4 text-xs font-medium text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded">Role: {roadmap.role}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">{roadmap.phases?.length || 0} Phases</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => togglePublish(roadmap)}
                    disabled={updateMutation.isPending}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${roadmap.isPublished ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'}`}
                  >
                    {roadmap.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Roadmap (Coming Soon)">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this roadmap?')) {
                        deleteMutation.mutate(roadmap._id);
                      }
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
