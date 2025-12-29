import { SurveyResponse, RankDefinition } from '../types';
import { calculateOverallScore, calculateScoreFromResponse } from './literacyScoreService';
import { getRankDefinition } from './rankDefinitionService';

/**
 * スコアからランクを決定
 * スコアに基づいてランク1-5を返す
 */
export function getRankFromScore(score: number): number {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

/**
 * 回答者のランク変動情報を取得
 */
export interface RankChangeInfo {
  name: string;
  previousRank: number | null;
  currentRank: number;
  changeType: 'up' | 'down' | 'maintain' | 'new';
  date: string;
  response: SurveyResponse;
}

/**
 * 回答者毎のランク変動を計算
 */
export function calculateRankChanges(
  responses: SurveyResponse[],
  orgId: string,
  rankDefinition?: RankDefinition
): RankChangeInfo[] {
  // 回答者ごとにグループ化
  const byRespondent = new Map<string, SurveyResponse[]>();
  responses.forEach(response => {
    if (response.orgId === orgId) {
      const name = response.respondentName;
      if (!byRespondent.has(name)) {
        byRespondent.set(name, []);
      }
      byRespondent.get(name)!.push(response);
    }
  });

  const rankChanges: RankChangeInfo[] = [];

  byRespondent.forEach((respondentResponses, name) => {
    // 時系列でソート
    const sorted = [...respondentResponses].sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    if (sorted.length === 0) return;

    // 最新の回答
    const latestResponse = sorted[sorted.length - 1];
    const latestScores = calculateScoreFromResponse(latestResponse, rankDefinition);
    const latestOverallScore = calculateOverallScore(latestScores);
    const currentRank = getRankFromScore(latestOverallScore);

    // 前回の回答（最新以外の最後の回答）
    let previousRank: number | null = null;
    let changeType: 'up' | 'down' | 'maintain' | 'new' = 'new';

    if (sorted.length > 1) {
      const previousResponse = sorted[sorted.length - 2];
      const previousScores = calculateScoreFromResponse(previousResponse, rankDefinition);
      const previousOverallScore = calculateOverallScore(previousScores);
      previousRank = getRankFromScore(previousOverallScore);

      if (currentRank > previousRank) {
        changeType = 'up';
      } else if (currentRank < previousRank) {
        changeType = 'down';
      } else {
        changeType = 'maintain';
      }
    }

    rankChanges.push({
      name,
      previousRank,
      currentRank,
      changeType,
      date: new Date(latestResponse.submittedAt).toLocaleDateString('ja-JP'),
      response: latestResponse,
    });
  });

  // 日付でソート（新しい順）
  return rankChanges.sort(
    (a, b) => new Date(b.response.submittedAt).getTime() - new Date(a.response.submittedAt).getTime()
  );
}

/**
 * ランク変動の統計を計算
 */
export interface RankChangeStats {
  rankUp: number;
  maintain: number;
  rankDown: number;
}

export function calculateRankChangeStats(rankChanges: RankChangeInfo[]): RankChangeStats {
  return {
    rankUp: rankChanges.filter(c => c.changeType === 'up').length,
    maintain: rankChanges.filter(c => c.changeType === 'maintain').length,
    rankDown: rankChanges.filter(c => c.changeType === 'down').length,
  };
}

