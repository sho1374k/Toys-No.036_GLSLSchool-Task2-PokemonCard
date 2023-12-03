import { writeFileSync, readFileSync } from "fs";
import { glob } from "glob";

const replaceRelativePathInCss = () => {
  try {
    const files = glob.sync("dist/assets/**/*.css");
    console.log(files);
    for (const file of files) {
      const data = readFileSync(file, "utf-8");
      const result = data.replace(/.\/assets/g, "");
      writeFileSync(file, result, "utf8");
    }
    console.log(
      `\n// --------------------------\n\n👌 ~ replace relative path in css files\n\n// --------------------------\n`,
    );
  } catch (error) {
    console.log(
      `\n// -------------------------- \n\n🙅‍♀️ ~ replace relative path in css files\n\n// --------------------------\n${error}\n`,
    );
  }
};
replaceRelativePathInCss();

/* --------------------------
# 📝 ~ Note
## 🌍 ~ Overview
下記の条件が前提として実行しています。

▼ build先の設定 ▼
- `/dist/assets/`
- `/dist/assets/img/`

▼ 開発環境設定 ▼
- `/src/styles/`
- `/public/assets/img/`

## 🎮 ~ Command
```
node _build-options/replaceRelativePathInCss.mjs
```
-------------------------- */
