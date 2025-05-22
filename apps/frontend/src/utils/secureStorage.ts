import CryptoJS from 'crypto-js';

const DEFAULT_SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-secret';

function encrypt(data: any, secret: string = DEFAULT_SECRET): string {
  const stringData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, secret).toString();
}

function decrypt<T = any>(ciphertext: string, secret: string = DEFAULT_SECRET): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData) as T;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

// ✅ Combined function to encrypt and store in localStorage
export function setLocalInfo(key: string, data: any, secret?: string): void {
  const encrypted = encrypt(data, secret);
  localStorage.setItem(key, encrypted);
}

// ✅ Combined function to get and decrypt from localStorage
export function getLocalInfo<T = any>(key: string, secret?: string): T | null {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  return decrypt<T>(encrypted, secret);
}
