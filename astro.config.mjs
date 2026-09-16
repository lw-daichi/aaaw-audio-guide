// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL, BASE_PATH } from './site.config.mjs';

// https://astro.build/config
export default defineConfig({
  // 公開URL（QRが指す先）。site.config.mjs で一元管理しています。
  site: SITE_URL,
  base: BASE_PATH,
  // /works/01/ のような末尾スラッシュ付きのきれいなURLで出力します。
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
