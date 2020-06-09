import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { CSSTransition } from 'react-transition-group';
import {
  faEdit as faEditRegular, faFolder, faTrashAlt,
} from '@fortawesome/free-regular-svg-icons';
import {
  faWindowClose, faPlus, faStar, faChevronDown, faChevronUp, faUser, faSignOutAlt, faHome, faSearch, faEdit as faEditSolid,
} from '@fortawesome/free-solid-svg-icons';
import TabManager from './tabmanager';
import ProjectDetail from './projectdetail';
import Login from './login';
import Modal from './modal';

// FontAwesome notes: https://www.digitalocean.com/community/tutorials/how-to-use-font-awesome-5-with-react

library.add(faEditRegular, faFolder, faTrashAlt);
library.add(faWindowClose, faPlus, faStar, faChevronDown, faChevronUp, faUser, faSignOutAlt, faHome, faSearch, faEditSolid);

class App extends Component {
  constructor(props) {
    super(props);
    this.previousLocation = this.props.location;
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate() {
    const { location } = this.props;
    if (!(location.state && location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const isModal = (
      location.state
      && location.state.modal // Should be specified when redirecting
      && this.previousLocation !== location
    );

    return (
      <div className="container">
        <Switch location={isModal ? this.previousLocation : location}>
          <Route path="/project/:proj" component={ProjectDetail} />
          <Route path="/login" component={Login} />
          <Route component={TabManager} />
        </Switch>
        <CSSTransition
          in={isModal}
          timeout={300}
          classNames="modal-wrapper"
          unmountOnExit
        >
          <Route exact path="/modal:id" component={Modal} />
        </CSSTransition>
      </div>
    );
  }
}

export default withRouter(App);
