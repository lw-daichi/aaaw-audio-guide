import fs from 'node:fs';
import path from 'node:path';

// 作品カルテ（.md）と、番号で対応する画像・音声を読み込むローダー。
// - content/works/NN.md … 作品ごとのドキュメント（frontmatter＋解説本文）
// - public/images/NN.*  … サムネイル/作品写真（番号で自動検出）
// - public/audio/NN.*   … 音声ガイド（番号で自動検出）
// ※ ビルド時（Node）に実行される。純Nodeなので QR スクリプトからも同じ関数を使える。

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'works');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');

// 検出する拡張子（左が優先）
const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'];
const AUDIO_EXTS = ['mp3', 'm4a', 'aac', 'ogg', 'wav'];

/**
 * @typedef {Object} Work
 * @property {string} id           作品番号（ファイル名＝URL。例 "01"）
 * @property {string} title        作品名
 * @property {string} title_en     作品名（英語・任意）
 * @property {string} artist       作家名
 * @property {string} artist_en    作家名（英語・任意）
 * @property {string} role         肩書き（任意）
 * @property {string} location     展示場所（任意）
 * @property {string} youtube_id   紹介ムービーの YouTube ID（無ければ空）
 * @property {string} thumbnail    サムネイル画像パス（public からの相対・自動検出）
 * @property {string} audio        音声ガイドパス（public からの相対・自動検出）
 * @property {string} description  解説本文
 */

/**
 * すべての作品を番号順で返す。
 * @returns {Work[]}
 */
export function getWorks() {
  let files;
  try {
    files = fs.readdirSync(CONTENT_DIR);
  } catch {
    return [];
  }
  return files
    .filter((f) => f.toLowerCase().endsWith('.md'))
    .filter((f) => !f.startsWith('_') && !f.startsWith('.')) // _TEMPLATE.md 等は除外
    .map(loadOne)
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

/** @param {string} filename */
function loadOne(filename) {
  const id = filename.replace(/\.md$/i, '').trim();
  if (!id) return null;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data, body } = parseDoc(raw);
  return {
    id,
    title: str(data.title),
    title_en: str(data.title_en),
    artist: str(data.artist),
    artist_en: str(data.artist_en),
    role: str(data.role),
    location: str(data.location),
    youtube_id: str(data.youtube_id),
    // frontmatter で明示指定があれば優先。無ければ番号で自動検出。
    thumbnail: str(data.thumbnail) || detectAsset(IMAGES_DIR, 'images', id, IMAGE_EXTS),
    audio: str(data.audio) || detectAsset(AUDIO_DIR, 'audio', id, AUDIO_EXTS),
    description: body,
  };
}

/**
 * public 配下のディレクトリから、番号に対応するファイルを探す。
 * 例）id="01" → images/01.jpg
 * @returns {string} public からの相対パス（無ければ空文字）
 */
function detectAsset(absDir, urlDir, id, exts) {
  let files;
  try {
    files = fs.readdirSync(absDir);
  } catch {
    return '';
  }
  // 1) 完全一致（01.jpg）を拡張子の優先順で
  for (const ext of exts) {
    if (files.includes(`${id}.${ext}`)) return `${urlDir}/${id}.${ext}`;
  }
  // 2) 「01.」「01-」で始まるファイル（01-main.jpg など）
  const alt = files.find((f) => f.startsWith(`${id}.`) || f.startsWith(`${id}-`));
  return alt ? `${urlDir}/${alt}` : '';
}

/**
 * ごく軽量な frontmatter パーサー。
 * 先頭の --- で囲まれた key: value 群と、その下の本文に分ける。
 * ※ 値のコロンや日本語もそのまま扱える（YAMLの 01→1 問題も起きない）。
 * @param {string} raw
 * @returns {{ data: Record<string,string>, body: string }}
 */
function parseDoc(raw) {
  const text = raw.replace(/^﻿/, ''); // BOM除去
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text.trim() };
  /** @type {Record<string,string>} */
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue; // 空行・コメント行は無視
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // 前後のクォートを外す
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key) data[key] = val;
  }
  return { data, body: m[2].trim() };
}

/** @param {any} v */
function str(v) {
  return v === undefined || v === null ? '' : String(v).trim();
}
