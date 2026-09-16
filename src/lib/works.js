import yaml from 'js-yaml';
// Vite の ?raw で works.yaml を文字列として読み込みます（ビルド時に確定）。
import worksRaw from '../data/works.yaml?raw';

/**
 * @typedef {Object} Work
 * @property {string} id           ゼロ埋め2桁の作品番号（例 "01"）。URLに使用。
 * @property {string} title        作品名
 * @property {string} artist       作家名
 * @property {string} artist_en    作家名（英語・任意）
 * @property {string} role         肩書き（例「刺繍作家」・任意）
 * @property {string} location     展示場所（任意）
 * @property {string} thumbnail    サムネイル画像のパス（public からの相対）
 * @property {string} youtube_id   紹介ムービーの YouTube ID（無ければ空文字）
 * @property {string} audio        音声ガイド mp3 のパス（無ければ空文字）
 * @property {string} description  解説テキスト（日本語）
 * @property {string} title_en     作品名（英語・任意）
 * @property {string} description_en 解説テキスト（英語・任意）
 */

/**
 * works.yaml を読み込み、正規化して番号順に返します。
 * @returns {Work[]}
 */
export function getWorks() {
  const data = yaml.load(worksRaw) || {};
  const list = Array.isArray(data.works) ? data.works : [];
  return list
    .filter((w) => w && w.id !== undefined && w.id !== null)
    .map(normalize)
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

/**
 * @param {any} w
 * @returns {Work}
 */
function normalize(w) {
  return {
    // 数字として読まれてしまった場合(例: 1)も 2桁ゼロ埋めに補正。
    id: String(w.id).padStart(2, '0'),
    title: str(w.title),
    artist: str(w.artist),
    artist_en: str(w.artist_en),
    role: str(w.role),
    location: str(w.location),
    thumbnail: str(w.thumbnail),
    youtube_id: str(w.youtube_id),
    audio: str(w.audio),
    description: str(w.description),
    title_en: str(w.title_en),
    description_en: str(w.description_en),
  };
}

/** @param {any} v */
function str(v) {
  return v === undefined || v === null ? '' : String(v).trim();
}
