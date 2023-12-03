import { defineConfig } from "astro/config";
import postcssMergeQueries from "postcss-merge-queries";
import glsl from "vite-plugin-glsl";
import * as dotenv from "dotenv";
dotenv.config();

function createDate() {
  let now = new Date(),
    year = String(now.getFullYear()),
    month = String(now.getMonth() + 1),
    date = String(now.getDate()),
    hour = String(now.getHours()),
    minute = String(now.getMinutes());

  month = month.length === 1 ? `0${month}` : month;
  return `${year}${month}${date}`;
}

const MODE = process.env.NODE_ENV;
const IS_PROD = MODE === "production";
const SITE_URL = IS_PROD ? process.env.PUBLIC_PROD_URL : process.env.PUBLIC_LOCAL_URL;
const DATE = createDate();

console.log(
  `// --------------------------\n\n⚡️ ~ MODE : ${MODE}\n\n▕▔▔▔▔▔▔▔▔▔▔▔╲\n▕╮╭┻┻╮╭┻┻╮╭▕╮╲\n▕╯┃╭╮┃┃╭╮┃╰▕╯╭▏\n▕╭┻┻┻┛┗┻┻┛ ╰▏ ▏\n▕╰━━━┓┈┈┈╭╮▕╭╮▏\n▕╭╮╰┳┳┳┳╯╰╯▕╰╯▏\n▕╰╯┈┗┛┗┛┈╭╮▕╮┈▏\n\n// --------------------------\n\n🌏 ~ ${SITE_URL}\n\n// --------------------------`,
);

// https://astro.build/config
export default defineConfig({
  base: "/",
  site: SITE_URL,
  compressHTML: false, // デフォルト: true
  markdown: {
    drafts: true,
  },
  build: {
    inlineStylesheets: "never", // 外部スタイルシート化
    assets: "assets",
  },
  server: {
    open: true,
    host: true,
  },
  preview: {
    open: true,
    host: true,
  },
  plugins: ["prettier-plugin-astro"],
  integrations: [],
  vite: {
    build: {
      rollupOptions: {
        output: {
          assetFileNames: `assets/build.[hash].${DATE}[extname]`,
          entryFileNames: `assets/build.[hash].${DATE}.js`,
        },
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
    },
    css: {
      postcss: {
        plugins: [postcssMergeQueries],
      },
    },
    plugins: [glsl()],
  },
});
