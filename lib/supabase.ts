import { createClient } from '@supabase/supabase-js';

// 環境変数からSupabaseのURLとキーを取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの作成（環境変数がない場合でもダミークライアントを作成してエラーを防ぐ）
let supabaseClient: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase環境変数が設定されていません。VITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定してください。');
  // ダミーのURLとキーでクライアントを作成（エラーを防ぐため）
  supabaseClient = createClient('https://placeholder.supabase.co', 'dummy-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export const supabase = supabaseClient;

// データベースの型定義（Supabaseのスキーマに基づく）
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
