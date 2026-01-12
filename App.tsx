
import React, { useState, useEffect } from 'react';
import { AuthState, Organization, Role, Survey } from './types';
import { MOCK_ORGS } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AdminView from './components/AdminView';
import Login from './components/Login';
import SurveyManagement from './components/SurveyManagement';
import RankDefinitionSettings from './components/RankDefinitionSettings';
import SurveyResponseForm from './components/SurveyResponseForm';
import RespondentGrowthAnalysis from './components/RespondentGrowthAnalysis';
import { findSurveyById } from './services/surveyService';
import { saveResponse } from './services/surveyResponseService';
import { getOrganizationById } from './services/organizationService';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    org: null,
    viewingOrg: null,
    isAuthenticated: false,
    isSuperAdmin: false
  });

  const [activeView, setActiveView] = useState<'dashboard' | 'orgs' | 'surveys' | 'rankDefinition' | 'growth'>('dashboard');
  const [publicSurvey, setPublicSurvey] = useState<Survey | null>(null); // 公開回答画面用

  // Handle URL params on initialization
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tenantId = params.get('tenant'); // UUIDを使用
    const surveyId = params.get('survey');
    
    if (tenantId) {
      // UUIDで法人を検索（Supabaseから取得を試みる）
      loadOrganizationById(tenantId);
    }
    
    // 回答リンクからアクセスされた場合
    if (surveyId) {
      const survey = findSurveyById(surveyId);
      if (survey && survey.isActive) {
        setPublicSurvey(survey);
      }
    }
  }, []);

  const loadOrganizationById = async (orgId: string) => {
    try {
      // まずSupabaseから取得を試みる
      const org = await getOrganizationById(orgId);
      if (org) {
        setAuth(prev => ({ ...prev, viewingOrg: org }));
        return;
      }
    } catch (error) {
      console.error('法人の取得に失敗しました:', error);
    }
    
    // Supabaseから取得できない場合は、MOCK_ORGSから検索（後方互換性）
    const org = MOCK_ORGS.find(o => o.id === orgId || o.slug === orgId);
    if (org) {
      setAuth(prev => ({ ...prev, viewingOrg: org }));
    }
  };

  const handleLogin = (org: Organization, isSuperAdmin?: boolean) => {
    setAuth(prev => ({
      ...prev,
      org,
      isAuthenticated: true,
      isSuperAdmin: isSuperAdmin || false
    }));
  };

  const handleLogout = () => {
    setAuth({ org: null, viewingOrg: null, isAuthenticated: false, isSuperAdmin: false });
    setActiveView('dashboard');
  };

  const handleSelectOrg = (org: Organization | null) => {
    setAuth(prev => ({ ...prev, viewingOrg: org }));
    // 成長率分析画面から呼ばれた場合は、activeViewを変更しない
    if (org && activeView !== 'growth') {
      setActiveView('dashboard');
    }
  };

  const clearViewingOrg = () => {
    // Clear URL parameter and state
    const url = new URL(window.location.href);
    url.searchParams.delete('tenant');
    window.history.pushState({}, '', url.toString());
    setAuth(prev => ({ ...prev, viewingOrg: null }));
  };

  // 公開回答画面を表示中の場合（ログイン不要）
  if (publicSurvey) {
    const handlePublicResponseSubmit = (response: any) => {
      saveResponse(response);
      alert('アンケートへのご回答ありがとうございました！');
      // URLパラメータをクリアしてリダイレクト
      const url = new URL(window.location.href);
      url.searchParams.delete('survey');
      window.history.pushState({}, '', url.toString());
      setPublicSurvey(null);
    };

    const handlePublicResponseCancel = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('survey');
      window.history.pushState({}, '', url.toString());
      setPublicSurvey(null);
    };

    return (
      <div className="min-h-screen bg-slate-50">
        <SurveyResponseForm
          survey={publicSurvey}
          orgId={publicSurvey.orgId}
          onSubmit={handlePublicResponseSubmit}
          onCancel={handlePublicResponseCancel}
        />
      </div>
    );
  }

  if (!auth.isAuthenticated || !auth.org) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      org={auth.org}
      isSuperAdmin={auth.isSuperAdmin || false}
      onLogout={handleLogout}
      onNavigate={setActiveView}
      activeView={activeView}
    >
      {activeView === 'dashboard' && (
        <Dashboard 
          org={auth.org}
          viewingOrg={auth.viewingOrg} 
          onClearView={clearViewingOrg}
          organizations={auth.isSuperAdmin ? MOCK_ORGS : undefined}
          onSelectOrg={handleSelectOrg}
          isSuperAdmin={auth.isSuperAdmin || false}
        />
      )}
      {activeView === 'orgs' && (
        <AdminView type="orgs" onSelectOrg={handleSelectOrg} />
      )}
      {activeView === 'surveys' && !auth.isSuperAdmin && (
        <SurveyManagement 
          userRole={Role.ORG_ADMIN}
          orgId={auth.org.id}
        />
      )}
      {activeView === 'rankDefinition' && !auth.isSuperAdmin && (
        <RankDefinitionSettings org={auth.org} />
      )}
      {activeView === 'growth' && (
        <RespondentGrowthAnalysis 
          org={auth.org}
          viewingOrg={auth.viewingOrg}
          isSuperAdmin={auth.isSuperAdmin || false}
          organizations={auth.isSuperAdmin ? MOCK_ORGS : undefined}
          onSelectOrg={handleSelectOrg}
          onClearView={clearViewingOrg}
        />
      )}
    </Layout>
  );
};

export default App;
