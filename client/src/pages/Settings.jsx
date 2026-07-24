import { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { User, Mail, Settings as SettingsIcon, Shield, Save } from 'lucide-react';

export default function Settings() {
  useDocumentTitle('Settings');
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile update functionality coming soon!');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-slate-700" />
          Account Settings
        </h1>
        <p className="mt-2 text-slate-500">Manage your profile and preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium text-slate-900">Profile</h3>
          <p className="mt-1 text-sm text-slate-500">
            This information will be displayed publicly so be careful what you share.
          </p>
        </div>
        
        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="block w-full rounded-lg border-slate-300 border bg-slate-50 p-2.5 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500">Email cannot be changed at this time.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4" /> Account Role
                  </label>
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-800 capitalize border border-slate-200">
                    {user?.role || 'User'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-200">
              <button
                type="submit"
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
