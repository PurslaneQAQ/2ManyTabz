import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { requestNewProject } from '../../../../shared/actions/projectactions';
import { frontendError } from '../../../../shared/actions/erroractions';

// eslint-disable-next-line no-unused-vars
class ProjectCreator extends Component {
  constructor(props) {
    super(props);
    this.state = { projectName: '' };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmitNew = this.handleSubmitNew.bind(this);
  }

  handleNameChange(e) {
    this.setState({ projectName: e.target.value });
  }

  handleSubmitNew(e) {
    e.preventDefault();
    // Reference: https://blog.csdn.net/weixin_41646716/article/details/89375896
    // Detect empty string
    if (this.state.projectName.replace(/(^s*)|(s*$)/g, '').length === 0) {
      this.props.frontendError('Project name can not be empty!');
      return;
    }
    if (this.state.projectName.indexOf('/') !== -1) {
      this.props.frontendError('Project name shouldn\'t contain \'/\'!');
      return;
    }
    if (!this.props.projectList.includes(this.state.projectName)) {
      console.log(this.state.projectName);
      this.props.requestNewProject(this.state.projectName);
    } else {
      this.props.frontendError('Project name exists!');
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmitNew}>
        <div className="input-group">
          <input type="text" name="title" placeholder="Project Name (should't contain '\')" onBlur={this.handleNameChange} />
          <button type="submit"> Add project </button>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  projectList: reduxState.projects.projectList,
});

export default connect(mapStateToProps, { requestNewProject, frontendError })(ProjectCreator);
