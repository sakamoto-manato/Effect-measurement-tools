
import React, { useState, useEffect } from 'react';
import { Organization } from '../types';
import { MOCK_ORGS } from '../constants';

interface LoginProps {
  onLogin: (org: Organization, isSuperAdmin?: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tenantOrg, setTenantOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tenantSlug = params.get('tenant');
    
    if (tenantSlug) {
      const org = MOCK_ORGS.find(o => o.slug === tenantSlug);
      if (org) {
        setTenantOrg(org);
        setAccountId(org.accountId);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // システム管理者のログイン（特別なアカウントID）
    if (accountId === 'admin' && password === 'admin') {
      // システム管理者用のダミー組織を作成
      const adminOrg: Organization = {
        id: 'system-admin',
        slug: 'system',
        name: 'システム管理者',
        createdAt: new Date().toISOString(),
        memberCount: 0,
        avgScore: 0,
        accountId: 'admin',
        password: 'admin',
      };
      onLogin(adminOrg, true);
      return;
    }

    // 法人アカウントのログイン
    const org = MOCK_ORGS.find(o => o.accountId === accountId);
    if (org) {
      // デモ用：パスワードチェック（実際の実装ではハッシュ化されたパスワードと比較）
      if (org.password === password || password === 'demo123') {
        onLogin(org, false);
      } else {
        setError('アカウントIDまたはパスワードが正しくありません。');
      }
    } else {
      setError('アカウントIDまたはパスワードが正しくありません。');
    }
  };

  const clearTenant = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('tenant');
    window.location.href = url.toString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 border-t-4 border-indigo-600">
          <div className="text-center mb-8 sm:mb-10">
            {tenantOrg ? (
              <>
                <div className="inline-block p-3 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  <span className="text-xl sm:text-2xl font-bold">🏢</span>
                </div>
                <div className="flex justify-center mb-3">
                  <img src="/EffiQ-logo.png" alt="EffiQ" className="h-8 sm:h-10 w-auto" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{tenantOrg.name}</h1>
                <p className="text-slate-500 text-xs sm:text-sm">EffiQ ログイン</p>
                <button 
                  onClick={clearTenant}
                  className="mt-2 text-[10px] text-slate-400 hover:text-indigo-600 font-bold uppercase tracking-widest"
                >
                  ← システム全体ログインに戻る
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <img src="/EffiQ-logo.png" alt="EffiQ" className="h-12 sm:h-16 w-auto" />
                </div>
                <p className="text-slate-500 text-sm sm:text-base">法人アカウントでログインしてください</p>
              </>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {tenantOrg ? 'アカウントID' : 'アカウントID / システム管理者ID'}
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder={tenantOrg ? tenantOrg.accountId : "法人のアカウントID または 'admin'"}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                required
              />
              {tenantOrg && (
                <p className="mt-1 text-xs text-slate-500">
                  この法人のアカウントID: {tenantOrg.accountId}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">パスワード</label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">パスワードを忘れましたか？</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95"
            >
              ログイン
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest mb-4">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setAccountId('admin'); setPassword('admin'); }}
                className="text-[10px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                System Admin
              </button>
              {tenantOrg ? (
                <button
                  onClick={() => { setAccountId(tenantOrg.accountId); setPassword('demo123'); }}
                  className="text-[10px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  {tenantOrg.name}
                </button>
              ) : (
                <button
                  onClick={() => { setAccountId('tech-frontier'); setPassword('demo123'); }}
                  className="text-[10px] py-2 px-3 bg-slate-50 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Tech Frontier
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-slate-400 text-sm">
          &copy; 2024 EffiQ
        </p>
      </div>
    </div>
  );
};

export default Login;
