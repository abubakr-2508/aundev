// Comprehensive polyfill for Web Crypto API and PKCE support
const crypto = require('crypto');

// Helper function to convert buffer to base64url
function base64urlEncode(buffer: ArrayBuffer): string {
  const base64 = Buffer.from(buffer).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// PKCE helper functions
async function sha256(buffer: string): Promise<ArrayBuffer> {
  return crypto.createHash('sha256').update(buffer).digest();
}

async function calculatePKCECodeChallenge(code_verifier: string): Promise<string> {
  const hashed = await sha256(code_verifier);
  return base64urlEncode(hashed);
}

// Polyfill for Web Crypto API in environments where it might be missing
if (typeof window !== 'undefined' && !window.crypto) {
  // @ts-ignore
  window.crypto = {
    getRandomValues: (array: Uint8Array) => {
      return crypto.randomFillSync(array);
    },
    subtle: {
      digest: async (algorithm: string, data: BufferSource) => {
        if (algorithm === 'SHA-256' || algorithm === 'sha-256') {
          return crypto.createHash('sha256').update(Buffer.from(data)).digest().buffer;
        }
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    },
    webcrypto: crypto.webcrypto
  };
}

if (typeof global !== 'undefined' && !global.crypto) {
  // @ts-ignore
  global.crypto = {
    getRandomValues: (array: Uint8Array) => {
      return crypto.randomFillSync(array);
    },
    subtle: {
      digest: async (algorithm: string, data: BufferSource) => {
        if (algorithm === 'SHA-256' || algorithm === 'sha-256') {
          return crypto.createHash('sha256').update(Buffer.from(data)).digest().buffer;
        }
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    },
    webcrypto: crypto.webcrypto
  };
}

// Ensure TextEncoder is available
if (typeof window !== 'undefined' && !window.TextEncoder) {
  // @ts-ignore
  window.TextEncoder = require('util').TextEncoder;
}

if (typeof global !== 'undefined' && !global.TextEncoder) {
  // @ts-ignore
  global.TextEncoder = require('util').TextEncoder;
}

// Ensure crypto.subtle is available
if (typeof window !== 'undefined' && window.crypto && !window.crypto.subtle) {
  // @ts-ignore
  window.crypto.subtle = crypto.webcrypto.subtle;
}

if (typeof global !== 'undefined' && global.crypto && !global.crypto.subtle) {
  // @ts-ignore
  global.crypto.subtle = crypto.webcrypto.subtle;
}