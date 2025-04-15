// backend/services/auth.service.ts
import { supabase } from '@/backend/db/supabase';

export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    // If immediate sign-in (no email verification required), save session
    if (data.session) {
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Sign in a user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      if (error.message === "Email not confirmed") {
        throw new Error("Please verify your email before logging in");
      }
      throw error;
    }
    
    // Save session to localStorage
    if (data.session) {
      localStorage.setItem('supabase.auth.token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    // Clear storage regardless of success
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('user');
    
    if (error) throw error;
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('supabase.auth.token');
    return !!token;
  },

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
  
  // Resend verification email
  async resendVerification(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });
    
    if (error) throw error;
    return data;
  }
};