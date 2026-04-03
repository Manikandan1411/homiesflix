import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 1. GET Signatures
  if (req.method === 'GET') {
    try {
      const signatures = await kv.get('homieflix_signatures') || [];
      return res.status(200).json(signatures);
    } catch (error) {
      console.error('KV GET Error:', error);
      return res.status(500).json({ error: 'Failed to fetch signatures' });
    }
  }

  // 2. POST New Signature
  if (req.method === 'POST') {
    try {
      const newSig = req.body;
      if (!newSig || (!newSig.name && !newSig.msg)) {
        return res.status(400).json({ error: 'Invalid signature data' });
      }

      // Add a server-side timestamp for reliability
      newSig.timestamp = Date.now();
      
      const signatures = await kv.get('homieflix_signatures') || [];
      signatures.unshift(newSig);
      
      // Limit to last 500 signatures to keep performance high
      const limitedSignatures = signatures.slice(0, 500);
      
      await kv.set('homieflix_signatures', limitedSignatures);
      return res.status(201).json({ success: true });
    } catch (error) {
      console.error('KV POST Error:', error);
      return res.status(500).json({ error: 'Failed to save signature' });
    }
  }

  // 3. Method Not Allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
