import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";
require("dotenv").config();

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  const etag = responseHeaders.get("etag");
  const ifNoneMatch = request.headers.get("if-none-match");
  if (etag !== null && ifNoneMatch !== null && etag === ifNoneMatch) {
    return new Response(null, { status: 304 });
  }

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
