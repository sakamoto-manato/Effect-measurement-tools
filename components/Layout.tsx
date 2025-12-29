
import React from 'react';
import { Organization } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  org: Organization;
  isSuperAdmin: boolean;
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'orgs' | 'surveys' | 'rankDefinition' | 'growth') => void;
  activeView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, org, isSuperAdmin, onLogout, onNavigate, activeView }) => {

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AI Literacy Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Dashboard</p>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span className="mr-3">📊</span>
            ダッシュボード
          </button>

          <button
            onClick={() => onNavigate('surveys')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeView === 'surveys' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span className="mr-3">📝</span>
            アンケート管理
          </button>

          <button
            onClick={() => onNavigate('rankDefinition')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeView === 'rankDefinition' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span className="mr-3">⭐</span>
            ランク定義設定
          </button>

          <button
            onClick={() => onNavigate('growth')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeView === 'growth' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <span className="mr-3">📈</span>
            成長率分析
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => onNavigate('orgs')}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeView === 'orgs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <span className="mr-3">🏢</span>
              法人管理
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center p-3 mb-4 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
              {org.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{org.name}</p>
              <p className="text-xs text-slate-500 truncate">{isSuperAdmin ? 'システム管理者' : '法人アカウント'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-2 px-4 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm"
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {activeView === 'dashboard' && '分析ダッシュボード'}
            {activeView === 'surveys' && 'アンケート管理'}
            {activeView === 'rankDefinition' && 'ランク定義設定'}
            {activeView === 'growth' && '回答者別成長率分析'}
            {activeView === 'orgs' && '法人アカウント管理'}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {isSuperAdmin ? 'システム管理者' : '法人アカウント'}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
