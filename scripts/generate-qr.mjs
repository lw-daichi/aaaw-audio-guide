// =====================================================================
//  QRコード生成スクリプト
//  works.yaml の各作品URLに対応する QR を SVG と PNG で public/qr/ に出力します。
//  実行： npm run qr
//
//  出力例）public/qr/01.svg, public/qr/01.png ...
//          印刷用に PNG は高解像度（1200px相当）で出力します。
// =====================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import QRCode from 'qrcode';
import { SITE_URL, BASE_PATH } from '../site.config.mjs';

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)));
const worksFile = path.join(root, 'src', 'data', 'works.yaml');
const outDir = path.join(root, 'public', 'qr');

function buildUrl(id) {
  // 例）https://lw-daichi.github.io/aaaw-audio-guide/works/01/
  const base = BASE_PATH.replace(/\/$/, '');
  return `${SITE_URL}${base}/works/${id}/`;
}

async function main() {
  const raw = fs.readFileSync(worksFile, 'utf-8');
  const data = yaml.load(raw) || {};
  const works = Array.isArray(data.works) ? data.works : [];

  if (works.length === 0) {
    console.error('作品が見つかりません（works.yaml を確認してください）。');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  const indexLines = ['# QRコード対応表', '', '| No. | 作品名 | URL |', '| --- | --- | --- |'];

  for (const w of works) {
    if (w == null || w.id === undefined || w.id === null) continue;
    const id = String(w.id).padStart(2, '0');
    const url = buildUrl(id);
    const opts = { errorCorrectionLevel: 'M', margin: 2 };

    // SVG（拡大しても劣化しない・印刷に最適）
    const svg = await QRCode.toString(url, { ...opts, type: 'svg' });
    fs.writeFileSync(path.join(outDir, `${id}.svg`), svg, 'utf-8');

    // PNG（高解像度）
    await QRCode.toFile(path.join(outDir, `${id}.png`), url, {
      ...opts,
      type: 'png',
      width: 1200,
    });

    indexLines.push(`| ${id} | ${w.title ?? ''} | ${url} |`);
    console.log(`✓ ${id}  ${url}`);
  }

  // 対応表（印刷時の照合用）
  fs.writeFileSync(path.join(outDir, 'index.md'), indexLines.join('\n') + '\n', 'utf-8');

  console.log(`\n完了：${outDir} に出力しました（対応表 index.md も生成）。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
