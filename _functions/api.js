export async function onRequestPost() {
  return new Response(
    JSON.stringify({ reply: "API WORKING" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
