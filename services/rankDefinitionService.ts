import { RankDefinition, RankItem } from '../types';

const STORAGE_KEY_PREFIX = 'rank_definitions_';

/**
 * デフォルトのランク定義
 */
export const DEFAULT_RANK_DEFINITION: RankItem[] = [
  {
    id: 'rank1',
    name: 'ランク1（ビギナー）',
    descriptions: [
      '生成AIをほぼ使ったことがない状態',
      'AIの基本用語に自信がない',
      '業務でAIを使ったことがほとんどない',
      'トレーニングや研修は未受講',
      '「何に使えるのか」がまだイメージできない',
    ],
  },
  {
    id: 'rank2',
    name: 'ランク2（ベーシック）',
    descriptions: [
      'AIを知っていて触れたことがある',
      'ChatGPTなどを試した経験はある',
      '用語（プロンプトなど）は何となく理解',
      '文章生成・画像生成などの一般的な使い方を知っている',
      '業務活用はまだ習慣化していない',
    ],
  },
  {
    id: 'rank3',
    name: 'ランク3（プラクティス）',
    descriptions: [
      '業務でAIを使い始めている',
      'メール下書き、要約などでAIを週1回以上使う',
      'シンプルなプロンプトを工夫できる',
      '小規模タスクでAI活用の成果を実感',
      '小規模プロジェクトや改善に参加したことがある',
    ],
  },
  {
    id: 'rank4',
    name: 'ランク4（アドバンス）',
    descriptions: [
      '日常業務の中で成果が出ている',
      'カスタムプロンプトやワークフロー化を実践',
      '複数ツールやAPI連携を使った経験あり',
      '明確な成果（工数削減・品質向上）がある',
      '部署内でAI活用の相談役になっている',
    ],
  },
  {
    id: 'rank5',
    name: 'ランク5（エキスパート）',
    descriptions: [
      '高度なAI活用で価値創出している',
      'RAGやファインチューニングなども理解し実践',
      '複雑な自動化・システム連携が可能',
      '新規サービス・業務プロセスを構築できる',
      '社内外で教育・研修ができるレベル',
    ],
  },
];

/**
 * ランク定義を保存（localStorage）
 */
export function saveRankDefinition(rankDefinition: RankDefinition): void {
  const key = `${STORAGE_KEY_PREFIX}${rankDefinition.orgId}`;
  localStorage.setItem(key, JSON.stringify(rankDefinition));
}

/**
 * ランク定義を取得
 */
export function getRankDefinition(orgId: string): RankDefinition | null {
  const key = `${STORAGE_KEY_PREFIX}${orgId}`;
  const data = localStorage.getItem(key);
  if (!data) {
    // デフォルトランク定義を返す
    return {
      orgId,
      ranks: DEFAULT_RANK_DEFINITION,
    };
  }
  try {
    return JSON.parse(data) as RankDefinition;
  } catch {
    return {
      orgId,
      ranks: DEFAULT_RANK_DEFINITION,
    };
  }
}

/**
 * デフォルトランク定義を取得
 */
export function getDefaultRankDefinition(orgId: string): RankDefinition {
  return {
    orgId,
    ranks: DEFAULT_RANK_DEFINITION,
  };
}

