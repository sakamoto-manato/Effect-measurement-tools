
import { Role, Organization, User } from './types';

export const MOCK_ORGS: Organization[] = [
  { 
    id: 'org-1', 
    slug: 'tech-frontier', 
    name: '株式会社テクノロジー・フロンティア', 
    createdAt: '2024-01-15', 
    memberCount: 25, 
    avgScore: 68,
    description: '最先端のテクノロジーを活用したイノベーション創出を目指す企業です。AI技術の導入と活用に積極的に取り組んでいます。',
    website: 'https://tech-frontier.example.com',
    address: '〒100-0001 東京都千代田区千代田1-1-1',
    phone: '03-1234-5678',
    email: 'contact@tech-frontier.example.com',
    accountId: 'tech-frontier',
    password: 'demo123' // デモ用
  },
  { 
    id: 'org-2', 
    slug: 'global-sol', 
    name: 'グローバル・イノベーション・ソリューション', 
    createdAt: '2024-02-10', 
    memberCount: 12, 
    avgScore: 45,
    description: 'グローバルな視点でビジネスソリューションを提供する企業です。',
    website: 'https://global-sol.example.com',
    address: '〒150-0001 東京都渋谷区神宮前1-1-1',
    phone: '03-2345-6789',
    email: 'info@global-sol.example.com',
    accountId: 'global-sol',
    password: 'demo123' // デモ用
  },
  { 
    id: 'org-3', 
    slug: 'ai-collab', 
    name: 'AI共創ラボ', 
    createdAt: '2024-03-05', 
    memberCount: 8, 
    avgScore: 82,
    description: 'AI技術の研究開発と実用化を推進する専門組織です。最新のAI技術を活用したソリューション開発に強みを持ちます。',
    website: 'https://ai-collab.example.com',
    address: '〒106-0032 東京都港区六本木1-1-1',
    phone: '03-3456-7890',
    email: 'hello@ai-collab.example.com',
    accountId: 'ai-collab',
    password: 'demo123' // デモ用
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'システム管理者',
    email: 'admin@system.com',
    role: Role.SUPER_ADMIN,
    orgId: 'system',
    scores: { basics: 90, prompting: 95, ethics: 80, tools: 90, automation: 85 },
    pendingPassword: false
  },
  {
    id: 'u-1',
    name: '山田 太郎',
    email: 'yamada@tech.com',
    role: Role.ORG_ADMIN,
    orgId: 'org-1',
    scores: { basics: 70, prompting: 60, ethics: 50, tools: 65, automation: 40 },
    pendingPassword: false
  },
  {
    id: 'u-2',
    name: '佐藤 結衣',
    email: 'sato@tech.com',
    role: Role.USER,
    orgId: 'org-1',
    scores: { basics: 45, prompting: 30, ethics: 70, tools: 40, automation: 20 },
    pendingPassword: false
  }
];

export const LITERACY_DIMENSIONS = [
  { key: 'basics', label: '基礎知識' },
  { key: 'prompting', label: 'プロンプト工学' },
  { key: 'ethics', label: '倫理・リスク' },
  { key: 'tools', label: 'ツール選定' },
  { key: 'automation', label: '自動化/活用' },
];
