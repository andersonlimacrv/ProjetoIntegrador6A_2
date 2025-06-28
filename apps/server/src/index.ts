import { greet } from "@packages/shared";
import { serve } from "bun";

const server = serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return new Response("OK");
    }

    if (url.pathname === "/") {
      return new Response(greet("from the server my man"));
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
