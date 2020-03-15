import React, { Component } from "react";

import { TextWithExplanation } from "./TextWithExplanation";

export class ResponseWithExplanation extends Component {
  render() {
    const { response } = this.props;
    if (!response) return null;

    const split = response.split("|");

    return (
      <div className="text-break border rounded mb-3 p-1 text-monospace">
        <Explanation
          name="pcdex"
          header="Protocol Header"
          body={
            <div>
              Identifies the used encryption scheme. Must always be{" "}
              <code>pcdex</code>, for Privacy Compliant Data EXchange.
            </div>
          }
        >
          {split[0]}
        </Explanation>
        |
        <Explanation
          name="masterKeyId"
          header="Master Key ID"
          body={
            <div>
              Identifies the master key to use. The key ID change every time we
              rotate the master key.
            </div>
          }
        >
          {split[1]}
        </Explanation>
        |
        <Explanation
          name="encryptionSalt"
          header="Encryption Key Salt"
          body={
            <div>
              Salt value used to derive the encryption key from the master key
              with HKDF.
            </div>
          }
        >
          {split[2]}
        </Explanation>
        |
        <Explanation
          name="info"
          header="Info Field"
          body="Exact copy of the input from the API caller. Used to prevent replay attacks."
        >
          {split[3]}
        </Explanation>
        |
        <Explanation
          name="maskedPhoneNumber"
          header="Masked Phone Number"
          body="Phone number with only the first and the last digits visible. Used for displaying on the screen if the app is not allowed to decode the plain text phone number."
        >
          {split[4]}
        </Explanation>
        |
        <Explanation
          name="insensitiveMacSalt"
          header="Insensitive MAC Salt"
          body="Salt value used to derive a signing key from the master key with HKDF. This signing key is used to sign the privacy insensitive parts of the response. Every field before and including this field is not considered insensitive. The insensitive fields are only signed, but not encrypted."
        >
          {split[5]}
        </Explanation>
        |
        <Explanation
          name="insensitiveMac"
          header="Insensitive MAC"
          body="Signature of the privacy insensitive parts of the response. Every field before and including this field is not considered insensitive. Used to prevent an attacker from tampering with the insensitive values. The insensitive fields are only signed, but not encrypted."
        >
          {split[6]}
        </Explanation>
        |
        <Explanation
          name="iv"
          header="AES CBC IV"
          body="Initialization vector used to encrypt the privacy sensitive fields of the response."
        >
          {split[7]}
        </Explanation>
        |
        <Explanation
          name="encryptedPhoneNumber"
          header="Encrypted Phone Number"
          body="Phone number encrypted with the encryption key derived from the master key and the Encryption Key Salt and the AES CBC IV as Initialization vectors."
        >
          {split[8]}
        </Explanation>
        |
        <Explanation
          name="sensitiveMacSalt"
          header="Sensitive MAC Salt"
          body="Salt value used to derive a signing key from the master key with HKDF. This signing key is used to sign the complete response."
        >
          {split[9]}
        </Explanation>
        |
        <Explanation
          name="sensitiveMac"
          header="Sensitive MAC"
          body="Signature of the complete response. Used to prevent an attacker from tampering with the response values."
        >
          {split[10]}
        </Explanation>
      </div>
    );
  }
}

class Explanation extends Component {
  render() {
    const { name, header, ...others } = this.props;
    return (
      <TextWithExplanation
        header={
          <>
            {header} <code>{name}</code>
          </>
        }
        {...others}
      />
    );
  }
}
