# AAAW2026 音声ガイドサイト

各作品の「作品紹介ムービー（アーティスト音声＋作品映像）」と音声ガイドを、
**1作品＝1ページ**で公開する静的サイトです。

- 会場：作品脇のQR → スマホでそのページを開き、音声/動画を再生
- オンライン：トップから全作品を巡る（オンラインツアー）
- ホスティング：**GitHub Pages（無料）**
- 公開URL（QRが指す先・凍結済み）：
  **https://lw-daichi.github.io/aaaw-audio-guide/**

---

## 🧑‍🎨 作品の追加・編集手順（非エンジニア向け）

作品の内容は、たった1つのファイル **`src/data/works.yaml`** を編集するだけで追加できます。

### 手順

1. **画像と音声のファイルを置く**
   - サムネイル画像 → `public/images/` に入れる（例：`public/images/04.jpg`）
   - 音声ガイド mp3 → `public/audio/` に入れる（例：`public/audio/04.mp3`）
   - ※ 動画は YouTube に**限定公開**でアップロードし、その「動画ID」を使います
     （URL `https://youtu.be/**dQw4w9WgXcQ**` の太字部分が動画IDです）

2. **`src/data/works.yaml` に1件追記する**（下の書き方を参照）

3. **保存して GitHub に反映する**
   - GitHub Desktop などで「Commit」→「Push」すれば、数分後に自動で公開されます
   - （コマンドの場合：`git add -A && git commit -m "作品04を追加" && git push`）

### works.yaml の書き方（1作品ぶん）

```yaml
  - id: "04"                     # ★必ずダブルクォートで囲む。2桁ゼロ埋め（01, 02...）
    title: 作品タイトル            # 作品名（日本語）
    artist: 作家名                # 作家名
    thumbnail: images/04.jpg      # サムネイル画像（public/ からの相対パス）
    youtube_id: dQw4w9WgXcQ       # 紹介ムービーの YouTube 動画ID（無ければ "" ）
    audio: audio/04.mp3           # 音声ガイド mp3（無ければ "" ）
    description: |                # 解説テキスト（改行はそのまま反映されます）
      ここに解説文を書きます。
      2行目もこのように書けます。
```

#### 各項目のルール

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| `id` | ◯ | 作品番号。**必ず `"01"` のようにクォートで囲む**。URLに使うので、印刷後は変更禁止 |
| `title` | ◯ | 作品名 |
| `artist` | ◯ | 作家名 |
| `thumbnail` | ◯ | 一覧・OGP用画像。`public/images/` に置いてパスを書く |
| `youtube_id` | 任意 | 動画がある作品のみ。無い場合は `""` にする（音声だけでも成立します） |
| `audio` | 任意 | 音声がある作品のみ。無い場合は `""` にする（動画だけでも成立します） |
| `description` | 任意 | 解説テキスト |

> ⚠️ **id のクォート忘れに注意**：`id: 01` と書くと `1` として扱われURLが崩れます。
> 必ず **`id: "01"`** と書いてください。

---

## 🔳 QRコードの作り方

作品リストと番号（id）が**確定してから**、以下を実行するとQRを生成できます。

```bash
npm run qr
```

- `public/qr/` に `01.svg` / `01.png` … が出力されます（印刷用にPNGは高解像度）
- `public/qr/index.md` にURL対応表も出力されます（印刷時の照合用）
- **印刷後はURL（＝作品番号）を変更できません。** 番号を確定してから印刷してください。

---

## 🖥️ ローカルで確認する（任意・エンジニア向け）

```bash
npm install       # 最初の1回だけ
npm run dev       # 開発サーバー起動 → 表示されたURLをブラウザで開く
npm run build     # 本番と同じ静的ファイルを dist/ に生成
npm run preview   # build 後の内容をローカルで確認
```

> Node.js（v18.20.8 以上 / v20.3 以上 / v22 以上）が必要です。

---

## 🚀 公開のしくみ（GitHub Pages 自動デプロイ）

`main` ブランチに push すると、**GitHub Actions が自動でビルド＆公開**します
（設定：`.github/workflows/deploy.yml`）。手作業のアップロードは不要です。

### 初回だけ必要なセットアップ

1. GitHub でリポジトリ `aaaw-audio-guide` を作成し、このフォルダを push する
2. リポジトリの **Settings → Pages** を開く
3. **Build and deployment → Source** を **「GitHub Actions」** に設定する
4. 以後、`main` への push で自動公開されます
   （Actions タブでビルドの進行・成否を確認できます）

> 公開URLやリポジトリ名を変える場合は **`site.config.mjs`** の
> `SITE_URL` / `BASE_PATH` を修正してください（QRのURLもここを参照します）。

---

## 📊 アクセス解析（任意）

`site.config.mjs` にコードを入れると解析タグが有効になります（空なら何も出力しません）。

- **GoatCounter**：`GOATCOUNTER_CODE = 'あなたのコード'`
- **Cloudflare Web Analytics**：`CLOUDFLARE_ANALYTICS_TOKEN = 'あなたのトークン'`
- 動画の再生数は **YouTube Analytics**（作品別）で確認できます

> 各サービスの無料枠・規約は導入時にご確認ください。

---

## 🗂️ フォルダ構成（参考）

```
aaaw-audio-guide/
├─ site.config.mjs            # サイト設定（URL・タイトル・解析）←よく触るのはここと works.yaml
├─ src/
│  ├─ data/works.yaml         # ★作品データ（追加・編集はここ）
│  ├─ pages/
│  │  ├─ index.astro          # トップ（作品一覧）
│  │  ├─ about.astro          # このサイトについて
│  │  └─ works/[id].astro     # 作品ページ（自動生成）
│  ├─ components/             # 音声プレーヤー・YouTube埋め込み・解析
│  ├─ layouts/Base.astro      # 共通レイアウト
│  ├─ lib/                    # works.yaml 読み込み・URL補助
│  └─ styles/global.css       # デザイン（ライト/ダーク対応）
├─ public/
│  ├─ images/                 # サムネイル画像を置く
│  ├─ audio/                  # 音声ガイド mp3 を置く
│  └─ qr/                     # 生成されたQR（npm run qr）
├─ scripts/generate-qr.mjs    # QR生成スクリプト
└─ .github/workflows/deploy.yml  # 自動デプロイ設定
```

---

## メモ・既知の未決事項

- 作品リストと番号（id）の対応表の確定 ← **QR印刷前に必須**
- 音声のみ／動画付きの作品の混在 → 本テンプレートで自動対応（片方が空 `""` でOK）
- アイヌ文化表現・クレジット表記のレビュー（`src/pages/about.astro` に記載欄あり）
- サンプルの画像（`public/images/*.svg`）・音声（`public/audio/*.mp3`・無音）・
  `youtube_id`（Rick Astley のダミー）は、**本番の内容に差し替えてください**。
