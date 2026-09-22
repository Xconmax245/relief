import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('Invalid or missing ENCRYPTION_KEY. Must be a 64-character hex string (32 bytes).');
  }

  const keyBuffer = Buffer.from(encryptionKey, 'hex');
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
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('Invalid or missing ENCRYPTION_KEY. Must be a 64-character hex string (32 bytes).');
  }

  const keyBuffer = Buffer.from(encryptionKey, 'hex');
  
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
