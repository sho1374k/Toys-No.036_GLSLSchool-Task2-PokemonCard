import { writeFileSync, readFileSync } from "fs";
import {glob} from "glob";

const replaceRelativePathInHtml = () => {
  try {
    const files = glob.sync("dist/**/*.html");
    console.log(files);
    for (const file of files) {
      // htmlファイルの読み込み
      const data = readFileSync(file, "utf8");

      // htmlの置かれているパスから相対(., ..)を算出
      let relativePath = file.replace(/[^/]/g, "").replace(/\//g, ".");

      if (relativePath.length === 1) {
        relativePath = file.replace(/[^/]/g, "").replace(/\//g, ".");
      } else {
        relativePath = file.replace(/[^/]/g, "").replace(/\//g, "../");

        if (file.includes("index.html")) {
          relativePath = relativePath.slice(0, -4);
          // 3 ... | ../../ → ..
          // 4 .... | ../../../ → ../..
          // 5 ..... | ../../../../ → ../../..
        } else {
          relativePath = relativePath.slice(0, -1);
          // 3 ... | ../../ → ../..
          // 4 .... | ../../../ → ../../..
          // 5 ..... | ../../../../ → ../../../..
        }
      }

      // href, srcに指定されている絶対パスを置換
      const result = data
        .replace(/href="\//g, `href="${relativePath}/`)
        .replace(/href='\//g, `href='${relativePath}/`)
        .replace(/src="\//g, `src="${relativePath}/`)
        .replace(/src='\//g, `src='${relativePath}/`)
        .replace(/srcset="\//g, `srcset="${relativePath}/`)
        .replace(/srcset='\//g, `srcset='${relativePath}/`)
        .replace(/action="\//g, `action="${relativePath}/`)
        .replace(/action='\//g, `action='${relativePath}/`)
        .replace(/content="\//g, `content="${relativePath}/`)
        .replace(/content='\//g, `content='${relativePath}/`)
        .replace(/data-path="\//g, `data-path="${relativePath}/`)
        .replace(/data-path='\//g, `data-path='${relativePath}/`);

      writeFileSync(file, result, "utf8");
    }
    console.log(`\n// --------------------------\n\n👌 ~ replace relative path in html files\n\n// --------------------------\n`);
  } catch (error) {
    console.log(
      `\n// -------------------------- \n\n🙅‍♀️ ~ replace relative path in html files\n\n// --------------------------\n${error}\n`,
    );
  }
};

replaceRelativePathInHtml();
/* --------------------------
# 📝 ~ Note
## 🌍 ~ Overview
- 前提としてhtml拡張性のファイルのみ対応しています。
- シングルクォーテーションとダブルクォーテーションを確認しています。

▼ 置き換え対応箇所 ▼
- href
- src
- srcset
- action
- content
- data-path

## 🎮 ~ Command
```
node _build-options/replaceRelativePathInHtml.mjs
```
-------------------------- */