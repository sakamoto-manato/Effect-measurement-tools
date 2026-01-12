-- デモ法人データの挿入SQL
-- Supabase SQL Editorで実行してください
-- 既存データがある場合はスキップされます

-- ============================================
-- デモ法人データの挿入
-- ============================================

-- 注意: UUIDは固定値を使用しますが、実際の環境では既存データと衝突しないか確認してください
-- 既存データを上書きしたくない場合は、ON CONFLICT DO NOTHING を使用します

-- 法人1: 株式会社テクノロジー・フロンティア
INSERT INTO public.organizations (id, slug, name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,  -- 固定UUID
  'tech-frontier',  -- 会社名ベースのslug
  '株式会社テクノロジー・フロンティア',
  '2024-01-15'::timestamp with time zone,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  updated_at = NOW();

-- 法人2: グローバル・イノベーション・ソリューション
INSERT INTO public.organizations (id, slug, name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  'global-sol',  -- 会社名ベースのslug
  'グローバル・イノベーション・ソリューション',
  '2024-02-10'::timestamp with time zone,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  updated_at = NOW();

-- 法人3: AI共創ラボ
INSERT INTO public.organizations (id, slug, name, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  'ai-collab',  -- 会社名ベースのslug
  'AI共創ラボ',
  '2024-03-05'::timestamp with time zone,
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET 
  name = EXCLUDED.name,
  updated_at = NOW();

-- ============================================
-- 挿入結果の確認
-- ============================================
SELECT id, slug, name, created_at FROM public.organizations ORDER BY created_at;
