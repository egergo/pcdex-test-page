import {
  randomNonce256,
  hkdfSimpleSha256,
  aesCbcEncrypt,
  hmacSha256
} from "../utils/crypto";
import { toBase64 } from "../utils/base64";

export async function createResponse({
  masterKeyId,
  masterKeySecret,
  phoneNumber,
  info
}) {
  const encryptionSalt = await randomNonce256();
  const encryptionKey = await hkdfSimpleSha256(masterKeySecret, encryptionSalt);

  const { iv, encrypted: encryptedPhoneNumber } = await aesCbcEncrypt(
    encryptionKey,
    phoneNumber
  );

  const maskedPhoneNumber =
    phoneNumber.slice(0, 3) + "********" + phoneNumber.slice(-2);

  const insensitiveMacSalt = await randomNonce256();
  const insensitiveMacKey = await hkdfSimpleSha256(
    masterKeySecret,
    insensitiveMacSalt
  );
  const insensitive = `pcdex|${masterKeyId}|${toBase64(
    encryptionSalt
  )}|${info}|${maskedPhoneNumber}|${toBase64(insensitiveMacSalt)}|`;
  const insensitiveMac = await hmacSha256(insensitiveMacKey, insensitive);
  const insensitiveSigned = `${insensitive}${toBase64(insensitiveMac)}`;

  const sensitiveMacSalt = await randomNonce256();
  const sensitiveMacKey = await hkdfSimpleSha256(
    masterKeySecret,
    sensitiveMacSalt
  );
  const sensitive = `${insensitiveSigned}|${toBase64(iv)}|${toBase64(
    encryptedPhoneNumber
  )}|${toBase64(sensitiveMacSalt)}|`;
  const sensitiveMac = await hmacSha256(sensitiveMacKey, sensitive);
  const sensitiveSigned = `${sensitive}${toBase64(sensitiveMac)}`;

  return {
    result: sensitiveSigned,
    debugInfo: {
      info,
      maskedPhoneNumber,
      encryptionSalt: toBase64(encryptionSalt),
      encryptionKey: toBase64(encryptionKey),
      iv: toBase64(iv),
      encryptedPhoneNumber: toBase64(encryptedPhoneNumber),
      insensitiveMacSalt: toBase64(insensitiveMacSalt),
      insensitiveMacKey: toBase64(insensitiveMacKey),
      insensitive,
      insensitiveMac: toBase64(insensitiveMac),
      insensitiveSigned,
      sensitiveMacSalt: toBase64(sensitiveMacSalt),
      sensitiveMacKey: toBase64(sensitiveMacKey),
      sensitive,
      sensitiveMac: toBase64(sensitiveMac),
      sensitiveSigned
    }
  };
}
