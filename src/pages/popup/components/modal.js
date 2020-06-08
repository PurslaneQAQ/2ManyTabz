/* eslint-disable jsx-a11y/interactive-supports-focus */
// Reference: https://blog.logrocket.com/building-a-modal-module-for-react-with-react-router/

import React, { Component } from 'react';
import Synchronize from './modals/synchronize';
import Error from './modals/error';
import Dialog from './modals/dialog';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locked: false,
    };
    this.lockModal = this.lockModal.bind(this);
    this.setModal = this.setModal.bind(this);
  }

  setModal() {
    const type = this.props.match.params.id.substr(1);
    const { location } = this.props;
    if (type === 'synchronize') {
      return <Synchronize locked={this.state.locked} lockModal={this.lockModal} />;
    } else if (type === 'error') {
      return <Error />;
    } else if (type === 'dialog') {
      if (location.state) {
        const { content, returnTo, waitFor } = location.state;
        return <Dialog content={content} returnTo={returnTo} waitFor={waitFor} />;
      } else { return 'Invalid dialog'; }
    } else { return 'Unknow modal'; }
  }

  lockModal() {
    this.setState({ locked: true });
  }

  render() {
    return (
      <div
        role="button"
        onClick={() => { if (!this.state.locked) this.props.history.goBack(); }}
      >
        <div
          role="button"
          className="modal"
          onClick={(e) => e.stopPropagation()}
        >
          {this.setModal()}
        </div>
      </div>
    );
  }
}

export default Modal;
