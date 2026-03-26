import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { projects } from "@/data/projects";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = projects.find((p) => p.category === slug);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const printUrl = `${protocol}://${host}/portfolio/print/${slug}`;

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.goto(printUrl, { waitUntil: "networkidle0" });

    // 웹 폰트 로딩 완료 대기
    await page.evaluate(() => document.fonts.ready);

    const pdfUint8 = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    const pdfBuffer = Buffer.from(pdfUint8);
    const filename = `${project.title}_포트폴리오.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } finally {
    await browser.close();
  }
}
