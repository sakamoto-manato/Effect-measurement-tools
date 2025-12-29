import React, { useState, useEffect } from 'react';
import { User, Role, Organization } from '../types';
import { MOCK_ORGS } from '../constants';
import { sendInvitationEmail, getEmailNotificationMessage } from '../services/emailService';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'scores'>) => void;
  user?: User | null; // 編集時は既存のユーザーデータ、新規追加時はnull
  orgId?: string; // 法人専用ダッシュボードの場合、所属法人IDを指定
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user, orgId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: Role.USER,
    orgId: orgId || '',
  });

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user) {
      // 編集モード：既存データをフォームに設定
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || Role.USER,
        orgId: user.orgId || orgId || '',
      });
      setEmailSent(false);
      setEmailError('');
    } else {
      // 新規追加モード：フォームをリセット
      setFormData({
        name: '',
        email: '',
        role: Role.USER,
        orgId: orgId || '',
      });
      setEmailSent(false);
      setEmailError('');
    }
  }, [user, orgId, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateInvitationToken = (): string => {
    // 実際の実装では、より安全なトークン生成を使用
    return `inv_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.orgId) {
      alert('名前、メールアドレス、所属法人は必須項目です。');
      return;
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('有効なメールアドレスを入力してください。');
      return;
    }

    if (!user) {
      // 新規追加：招待メールを送信
      setSendingEmail(true);
      setEmailError('');
      
      const invitationToken = generateInvitationToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24時間有効

      const newUser: Omit<User, 'id' | 'scores'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        orgId: formData.orgId,
        pendingPassword: true,
        invitationToken,
        invitationExpiresAt: expiresAt.toISOString(),
      };

      const org = MOCK_ORGS.find(o => o.id === formData.orgId);
      const emailSent = await sendInvitationEmail(newUser as User, org || null, invitationToken);
      
      setSendingEmail(false);
      
      if (emailSent) {
        setEmailSent(true);
        onSave(newUser);
        // モーダルは閉じずに、メール送信成功メッセージを表示
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setEmailError('メール送信に失敗しました。ユーザーは作成されましたが、手動で招待リンクを送信してください。');
        onSave(newUser);
      }
    } else {
      // 編集モード：メール送信なし
      const updatedUser: Omit<User, 'id' | 'scores'> = {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        orgId: formData.orgId,
      };
      onSave(updatedUser);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* オーバーレイ */}
        <div 
          className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* モーダル */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  {user ? 'ユーザー情報を編集' : '新規ユーザーを招待'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* 名前 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!user} // 編集時はメールアドレス変更不可
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                      user ? 'bg-slate-50 text-slate-500' : ''
                    }`}
                  />
                  {user && (
                    <p className="mt-1 text-xs text-slate-500">
                      メールアドレスは変更できません
                    </p>
                  )}
                </div>

                {/* ロール */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ロール <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value={Role.USER}>ユーザー</option>
                    <option value={Role.ORG_ADMIN}>法人管理者</option>
                    {!orgId && (
                      <option value={Role.SUPER_ADMIN}>システム管理者</option>
                    )}
                  </select>
                </div>

                {/* 所属法人 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    所属法人 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="orgId"
                    value={formData.orgId}
                    onChange={handleInputChange}
                    required
                    disabled={!!orgId} // 法人専用ダッシュボードの場合は固定
                    className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                      orgId ? 'bg-slate-50 text-slate-500' : ''
                    }`}
                  >
                    <option value="">選択してください</option>
                    {MOCK_ORGS.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  {orgId && (
                    <p className="mt-1 text-xs text-slate-500">
                      この法人のメンバーとして追加されます
                    </p>
                  )}
                </div>

                {/* メール送信状態 */}
                {!user && (
                  <div className="mt-4">
                    {sendingEmail && (
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600 text-sm border border-blue-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>招待メールを送信中...</span>
                        </div>
                      </div>
                    )}
                    {emailSent && (
                      <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm border border-green-100">
                        ✓ {formData.email} に招待メールを送信しました。
                      </div>
                    )}
                    {emailError && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                        {emailError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* フッター */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={sendingEmail}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={sendingEmail || emailSent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {sendingEmail ? '送信中...' : user ? '更新' : '招待メールを送信'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

