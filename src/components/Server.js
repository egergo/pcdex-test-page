import React, { Component } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

import { createResponse } from "../pcdex/createResponse";
import { ResponseWithExplanation } from "./ResponseWithExplanation";
import { ResponseDebugInfo } from "./ResponseDebugInfo";

export class Server extends Component {
  constructor(props) {
    super();
    const { defaultPhoneNumber, defaultInfo } = props;
    this.state = {
      phoneNumber: defaultPhoneNumber || "",
      info: defaultInfo || "",
      response: "",
      includeMaskedPhoneNumber: true,
      debugInfo: null
    };
  }

  handlePhoneNumberChange = event => {
    this.setState({ phoneNumber: event.target.value }, () =>
      this.fireOnChange()
    );
  };

  handleInfoChange = event => {
    this.setState({ info: event.target.value }, () => this.fireOnChange());
  };

  handleMaskedChanged = event => {
    this.setState({ includeMaskedPhoneNumber: event.target.checked }, () =>
      this.fireOnChange()
    );
  };

  fireOnChange() {
    const { phoneNumber, info, response, debugInfo } = this.state;
    this.props.onChange &&
      this.props.onChange({ phoneNumber, info, response, debugInfo });
  }

  handleEncryptClick = async event => {
    event.preventDefault();

    const { phoneNumber, info, includeMaskedPhoneNumber } = this.state;
    const { masterKeyId, masterKeySecret } = this.props;

    const response = await createResponse({
      masterKeyId,
      masterKeySecret,
      phoneNumber,
      info,
      includeMaskedPhoneNumber
    });
    this.setState(
      {
        response: response.result,
        debugInfo: response.debugInfo
      },
      () => this.fireOnChange()
    );
  };

  render() {
    const {
      response,
      phoneNumber,
      info,
      includeMaskedPhoneNumber,
      debugInfo
    } = this.state;

    return (
      <Form>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Phone Number</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text"
            value={phoneNumber}
            onChange={this.handlePhoneNumberChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Info</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text"
            value={info}
            onChange={this.handleInfoChange}
          />
        </InputGroup>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Include masked phone number"
            checked={includeMaskedPhoneNumber}
            onChange={this.handleMaskedChanged}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mb-3"
          onClick={this.handleEncryptClick}
        >
          Encrypt Phone Number
        </Button>

        <ResponseWithExplanation response={response} />
        <ResponseDebugInfo debugInfo={debugInfo} />
      </Form>
    );
  }
}
