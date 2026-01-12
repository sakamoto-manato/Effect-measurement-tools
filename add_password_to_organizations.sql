-- organizationsテーブルにpasswordカラムを追加するマイグレーション
-- Supabase SQL Editorで実行してください

DO $$ 
BEGIN
  -- passwordカラムの追加
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' AND table_name = 'organizations' AND column_name = 'password') THEN
    ALTER TABLE public.organizations ADD COLUMN password VARCHAR(255);
    
    RAISE NOTICE 'passwordカラムを追加しました';
  ELSE
    RAISE NOTICE 'passwordカラムは既に存在します';
  END IF;
END $$;
