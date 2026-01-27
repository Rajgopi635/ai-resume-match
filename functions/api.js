export async function onRequest(context) {

if (context.request.method !== "POST") {
  return new Response("Method not allowed", { status: 405 });
}

const body = await context.request.json();
const prompt = body.prompt || "hello";

return new Response(
JSON.stringify({ reply: "API WORKING" }),
{ headers: { "Content-Type": "application/json" } }
);

}
