export default async (req, context) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }});
  }
  try {
    const body = await req.json();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': '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', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    return new Response(text, { status: response.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }});
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' }});
  }
};
export const config = { path: '/api/analyze' };
