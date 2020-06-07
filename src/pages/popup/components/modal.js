/* eslint-disable jsx-a11y/interactive-supports-focus */
// Reference: https://blog.logrocket.com/building-a-modal-module-for-react-with-react-router/

import React, { Component } from 'react';
// import { CSSTransition } from 'react-transition-group';
import Synchronize from './modals/synchronize';
import Error from './modals/error';
import '../scss/modal.scss';

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
    if (type === 'synchronize') {
      return <Synchronize locked={this.state.locked} lockModal={this.lockModal} />;
    } else if (type === 'error') {
      return <Error />;
    } else { return 'Unknow modal'; }
  }

  lockModal() {
    this.setState({ locked: true });
  }

  render() {
    return (
    // <div>
    //   <CSSTransition
    //     timeout={300}
    //     classNames="modal-wrapper"
    //   >
      <div
        role="button"
        className="modal-wrapper-active"
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
    // </CSSTransition>
    // </div>
    );
  }
}

export default Modal;
