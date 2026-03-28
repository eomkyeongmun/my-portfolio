import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const client = new SESClient({});

const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL ?? "eomkyeongmun@naver.com";
const SENDER_EMAIL = process.env.SENDER_EMAIL ?? "noreply@eomkyeongmun.me";

export const handler = async (event) => {
  const detail = event.detail ?? {};
  const { name, email, message, ip, timestamp } = detail;

  const senderLine = name || email ? `${name || "(이름 없음)"} <${email || "이메일 없음"}>` : "(익명)";

  const textBody = [
    "포트폴리오에 새 피드백이 도착했습니다.",
    "",
    `보낸 사람: ${senderLine}`,
    `IP: ${ip}`,
    `시간: ${timestamp}`,
    "",
    "─────────────────────────────",
    message,
    "─────────────────────────────",
  ].join("\n");

  const htmlBody = `
<!DOCTYPE html>
<html lang="ko">
<body style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #059669;">포트폴리오 피드백 도착</h2>
  <table style="width:100%; border-collapse: collapse; margin-bottom: 16px;">
    <tr><td style="padding: 4px 8px; font-weight: bold; width: 80px;">보낸 사람</td><td style="padding: 4px 8px;">${senderLine}</td></tr>
    <tr><td style="padding: 4px 8px; font-weight: bold;">IP</td><td style="padding: 4px 8px;">${ip}</td></tr>
    <tr><td style="padding: 4px 8px; font-weight: bold;">시간</td><td style="padding: 4px 8px;">${timestamp}</td></tr>
  </table>
  <hr style="border: 1px solid #e5e7eb;" />
  <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
</body>
</html>`;

  await client.send(
    new SendEmailCommand({
      Source: SENDER_EMAIL,
      Destination: { ToAddresses: [FEEDBACK_EMAIL] },
      Message: {
        Subject: { Data: "포트폴리오 피드백 도착", Charset: "UTF-8" },
        Body: {
          Text: { Data: textBody, Charset: "UTF-8" },
          Html: { Data: htmlBody, Charset: "UTF-8" },
        },
      },
    })
  );

  console.log(`Email sent to ${FEEDBACK_EMAIL} at ${timestamp}`);
};
