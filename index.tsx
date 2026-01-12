
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// エラーハンドリングを追加
const root = ReactDOM.createRoot(rootElement);

// エラーバウンダリーなしでも基本的なエラーハンドリング
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('アプリケーションの初期化エラー:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>エラーが発生しました</h1>
      <p>アプリケーションの初期化中にエラーが発生しました。</p>
      <p>ブラウザのコンソールを確認してください。</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${error}</pre>
    </div>
  `;
}
