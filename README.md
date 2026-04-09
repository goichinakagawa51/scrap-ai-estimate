# スクラップAI見積

スクラップの写真を撮るだけでAIが品目を識別し、当日単価で買取価格を算出するPWAアプリ。

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. ローカルで動作確認（任意）

```bash
npm run dev
```

ブラウザで http://localhost:5173 が開きます。  
※ AI解析機能はVercelデプロイ後に動作します。

### 3. GitHubにpush

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/scrap-ai-estimate.git
git push -u origin main
```

### 4. Vercelにデプロイ

1. https://vercel.com にログイン
2. 「Add New...」→「Project」
3. GitHubのリポジトリ `scrap-ai-estimate` を選択 →「Import」
4. **Environment Variables** に以下を追加：
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-xxxxxxxx`（あなたのAPIキー）
5. 「Deploy」をクリック

### 5. テストユーザーに配布

デプロイ完了後に発行されるURL（例: `https://scrap-ai-estimate.vercel.app`）をLINE等でテストユーザーに共有。

テストユーザーには以下を案内：
1. iPhoneのSafariでURLを開く
2. 共有ボタン（□↑）→「ホーム画面に追加」
3. ホーム画面からアプリとして起動

## 技術構成

- **フロントエンド**: React + Vite
- **AI**: Claude Sonnet（Anthropic API）
- **ホスティング**: Vercel（無料プラン）
- **APIプロキシ**: Vercel Serverless Functions（`/api/analyze`）

## ファイル構成

```
├── api/analyze.js       ← APIプロキシ（APIキーをサーバー側で保持）
├── public/
│   ├── manifest.json    ← PWA設定
│   └── icon-192.png     ← アプリアイコン
├── src/
│   ├── App.jsx          ← メインアプリ
│   └── main.jsx         ← エントリポイント
├── index.html           ← HTML（PWAメタタグ含む）
├── vercel.json          ← Vercelルーティング設定
└── vite.config.js       ← Vite設定
```
