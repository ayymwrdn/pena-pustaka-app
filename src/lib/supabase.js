import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pena-pustaka.supabase.co'  
const supabaseAnonKey = 'sb_publishable_X5f9f1sNGqapoRoboEupuw_NOmzjA30'  

export const supabase = createClient(supabaseUrl, supabaseAnonKey)