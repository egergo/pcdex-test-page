import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

export class TextWithExplanation extends Component {
  constructor() {
    super();
    this.state = {
      hovered: false,
      modalOpen: false
    };
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handleClick = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { header, body } = this.props;
    const { hovered, modalOpen } = this.state;

    const color = hovered ? "#0000EE" : "inherit";
    const textDecoration = hovered ? "underline" : "inherit";

    return (
      <>
        <span
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
          style={{ cursor: "pointer", color, textDecoration }}
        >
          {this.props.children}
        </span>

        <Modal show={modalOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{header}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
