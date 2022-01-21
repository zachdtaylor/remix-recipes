import { renderToStaticMarkup } from "react-dom/server";
import {
  createCookie,
  createCookieSessionStorage,
  redirect,
  json,
} from "remix";
import { decrypt, encrypt } from "./cryptography.server";
import { sendEmail } from "./email.server";

if (typeof process.env.AUTH_SESSION_SECRET !== "string") {
  throw new Error("Missing env var `AUTH_SESSION_SECRET`");
}

if (typeof process.env.ORIGIN !== "string") {
  throw new Error("Missing env var `ORIGIN`");
}

const sessionCookie = createCookie("remix-planner__session", {
  secrets: [process.env.AUTH_SESSION_SECRET],
  httpOnly: true,
});

export const authSession = createCookieSessionStorage({
  cookie: sessionCookie,
});

export async function requireAuthSession(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const session = await authSession.getSession(cookieHeader);
  if (!session.has("userId")) {
    throw redirect("/login");
  }
  return session;
}

export async function getSessionUserId(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const session = await authSession.getSession(cookieHeader);
  return session.get("userId") || null;
}

/// Magic Links
const magicLinkExpirationTime = 1000 * 60 * 10; // 10 minutes

type MagicLinkPayload = {
  email: string;
  createdAt: string;
};
export function generateMagicLink(email: string) {
  const payload: MagicLinkPayload = {
    email,
    createdAt: new Date().toISOString(),
  };
  const magicValue = encrypt(JSON.stringify(payload));
  const url = new URL(process.env.ORIGIN as string);
  url.pathname = "/auth/validate";
  url.searchParams.set("magic", magicValue);
  return url.toString();
}

export function validateMagicValue(magic: string) {
  let magicLinkPayload;
  try {
    magicLinkPayload = JSON.parse(decrypt(magic));
  } catch {
    throw invalidMagicLink();
  }

  if (!isMagicLinkPayload(magicLinkPayload)) {
    throw invalidMagicLink();
  }

  const createdAt = new Date(magicLinkPayload.createdAt);
  const expireTime = createdAt.getTime() + magicLinkExpirationTime;

  if (Date.now() > expireTime) {
    throw invalidMagicLink("Magic link has expired. Please try again.");
  }

  return magicLinkPayload;
}

export function getMagicLinkPayload(request: Request) {
  const { searchParams } = new URL(request.url);
  const magic = searchParams.get("magic");

  if (typeof magic !== "string") {
    throw invalidMagicLink();
  }

  return validateMagicValue(magic);
}

export function sendMagicLinkEmail(email: string) {
  const link = generateMagicLink(email);
  const html = renderToStaticMarkup(
    <div>
      <h1>Log in to Remix Recipes</h1>
      <p>
        Hey, there! Click the link below to finish logging in to the Remix
        Recipes app.
      </p>
      <a href={link}>Complete Login</a>
    </div>
  );
  if (process.env.NODE_ENV === "production") {
    return sendEmail({
      from: "Remix Recipes <zachtylr04@gmail.com>",
      to: email,
      subject: "Log in to Remix Recipes!",
      html,
    });
  }
  console.log("Here's your magic link:", link);
}

function isMagicLinkPayload(obj: any): obj is MagicLinkPayload {
  return (
    typeof obj === "object" &&
    typeof obj.email === "string" &&
    typeof obj.createdAt === "string"
  );
}

function invalidMagicLink(message?: string) {
  return json({ message: message || "Invalid magic link" }, { status: 400 });
}
