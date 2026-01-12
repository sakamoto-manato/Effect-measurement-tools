-- RLSポリシーとテーブル構造のデバッグ用SQL
-- Supabase SQL Editorで実行して、エラーの原因を確認してください

-- 1. profilesテーブルの構造を確認
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. 現在のRLSポリシーを確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

-- 3. organizationsテーブルのRLSポリシーを確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'organizations'
ORDER BY policyname;

-- 4. profilesテーブルの制約を確認
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
AND tc.table_name = 'profiles';

-- 5. テストデータの挿入を試行（エラーメッセージを確認）
-- 注意: このクエリはエラーになる可能性がありますが、エラーメッセージから原因が分かります
DO $$
DECLARE
    test_org_id UUID;
BEGIN
    -- 既存のorganization_idを取得（存在する場合）
    SELECT id INTO test_org_id FROM public.organizations LIMIT 1;
    
    IF test_org_id IS NULL THEN
        RAISE NOTICE 'organizationsテーブルにデータがありません。先に法人を追加してください。';
    ELSE
        RAISE NOTICE 'テスト用のorganization_id: %', test_org_id;
        
        -- テスト挿入（エラーが発生する場合は、エラーメッセージを確認）
        BEGIN
            INSERT INTO public.profiles (name, email, role, organization_id)
            VALUES ('テストユーザー', 'test@example.com', 'USER', test_org_id);
            RAISE NOTICE 'テスト挿入が成功しました';
            -- テストデータを削除
            DELETE FROM public.profiles WHERE email = 'test@example.com';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'エラーが発生しました: %', SQLERRM;
        END;
    END IF;
END $$;
