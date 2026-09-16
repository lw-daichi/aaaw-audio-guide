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

覚えることは **2つのフォルダ** と **1つのルール** だけです。

| やること | 場所 |
| --- | --- |
| ① 作品の文章（作品名・作家・場所・解説）を書く | **`content/works/` の中の `番号.md`** |
| ② 写真・音声ファイルを置く | **`public/images/` と `public/audio/`** |

> **1つのルール＝「番号をそろえる」だけ。**
> `content/works/04.md` の作品には、`public/images/04.jpg` と `public/audio/04.mp3` が
> **自動で** ひもづきます。ファイル名の番号を合わせるだけで、パスを書く必要はありません。

### 既存の作品を「編集」する

`content/works/01.md` などをテキストエディタ（または GitHub の画面上）で開いて書き換え、
保存して Push するだけ。数分後にページが自動更新されます。

### 新しい作品を「追加」する

1. **文章を用意する**
   `content/works/_TEMPLATE.md` をコピーして、**`04.md`（＝作品番号）** にリネーム。
   中身（作品名・作家名など）を書き換えます。番号がそのままURL `…/works/04/` になります。

2. **写真・音声を置く**
   - 写真 → `public/images/` に **`04.jpg`**（`.png` でも可）を入れる
   - 音声 → `public/audio/` に **`04.mp3`** を入れる
   - 動画がある場合 → YouTube に**限定公開**でアップし、`04.md` の `youtube_id` に「動画ID」を書く
     （URL `https://youtu.be/`**`dQw4w9WgXcQ`** の太字部分が動画IDです）

3. **GitHub に反映する**
   GitHub Desktop で「Commit」→「Push」（またはコマンド
   `git add -A && git commit -m "作品04を追加" && git push`）。数分で公開されます。

### `番号.md`（作品カルテ）の書き方

上が `---` で囲んだ**基本情報**、下が**解説の本文**です。

```markdown
---
title: 作品タイトル          # 作品名（必須）
title_en: ""                # 英語タイトル（任意）
artist: 作家名               # 作家名（必須）
artist_en: ""               # 作家名の英語表記（任意）
role: ""                    # 肩書き（任意・例 刺繍作家）
location: ""                # 展示場所（任意・例 コロポックル（アイヌコタン））
youtube_id: ""              # 紹介ムービーのYouTube ID（任意）
---
ここに解説文を書きます。

行を空けると段落になり、そのままページに反映されます。
```

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| ファイル名（`04.md`の`04`） | ◯ | 作品番号＝URL。**2桁**推奨（`01`）。印刷後は変更禁止 |
| `title` | ◯ | 作品名 |
| `artist` | ◯ | 作家名 |
| `title_en` / `artist_en` | 任意 | 英語表記 |
| `role` | 任意 | 肩書き（作家名の後に（　）付きで表示） |
| `location` | 任意 | 展示場所（📍付きで表示） |
| `youtube_id` | 任意 | 紹介ムービーの動画ID。無ければ空 |
| `---`より下の本文 | 任意 | 解説テキスト（改行はそのまま反映） |
| 写真 `public/images/04.*` | 任意 | 番号で自動表示。**動画が無い作品はページに大きく表示** |
| 音声 `public/audio/04.mp3` | 任意 | 番号で自動表示 |

> 💡 写真は**軽く圧縮**してから置いてください（会場の回線対策）。目安は長辺 1400px 前後・
> 数百KB。重い写真は開くのが遅くなります。まとめて渡していただければ一括圧縮も可能です。

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

**★印の3か所だけ覚えれば運用できます。**

```
aaaw-audio-guide/
├─ content/works/             # ★①作品カルテ（文章）を置く場所
│  ├─ 01.md  02.md  03.md     #   作品ごとに1ファイル（ファイル名＝番号＝URL）
│  └─ _TEMPLATE.md            #   新規作品はこれをコピーして使う
├─ public/
│  ├─ images/                 # ★②写真を置く（番号を合わせるだけ・例 01.jpg）
│  ├─ audio/                  # ★②音声を置く（番号を合わせるだけ・例 01.mp3）
│  └─ qr/                     #   生成されたQR（npm run qr）
├─ site.config.mjs            # ★③サイト設定（URL・タイトル・アクセス解析）
├─ src/
│  ├─ pages/
│  │  ├─ index.astro          # トップ（作品一覧）
│  │  ├─ about.astro          # このサイトについて
│  │  └─ works/[id].astro     # 作品ページ（番号ごとに自動生成）
│  ├─ components/             # 音声プレーヤー・YouTube埋め込み・解析
│  ├─ layouts/Base.astro      # 共通レイアウト
│  ├─ lib/works.js            # カルテ＋画像/音声を読み込む処理
│  └─ styles/global.css       # デザイン（トンマナ）
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
