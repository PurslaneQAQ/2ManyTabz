/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DisplaySetting from './managerview/displayset';
import TabView from './sharedview/tabview';
import ProjectList from './managerview/projectlist';
import ProjectCreator from './managerview/projectcreator';
import MovingTab from './managerview/movingtab';
import Header from './sharedview/header';
import Footer from './sharedview/footer';
import { requestGetTabs } from '../../../shared/actions/tabactions';
import { requestLoadProjects } from '../../../shared/actions/projectactions';

class TabManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
    };
    this.setFilter = this.setFilter.bind(this);
  }

  componentDidMount() {
    // const { activeWindow, activeProj } = this.props;
    // if (activeWindow === -1) {
    //   console.log(activeProj);
    //   this.props.requestGetTabs(activeProj);
    // }
    const { activeProj } = this.props;
    this.props.requestGetTabs(activeProj);
    this.props.requestLoadProjects();
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error && error !== prevProps.error) {
      this.props.history.push({ pathname: '/modal:error', state: { modal: true } });
    }
  }

  setFilter(filter) {
    this.setState({ filter });
  }

  render() {
    const {
      projectList, activeWindow, activeProj, tabs, movingTab,
    } = this.props;
    const tabShow = [];
    const projectOverview = {};
    projectList.forEach((project) => {
      projectOverview[project] = { example: '', ids: [], contains: false };
    });
    if (activeWindow !== -1) {
      Object.values(tabs[activeWindow]).forEach((tab) => {
        if (projectOverview[tab.project]) { // Might not exist when deleting a project just finished
          projectOverview[tab.project].ids.push(tab.id);
          if (projectOverview[tab.project].example === '')projectOverview[tab.project].example = tab.title;
          let flag = true;
          Object.keys(this.state.filter).forEach((key) => {
            if (!tab[key].toLowerCase().includes(this.state.filter[key].toLowerCase()))flag = false;
          });
          if (!flag) return;
          if (Object.keys(this.state.filter).length)projectOverview[tab.project].contains = true; // Contains tabs that fits the filter
          if (tab.project === activeProj) {
            tabShow.push(tab);
          }
        }
      });
    }

    return (
      <div id="tab-manager" className={movingTab ? 'grab-tab' : ''}>
        <Header />
        <DisplaySetting setFilter={this.setFilter} switchView={this.props.requestSwitchView} />
        <TabView tabs={tabShow} filter={this.state.filter} />
        <div id="project-view">
          <ProjectList projectOverview={projectOverview} />
          { movingTab ? <MovingTab /> : null }
          <div className="thin-row-container"><ProjectCreator /></div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  tabs: reduxState.tabs.tabList,
  movingTab: reduxState.tabs.movingTab,
  activeWindow: reduxState.tabs.activeWindow,
  projectList: reduxState.projects.projectList,
  activeProj: reduxState.projects.activeProj,
  error: reduxState.error.errorMsg,
});

export default connect(mapStateToProps, { requestGetTabs, requestLoadProjects })(TabManager);
