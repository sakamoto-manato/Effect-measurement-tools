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
