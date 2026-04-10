export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const apiKey = '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';
  console.log('Key length:', apiKey.length, 'Key start:', apiKey.substring(0,15));
  try {
    const headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
    console.log('Headers:', JSON.stringify(Object.keys(headers)));
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', text.substring(0, 200));
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(text);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
