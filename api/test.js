export default function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY || 'NOT SET';
  res.status(200).json({
    keyExists: key !== 'NOT SET',
    keyStart: key.substring(0, 10),
    keyLength: key.length
  });
}