export async function hkdfSimpleSha256(ikm, salt) {
  const ikmBuffer = new TextEncoder('utf-8').encode(ikm);
  const saltBuffer = new TextEncoder('utf-8').encode(salt);  

  const saltAsKey = await crypto.subtle.importKey('raw', saltBuffer, {name: 'HMAC', hash: 'SHA-256'}, true, ['sign']);
  
  const derivedKey = await crypto.subtle.sign('HMAC', saltAsKey, ikmBuffer);
  return derivedKey;
}

export async function hmacSha256(key, value) {
  const importedKey = await crypto.subtle.importKey('raw', key, {name: 'HMAC', hash: 'SHA-256'}, true, ['sign']);
	const valueBuffer = new TextEncoder('utf-8').encode(value);
  const mac = await crypto.subtle.sign('HMAC', importedKey, valueBuffer);
  return mac;
}

export async function randomNonce256() {
	return crypto.getRandomValues(new Uint8Array(32));
}

export async function aesCbcEncrypt(key, value) {
  const importedKey = await crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, true, ['encrypt']);
  const importedValue = new TextEncoder('utf-8').encode(value);  
  const iv = await crypto.getRandomValues(new Uint8Array(16));
  const encrypted = await crypto.subtle.encrypt({name: 'AES-CBC', iv}, importedKey, importedValue);
  return {iv, encrypted};
}

export async function aesCbcDecrypt(key, iv, value) {
  const importedKey = await crypto.subtle.importKey('raw', key, {name: 'AES-CBC'}, true, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({name: 'AES-CBC', iv}, importedKey, value);
	return new TextDecoder().decode(decrypted);
}
