import { renderToFile } from "@react-pdf/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { registerFonts } from "./lib/fonts";
import { getData } from "./lib/data";
import { getCompany, companies } from "./companies";
import type { DocType, Lang } from "./lib/types";
import { ResumeDoc } from "./templates/Resume";
import { PortfolioDoc } from "./templates/Portfolio";

const dir = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(dir, "../out");

function parseArgs() {
  const out: Record<string, string> = {};
  for (const a of process.argv.slice(2)) {
    if (!a.startsWith("--")) continue;
    const [k, v] = a.replace(/^--/, "").split("=");
    out[k] = v ?? "true";
  }
  return out;
}

async function main() {
  registerFonts();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const args = parseArgs();
  const companyId = args.company ?? "default";

  if (args.company && !companies[args.company]) {
    console.warn(`⚠️  '${args.company}' 기업 설정이 없어 default 로 진행합니다. (등록: ${Object.keys(companies).join(", ")})`);
  }
  const company = getCompany(companyId);

  const types: DocType[] = args.type && args.type !== "all" ? [args.type as DocType] : ["resume", "portfolio"];
  const langs: Lang[] = args.lang && args.lang !== "all" ? [args.lang as Lang] : ["ko", "en"];

  for (const lang of langs) {
    const data = getData(lang);
    for (const type of types) {
      const element =
        type === "resume"
          ? ResumeDoc({ data, company, lang })
          : PortfolioDoc({ data, company, lang });
      const file = path.join(OUT_DIR, `${company.id}-${type}-${lang}.pdf`);
      await renderToFile(element, file);
      console.log(`✓ ${path.relative(process.cwd(), file)}`);
    }
  }

  console.log(`\n완료 — out/ 폴더 확인 (기업: ${company.displayName} / accent ${company.accent})`);
}

main().catch((err) => {
  console.error("✗ 생성 실패:", err);
  process.exit(1);
});
