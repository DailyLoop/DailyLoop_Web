import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean; // New
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean; // New
};

type AuthAction = 
  | { type: 'SET_AUTH', user: User | null, token: string | null }
  | { type: 'SET_LOADING', loading: boolean }
  | { type: 'SET_INITIALIZED', initialized: boolean } // New
  | { type: 'SIGN_OUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      if (action.user?.id === state.user?.id && action.token === state.token) {
        return state;
      }
      return { ...state, user: action.user, token: action.token };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.initialized };
    case 'SIGN_OUT':
      return { ...state, user: null, token: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    loading: true,
    initialized: false // New
  });

  useEffect(() => {
    console.log('[AuthContext] 🚀 Initial auth check');
    let mounted = true;
    let sessionChecked = false;
    let authEventReceived = false;

    const markInitialized = () => {
      if (mounted && sessionChecked && authEventReceived) {
        console.log('[AuthContext] 📥 Auth fully initialized');
        dispatch({ type: 'SET_INITIALIZED', initialized: true });
        dispatch({ type: 'SET_LOADING', loading: false });
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      console.log('[AuthContext] 📥 Initial session retrieved');
      dispatch({ 
        type: 'SET_AUTH', 
        user: session?.user ?? null, 
        token: session?.access_token ?? null 
      });
      sessionChecked = true;
      markInitialized();
    });

    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      console.log('[AuthContext] 🔔 Auth state changed:', _event);
      dispatch({ 
        type: 'SET_AUTH', 
        user: session?.user ?? null, 
        token: session?.access_token ?? null 
      });
      if (!authEventReceived) {
        authEventReceived = true;
        markInitialized();
      }
    });

    // Fallback timeout in case auth event never fires
    setTimeout(() => {
      if (mounted && sessionChecked && !authEventReceived) {
        console.log('[AuthContext] ⏰ Fallback: Forcing initialization');
        authEventReceived = true;
        markInitialized();
      }
    }, 1000); // 1-second fallback

    return () => {
      console.log('[AuthContext] 🧹 Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    dispatch({ type: 'SET_LOADING', loading: false });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    dispatch({ type: 'SET_LOADING', loading: false });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    dispatch({ type: 'SIGN_OUT' });
  };

  return (
    <AuthContext.Provider value={{ 
      user: state.user, 
      token: state.token, 
      loading: state.loading,
      initialized: state.initialized, // New
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};