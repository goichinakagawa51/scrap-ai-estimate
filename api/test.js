export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY || 'NOT SET';
  const trimmed = key.trim();
  res.status(200).json({
    originalLength: key.length,
    trimmedLength: trimmed.length,
    hasWhitespace: key !== trimmed,
    first20: trimmed.substring(0, 20),
    last10: trimmed.substring(trimmed.length - 10)
  });
}