import ActionTypes from '../../../shared/actionTypes';
import { loadcurrentProject, loadProjectList, removeProject } from '../localstorage';
import * as ajax from '../../../modules/ajax';

// TODO: Methods below should be updated with communication with the server

const loadProjectsAlias = () => {
  return (dispatch, getState) => {
    const { authenticated } = getState().auth;
    if (authenticated) {
      ajax.loadProjects(dispatch);
    } else {
      dispatch({
        type: ActionTypes.LOAD_PROJECTS_FULLFILLED,
        projectList: loadProjectList(),
      });
    }
  };
};

const mergeProjectsAlias = () => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.MERGING_PROJECTS });
    const projects = [];
    const { projectList } = getState().projects;
    const { authenticated } = getState().auth;
    projectList.forEach((projectName) => {
      const { projectNote, resources } = loadcurrentProject(projectName);
      projects.push({ projectName, projectNote, resources });
    }); // So it would become: projectName, projectNote, resources
    console.log(projects);
    if (authenticated) {
      ajax.mergeProjects(dispatch, projects, () => {
        dispatch({
          type: ActionTypes.MERGE_PROJECTS_FULLFILLED,
        });
      });
    } else { // Only for debugging!!!!
      setTimeout(() => {
        dispatch({
          type: ActionTypes.MERGE_PROJECTS_FULLFILLED,
        });
      }, 3000);
      setTimeout(() => {
        dispatch({
          type: ActionTypes.POST_MERGE_PROJECTS,
        });
      }, 5000);
    }
    //
  };
};

const newProjectAlias = (req) => {
  return (dispatch, getState) => {
    const { authenticated } = getState().auth;
    const projectName = req.payload;
    if (authenticated) {
      ajax.newProject(dispatch, projectName);
    } else {
      dispatch({
        type: ActionTypes.NEW_PROJECT_FULLFILLED,
        projectName,
      });
    }
  };
};

const deleteProjectAlias = (req) => {
  return (dispatch, getState) => {
    const projectName = req.payload;
    const { authenticated } = getState().auth;
    const { synchronize } = getState().preferences;
    const { projectList, currentProject } = getState().projects;
    const localUpdate = () => {
      removeProject(projectName);
    };
    if (authenticated) {
      ajax.deleteProject(dispatch, currentProject.projectName, synchronize ? localUpdate : null);
    } else {
      const projInd = projectList.indexOf(projectName);
      if (projInd > -1) projectList.splice(projInd, 1);
      localUpdate();
      dispatch({
        type: ActionTypes.DELETE_PROJECT_FULLFILLED,
        projectList,
        projectName,
      });
    }
  };
};


const updateProjectAlias = (req) => {
  return (dispatch, getState) => {
    const updatedProj = req.payload;
    const { authenticated } = getState().auth;
    const { currentProject, projectList } = getState().projects;
    const { synchronize } = getState().preferences;
    const localUpdate = () => {
      if (updatedProj.projectName !== currentProject.projectName) {
        removeProject(currentProject.projectName);
        projectList[projectList.findIndex((p) => (p === currentProject.projectName))] = updatedProj.projectName;
      }
    };
    if (authenticated) {
      ajax.updateProject(dispatch, currentProject.projectName, updatedProj, synchronize ? localUpdate : null);
    } else {
      localUpdate();
      currentProject.projectName = updatedProj.projectName;
      currentProject.projectNote = updatedProj.projectNote;
      dispatch({
        type: ActionTypes.UPDATE_PROJECT_FULLFILLED,
        activeProj: updatedProj.projectName,
        currentProject,
        projectList,
      });
    }
  };
};

const addResourcesAlias = (req) => {
  return (dispatch, getState) => {
    const { authenticated } = getState().auth;
    const { currentProject } = getState().projects;
    const { tabs } = req.payload;
    if (authenticated) {
      const tabResources = {};
      tabs.forEach((tab) => {
        if (!currentProject.resources[tab.url]) {
          tabResources[tab.url] = {
            url: tab.url,
            icon: tab.icon,
            title: tab.title,
            tags: [],
          };
        } // No duplicate
      });
      ajax.addResources(dispatch, currentProject.projectName, tabResources);
    } else {
      console.log(tabs);
      tabs.forEach((tab) => {
        currentProject.resources[tab.url] = {
          url: tab.url,
          icon: tab.icon,
          title: tab.title,
          tags: [],
        };
      });
      dispatch({
        type: ActionTypes.ADD_RESOURCES_FULLFILLED,
        currentProject,
      });
    }
  };
};

const updateResourceAlia = (req) => {
  return (dispatch, getState) => {
    const { authenticated } = getState().auth;
    const { url, projectName, updatedResource } = req.payload;
    if (authenticated) {
      ajax.updateResource(dispatch, { ...updatedResource, url }, projectName);
    } else {
      const resource = getState().projects.currentProject.resources[url];
      Object.keys(updatedResource).forEach((key) => {
        resource[key] = updatedResource[key];
      });
      dispatch({
        type: ActionTypes.UPDATE_RESOURCE_FULLFILLED,
        resource,
      });
    }
  };
};

const deleteResourcesAlias = (req) => {
  return (dispatch, getState) => {
    const { authenticated } = getState().auth;
    const { currentProject } = getState().projects;
    const { urls } = req.payload;
    if (authenticated) {
      ajax.deleteResources(dispatch, currentProject.projectName, urls);
    } else {
      urls.forEach((url) => {
        delete currentProject.resources[url];
      });
      dispatch({
        type: ActionTypes.DELETE_RESOURCES_FULLFILLED,
        currentProject,
      });
    }
  };
};

const loadResourcesAlias = (req) => {
  return (dispatch, getState) => {
    const projectName = req.payload;
    const { authenticated } = getState().auth;
    if (authenticated) {
      ajax.loadProject(dispatch, projectName);
    } else {
      const { projectNote, resources } = loadcurrentProject(projectName);
      dispatch({
        type: ActionTypes.LOAD_RESOURCES_FULLFILLED,
        currentProject: {
          projectName,
          projectNote,
          resources,
        },
      });
    }
  };
};

export default {
  LOAD_PROJECTS_REQUESTED: loadProjectsAlias,
  MERGE_PROJECTS_REQUESTED: mergeProjectsAlias,
  NEW_PROJECT_REQUESTED: newProjectAlias,
  DELETE_PROJECT_REQUESTED: deleteProjectAlias,
  UPDATE_PROJECT_REQUESTED: updateProjectAlias,

  ADD_RESOURCES_REQUESTED: addResourcesAlias,
  DELETE_RESOURCES_REQUESTED: deleteResourcesAlias,
  LOAD_RESOURCES_REQUESTED: loadResourcesAlias,
  UPDATE_RESOURCE_REQUESTED: updateResourceAlia,
};
