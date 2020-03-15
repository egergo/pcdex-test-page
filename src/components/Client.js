import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import { verifyResponse } from "../pcdex/verifyResponse";
import { ResponseWithExplanation } from "./ResponseWithExplanation";

export class Client extends Component {
  constructor(props) {
    super();
    this.state = {
      value:
        props.value ||
        "pcdex|1|r0M8H5GWxppR/mwvE1oc/sLdkwX1aWq5c+pONhzXGq0=|1.2345682938.1584265462|+91********79|PbmUoLjxqj0S9eRT+Si21Kzv42XiHlB/FJouxz/mx0U=|eI7RkvmCM03l0YnNLAyzSo8aLulb+G4r3bbaitx9HgE=|yV+GQBPZTfZtRrwzXei5Ig==|KOafifXbI+sDcFiBW/LlMg==|YX34Cz56sYIjqO1vcFheY4Qc7xmFiS0yebuT69Mn3y4=|OI7YDw4jdVu9olo0q8eNOTVY115SGqC2d8JR5GH9tlI="
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value }, () => this.verifyEncrypted());
  };

  verifyEncrypted = async () => {
    const { masterKeyId, masterKeySecret, phoneNumber, info } = this.props;

    const result = await verifyResponse({
      masterKeyId,
      masterKeySecret,
      phoneNumber,
      info,
      encryptedHeaders: this.state.value
    });
    this.setState({ result });
  };

  componentDidMount() {
    this.verifyEncrypted()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.masterKeyId !== this.props.masterKeyId ||
      prevProps.masterKeySecret !== this.props.masterKeySecret ||
      prevProps.phoneNumber !== this.props.phoneNumber ||
      prevProps.info !== this.props.info ||
      prevState.value !== this.state.value
    ) {
      this.verifyEncrypted();
    }
  }

  render() {
    const { result } = this.state;
    const value = this.props.value || this.state.value || "";

    return (
      <>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text>Encrypted</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            as="textarea"
            rows={4}
            className="text-monospace"
            value={value}
            onChange={this.handleChange}
          />
        </InputGroup>
        <Results result={result} />
        <ResponseWithExplanation response={value} />
      </>
    );
  }
}

class Results extends Component {
  render() {
    const { result } = this.props;

    if (!result) return null;

    return result.map(line => <Result key={line.name} {...line} />);
  }
}

class Result extends Component {
  render() {
    const { name, ok, value, expected } = this.props;

    const icon = ok ? faCheck : faTimes;
    const colorClass = ok ? "text-success" : "text-danger";
    const text = ok ? value : `${value} (expected: ${expected})`;

    return (
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>{name}</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl readOnly value={text} />
        <InputGroup.Append>
          <InputGroup.Text>
            <FontAwesomeIcon className={colorClass} icon={icon} />
          </InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}
