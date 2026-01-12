-- 検証用ユーザーデータの挿入SQL
-- Supabase SQL Editorで実行してください
-- 3つの法人に対してそれぞれ5名ずつ、合計15名のユーザーを追加します

-- ============================================
-- 法人1: 株式会社テクノロジー・フロンティア (tech-frontier)
-- Organization ID: 550e8400-e29b-41d4-a716-446655440001
-- ============================================

INSERT INTO public.profiles (id, name, email, role, organization_id, department, position, scores, pending_password, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    '田中 健一',
    'tanaka.kenichi@tech-frontier.example.com',
    'ORG_ADMIN',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '開発部',
    '部長',
    '{"basics": 75, "prompting": 70, "ethics": 65, "tools": 80, "automation": 60}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '鈴木 美咲',
    'suzuki.misaki@tech-frontier.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '開発部',
    '課長',
    '{"basics": 60, "prompting": 55, "ethics": 70, "tools": 65, "automation": 50}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '高橋 翔太',
    'takahashi.shota@tech-frontier.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '企画部',
    '主任',
    '{"basics": 50, "prompting": 45, "ethics": 60, "tools": 55, "automation": 40}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '佐藤 花子',
    'sato.hanako@tech-frontier.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '開発部',
    '一般社員',
    '{"basics": 45, "prompting": 40, "ethics": 55, "tools": 50, "automation": 35}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '山田 次郎',
    'yamada.jiro@tech-frontier.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    '企画部',
    '一般社員',
    '{"basics": 40, "prompting": 35, "ethics": 50, "tools": 45, "automation": 30}'::jsonb,
    false,
    NOW(),
    NOW()
  );

-- ============================================
-- 法人2: グローバル・イノベーション・ソリューション (global-sol)
-- Organization ID: 550e8400-e29b-41d4-a716-446655440002
-- ============================================

INSERT INTO public.profiles (id, name, email, role, organization_id, department, position, scores, pending_password, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    '伊藤 麻衣',
    'ito.mai@global-sol.example.com',
    'ORG_ADMIN',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '営業部',
    '部長',
    '{"basics": 70, "prompting": 65, "ethics": 60, "tools": 75, "automation": 55}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '渡辺 大輔',
    'watanabe.daisuke@global-sol.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '営業部',
    '課長',
    '{"basics": 55, "prompting": 50, "ethics": 65, "tools": 60, "automation": 45}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '中村 優香',
    'nakamura.yuka@global-sol.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'マーケティング部',
    '主任',
    '{"basics": 50, "prompting": 45, "ethics": 60, "tools": 55, "automation": 40}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '小林 健',
    'kobayashi.ken@global-sol.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    '営業部',
    '一般社員',
    '{"basics": 45, "prompting": 40, "ethics": 55, "tools": 50, "automation": 35}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '加藤 さくら',
    'kato.sakura@global-sol.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'マーケティング部',
    '一般社員',
    '{"basics": 40, "prompting": 35, "ethics": 50, "tools": 45, "automation": 30}'::jsonb,
    false,
    NOW(),
    NOW()
  );

-- ============================================
-- 法人3: AI共創ラボ (ai-collab)
-- Organization ID: 550e8400-e29b-41d4-a716-446655440003
-- ============================================

INSERT INTO public.profiles (id, name, email, role, organization_id, department, position, scores, pending_password, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    '吉田 拓也',
    'yoshida.takuya@ai-collab.example.com',
    'ORG_ADMIN',
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    '研究開発部',
    '部長',
    '{"basics": 85, "prompting": 90, "ethics": 75, "tools": 85, "automation": 80}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '斉藤 彩',
    'saito.aya@ai-collab.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    '研究開発部',
    '課長',
    '{"basics": 75, "prompting": 80, "ethics": 70, "tools": 75, "automation": 70}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '松本 亮',
    'matsumoto.ryo@ai-collab.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'データ分析部',
    '主任',
    '{"basics": 70, "prompting": 75, "ethics": 65, "tools": 70, "automation": 65}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '井上 由美',
    'inoue.yumi@ai-collab.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    '研究開発部',
    '一般社員',
    '{"basics": 65, "prompting": 70, "ethics": 60, "tools": 65, "automation": 60}'::jsonb,
    false,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '木村 達也',
    'kimura.tatsuya@ai-collab.example.com',
    'USER',
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'データ分析部',
    '一般社員',
    '{"basics": 60, "prompting": 65, "ethics": 55, "tools": 60, "automation": 55}'::jsonb,
    false,
    NOW(),
    NOW()
  );

-- ============================================
-- 挿入結果の確認
-- ============================================
SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  o.slug as organization_slug,
  o.name as organization_name,
  p.department,
  p.position,
  p.scores,
  p.created_at
FROM public.profiles p
JOIN public.organizations o ON p.organization_id = o.id
ORDER BY o.slug, p.role DESC, p.name;
