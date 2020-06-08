/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { requestUpdateProject } from '../../../../shared/actions/projectactions';
import { frontendError } from '../../../../shared/actions/erroractions';

class ProjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      updatedProject: {
        projectName: '',
        projectNote: '',
      },
    };
    this.renderEdit = this.renderEdit.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderNote = this.renderNote.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
  }

  onEditClick(event) {
    const { isEditing, updatedProject } = this.state;
    const { projectList, currentProject } = this.props;
    if (isEditing) {
      if (updatedProject.projectName.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
        console.log('Project Name can not be empty!');
        this.props.frontendError('Project Name can not be empty!');
        return;
      } if (updatedProject.projectName.indexOf('/') !== -1
      || updatedProject.projectName.indexOf('\\') !== -1) {
        this.props.frontendError('Project name shouldn\'t contain \\ or / !');
        return;
      } else if (updatedProject.projectName !== currentProject.projectName && projectList.includes(updatedProject.projectName)) {
        console.log('exists!');
        this.props.frontendError('A Project with the same name already exist!');
        return;
      } else if (updatedProject.projectName === currentProject.projectName
        && updatedProject.projectNote === currentProject.projectNote) {
        console.log('Nothing changed');
        this.setState({ isEditing: false });
        return;
      }
      this.props.requestUpdateProject(updatedProject);
      this.setState({ isEditing: false });
    } else {
      this.setState({
        updatedProject: {
          projectName: currentProject.projectName,
          projectNote: currentProject.projectNote,
        },
      });
      this.setState({ isEditing: true });
    }
  }

  onNameChange(event) {
    const projectName = event.target.value.substr(0, 30);
    this.setState((prevState) => ({
      updatedProject: { ...prevState.updatedProject, projectName },
    }));
  }

  onNoteChange(event) {
    const projectNote = event.target.value.substr(0, 60);
    this.setState((prevState) => ({
      updatedProject: { ...prevState.updatedProject, projectNote },
    }));
  }

  renderEdit() {
    return (
      <button type="button" onClick={this.onEditClick} className="note-button"><FontAwesomeIcon icon={['far', 'edit']} size="2x" /> </button>
    );
  }

  renderTitle() {
    if (this.state.isEditing) {
      return (
        <span>
          <label>Title</label>
          <input
            id="projectName-change"
            type="text"
            onChange={this.onNameChange}
            value={this.state.updatedProject.projectName}
            placeholder="update projectName"
          />
        </span>
      );
    } else {
      return (
        <span className="projectName">
          {/* <h1 className="project-projectName">{this.props.currentProject.projectName}</h1> */}
        </span>
      );
    }
  }

  renderNote() {
    const { currentProject } = this.props;
    if (this.state.isEditing) {
      return (
        <span>
          <label>Note</label>
          <input
            id="note-change"
            type="text"
            onChange={this.onNoteChange}
            placeholder="update note"
            value={this.state.updatedProject.projectNote}
          />
          {this.renderEdit()}
        </span>
      );
    } else {
      return (
        <span className="background">
          {/* <p className="project-note" dangerouslySetInnerHTML={{ __html: marked(currentProject.note || '') }} /> */}
          <span className="project-note">{ currentProject.projectNote }</span>
          {this.renderEdit()}
        </span>
      );
    }
  }

  render() {
    return (
      <div id="project-editor" className="row-container">
        {this.renderTitle()}
        {this.renderNote()}
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  currentProject: reduxState.projects.currentProject,
  projectList: reduxState.projects.projectList,
});

export default connect(mapStateToProps, { requestUpdateProject, frontendError })(ProjectEditor);
