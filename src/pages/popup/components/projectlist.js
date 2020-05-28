/* eslint-disable react/button-has-type */
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { requestNewProject } from '../../../shared/actions/projectactions';
import Project from './project';

// eslint-disable-next-line no-unused-vars
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = { pojectName: '' };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmitNew = this.handleSubmitNew.bind(this);
  }

  handleNameChange(e) {
    this.setState({ projectName: e.target.value });
  }

  handleSubmitNew() {
    if (!this.props.projects.includes(this.state.pojectName)) {
      this.props.requestNewProject(this.state.projectName);
    } else {
      console.log('project exists!');
    }
  }

  render() {
    const projectView = this.props.projects.map((project) => {
      return (
        <Project
          key={`project-${project}`}
          projectTitle={project}
        />
      );
    });
    return (
      <ul id="project-list">
        {projectView}
        <form onSubmit={this.handleSubmitNew}>
          <input type="text" name="title" onBlur={this.handleNameChange} />
          <button type="submit"> Add project </button>
        </form>
      </ul>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  projects: reduxState.projects.projectList,
});

export default connect(mapStateToProps, { requestNewProject })(ProjectList);
