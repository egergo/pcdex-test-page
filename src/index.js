import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Container, Row, Col } from "react-bootstrap";

import { Client } from "./components/Client";
import { Server } from "./components/Server";
import { Shared } from "./components/Shared";

class App extends Component {
  constructor() {
    super();
    this.state = {
      masterKeyId: "1",
      masterKeySecret: "JioFBTestShar3dKey1337",
      phoneNumber: "+917555509979",
      info: "1.2345682938.1584265462",
      response: ""
    };
  }

  handleSharedChange = event => {
    const { masterKeyId, masterKeySecret } = event;
    this.setState({ masterKeyId, masterKeySecret });
  };

  handleServerChange = event => {
    const { phoneNumber, info, response } = event;
    this.setState({ phoneNumber, info, response });
  };

  render() {
    const { masterKeyId, masterKeySecret, phoneNumber, info } = this.state;

    return (
      <Container>
        <Row>
          <Col>
            <h3>Shared</h3>
            <p>We agree on these parameters offline</p>
            <Shared
              defaultMasterKeyId={masterKeyId}
              defaultMasterKeySecret={masterKeySecret}
              onChange={this.handleSharedChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Server</h3>
            <p>Generate a response with the specified phone number and requested info field</p>
            <Server
              masterKeyId={masterKeyId}
              masterKeySecret={masterKeySecret}
              defaultPhoneNumber={phoneNumber}
              defaultInfo={info}
              onChange={this.handleServerChange}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Client</h3>
            <p>Verify a response by copying it into the field below</p>
            <Client
              masterKeyId={masterKeyId}
              masterKeySecret={masterKeySecret}
              phoneNumber={phoneNumber}
              info={info}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

render(<App />, document.getElementById("root"));
