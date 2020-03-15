import React, { Component } from "react";
import { Form, InputGroup } from "react-bootstrap";

export class Shared extends Component {
  constructor(props) {
    super();
    const { defaultMasterKeyId, defaultMasterKeySecret } = props;
    this.state = {
      masterKeyId: defaultMasterKeyId || "",
      masterKeySecret: defaultMasterKeySecret || ""
    };
  }

  handleMasterKeyIdChange = event => {
    this.setState({ masterKeyId: event.target.value }, () =>
      this.fireOnChange()
    );
  };

  handleMasterKeySecretChange = event => {
    this.setState({ masterKeySecret: event.target.value }, () =>
      this.fireOnChange()
    );
  };

  fireOnChange() {
    const { masterKeyId, masterKeySecret } = this.state;
    this.props.onChange &&
      this.props.onChange({
        masterKeyId,
        masterKeySecret
      });
  }

  render() {
    const { masterKeyId, masterKeySecret } = this.state;

    return (
      <Form>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Master Key ID</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="number"
            value={masterKeyId}
            onChange={this.handleMasterKeyIdChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">
              Master Key Secret
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text"
            value={masterKeySecret}
            onChange={this.handleMasterKeySecretChange}
          />
        </InputGroup>
      </Form>
    );
  }
}
