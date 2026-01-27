export async function onRequest() {
  return new Response(
    JSON.stringify({ reply: "API WORKING" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
