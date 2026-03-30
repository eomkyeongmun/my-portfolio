import AWSXRay from "aws-xray-sdk-core";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

// SITE_URL: CloudFront 도메인 (예: https://d1234abcd.cloudfront.net)
// Lambda 환경 변수로 반드시 설정해야 합니다 (Terraform 또는 AWS 콘솔).
const SITE_URL = process.env.SITE_URL;

/**
 * API Gateway v2 이벤트: GET /api/pdf/{slug}
 * slug → /portfolio/print/{slug} 페이지를 Puppeteer로 렌더링해 PDF 반환
 */
export const handler = async (event) => {
  if (!SITE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SITE_URL environment variable is not set" }),
    };
  }

  const slug = event.pathParameters?.slug ?? "portfolio";
  const printUrl = `${SITE_URL}/portfolio/print/${slug}/`;
  const seg = AWSXRay.getSegment();

  let browser;
  try {
    const subLaunch = seg.addNewSubsegment("puppeteer.launch");
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    subLaunch.close();

    const page = await browser.newPage();

    const subGoto = seg.addNewSubsegment("page.goto");
    await page.goto(printUrl, { waitUntil: "networkidle0", timeout: 30_000 });
    subGoto.close();

    const subFonts = seg.addNewSubsegment("fonts.ready");
    await page.evaluateHandle("document.fonts.ready");
    subFonts.close();

    const subPdf = seg.addNewSubsegment("page.pdf");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      // print 페이지 CSS(px-[14mm] py-[16mm])가 내부 여백을 처리하므로 마진은 0
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    subPdf.close();

    const filename = encodeURIComponent(`${slug}_포트폴리오.pdf`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
      },
      body: Buffer.from(pdf).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error("PDF generation failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "PDF generation failed", detail: err.message }),
    };
  } finally {
    if (browser) await browser.close();
  }
};
