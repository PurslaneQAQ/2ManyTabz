/* eslint-disable react/button-has-type */
import React from 'react';
import Project from './project';
import ProjectCreator from './projectcreator';

const ProjectList = (props) => {
  const { projectOverview } = props;
  const projectView = Object.keys(projectOverview).map((project) => {
    return (
      <Project
        key={`project-${project}`}
        projectTitle={project}
        example={projectOverview[project].example}
        ids={projectOverview[project].ids}
      />
    );
  });
  return (
    <ul id="project-list">
      {projectView}
      <ProjectCreator />
    </ul>
  );
};

export default ProjectList;
