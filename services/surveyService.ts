import { Survey } from '../types';

const STORAGE_KEY_PREFIX = 'surveys_';

/**
 * アンケートを保存（localStorage）
 */
export function saveSurvey(survey: Survey): void {
  const key = `${STORAGE_KEY_PREFIX}${survey.orgId}`;
  const existingSurveys = getSurveysByOrg(survey.orgId);
  const updatedSurveys = existingSurveys.map(s => 
    s.id === survey.id ? survey : s
  );
  
  // 新規アンケートの場合は追加
  if (!existingSurveys.find(s => s.id === survey.id)) {
    updatedSurveys.push(survey);
  }
  
  localStorage.setItem(key, JSON.stringify(updatedSurveys));
}

/**
 * アンケート一覧を保存（localStorage）
 */
export function saveSurveys(orgId: string, surveys: Survey[]): void {
  const key = `${STORAGE_KEY_PREFIX}${orgId}`;
  localStorage.setItem(key, JSON.stringify(surveys));
}

/**
 * 法人別のアンケート一覧を取得
 */
export function getSurveysByOrg(orgId: string): Survey[] {
  const key = `${STORAGE_KEY_PREFIX}${orgId}`;
  const data = localStorage.getItem(key);
  if (!data) return [];
  try {
    return JSON.parse(data) as Survey[];
  } catch {
    return [];
  }
}

/**
 * アンケートIDでアンケートを取得
 */
export function getSurveyById(surveyId: string, orgId: string): Survey | null {
  const surveys = getSurveysByOrg(orgId);
  return surveys.find(s => s.id === surveyId) || null;
}

/**
 * すべてのアンケートからIDで検索（orgIdが不明な場合）
 */
export function findSurveyById(surveyId: string): Survey | null {
  // すべてのlocalStorageキーをチェック
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      try {
        const surveys = JSON.parse(localStorage.getItem(key) || '[]') as Survey[];
        const survey = surveys.find(s => s.id === surveyId);
        if (survey) return survey;
      } catch {
        continue;
      }
    }
  }
  return null;
}

/**
 * アンケートを削除
 */
export function deleteSurvey(surveyId: string, orgId: string): void {
  const surveys = getSurveysByOrg(orgId);
  const updatedSurveys = surveys.filter(s => s.id !== surveyId);
  saveSurveys(orgId, updatedSurveys);
}

