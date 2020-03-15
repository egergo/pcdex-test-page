import React, { Component } from "react";
import { Form, InputGroup, FormControl } from "react-bootstrap";

export class ResponseDebugInfo extends Component {
  render() {
    const { debugInfo } = this.props;
    if (!debugInfo) return null;

    const {
      maskedPhoneNumber,
      encryptionSalt,
      insensitiveMacSalt,
      encryptedPhoneNumber,
      sensitiveMacKey,
      sensitive,
      insensitiveMacKey,
      insensitiveMac,
      iv,
      insensitive,
      encryptionKey,
      sensitiveMacSalt,
      sensitiveMac
    } = debugInfo;

    return (
      <>
        <Field
          name="maskedPhoneNumber"
          value={maskedPhoneNumber}
          code=""
          description="Phone number with the middle numbers masked. Privacy safe for display purposes"
        />
        <Field
          name="encryptionSalt"
          value={encryptionSalt}
          code="random 256bits"
          description="Salt used to derive encryptionKey from masterKey"
        />
        <Field
          name="encryptionKey"
          value={encryptionKey}
          code="hmac-sha256(encryptionSalt, masterKey)"
          description="Key used to encrypt the phone number. This field is not part of the response"
        />
        <Field
          name="insensitiveMacSalt"
          value={insensitiveMacSalt}
          code="random 256bits"
          description="Salt used to derive insensitiveMacKey from masterKey"
        />
        <Field
          name="insensitiveMacKey"
          value={insensitiveMacKey}
          code="hmac-sha256(insensitiveMacSalt, masterKey)"
          description="HMAC-SHA256 signature key of the insentive parts of the response. This field is not part of the response"
        />
        <Field
          name="insensitive"
          value={insensitive}
          code="pcdex | masterKeyId | encryptionSalt | info | maskedPhoneNumber | insensitiveMacSalt |"
          description="Insensitive data in the response, signed with insensitiveMacKey"
        />
        <Field
          name="insensitiveMac"
          value={insensitiveMac}
          code="hmac-sha256(insensitiveMacKey, insensitive)"
          description="HMAC-SHA256 signature of the insensitive parts of the response"
        />
        <Field
          name="iv"
          value={iv}
          code="random 128bits"
          description="Initialization Vector of the AES CBC mode cypher used to encrypt the phone number"
        />
        <Field
          name="encryptedPhoneNumber"
          value={encryptedPhoneNumber}
          code="aes-cbc(encryptionKey, iv, phoneNumber)"
          description="AES CBC encrypted phone number"
        />
        <Field
          name="sensitiveMacSalt"
          value={sensitiveMacSalt}
          code="random 256bits"
          description="Salt used to derive sensitiveMacKey from masterKey"
        />
        <Field
          name="sensitiveMacKey"
          value={sensitiveMacKey}
          code="hmac-sha256(sensitiveMacSalt, masterKey)"
          description="HMAC-SHA256 signature key of the whole response. This field is not part of the response"
        />
        <Field
          name="sensitive"
          value={sensitive}
          code="insensitive insensitiveMac | iv | encryptedPhoneNumber | sensitiveMacSalt |"
          description="The whole response that is considered sensitive. This is signed with sensitiveMacKey"
        />
        <Field
          name="sensitiveMac"
          value={sensitiveMac}
          code="hmac-sha256(sensitiveMacKey, sensitive)"
          description="HMAC-SHA256 signature of the whole response"
        />
      </>
    );
  }
}

class Field extends Component {
  render() {
    const { name, value, code, description } = this.props;

    return (
      <>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>{name}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl value={value} readOnly={true} />
        </InputGroup>
        <Form.Text className="text-muted mb-3">
          <code>{code}</code> {description}
        </Form.Text>
      </>
    );
  }
}
