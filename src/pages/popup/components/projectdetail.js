import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Values from '../../../shared/values';
import ProjectEditor from './detailview/projecteditor';
import TabView from './sharedview/tabview';
import ResourceView from './detailview/resourceview';
import Header from './sharedview/header';
import Footer from './sharedview/footer';
import { requestGetTabs } from '../../../shared/actions/tabactions';
import { requestLoadResources, requestDeleteProject, switchProject } from '../../../shared/actions/projectactions';
import '../scss/projectdetail.scss';


class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteRequested: 0,
    };
    // Tabs could be edited seperately
    // Read tabs from props
    this.handleDeleteProject = this.handleDeleteProject.bind(this);
  }

  componentDidMount() {
    const { activeProj } = this.props;
    const newActive = this.props.match.params.proj.substr(1);
    if (activeProj !== newActive) {
      this.props.switchProject(newActive);
    }
    this.props.requestGetTabs(activeProj);
    this.props.requestLoadResources(newActive);
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error && error !== prevProps.error) {
      this.props.history.push({ pathname: '/modal:error', state: { modal: true } });
      return;
    }
    const { location, activeProj } = this.props;
    if (location && location !== prevProps.location && location.state && location.state.delete) {
      this.state.deleteRequested = 1;
      this.props.requestDeleteProject(activeProj);// Refresh would start when active project is changed
    }
  }

  handleDeleteProject() {
    this.props.history.push({
      pathname: '/modal:dialog',
      state: {
        modal: true,
        content: `Are you sure that you want to delete the project ${this.props.activeProj}?`,
        returnTo: this.props.history.location.pathname,
        waitFor: 'delete',
      },
    });
  }

  render() {
    const { activeWindow, activeProj, tabs } = this.props;
    const tabShow = [];
    if (activeProj === Values.defaultProject && this.state.deleteRequested) {
      return <Redirect to="/" />;
    }
    if (activeWindow !== -1) {
      Object.values(tabs[activeWindow]).forEach((tab) => {
        if (tab.project !== activeProj) return;
        tabShow.push(tab);
      });
    }
    return (
      <div id="project-detail">
        <Header title={activeProj} />
        {/* <DisplaySetting setFilter={this.setFilter} switchView={this.props.requestSwitchView} /> */}
        <ProjectEditor />
        <TabView editing tabs={tabShow} filter={this.state.filter} />
        <ResourceView />
        <div className="thin-row-container"><button type="button" className="warning" onClick={this.handleDeleteProject}>Delete Project</button></div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  tabs: reduxState.tabs.tabList,
  activeWindow: reduxState.tabs.activeWindow,
  activeProj: reduxState.projects.activeProj,
  error: reduxState.error.errorMsg,
});

export default connect(mapStateToProps, {
  requestGetTabs, requestDeleteProject, requestLoadResources, switchProject,
})(ProjectDetail);
