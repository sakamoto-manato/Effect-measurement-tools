<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1V1rsfQPwcJWiOlcAoa2xrX21kDgfvFJ3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. 環境変数の設定:
   
   `.env.local`ファイルを作成し、以下の環境変数を設定してください：
   ```env
   # Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key
   
   # Supabase設定
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   - `GEMINI_API_KEY`: Gemini APIのキー（既存）
   - `VITE_SUPABASE_URL`: SupabaseプロジェクトのURL（https://app.supabase.com のプロジェクト設定から取得）
   - `VITE_SUPABASE_ANON_KEY`: SupabaseのAnon Key（https://app.supabase.com のプロジェクト設定から取得）

3. Supabaseデータベースのセットアップ:
   
   プロジェクトルートのSQLスキーマを使用してSupabaseにデータベースを作成してください。
   以下のテーブルが作成されます：
   - `organizations` (法人テーブル)
   - `profiles` (ユーザープロフィール)
   - `rank_definitions` (ランク定義)
   - `survey_responses` (アンケート回答)
   - `monthly_user_ranks` (月別ランク)

4. Run the app:
   ```bash
   npm run dev
   ```

## Supabase連携について

このアプリケーションはSupabaseをデータベースとして使用しています。

### 主な機能

- **法人管理**: 新規法人追加時に自動でランダム識別ID（UUID）とSlug（URL識別子）が生成されます
- **データ永続化**: 法人情報はSupabaseの`organizations`テーブルに保存されます
- **重複チェック**: Slugの重複を自動でチェックします

### データベーススキーマ

詳細なスキーマ定義は、プロジェクトルートのSQLファイルを参照してください。

## Vercelへのデプロイ

### デプロイ手順

1. **Vercelプロジェクトの作成**
   - Vercelダッシュボード（https://vercel.com）にログイン
   - 新しいプロジェクトを作成し、GitHubリポジトリを接続

2. **環境変数の設定**
   
   Vercelダッシュボードの「Settings」→「Environment Variables」で以下の環境変数を設定してください：
   
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
   
   **重要**: 環境変数名は`VITE_`で始まる必要があります（Viteのビルド時にクライアント側で使用可能にするため）

3. **デプロイ**
   - 環境変数を設定後、自動的に再デプロイされます
   - または、手動で「Deployments」タブから再デプロイを実行

### トラブルシューティング

**空白ページが表示される場合:**

1. **環境変数の確認**
   - Vercelダッシュボードで環境変数が正しく設定されているか確認
   - 環境変数名が`VITE_`で始まっているか確認

2. **ビルドログの確認**
   - Vercelダッシュボードの「Deployments」→ 該当デプロイ → 「Build Logs」を確認
   - エラーメッセージがないか確認

3. **ブラウザのコンソール確認**
   - ブラウザの開発者ツール（F12）を開き、「Console」タブでエラーを確認
   - ネットワークエラーやJavaScriptエラーがないか確認

4. **Supabase環境変数の確認**
   - Supabase環境変数が設定されていない場合でも、アプリは動作します（MOCK_ORGSを使用）
   - ただし、Supabase連携機能は使用できません
