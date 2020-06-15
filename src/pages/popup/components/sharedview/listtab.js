import React from 'react';
import { connect } from 'react-redux';
import CloseTabBtn from './tabcontrols/closetabbtn';
import SaveTabBtn from './tabcontrols/savetabbtn';
import handleDragTab from './tabcontrols/handledragtab';
import { moveTab, requestSwitchTab } from '../../../../shared/actions/tabactions';

const ListTab = (props) => {
  const { tab, editing, activeTab } = props;
  return (
    <li
      title={tab.title}
      className={`list-tab${tab.id === activeTab ? ' active' : ''}`}
      onMouseDown={(e) => { if (!editing) handleDragTab(e, props.moveTab, tab, tab.id === activeTab); }}
      onMouseUp={() => { props.requestSwitchTab(tab.id); }}
    >
      <img alt=" " src={tab.icon} />
      <span className="cut-title">{tab.title}</span>
      <CloseTabBtn tab={tab} />
      {editing ? (
        <SaveTabBtn tab={tab} />
      ) : null}
    </li>
  );
};

const mapStateToProps = (reduxState) => ({
  activeTab: reduxState.tabs.activeTab,
});

export default connect(mapStateToProps, {
  requestSwitchTab, moveTab,
})(ListTab);
