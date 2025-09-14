import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { authService } from '@/lib/authService';
import useSecurityStore from '@/stores/securityStore';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const securityStore = useSecurityStore();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const [csrfToken, setCsrfToken] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    if (session?.user) {
      const userProfile = await fetchProfile(session.user.id);
      setProfile(userProfile);
      
      // Simple hardcoded approach - no complex role fetching
      setUserRoles(['admin']); // Assume admin if they can log in
      setCsrfToken('hardcoded-token');
      
      // Update activity when session is established
      securityStore.updateActivity();
    } else {
      setProfile(null);
      setUserRoles([]);
      setCsrfToken(null);
    }
    setLoading(false);
  }, [fetchProfile, securityStore]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await handleSession(session);
      }
    );

    // Set up session timeout checking
    const sessionCheckInterval = setInterval(() => {
      if (securityStore.checkSessionExpiry()) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired due to inactivity. Please log in again.",
        });
        // Optionally sign out user
        // supabase.auth.signOut();
      }
    }, 60000); // Check every minute

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const updateActivity = () => securityStore.updateActivity();
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
      // Remove activity listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [handleSession, securityStore, toast]);

  const signIn = useCallback(async (email, password) => {
    // Check rate limiting before attempting login
    const rateLimitResult = securityStore.checkLoginRateLimit(email);
    
    if (!rateLimitResult.allowed) {
      const remainingTime = Math.ceil(rateLimitResult.delay / 1000 / 60); // Convert to minutes
      
      toast({
        variant: "destructive",
        title: "Account Temporarily Locked",
        description: rateLimitResult.reason === 'LOCKED' 
          ? `Too many failed attempts. Please try again in ${remainingTime} minutes.`
          : `Rate limit exceeded. Please wait ${remainingTime} minutes before trying again.`,
      });
      
      throw new Error(`Rate limited: ${rateLimitResult.reason}`);
    }

    // Apply progressive delay if needed
    if (rateLimitResult.delay > 0) {
      toast({
        title: "Please Wait",
        description: `Security delay: ${Math.ceil(rateLimitResult.delay / 1000)} seconds`,
      });
      await new Promise(resolve => setTimeout(resolve, rateLimitResult.delay));
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Record failed attempt
        securityStore.recordFailedLogin(email, 'INVALID_CREDENTIALS');
        
        toast({
          variant: "destructive",
          title: "Sign in Failed",
          description: error.message || "Invalid credentials.",
        });
        throw error;
      }

      // Record successful login
      securityStore.recordSuccessfulLogin(email);
      securityStore.updateActivity();

      // Let RLS policies handle access control - no email checking here
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      // Record failed attempt for any error
      if (error.message && !error.message.includes('Rate limited')) {
        securityStore.recordFailedLogin(email, 'LOGIN_ERROR');
      }
      throw error;
    }
  }, [toast, securityStore]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
      throw error;
    }
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  }, [toast]);

  const isAdmin = useMemo(() => {
    // Super simple - if they're logged in with mateomema1@gmail.com, they're admin
    return user?.email === 'mateomema1@gmail.com';
  }, [user]);

  const hasRole = useCallback((role) => {
    return userRoles.includes(role);
  }, [userRoles]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    hasRole,
    userRoles,
    csrfToken
  }), [user, profile, session, loading, signIn, signOut, isAdmin, hasRole, userRoles, csrfToken]);

  return (
    <AuthContext.Provider value={value}>
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