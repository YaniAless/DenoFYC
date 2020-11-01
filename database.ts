/**
 * webserver.ts
 */
import { serve } from "https://deno.land/std@0.69.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.13.0/mod.ts";

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

for await (const request of server) {
  let bodyContent = "Your user-agent is:\n\n";
  bodyContent += request.headers.get("user-agent") || "Unknown";

  request.respond({ status: 200, body: bodyContent });
}
