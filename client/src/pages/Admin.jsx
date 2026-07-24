import { useQuery, useMutation } from '@tanstack/react-query';
import { getAdminCache, clearAdminCache } from '../lib/api';
import { Database, Trash2, RefreshCw, AlertCircle, HardDrive } from 'lucide-react';
import { useState } from 'react';

export default function Admin() {
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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-slate-700" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-500">Manage AI generated content and system cache.</p>
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
        <div className="mb-8 rounded-lg bg-red-50 p-4 text-red-600 border border-red-200 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          Failed to load admin data. Ensure you have the correct permissions.
        </div>
      )}

      <div className="mb-8 grid gap-6 sm:grid-cols-3">
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Tokens (In/Out)</th>
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
                        entry.contentType === 'overview' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {entry.contentType}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {entry.tokenUsage?.input || 0} / {entry.tokenUsage?.output || 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {new Date(entry.generatedAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteEntry(entry._id)}
                        disabled={clearMutation.isPending}
                        className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
