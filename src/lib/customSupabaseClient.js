import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nozhsvniwbcvdbbokaig.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vemhzdm5pd2JjdmRiYm9rYWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0Nzg5MzQsImV4cCI6MjA3MDA1NDkzNH0.OB0pZBcLFqmaavd6dKEIc5IB-L2817P3cv_TG8wBoAQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);