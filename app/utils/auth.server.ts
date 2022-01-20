import { createCookie, createCookieSessionStorage, redirect } from "remix";

if (typeof process.env.AUTH_SESSION_SECRET !== "string") {
  throw new Error("Missing env var `AUTH_SESSION_SECRET`");
}

const sessionCookie = createCookie("remix-planner__session", {
  secrets: [process.env.AUTH_SESSION_SECRET],
  httpOnly: true,
});

const authSession = createCookieSessionStorage({
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
