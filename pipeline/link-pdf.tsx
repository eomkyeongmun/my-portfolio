import React from "react";
import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import { renderToFile } from "@react-pdf/renderer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { registerFonts } from "./lib/fonts";

const dir = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(dir, "../out");

const s = StyleSheet.create({
  page: {
    fontFamily: "Nanum",
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    color: "#555",
    marginBottom: 32,
  },
  link: {
    fontSize: 16,
    color: "#FF6F0F",
    textDecoration: "underline",
  },
  note: {
    fontSize: 10,
    color: "#999",
    marginTop: 40,
  },
});

function LinkDoc({ name, url }: { name: string; url: string }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View>
          <Text style={s.title}>{name}</Text>
          <Text style={s.subtitle}>포트폴리오 웹사이트</Text>
          <Link style={s.link} src={url}>
            {url}
          </Link>
          <Text style={s.note}>위 링크를 클릭하면 포트폴리오 사이트로 이동합니다.</Text>
        </View>
      </Page>
    </Document>
  );
}

async function main() {
  registerFonts();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const name = "엄경문";
  const url = "https://www.eomkyeongmun.me";
  const file = path.join(OUT_DIR, "daangn-portfolio-link.pdf");

  await renderToFile(LinkDoc({ name, url }), file);
  console.log(`✓ ${path.relative(process.cwd(), file)}`);
}

main().catch((err) => {
  console.error("✗ 생성 실패:", err);
  process.exit(1);
});
