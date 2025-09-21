import { createClient } from '@supabase/supabase-js'

// 这就像配钥匙，需要地址和密码
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 配制好钥匙
export const supabase = createClient(supabaseUrl, supabaseKey)