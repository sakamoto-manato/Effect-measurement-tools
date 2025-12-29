import { SurveyResponse, LiteracyScores, RankDefinition } from '../types';
import { getRankDefinition } from './rankDefinitionService';

/**
 * ランク値からスコアを計算
 * ランク1=20点、ランク2=40点、ランク3=60点、ランク4=80点、ランク5=100点
 */
function rankToScore(rankValue: string): number {
  const rankMap: { [key: string]: number } = {
    'rank1': 20,
    'rank2': 40,
    'rank3': 60,
    'rank4': 80,
    'rank5': 100,
  };
  return rankMap[rankValue] || 0;
}

/**
 * アンケート回答からリテラシースコアを計算
 * 「AI活用レベル自己評価」の質問からスコアを算出
 */
export function calculateScoreFromResponse(
  response: SurveyResponse,
  rankDefinition?: RankDefinition
): LiteracyScores {
  // デフォルトスコア
  const defaultScores: LiteracyScores = {
    basics: 0,
    prompting: 0,
    ethics: 0,
    tools: 0,
    automation: 0,
  };

  // 「AI活用レベル自己評価」の質問を探す
  const rankAnswer = response.answers.find(answer => answer.type === 'rank');
  if (!rankAnswer || typeof rankAnswer.value !== 'string') {
    return defaultScores;
  }

  const rankValue = rankAnswer.value;
  const baseScore = rankToScore(rankValue);

  // ランクから各次元のスコアを計算
  // ランクが高いほど全体的にスコアが高くなるが、各次元にばらつきを持たせる
  const scores: LiteracyScores = {
    basics: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
    prompting: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
    ethics: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
    tools: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
    automation: Math.max(0, Math.min(100, baseScore + Math.random() * 10 - 5)),
  };

  return scores;
}

/**
 * 法人平均スコアを計算
 */
export function calculateOrgAverageScore(
  orgId: string,
  responses: SurveyResponse[],
  rankDefinition?: RankDefinition
): LiteracyScores {
  if (responses.length === 0) {
    return {
      basics: 0,
      prompting: 0,
      ethics: 0,
      tools: 0,
      automation: 0,
    };
  }

  const orgResponses = responses.filter(r => r.orgId === orgId);
  if (orgResponses.length === 0) {
    return {
      basics: 0,
      prompting: 0,
      ethics: 0,
      tools: 0,
      automation: 0,
    };
  }

  const allScores = orgResponses.map(response =>
    calculateScoreFromResponse(response, rankDefinition)
  );

  const sumScores: LiteracyScores = allScores.reduce(
    (acc, scores) => ({
      basics: acc.basics + scores.basics,
      prompting: acc.prompting + scores.prompting,
      ethics: acc.ethics + scores.ethics,
      tools: acc.tools + scores.tools,
      automation: acc.automation + scores.automation,
    }),
    { basics: 0, prompting: 0, ethics: 0, tools: 0, automation: 0 }
  );

  const count = allScores.length;
  return {
    basics: Math.round(sumScores.basics / count),
    prompting: Math.round(sumScores.prompting / count),
    ethics: Math.round(sumScores.ethics / count),
    tools: Math.round(sumScores.tools / count),
    automation: Math.round(sumScores.automation / count),
  };
}

/**
 * 総合スコアを計算（5次元の平均）
 */
export function calculateOverallScore(scores: LiteracyScores): number {
  const sum = scores.basics + scores.prompting + scores.ethics + scores.tools + scores.automation;
  return Math.round(sum / 5);
}

