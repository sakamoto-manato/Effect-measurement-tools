import { User, Organization } from '../types';

/**
 * メール送信サービス（シミュレーション）
 * 実際の本番環境では、SendGrid、AWS SES、Nodemailer等を使用
 */
export async function sendInvitationEmail(
  user: User,
  org: Organization | null,
  invitationToken: string
): Promise<boolean> {
  try {
    // 実際の実装では、ここでメール送信APIを呼び出す
    // 例: await sendGrid.send({ to: user.email, ... })
    
    // デモ用：コンソールにメール内容を出力
    const loginUrl = org 
      ? `${window.location.origin}?tenant=${org.slug}&token=${invitationToken}`
      : `${window.location.origin}?token=${invitationToken}`;
    
    const emailContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI Literacy Hub への招待
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${user.name} 様

${org ? `${org.name} の` : ''}AI Literacy Hub への招待を受けました。

以下のリンクからパスワードを設定してログインしてください：

${loginUrl}

このリンクは24時間有効です。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    console.log('📧 メール送信シミュレーション:');
    console.log(`送信先: ${user.email}`);
    console.log(`件名: AI Literacy Hub への招待`);
    console.log(`内容:\n${emailContent}`);
    
    // 実際の実装では、ここでメール送信APIを呼び出す
    // const result = await emailApi.send({
    //   to: user.email,
    //   subject: 'AI Literacy Hub への招待',
    //   html: generateEmailHTML(user, org, loginUrl),
    //   text: emailContent
    // });
    
    // デモ用：成功をシミュレート
    return true;
  } catch (error) {
    console.error('メール送信エラー:', error);
    return false;
  }
}

/**
 * メール送信の成功/失敗をユーザーに通知するためのメッセージを生成
 */
export function getEmailNotificationMessage(success: boolean, email: string): string {
  if (success) {
    return `${email} に招待メールを送信しました。`;
  } else {
    return `${email} へのメール送信に失敗しました。後でもう一度お試しください。`;
  }
}

