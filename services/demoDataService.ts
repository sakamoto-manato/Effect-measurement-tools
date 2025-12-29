import { SurveyResponse, Answer } from '../types';
import { getSurveysByOrg } from './surveyService';

/**
 * デモデータを生成する関数
 * 複数の回答者に対して、時系列で成長するスコアの回答データを生成
 */
export function generateDemoResponses(orgId: string): SurveyResponse[] {
  const surveys = getSurveysByOrg(orgId);
  if (surveys.length === 0) {
    return [];
  }

  const survey = surveys[0]; // 最初のアンケートを使用
  const demoRespondents = [
    '山田 太郎',
    '佐藤 花子',
    '鈴木 一郎',
  ];

  const responses: SurveyResponse[] = [];
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - 3); // 3ヶ月前から開始

  demoRespondents.forEach((name, respondentIndex) => {
    // 各回答者に対して3回の回答を生成（時系列で成長）
    for (let i = 0; i < 3; i++) {
      const responseDate = new Date(baseDate);
      responseDate.setMonth(responseDate.getMonth() + i);
      responseDate.setDate(responseDate.getDate() + respondentIndex * 2); // 回答者ごとに少しずつ日付をずらす

      // 成長するスコアを計算（回答回数に応じてスコアが上がる）
      const baseScore = 30 + respondentIndex * 10; // 回答者ごとに初期スコアが異なる
      const improvement = i * 15; // 各回答で15点ずつ向上
      const currentScore = Math.min(100, baseScore + improvement);

      // ランクを決定（スコアに基づいて）
      let rankValue = 'rank1';
      if (currentScore >= 80) rankValue = 'rank5';
      else if (currentScore >= 60) rankValue = 'rank4';
      else if (currentScore >= 40) rankValue = 'rank3';
      else if (currentScore >= 20) rankValue = 'rank2';

      // 業務削減時間も成長に応じて増加
      let timeReductionValue = 'no_effect';
      if (i === 2) timeReductionValue = '10_to_20';
      else if (i === 1) timeReductionValue = '5_to_10';
      else if (i === 0) timeReductionValue = 'less_than_5';

      const answers: Answer[] = survey.questions.map(question => {
        if (question.id === 'q-name-default') {
          return {
            questionId: question.id,
            type: question.type,
            value: name,
          };
        }

        if (question.type === 'rank') {
          return {
            questionId: question.id,
            type: question.type,
            value: rankValue,
          };
        }

        if (question.id === 'q6' && question.type === 'radio') {
          return {
            questionId: question.id,
            type: question.type,
            value: timeReductionValue,
          };
        }

        // その他の質問はランダムまたはデフォルト値を設定
        if (question.type === 'radio' && question.options && question.options.length > 0) {
          const randomIndex = Math.floor(Math.random() * question.options.length);
          return {
            questionId: question.id,
            type: question.type,
            value: question.options[randomIndex].value,
          };
        }

        if (question.type === 'checkbox' && question.options && question.options.length > 0) {
          const selectedCount = Math.floor(Math.random() * 3) + 1;
          const selectedOptions = question.options.slice(0, selectedCount);
          return {
            questionId: question.id,
            type: question.type,
            value: selectedOptions.map(opt => opt.value),
          };
        }

        if (question.type === 'text' || question.type === 'textarea') {
          return {
            questionId: question.id,
            type: question.type,
            value: `デモ回答 ${i + 1}`,
          };
        }

        return {
          questionId: question.id,
          type: question.type,
          value: '',
        };
      });

      const response: SurveyResponse = {
        id: `demo-response-${name}-${i}-${Date.now()}`,
        surveyId: survey.id,
        orgId: orgId,
        respondentName: name,
        answers: answers,
        submittedAt: responseDate.toISOString(),
        literacyScore: currentScore,
        timeReductionHours: timeReductionValue === '10_to_20' ? 15 : timeReductionValue === '5_to_10' ? 7.5 : timeReductionValue === 'less_than_5' ? 2.5 : 0,
      };

      responses.push(response);
    }
  });

  return responses;
}

