import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllTopics, getTracks, createTopic, updateTopic, deleteTopic, generateAdminTopicContent, generateAdminPracticeQuiz } from '../../lib/api';
import { Edit2, Trash2, Plus, X, BookOpen, Bot } from 'lucide-react';

export default function TopicManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [generatingTopicId, setGeneratingTopicId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    track: '',
    difficulty: 'beginner',
    estimatedTime: 15,
    isActive: true,
    order: 0,
    tags: ''
  });

  const { data: topics, isLoading: isLoadingTopics } = useQuery({
    queryKey: ['adminTopics'],
    queryFn: getAllTopics
  });

  const { data: tracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['adminTracks'],
    queryFn: () => getTracks()
  });

  const createMutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTopic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
      setIsModalOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      track: tracks && tracks.length > 0 ? tracks[0]._id : '',
      difficulty: 'beginner',
      estimatedTime: 15,
      isActive: true,
      order: 0,
      tags: ''
    });
    setEditingTopic(null);
  };

  const openModal = (topic = null) => {
    if (topic) {
      setEditingTopic(topic);
      setFormData({
        name: topic.name,
        slug: topic.slug || '',
        track: topic.track?._id || '',
        difficulty: topic.difficulty || 'beginner',
        estimatedTime: topic.estimatedTime || 15,
        isActive: topic.isActive,
        order: topic.order || 0,
        tags: topic.tags ? topic.tags.join(', ') : ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };
    
    if (editingTopic) {
      updateMutation.mutate({ id: editingTopic._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      deleteMutation.mutate(id);
    }
  };

  const generateOverviewMutation = useMutation({
    mutationFn: (slug) => generateAdminTopicContent(slug),
    onMutate: (slug) => setGeneratingTopicId(slug + '_overview'),
    onSuccess: () => {
      alert('Topic overview generated successfully!');
      setGeneratingTopicId(null);
    },
    onError: (error) => {
      alert(`Failed to generate overview: ${error.message}`);
      setGeneratingTopicId(null);
    }
  });

  const generatePracticeMutation = useMutation({
    mutationFn: (slug) => generateAdminPracticeQuiz(slug),
    onMutate: (slug) => setGeneratingTopicId(slug + '_practice'),
    onSuccess: () => {
      alert('Practice quiz generated successfully!');
      setGeneratingTopicId(null);
    },
    onError: (error) => {
      alert(`Failed to generate practice quiz: ${error.message}`);
      setGeneratingTopicId(null);
    }
  });

  if (isLoadingTopics || isLoadingTracks) {
    return <div className="p-8 text-center text-slate-500">Loading topics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Manage Topics</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Topic
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name / Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Track</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {topics?.map((topic) => (
              <tr key={topic._id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{topic.name}</div>
                  <div className="text-xs text-slate-500">{topic.slug}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                  {topic.track?.name || 'Unassigned'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 capitalize">
                  {topic.difficulty}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    topic.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {topic.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => generateOverviewMutation.mutate(topic.slug)}
                    disabled={generatingTopicId === topic.slug + '_overview'}
                    title="Generate Overview"
                    className="text-blue-600 hover:text-blue-900 mr-3 disabled:opacity-50"
                  >
                    <BookOpen className={`w-4 h-4 ${generatingTopicId === topic.slug + '_overview' ? 'animate-pulse' : ''}`} />
                  </button>
                  <button
                    onClick={() => generatePracticeMutation.mutate(topic.slug)}
                    disabled={generatingTopicId === topic.slug + '_practice'}
                    title="Generate Practice Quiz"
                    className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                  >
                    <Bot className={`w-4 h-4 ${generatingTopicId === topic.slug + '_practice' ? 'animate-pulse' : ''}`} />
                  </button>
                  <button 
                    onClick={() => openModal(topic)}
                    title="Edit Topic"
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(topic._id)}
                    title="Delete Topic"
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {(!topics || topics.length === 0) && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                  No topics found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-semibold text-lg">{editingTopic ? 'Edit Topic' : 'Create Topic'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug (optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                    placeholder="Auto-generated if left blank"
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Parent Track</label>
                  <select
                    required
                    value={formData.track}
                    onChange={e => setFormData({...formData, track: e.target.value})}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  >
                    <option value="" disabled>Select a track</option>
                    {tracks?.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={e => setFormData({...formData, difficulty: e.target.value})}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Time (mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.estimatedTime}
                    onChange={e => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Order Index</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g. react, hooks, frontend"
                  className="w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                />
              </div>

              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                >
                  {editingTopic ? 'Save Changes' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
