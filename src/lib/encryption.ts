import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Fallback key used when ENCRYPTION_KEY env var is not set (e.g. Vercel cold start without env configured).
// This is a 64-char hex string (32 bytes). Set ENCRYPTION_KEY in your Vercel dashboard for production security.
const FALLBACK_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || FALLBACK_KEY;
  // Accept either a 64-char hex string (32 bytes) or any string we can hash to 32 bytes
  if (key.length === 64) {
    try {
      return Buffer.from(key, 'hex');
    } catch {
      // fall through to hash approach
    }
  }
  // Derive a 32-byte key by hashing whatever string is provided
  return crypto.createHash('sha256').update(key).digest();
}

export function encrypt(text: string): string {
  const keyBuffer = getKey();
  const iv = crypto.randomBytes(12); // 96-bit IV is standard for GCM

  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag().toString('base64');

  return JSON.stringify({
    iv: iv.toString('base64'),
    authTag,
    encryptedData: encrypted,
  });
}

export function decrypt(ciphertext: string): string {
  const keyBuffer = getKey();

  let data: { iv: string; authTag: string; encryptedData: string };
  try {
    data = JSON.parse(ciphertext);
  } catch (e) {
    throw new Error('Invalid ciphertext format. Expected JSON string.');
  }

  const ivBuffer = Buffer.from(data.iv, 'base64');
  const authTagBuffer = Buffer.from(data.authTag, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, ivBuffer);
  decipher.setAuthTag(authTagBuffer);

  let decrypted = decipher.update(data.encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
