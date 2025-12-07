import React, { useState } from 'react';
import { UserStatus, RegistrationData } from '../types';
import { registerUser, checkSubscriptionStatus, verifyAdmin } from '../services/api';
import { PAYMENT_QR_IMAGE, PRICING } from '../constants';

interface AccessGateProps {
  onAccessGranted: (expiryDate?: string) => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onAccessGranted }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'status'>('register');
  const [formData, setFormData] = useState<RegistrationData>({ name: '', email: '' });
  
  // User Login State
  const [checkEmail, setCheckEmail] = useState('');
  
  // Admin Login State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [status, setStatus] = useState<UserStatus>(UserStatus.IDLE);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(UserStatus.LOADING);
    
    const response = await registerUser(formData);
    
    setIsSubmitting(false);
    if (response.result === 'success') {
      setStatus(UserStatus.REGISTERED);
      setMessage("Registration successful! Please proceed to payment.");
    } else {
      setStatus(UserStatus.ERROR);
      setMessage(response.message || "Registration failed. Try again.");
    }
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(UserStatus.LOADING);
    setMessage('');

    const response = await checkSubscriptionStatus(checkEmail);
    
    setIsSubmitting(false);
    if (response.result === 'success') {
      if (response.status === 'Active') {
        setStatus(UserStatus.ACTIVE);
        onAccessGranted(response.expiryDate); // Unlock dashboard & pass expiry
      } else {
        setStatus(UserStatus.REGISTERED);
        setMessage("Your account is Registered but not yet Active. Please verify payment with Admin.");
      }
    } else {
      setStatus(UserStatus.NOT_FOUND);
      setMessage("Email not found. Please register first.");
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(UserStatus.LOADING);
    setMessage('');

    const response = await verifyAdmin(adminUsername, adminPassword);
    
    setIsSubmitting(false);
    if (response.result === 'success') {
      setStatus(UserStatus.ACTIVE);
      onAccessGranted(response.expiryDate); // Bypass payment and unlock dashboard
    } else {
      setStatus(UserStatus.ERROR);
      setMessage("Invalid Admin Credentials.");
    }
  };

  return (
    <div id="subscribe" className="py-20 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => { setActiveTab('register'); setStatus(UserStatus.IDLE); setMessage(''); }}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'register' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              New Subscription
            </button>
            <button
              onClick={() => { setActiveTab('status'); setStatus(UserStatus.IDLE); setMessage(''); }}
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'status' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              Check Status / Login
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'register' ? (
              <div className="grid md:grid-cols-2 gap-10">
                {/* Form Side */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Step 1: Register</h3>
                  {status === UserStatus.REGISTERED ? (
                     <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded mb-4">
                       {message}
                     </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'Registering...' : 'Register'}
                      </button>
                      {status === UserStatus.ERROR && (
                        <p className="text-red-400 text-sm mt-2">{message}</p>
                      )}
                    </form>
                  )}
                </div>

                {/* QR Side */}
                <div className="flex flex-col items-center justify-center border-l border-slate-700 pl-0 md:pl-10 pt-10 md:pt-0">
                  <h3 className="text-xl font-bold text-white mb-2">Step 2: Payment</h3>
                  <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                    <img 
                      src={PAYMENT_QR_IMAGE} 
                      alt="Subscription Payment QR" 
                      className="w-48 h-48 object-cover" 
                    />
                  </div>
                  <p className="text-white font-bold text-lg mb-1">{PRICING.amount}{PRICING.period}</p>
                  <p className="text-slate-400 text-center text-sm mb-4">
                    Scan via Maybank QR / DuitNow.
                  </p>
                  <div className="bg-slate-800 p-4 rounded border border-slate-700 text-sm text-slate-300">
                    <p className="font-semibold mb-1">Step 3: Activation</p>
                    <p>After payment, Admins verify your ID. Status changes from <strong>Registered</strong> to <strong>Active</strong> manually.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  {isAdminMode ? 'Admin Direct Login' : 'Subscriber Access'}
                </h3>
                
                {isAdminMode ? (
                  // ADMIN LOGIN FORM
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Verifying...' : 'Login as Admin'}
                    </button>
                    <div className="text-center mt-4">
                      <button
                         type="button"
                         onClick={() => { setIsAdminMode(false); setStatus(UserStatus.IDLE); setMessage(''); }}
                         className="text-sm text-slate-400 hover:text-white underline"
                      >
                        Back to Subscriber Login
                      </button>
                    </div>
                  </form>
                ) : (
                  // USER LOGIN FORM
                  <form onSubmit={handleCheckStatus} className="space-y-4">
                    <div>
                      <label className="block text-left text-sm font-medium text-slate-400 mb-1">Enter Registered Email</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={checkEmail}
                        onChange={(e) => setCheckEmail(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Checking...' : 'Login / Check Status'}
                    </button>
                    
                    <div className="text-center mt-6 pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-500 mb-2">Administrator?</p>
                      <button
                         type="button"
                         onClick={() => { setIsAdminMode(true); setStatus(UserStatus.IDLE); setMessage(''); }}
                         className="text-xs text-brand-500 hover:text-brand-400 font-medium"
                      >
                        Login via Admin Credentials
                      </button>
                    </div>
                  </form>
                )}

                {status === UserStatus.NOT_FOUND && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-center">
                    {message}
                  </div>
                )}
                 {status === UserStatus.ERROR && isAdminMode && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-center">
                    {message}
                  </div>
                )}
                
                {status === UserStatus.REGISTERED && (
                   <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded text-yellow-400 text-center">
                    {message}
                  </div>
                )}

                {status === UserStatus.ACTIVE && (
                  <div className="mt-6 p-4 bg-brand-500/10 border border-brand-500/50 rounded text-brand-400 font-bold text-center">
                    Welcome back! Access granted.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};