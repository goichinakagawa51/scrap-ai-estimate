const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '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',
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 50,
    messages: [{ role: 'user', content: 'hello' }]
  })
});
const data = await res.json();
console.log(JSON.stringify(data, null, 2));