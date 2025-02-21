// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Newspaper, Loader2, AlertCircle, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Waves } from '../components/ui/waves-background';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState(''); // For Sign Up mode
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth(); // If you have a signUp method in your context
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return false;
    }
    if (!isLogin && password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      toast.error('Please connect to Supabase first using the "Connect to Supabase" button in the top right corner.');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Attempt to sign in
        await signIn(email, password);
        toast.success('Welcome back!');
        // Redirect to landing page after successful sign in
        navigate("/");
      } else {
        // Attempt to sign up using Supabase directly (or you can use signUp from your context)
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast.success('Account created! Please check your email to confirm and then sign in.');
        // Switch to login mode after sign up
        setIsLogin(true);
      }
    } catch (error: any) {
      const message = error.message || 'An error occurred';
      if (message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (message.includes('User already registered')) {
        toast.error('This email is already registered');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const showSupabaseWarning =
    !import.meta.env.VITE_SUPABASE_URL ||
    !import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-gray-900 flex relative">
      <Waves
        lineColor="rgba(255, 255, 255, 0.1)"
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute inset-0 backdrop-blur-3xl opacity-50" />
        <div className="max-w-md relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white font-playfair">NewsFlow</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 font-inter leading-relaxed">
            Your personalized news aggregator. Stay informed with curated content from trusted sources.
          </p>
          <div className="space-y-6 text-gray-400">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <p>Real-time news updates</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <p>Personalized news feed</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <p>AI-powered summaries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">NewsFlow</h1>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2 font-playfair">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isLogin 
              ? 'Sign in to continue to your personalized news feed'
              : 'Create an account to start your personalized news journey'
            }
          </p>

          {showSupabaseWarning && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  <p className="font-medium mb-1">Supabase Connection Required</p>
                  <p className="text-yellow-200/80">
                    Please click the "Connect to Supabase" button in the top right corner to enable authentication.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Display Name only when signing up */}
            {!isLogin && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your display name"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || showSupabaseWarning}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;