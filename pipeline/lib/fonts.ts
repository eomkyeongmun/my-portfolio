import { Font } from "@react-pdf/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

let registered = false;

/** 한글 렌더링용 Nanum Gothic 등록 (regular/bold). */
export function registerFonts() {
  if (registered) return;
  Font.register({
    family: "Nanum",
    fonts: [
      { src: path.join(dir, "../fonts/NanumGothic-Regular.ttf"), fontWeight: 400 },
      { src: path.join(dir, "../fonts/NanumGothic-Bold.ttf"), fontWeight: 700 },
    ],
  });
  // 한글/긴 토큰이 어색하게 하이픈 분절되지 않도록 비활성화
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
