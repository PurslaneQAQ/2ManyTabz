/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { switchView } from '../../../../shared/actions/preferenceactions';

const DisplaySetting = (props) => {
  return (
    <div id="display-setting" className="thin-row-container">
      <div className="search-bar">
        <FontAwesomeIcon icon="search" />
        <input type="text" placeholder="Search for a tab..." onChange={(e) => { props.setFilter(e.target.value ? { title: e.target.value } : {}); }} />
      </div>
      <label className="switch">
        <input type="checkbox" name="viewType" checked={props.displayType === '0'} onChange={(e) => { props.switchView(`${!e.target.checked - 0}`); }} />
        <span className="slider">
          <span className="slide-content">
            <span className={props.displayType === '0' ? 'active' : ''}>Grid View</span>
            <span className="ball" />
            <span className={props.displayType === '1' ? 'active' : ''}>List View</span>
          </span>
        </span>
      </label>
    </div>
  );
};

const mapStateToProps = (reduxState) => ({
  displayType: reduxState.preferences.displayType,
});

export default connect(mapStateToProps, { switchView })(DisplaySetting);
