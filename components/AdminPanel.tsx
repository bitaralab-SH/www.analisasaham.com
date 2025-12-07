import React, { useState, useEffect } from 'react';
import { fetchAllUsers, updateUserStatus } from '../services/api';
import { User, ApiResponse } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  onOpenDashboard: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onOpenDashboard }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Attempt to fetch users to validate credentials
    const response = await fetchAllUsers(username, password);
    
    if (response.result === 'success') {
      setIsAuthenticated(true);
      setUsers(response.data || []);
    } else {
      setError(response.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleStatusToggle = async (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Registered' : 'Active';
    
    // Optimistic update
    setUsers(users.map(u => u.email === email ? { ...u, status: 'Updating...' } : u));
    
    const response = await updateUserStatus(email, newStatus, username, password);
    
    if (response.result === 'success') {
      setUsers(users.map(u => u.email === email ? { ...u, status: newStatus } : u));
    } else {
      alert("Failed to update status");
      // Revert
      setUsers(users.map(u => u.email === email ? { ...u, status: currentStatus } : u));
    }
  };

  const refreshList = async () => {
    setLoading(true);
    const response = await fetchAllUsers(username, password);
    if (response.result === 'success') {
      setUsers(response.data || []);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-5xl rounded-xl shadow-2xl border border-slate-700 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="bg-red-500 w-2 h-2 rounded-full mr-2"></span>
            Admin Portal
          </h2>
          <div className="flex gap-4">
             {isAuthenticated && (
                <button 
                  onClick={() => { onOpenDashboard(); onClose(); }}
                  className="text-sm font-medium text-brand-500 hover:text-brand-400 transition-colors"
                >
                  Open Dashboard
                </button>
             )}
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-10">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="text-center mb-6">
                   <p className="text-slate-400">Enter Admin Credentials.</p>
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded transition-colors"
                >
                  {loading ? 'Verifying...' : 'Access Dashboard'}
                </button>
                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400">Total Users: <span className="text-white font-bold">{users.length}</span></p>
                <button onClick={refreshList} className="text-sm text-brand-400 hover:text-brand-300 underline">
                  Refresh List
                </button>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800 text-xs uppercase font-medium text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900">
                    {users.map((user, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.status === 'Active' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(user.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleStatusToggle(user.email, user.status)}
                            className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                              user.status === 'Active'
                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                            }`}
                          >
                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};