import { writeFileSync, readFileSync } from "fs";
import { glob } from "glob";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const minify = require("html-minifier").minify;

const htmlMinifier = () => {
  try {
    const files = glob.sync("dist/**/*.html");
    console.log(files);
    for (const file of files) {
      const data = readFileSync(file, "utf8");
      const after = minify(data, {
        collapseWhitespace: true, // 空白を折りたたむ
        removeComments: true, // HTMLコメントアウトを削除する
        minifyCSS: true, // clean-css
        minifyJS: true, // uglify-js
        removeAttributeQuotes: false, // 属性のクォートを削除
        removeStyleLinkTypeAttributes: true, // <style>と<link>から`type="text/css"`を削除する
      });
      writeFileSync(file, after, "utf8");
    }
    console.log(`\n// --------------------------\n\n👌 ~ html minifier\n\n// --------------------------\n`);
  } catch (error) {
    console.log(`\n// -------------------------- \n\n🙅‍♀️ ~ html minifier\n\n// --------------------------\n${error}\n`);
  }
};
htmlMinifier();

/* --------------------------
# 📝 ~ Note

## 📕 ~ Reference
- https://github.com/kangax/html-minifier
- https://qiita.com/ryo_hisano/items/9d41cd447a69943f8eb1

## 🎮 ~ Command
```
node _build-options/htmlMinifier.mjs
```
-------------------------- */
