/* eslint-disable no-param-reassign */
import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { requestSwitchTab, requestCloseTabs } from '../../../shared/actions/tabactions';

const TabGrid = (props) => {
  // ATTENTION!!! Here we provided 4 fuctions: jumpto, openTab, openTabs and close.
  // This is an example of how the client can use them.
  const {
    tabs,
  } = props;
  const tabList = tabs.map((tab) => {
    return (
      <li
        key={tab.id}
        title={tab.title}
        onClick={() => {
          props.requestSwitchTab(tab.id);
          // this.openTab(tab.url);
          // this.openTabs(testTabsUrlInFolder);
          // this.close(tab.id);
        }}
      >
        <img alt=" " src={tab.icon} />
        <span>{tab.title}</span>
        <FontAwesomeIcon
          className="btn"
          icon="window-close"
          onClick={(e) => { e.stopPropagation(); e.cancelBubble = true; props.requestCloseTabs(tab.id, props.activeProj); }}
        />
      </li>
    );
  });
  return <ul id="tab-grid"> I am the grid view {tabList}</ul>;
};

const mapStateToProps = (reduxState) => ({
  activeProj: reduxState.projects.activeProj,
});

export default connect(mapStateToProps, { requestSwitchTab, requestCloseTabs })(TabGrid);
