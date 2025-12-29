
import React, { useState, useEffect, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { LiteracyScores, Organization, SurveyResponse, Survey } from '../types';
import { LITERACY_DIMENSIONS } from '../constants';
import { getLiteracyInsight } from '../services/geminiService';
import { getResponsesByOrg } from '../services/surveyResponseService';
import { calculateOrgAverageScore, calculateOverallScore } from '../services/literacyScoreService';
import { getRankDefinition } from '../services/rankDefinitionService';

interface DashboardProps {
  org: Organization;
  viewingOrg: Organization | null;
  onClearView: () => void;
  organizations?: Organization[]; // 法人一覧（システム管理者用）
  onSelectOrg?: (org: Organization | null) => void; // 法人選択コールバック
  isSuperAdmin?: boolean; // システム管理者かどうか
}

const Dashboard: React.FC<DashboardProps> = ({ 
  org, 
  viewingOrg, 
  onClearView, 
  organizations = [],
  onSelectOrg,
  isSuperAdmin = false
}) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  // 回答データからスコアを計算
  const targetOrgId = viewingOrg?.id || org.id;
  const rankDefinition = viewingOrg?.rankDefinition || org.rankDefinition || getRankDefinition(targetOrgId);
  const orgResponses = responses.filter(r => r.orgId === targetOrgId);
  const calculatedScores = orgResponses.length > 0
    ? calculateOrgAverageScore(targetOrgId, orgResponses, rankDefinition || undefined)
    : null;

  // If viewing an org, we use average scores. For demo, we derive dimensions from avgScore
  const displayScores: LiteracyScores = calculatedScores || (viewingOrg 
    ? { 
        basics: viewingOrg.avgScore + 5, 
        prompting: viewingOrg.avgScore - 10, 
        ethics: viewingOrg.avgScore + 2, 
        tools: viewingOrg.avgScore, 
        automation: viewingOrg.avgScore - 5 
      }
    : {
        basics: org.avgScore + 5, 
        prompting: org.avgScore - 10, 
        ethics: org.avgScore + 2, 
        tools: org.avgScore, 
        automation: org.avgScore - 5 
      });

  const displayName = viewingOrg ? viewingOrg.name : org.name;

  const radarData = LITERACY_DIMENSIONS.map(dim => ({
    subject: dim.label,
    A: displayScores[dim.key as keyof LiteracyScores],
    fullMark: 100,
  }));

  const fetchInsight = async () => {
    setLoadingInsight(true);
    const promptName = viewingOrg ? `${viewingOrg.name}（組織全体）` : org.name;
    const text = await getLiteracyInsight(displayScores, promptName);
    setInsight(text || '');
    setLoadingInsight(false);
  };

  // 回答データを取得
  useEffect(() => {
    const targetOrgId = viewingOrg?.id || org.id;
    const orgResponses = getResponsesByOrg(targetOrgId);
    setResponses(orgResponses);

    // アンケートデータを取得（localStorageから）
    const surveysData = localStorage.getItem('surveys');
    if (surveysData) {
      try {
        const parsedSurveys = JSON.parse(surveysData) as Survey[];
        setSurveys(parsedSurveys.filter(s => s.isActive));
      } catch {
        // エラー時は空配列
        setSurveys([]);
      }
    } else {
      // 初期データがない場合は空配列
      setSurveys([]);
    }
  }, [viewingOrg, org]);

  useEffect(() => {
    fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewingOrg, org, responses]);

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOrgId = e.target.value;
    if (selectedOrgId === '') {
      onSelectOrg?.(null);
      onClearView();
    } else {
      const selectedOrg = organizations.find(org => org.id === selectedOrgId);
      if (selectedOrg) {
        onSelectOrg?.(selectedOrg);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* システム管理者用：法人選択セレクター */}
      {isSuperAdmin && organizations.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-lg flex-shrink-0">🏢</span>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  法人を選択してダッシュボードを表示
                </label>
                <select
                  value={viewingOrg?.id || ''}
                  onChange={handleOrgChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-slate-900"
                >
                  <option value="">マイダッシュボード</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {viewingOrg && (
              <button 
                onClick={() => {
                  onSelectOrg?.(null);
                  onClearView();
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                クリア
              </button>
            )}
          </div>
        </div>
      )}

      {/* 法人ビュー表示バナー */}
      {viewingOrg && (
        <div className="bg-indigo-600 text-white px-4 sm:px-6 py-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {viewingOrg.logo ? (
              <img
                src={viewingOrg.logo}
                alt={viewingOrg.name}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-white rounded-lg p-1 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="text-xl sm:text-2xl flex-shrink-0">🏢</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">組織ビュー実行中</p>
              <h3 className="text-base sm:text-xl font-bold truncate">{viewingOrg.name} の状況を表示しています</h3>
            </div>
          </div>
          <button 
            onClick={() => {
              onSelectOrg?.(null);
              onClearView();
            }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            {isSuperAdmin ? 'マイダッシュボードに戻る' : 'クリア'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">
            {viewingOrg ? '組織平均リテラシー分布' : 'リテラシー・レーダーチャート'}
          </h3>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={displayName}
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {viewingOrg ? '組織向け AI 戦略アドバイス' : 'Gemini AI 分析アドバイス'}
            </h3>
            <button
              onClick={fetchInsight}
              disabled={loadingInsight}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap ml-2"
            >
              {loadingInsight ? '分析中...' : '再生成'}
            </button>
          </div>
          <div className="flex-1 bg-indigo-50/50 rounded-lg p-4 sm:p-5 border border-indigo-100 text-slate-700 text-xs sm:text-sm leading-relaxed overflow-y-auto max-h-64">
            {loadingInsight ? (
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 italic">スコアをAIが解析しています...</p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{insight || 'アドバイスを読み込んでいます...'}</p>
            )}
          </div>
          <div className="mt-4 flex items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
            Powered by Gemini 3 Flash
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            {viewingOrg ? '組織平均スコア' : '総合スコア'}
          </p>
          <div className="flex items-end space-x-1 sm:space-x-2">
            <span className="text-2xl sm:text-4xl font-bold text-slate-900">
              {calculatedScores ? calculateOverallScore(calculatedScores) : (viewingOrg ? viewingOrg.avgScore : Math.round((Object.values(displayScores) as number[]).reduce((a, b) => a + b, 0) / 5))}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm mb-1">/ 100</span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            回答者数
          </p>
          <div className="flex items-end space-x-1 sm:space-x-2">
            <span className="text-xl sm:text-3xl font-bold text-indigo-600">
              {orgResponses.length}名
            </span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            総削減時間
          </p>
          <div className="flex items-end space-x-1 sm:space-x-2">
            <span className="text-xl sm:text-3xl font-bold text-emerald-600">
              {(() => {
                const totalHours = orgResponses.reduce((sum, response) => {
                  const timeReductionAnswer = response.answers.find(a => {
                    const question = surveys.find(s => s.id === response.surveyId)?.questions.find(q => q.id === a.questionId);
                    return question?.title.includes('業務時間削減効果');
                  });
                  if (timeReductionAnswer && typeof timeReductionAnswer.value === 'string') {
                    const value = timeReductionAnswer.value;
                    if (value === 'less_than_5') return 2.5;
                    if (value === '5_to_10') return 7.5;
                    if (value === '10_to_20') return 15;
                    if (value === 'more_than_20') return 25;
                  }
                  return 0;
                }, 0);
                return `${totalHours}h`;
              })()}
            </span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">削減率</p>
          <div className="flex items-end space-x-1 sm:space-x-2">
            <span className="text-xl sm:text-3xl font-bold text-purple-600">
              {(() => {
                const totalHours = orgResponses.reduce((sum, response) => {
                  const timeReductionAnswer = response.answers.find(a => {
                    const question = surveys.find(s => s.id === response.surveyId)?.questions.find(q => q.id === a.questionId);
                    return question?.title.includes('業務時間削減効果');
                  });
                  if (timeReductionAnswer && typeof timeReductionAnswer.value === 'string') {
                    const value = timeReductionAnswer.value;
                    if (value === 'less_than_5') return 2.5;
                    if (value === '5_to_10') return 7.5;
                    if (value === '10_to_20') return 15;
                    if (value === 'more_than_20') return 25;
                  }
                  return 0;
                }, 0);
                const totalWorkHours = orgResponses.length * 40; // 40時間/週
                const reductionRate = totalWorkHours > 0 ? Math.round((totalHours / totalWorkHours) * 100) : 0;
                return `${reductionRate}%`;
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* アンケート回答一覧 */}
      {surveys.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4">アンケート回答一覧</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              アンケートを選択
            </label>
            <select
              value={selectedSurveyId || ''}
              onChange={(e) => setSelectedSurveyId(e.target.value || null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white text-slate-900"
            >
              <option value="">すべてのアンケート</option>
              {surveys.map(survey => (
                <option key={survey.id} value={survey.id}>
                  {survey.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(selectedSurveyId
              ? orgResponses.filter(r => r.surveyId === selectedSurveyId)
              : orgResponses
            ).map((response) => {
              const survey = surveys.find(s => s.id === response.surveyId);
              return (
                <div
                  key={response.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{response.respondentName}</p>
                      <p className="text-sm text-slate-500 truncate">{survey?.title || 'アンケート'}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(response.submittedAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm whitespace-nowrap self-start sm:self-auto">
                      詳細を見る
                    </button>
                  </div>
                </div>
              );
            })}
            {orgResponses.length === 0 && (
              <p className="text-center text-slate-500 py-8">回答データがありません</p>
            )}
          </div>
        </div>
      )}

      {/* リテラシー推移グラフ（月次） */}
      {orgResponses.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">リテラシー推移（月次）</h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={(() => {
                // 過去6ヶ月のデータを生成
                const months: { month: string; score: number }[] = [];
                const now = new Date();
                for (let i = 5; i >= 0; i--) {
                  const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  const monthResponses = orgResponses.filter(r => {
                    const responseDate = new Date(r.submittedAt);
                    return responseDate.getFullYear() === date.getFullYear() &&
                           responseDate.getMonth() === date.getMonth();
                  });
                  const monthScore = monthResponses.length > 0
                    ? calculateOverallScore(calculateOrgAverageScore(targetOrgId, monthResponses, rankDefinition || undefined))
                    : 0;
                  months.push({ month: monthKey, score: monthScore });
                }
                return months;
              })()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} name="リテラシースコア" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 業務削減時間分析 */}
      {orgResponses.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">業務削減時間分析</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-4">削減時間の分布</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={(() => {
                        const distribution: { name: string; value: number }[] = [
                          { name: '5時間未満', value: 0 },
                          { name: '5~10時間', value: 0 },
                          { name: '10~20時間', value: 0 },
                          { name: '20時間以上', value: 0 },
                          { name: '効果なし', value: 0 },
                        ];
                        orgResponses.forEach(response => {
                          const timeReductionAnswer = response.answers.find(a => {
                            const question = surveys.find(s => s.id === response.surveyId)?.questions.find(q => q.id === a.questionId);
                            return question?.title.includes('業務時間削減効果');
                          });
                          if (timeReductionAnswer && typeof timeReductionAnswer.value === 'string') {
                            const value = timeReductionAnswer.value;
                            if (value === 'less_than_5') distribution[0].value++;
                            else if (value === '5_to_10') distribution[1].value++;
                            else if (value === '10_to_20') distribution[2].value++;
                            else if (value === 'more_than_20') distribution[3].value++;
                            else if (value === 'no_effect') distribution[4].value++;
                          }
                        });
                        return distribution.filter(d => d.value > 0);
                      })()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#6b7280'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">平均削減時間</p>
                <p className="text-2xl font-bold text-slate-800">
                  {(() => {
                    const totalHours = orgResponses.reduce((sum, response) => {
                      const timeReductionAnswer = response.answers.find(a => {
                        const question = surveys.find(s => s.id === response.surveyId)?.questions.find(q => q.id === a.questionId);
                        return question?.title.includes('業務時間削減効果');
                      });
                      if (timeReductionAnswer && typeof timeReductionAnswer.value === 'string') {
                        const value = timeReductionAnswer.value;
                        if (value === 'less_than_5') return 2.5;
                        if (value === '5_to_10') return 7.5;
                        if (value === '10_to_20') return 15;
                        if (value === 'more_than_20') return 25;
                      }
                      return 0;
                    }, 0);
                    return orgResponses.length > 0 ? `${(totalHours / orgResponses.length).toFixed(1)}時間/週` : '0時間/週';
                  })()}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">最大削減時間</p>
                <p className="text-2xl font-bold text-slate-800">
                  {(() => {
                    let maxHours = 0;
                    orgResponses.forEach(response => {
                      const timeReductionAnswer = response.answers.find(a => {
                        const question = surveys.find(s => s.id === response.surveyId)?.questions.find(q => q.id === a.questionId);
                        return question?.title.includes('業務時間削減効果');
                      });
                      if (timeReductionAnswer && typeof timeReductionAnswer.value === 'string') {
                        const value = timeReductionAnswer.value;
                        let hours = 0;
                        if (value === 'less_than_5') hours = 2.5;
                        else if (value === '5_to_10') hours = 7.5;
                        else if (value === '10_to_20') hours = 15;
                        else if (value === 'more_than_20') hours = 25;
                        maxHours = Math.max(maxHours, hours);
                      }
                    });
                    return `${maxHours}時間/週`;
                  })()}
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700 mb-2">削減時間の割合</p>
                <p className="text-2xl font-bold text-indigo-800">
                  {(() => {
                    const totalHours = orgResponses.reduce((sum, response) => {
                      const timeReductionAnswer = response.answers.find(a => {
                        const question = surveys.find(s => s.id === response.surveyId)?.questions.find(q => q.id === a.questionId);
                        return question?.title.includes('業務時間削減効果');
                      });
                      if (timeReductionAnswer && typeof timeReductionAnswer.value === 'string') {
                        const value = timeReductionAnswer.value;
                        if (value === 'less_than_5') return 2.5;
                        if (value === '5_to_10') return 7.5;
                        if (value === '10_to_20') return 15;
                        if (value === 'more_than_20') return 25;
                      }
                      return 0;
                    }, 0);
                    const totalWorkHours = orgResponses.length * 40; // 40時間/週
                    const reductionRate = totalWorkHours > 0 ? ((totalHours / totalWorkHours) * 100).toFixed(1) : '0';
                    return `${reductionRate}%`;
                  })()}
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  総労働時間（{orgResponses.length}名 × 40時間/週）に対する削減時間の割合
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 回答詳細モーダル */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">回答詳細</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700">回答者</p>
                <p className="text-lg text-slate-800">{selectedResponse.respondentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">回答日時</p>
                <p className="text-slate-600">{new Date(selectedResponse.submittedAt).toLocaleString('ja-JP')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">回答内容</p>
                <div className="space-y-3">
                  {selectedResponse.answers.map((answer, index) => {
                    const survey = surveys.find(s => s.id === selectedResponse.surveyId);
                    const question = survey?.questions.find(q => q.id === answer.questionId);
                    if (!question) return null;
                    return (
                      <div key={index} className="p-3 bg-slate-50 rounded border border-slate-200">
                        <p className="font-medium text-sm text-slate-700 mb-1">{question.title}</p>
                        <p className="text-slate-600">
                          {Array.isArray(answer.value)
                            ? answer.value.join(', ')
                            : answer.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
