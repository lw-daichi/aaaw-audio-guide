// =====================================================================
//  QRコード生成スクリプト
//  各作品ページのURLに対応する QR を SVG と PNG で public/qr/ に出力します。
//  実行： npm run qr
//
//  出力例）public/qr/01.svg, public/qr/01.png ...
//          印刷用に PNG は高解像度（1200px相当）で出力します。
//  作品の一覧は content/works/*.md（＝サイト本体と同じ情報源）から取得します。
// =====================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { SITE_URL, BASE_PATH } from '../site.config.mjs';
import { getWorks } from '../src/lib/works.js';

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)));
const outDir = path.join(root, 'public', 'qr');

function buildUrl(id) {
  // 例）https://lw-daichi.github.io/aaaw-audio-guide/works/01/
  const base = BASE_PATH.replace(/\/$/, '');
  return `${SITE_URL}${base}/works/${id}/`;
}

async function main() {
  const works = getWorks();
  if (works.length === 0) {
    console.error('作品が見つかりません（content/works/ に .md を確認してください）。');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const indexLines = ['# QRコード対応表', '', '| No. | 作品名 | URL |', '| --- | --- | --- |'];

  for (const w of works) {
    const url = buildUrl(w.id);
    const opts = { errorCorrectionLevel: 'M', margin: 2 };

    // SVG（拡大しても劣化しない・印刷に最適）
    const svg = await QRCode.toString(url, { ...opts, type: 'svg' });
    fs.writeFileSync(path.join(outDir, `${w.id}.svg`), svg, 'utf-8');

    // PNG（高解像度）
    await QRCode.toFile(path.join(outDir, `${w.id}.png`), url, {
      ...opts,
      type: 'png',
      width: 1200,
    });

    indexLines.push(`| ${w.id} | ${w.title} | ${url} |`);
    console.log(`✓ ${w.id}  ${url}`);
  }

  // 対応表（印刷時の照合用）
  fs.writeFileSync(path.join(outDir, 'index.md'), indexLines.join('\n') + '\n', 'utf-8');

  console.log(`\n完了：${outDir} に出力しました（対応表 index.md も生成）。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
