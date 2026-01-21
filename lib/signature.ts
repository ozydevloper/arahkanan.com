import { ApiResponse } from "@/dtype/api_response";
import crypto from "crypto";
import "dotenv/config";

const SECRET = "wfjowiehfoirhpifhfehoifqwihew98y29832g98pepufheiuwgf983g";

export function generateSignature() {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(timestamp);
  const signature = hmac.digest("hex");
  return Buffer.from(`${timestamp}.${signature}`).toString("base64");
}

export function verifySignature(encoded: string, maxAgeMs = 10_000) {
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const [timestamp, signature] = decoded.split(".");
    const now = Date.now();

    if (now - parseInt(timestamp) > maxAgeMs) return false;

    const hmac = crypto.createHmac("sha256", SECRET);
    hmac.update(timestamp);
    const expected = hmac.digest("hex");

    return signature === expected;
  } catch (err) {
    console.error("Signature verification failed:", err);
    return false;
  }
}

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const signature = generateSignature();
  const headers = {
    "nothing-to-see": signature,
    ...(init?.headers || {}),
  };

  return await fetch(input, { ...init, headers });
}

export function middlewareSignature(signature: string | null): boolean {
  if (!!!signature) {
    return false;
  }
  if (!!signature && !verifySignature(signature)!) {
    return false;
  }
  return true;
}
