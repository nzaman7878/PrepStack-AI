import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminCache, clearAdminCache, updateContent } from '../../lib/api';
import { Database, Trash2, RefreshCw, AlertCircle, HardDrive, Edit2, X } from 'lucide-react';

export default function ContentManager() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [jsonContent, setJsonContent] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data: cacheEntries, isLoading, error, refetch } = useQuery({
    queryKey: ['adminCache'],
    queryFn: getAdminCache,
  });

  const clearMutation = useMutation({
    mutationFn: clearAdminCache,
    onSuccess: () => {
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCache'] });
      setIsModalOpen(false);
    }
  });

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear ALL cached AI content? This cannot be undone.')) {
      clearMutation.mutate('all');
    }
  };

  const handleDeleteEntry = (id) => {
    if (window.confirm('Delete this cache entry?')) {
      clearMutation.mutate(id);
    }
  };

  const openEditModal = (entry) => {
    setEditingContent(entry);
    setJsonContent(JSON.stringify(entry.content, null, 2));
    setJsonError('');
    setIsModalOpen(true);
  };

  const handleSaveContent = (e) => {
    e.preventDefault();
    try {
      const parsedContent = JSON.parse(jsonContent);
      setJsonError('');
      updateMutation.mutate({
        id: editingContent._id,
        data: { content: parsedContent }
      });
    } catch (err) {
      setJsonError('Invalid JSON format: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Content</h2>
          <p className="mt-1 text-sm text-slate-500">View, edit, and clear AI-generated content cache.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()} 
            disabled={clearMutation.isPending}
            className="flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${clearMutation.isPending ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleClearAll}
            disabled={clearMutation.isPending || !cacheEntries?.length}
            className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All Cache
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600 border border-red-200 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          Failed to load admin data. Ensure you have the correct permissions.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Cache Entries</h3>
            <HardDrive className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{cacheEntries?.length || 0}</p>
        </div>
        
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Input Tokens</h3>
            <Database className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {cacheEntries?.reduce((acc, entry) => acc + (entry.tokenUsage?.input || 0), 0).toLocaleString() || 0}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">Total Output Tokens</h3>
            <Database className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {cacheEntries?.reduce((acc, entry) => acc + (entry.tokenUsage?.output || 0), 0).toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="font-semibold text-slate-800">Cached AI Content</h2>
        </div>
        
        {(!cacheEntries || cacheEntries.length === 0) ? (
          <div className="p-8 text-center text-slate-500">
            No cached content found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Topic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Generated At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {cacheEntries.map((entry) => (
                  <tr key={entry._id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{entry.topic?.name || 'Unknown Topic'}</div>
                      <div className="text-xs text-slate-500">{entry.topic?.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        entry.contentType === 'overview' ? 'bg-blue-100 text-blue-800' : 
                        entry.contentType === 'interview' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {entry.contentType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 capitalize">
                      {entry.difficulty}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {new Date(entry.generatedAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button 
                        onClick={() => openEditModal(entry)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEntry(entry._id)}
                        disabled={clearMutation.isPending}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 shrink-0">
              <h3 className="font-semibold text-lg">
                Edit Content - {editingContent?.topic?.name} ({editingContent?.contentType})
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {jsonError && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600 border border-red-200 text-sm">
                  {jsonError}
                </div>
              )}
              <textarea
                className="w-full h-[60vh] font-mono text-sm p-4 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
              />
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContent}
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save JSON'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
