export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // If it ends with .txt or .lua → redirect
  if (path.endsWith(".txt") || path.endsWith(".lua")) {
    return Response.redirect("https://idx.lol", 302);
  }

  // Otherwise serve the normal static file
  return context.next();
}
