export async function hkdfSimpleSha256(ikm, salt) {
  if (!isArrayBuffer(ikm)) {
    throw new Error("ikm must be an ArrayBuffer");
  }

  if (!isArrayBuffer(salt)) {
    throw new Error("salt must be an ArrayBuffer");
  }

  const saltAsKey = await crypto.subtle.importKey(
    "raw",
    salt,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  );

  const derivedKey = await crypto.subtle.sign("HMAC", saltAsKey, ikm);
  return derivedKey;
}

export async function hmacSha256(key, value) {
  if (!isArrayBuffer(key)) {
    throw new Error("key must be an ArrayBuffer");
  }

  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"]
  );
  const valueBuffer = new TextEncoder("utf-8").encode(value);
  const mac = await crypto.subtle.sign("HMAC", importedKey, valueBuffer);
  return mac;
}

export async function randomNonce256() {
  return crypto.getRandomValues(new Uint8Array(32));
}

export async function aesCbcEncrypt(key, value) {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-CBC" },
    true,
    ["encrypt"]
  );
  const importedValue = new TextEncoder("utf-8").encode(value);
  const iv = await crypto.getRandomValues(new Uint8Array(16));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    importedKey,
    importedValue
  );
  return { iv, encrypted };
}

export async function aesCbcDecrypt(key, iv, value) {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-CBC" },
    true,
    ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    importedKey,
    value
  );
  return new TextDecoder().decode(decrypted);
}

function isArrayBuffer(o) {
  return !!(o instanceof ArrayBuffer || ArrayBuffer.isView(o));
}
