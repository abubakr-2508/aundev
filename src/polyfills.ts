// Comprehensive polyfill for Web Crypto API and PKCE support
const crypto = require('crypto');

// Helper function to convert buffer to base64url
function base64urlEncode(buffer: ArrayBuffer): string {
  const base64 = Buffer.from(buffer).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// PKCE helper functions
async function sha256(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  const data = Buffer.from(buffer);
  return crypto.createHash('sha256').update(data).digest().buffer;
}

async function calculatePKCECodeChallenge(code_verifier: string): Promise<string> {
  // Convert the code_verifier string to an ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  
  // Hash the data using SHA-256
  const hashed = await sha256(data.buffer);
  
  // Encode the hash as base64url
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
      digest: async (algorithm: string | { name: string }, data: BufferSource) => {
        let algoName: string;
        if (typeof algorithm === 'string') {
          algoName = algorithm;
        } else {
          algoName = algorithm.name;
        }
        
        if (algoName === 'SHA-256' || algoName === 'sha-256') {
          const buffer = Buffer.from(data);
          return crypto.createHash('sha256').update(buffer).digest().buffer;
        }
        throw new Error(`Unsupported algorithm: ${algoName}`);
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
      digest: async (algorithm: string | { name: string }, data: BufferSource) => {
        let algoName: string;
        if (typeof algorithm === 'string') {
          algoName = algorithm;
        } else {
          algoName = algorithm.name;
        }
        
        if (algoName === 'SHA-256' || algoName === 'sha-256') {
          const buffer = Buffer.from(data);
          return crypto.createHash('sha256').update(buffer).digest().buffer;
        }
        throw new Error(`Unsupported algorithm: ${algoName}`);
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