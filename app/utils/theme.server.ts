import { createCookie, createCookieSessionStorage } from "remix";

if (typeof process.env.AUTH_SESSION_SECRET !== "string") {
  throw new Error("Missing env var `AUTH_SESSION_SECRET`");
}

export const themeCookie = createCookie("remix-planner__theme", {
  secrets: [process.env.AUTH_SESSION_SECRET],
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  expires: new Date("2122-04-25"),
});

export const themeStorage = createCookieSessionStorage({
  cookie: themeCookie,
});

type Theme = {
  primaryColor: string;
  primaryColorLight: string;
};

export function getTheme(name: string): Theme {
  if (name === "red") {
    return {
      primaryColor: "#cc0100",
      primaryColorLight: "#ff302f",
    };
  }
  if (name === "orange") {
    return {
      primaryColor: "#f56600",
      primaryColorLight: "#ff8731",
    };
  }
  if (name === "yellow") {
    return {
      primaryColor: "#f8bd0d",
      primaryColorLight: "#f9c733",
    };
  }
  if (name === "green") {
    return {
      primaryColor: "#097969",
      primaryColorLight: "#52a196",
    };
  }
  if (name === "blue") {
    return {
      primaryColor: "#164de9",
      primaryColorLight: "#4c76ee",
    };
  }
  if (name === "purple") {
    return {
      primaryColor: "#643292",
      primaryColorLight: "#9f6dcd",
    };
  }
  return {
    primaryColor: "#097969",
    primaryColorLight: "#52a196",
  };
}
