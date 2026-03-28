import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({});

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "*";
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME ?? "portfolio-events";
const MAX_MESSAGE_LENGTH = 2000;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  let body;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ error: "message is required" }),
    };
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` }),
    };
  }

  const name = escapeHtml((body.name ?? "").trim().slice(0, 100));
  const email = escapeHtml((body.email ?? "").trim().slice(0, 200));
  const safeMessage = escapeHtml(message);
  const ip = event.requestContext?.http?.sourceIp ?? "unknown";
  const timestamp = new Date().toISOString();

  await client.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: EVENT_BUS_NAME,
          Source: "portfolio.feedback",
          DetailType: "FeedbackReceived",
          Detail: JSON.stringify({ name, email, message: safeMessage, ip, timestamp }),
        },
      ],
    })
  );

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true }),
  };
};
