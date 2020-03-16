import { hkdfSimpleSha256, hmacSha256, aesCbcDecrypt } from "../utils/crypto";
import { toBase64, fromBase64 } from "../utils/base64";

export async function verifyResponse({
  masterKeyId,
  masterKeySecret,
  phoneNumber,
  info,
  encryptedHeaders
}) {
  const result = [];

  const [
    protoHeader,
    usedMasterKeyId,
    encryptionSalt,
    usedInfo,
    usedMaskedPhoneNumber,
    insensitiveMacSalt,
    usedInsensitiveMac,
    iv,
    encryptedPhoneNumber,
    sensitiveMacSalt,
    usedSensitiveMac
  ] = encryptedHeaders.split("|");

  addResult(result, "header", protoHeader, "pcdex");
  addResult(result, "masterKeyId", usedMasterKeyId, masterKeyId);
  addResult256BitBase64(result, "encryptionSalt", encryptionSalt);
  addResult256BitBase64(result, "insensitiveMacSalt", insensitiveMacSalt);
  addResult256BitBase64(result, "sensitiveMacSalt", sensitiveMacSalt);
  addResult(result, "info", usedInfo, info);

  const masterKeySecretBuffer = new TextEncoder().encode(masterKeySecret);

  let insensitive;
  let insensitiveMac;

  try {
    insensitive = `${protoHeader}|${usedMasterKeyId}|${encryptionSalt}|${usedInfo}|${usedMaskedPhoneNumber}|${insensitiveMacSalt}|`;
    const insensitiveMacKey = await hkdfSimpleSha256(
      masterKeySecretBuffer,
      fromBase64(insensitiveMacSalt)
    );
    insensitiveMac = await hmacSha256(insensitiveMacKey, insensitive);
    addResult(
      result,
      "insensitiveMac",
      usedInsensitiveMac,
      toBase64(insensitiveMac)
    );
  } catch (ex) {
    result.push({
      name: "insensitiveMac",
      ok: false,
      value: usedInsensitiveMac,
      expected: "N/A"
    });
  }

  try {
    const insensitiveSigned = `${insensitive}${toBase64(insensitiveMac)}`;
    const sensitive = `${insensitiveSigned}|${iv}|${encryptedPhoneNumber}|${sensitiveMacSalt}|`;
    const sensitiveMacKey = await hkdfSimpleSha256(
      masterKeySecretBuffer,
      fromBase64(sensitiveMacSalt)
    );
    const sensitiveMac = await hmacSha256(sensitiveMacKey, sensitive);
    addResult(result, "sensitiveMac", usedSensitiveMac, toBase64(sensitiveMac));
  } catch (ex) {
    result.push({
      name: "sensitiveMac",
      ok: false,
      value: usedSensitiveMac,
      expected: "N/A"
    });
  }

  let usedPhoneNumber;

  try {
    const decryptionKey = await hkdfSimpleSha256(
      masterKeySecretBuffer,
      fromBase64(encryptionSalt)
    );
    usedPhoneNumber = await aesCbcDecrypt(
      decryptionKey,
      fromBase64(iv),
      fromBase64(encryptedPhoneNumber)
    );
    addResult(result, "phoneNumber", usedPhoneNumber, phoneNumber);
  } catch (ex) {
    result.push({
      name: "phoneNumber",
      ok: false,
      value: "N/A",
      expected: phoneNumber
    });
  }

  const maskedPhoneNumber =
    phoneNumber.slice(0, 3) + "********" + phoneNumber.slice(-2);

  try {
    addResult(
      result,
      "maskedPhoneNumber",
      usedMaskedPhoneNumber,
      maskedPhoneNumber
    );
  } catch (ex) {
    result.push({
      name: "maskedPhoneNumber",
      ok: false,
      value: "N/A",
      expected: maskedPhoneNumber
    });
  }

  return result;
}

function addResult(result, name, value, expected) {
  result.push({
    name,
    ok: value === expected,
    value: "" + value,
    expected: "" + expected
  });
}

function addResult256BitBase64(result, name, value) {
  try {
    const decoded = fromBase64("" + value);

    if (decoded.length !== 32) {
      result.push({
        name,
        ok: false,
        value: "" + decoded.length * 8 + " bits",
        expected: "256 bits"
      });
    } else {
      result.push({ name, ok: true, value: "256 bits", expected: "256 bits" });
    }
  } catch (ex) {
    result.push({ name, ok: false, value, expected: "valid 256 bits base64" });
  }
}
