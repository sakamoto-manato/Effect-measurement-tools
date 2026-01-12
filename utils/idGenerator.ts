/**
 * ランダム識別IDを生成するユーティリティ関数
 * Supabase連携を考慮し、UUID v4形式を使用
 */

/**
 * UUID v4形式のランダム識別IDを生成
 * crypto.randomUUID()が利用可能な場合はそれを使用し、
 * 利用不可能な場合は代替実装を使用
 */
export function generateRandomOrgId(): string {
  // モダンブラウザでは crypto.randomUUID() が利用可能
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // フォールバック: UUID v4互換の生成関数
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * ランダム識別IDが有効なUUID v4形式かどうかを検証
 */
export function isValidOrgId(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * ランダムなSlug（URL識別子）を生成
 * 小文字の英数字とハイフンのみを使用
 * 例: "a3b2c1d4-e5f6-g7h8"
 */
export function generateRandomSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 4, 4]; // 各セグメントの長さ
  const slugParts: string[] = [];
  
  segments.forEach((length, index) => {
    let segment = '';
    for (let i = 0; i < length; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    slugParts.push(segment);
  });
  
  return slugParts.join('-');
}
