import ActionTypes from '../actionTypes';

export function switchProject(projectName) {
  localStorage.setItem('activeProj', projectName);
  return {
    type: ActionTypes.SWITCH_PROJECT,
    projectName,
  };
}

export function requestLoadProjects() {
  return {
    type: ActionTypes.LOAD_PROJECTS_REQUESTED,
  };
}

export function requestMergeProjects() {
  return {
    type: ActionTypes.MERGE_PROJECTS_REQUESTED,
  };
}

export function requestNewProject(projectName) {
  console.log('new project requested');
  return {
    type: ActionTypes.NEW_PROJECT_REQUESTED,
    payload: projectName,
  };
}

export function requestDeleteProject(projectName) {
  return {
    type: ActionTypes.DELETE_PROJECT_REQUESTED,
    payload: projectName,
  };
}

export function requestUpdateProject(updatedProj) {
  return {
    type: ActionTypes.UPDATE_PROJECT_REQUESTED,
    payload: updatedProj,
  };
}

export function requestLoadResources(projectName) {
  return {
    type: ActionTypes.LOAD_RESOURCES_REQUESTED,
    payload: projectName,
  };
}

export function requestAddResources(tabs, projectName) {
  return {
    type: ActionTypes.ADD_RESOURCES_REQUESTED,
    payload: {
      tabs,
      projectName,
    },
  };
}

export function requestUpdateResource(url, updatedResource, projectName) {
  return {
    type: ActionTypes.UPDATE_RESOURCE_REQUESTED,
    payload: {
      url,
      updatedResource,
      projectName,
    },
  };
}

export function requestDeleteResource(urls, projectName) {
  return {
    type: ActionTypes.DELETE_RESOURCES_REQUESTED,
    payload: {
      urls,
      projectName,
    },
  };
}
