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
        "pcdex|1|mEUj88lBlXnrtl/dQHQLci/EW7qvsTM0NqQDj7BJs0k=|1.2345682938.1584265462||RTUAaJW7nNABVCmimhdiMzVCNDZSYTSy4pBg27ZcGaA=|ziVZzg5HTfW042YeT25TQZzPe1+F9vzuSJVQB30U8qo=|0YhmORAolkEaUNctBDA8lg==|E5EcuUUve442tB8kSLEH2Q==|gr/zdlfmdE6EPe31ApJ8fWOG7y94zj/Ch9G1/XgdOIY=|z51MVaBjOEv3fBZiTnn6o0pBIreGZu+QuIcHZLDjrik="
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
    this.verifyEncrypted();
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
