// base（例 "/aaaw-audio-guide/"）を考慮して内部リンクや静的アセットの
// URL を組み立てるヘルパー。開発サーバー / 本番の両方で正しく動きます。
const BASE = import.meta.env.BASE_URL; // 末尾スラッシュ付き

/**
 * public 配下のパスや内部ページのパスに base を付与します。
 * 先頭スラッシュの有無は気にしなくてOK。
 * @param {string} [path]
 * @returns {string}
 */
export function href(path = '') {
  const clean = String(path).replace(/^\/+/, '');
  return BASE.replace(/\/$/, '') + '/' + clean;
}
