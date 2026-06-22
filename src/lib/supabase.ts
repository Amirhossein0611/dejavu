"use client";
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wyeiwetbaurdfwsiyztb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5ZWl3ZXRiYXVyZGZ3c2l5enRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDgzMzEsImV4cCI6MjA5NzcyNDMzMX0.klTIBd1ECkAJWZcmnRKNdoWj79Lg_D3fAw3lUlfOB5I'
);