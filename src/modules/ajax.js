import axios from 'axios';
import ActionTypes from '../shared/actionTypes';

// const rootUrl = 'http://localhost:8080/api';
const rootUrl = 'https://two-many-tabz.herokuapp.com/api';

const serverError = (dispatch, error) => {
  console.log(error);
  return dispatch({
    type: ActionTypes.SERVER_ERROR,
    error: error.toString(),
  });
};

export function checkSignStatus(dispatch) {
  dispatch(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Not logged in');
      return;
    }
    axios.get(`${rootUrl}/signin`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      dispatch({
        type: ActionTypes.AUTH_USER,
        userName: response.data.userName,
      });
    }).catch((error) => {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: error.toString,
      });
    });
  }); // To check login status at the very beginning
}

export const signInUserApi = (user) => {
  return new Promise((resolve, reject) => {
    const fields = {
      email: user.email, password: user.password,
    };
    axios.post(`${rootUrl}/signin`, fields)
      .then((response) => {
        // response.data should have {token, userName}
        console.log(response.data);
        const { token, userName } = response.data;
        resolve({ token, userName });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const signUpUserApi = (user) => {
  return new Promise((resolve, reject) => {
    const fields = {
      email: user.email, password: user.password, userName: user.userName,
    };
    console.log(fields);
    axios.post(`${rootUrl}/signup`, fields)
      .then((response) => {
        console.log(response.data);
        resolve({ token: response.data.token });
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export function loadProjects(dispatch) {
  dispatch(() => {
    axios.get(`${rootUrl}/projects`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      dispatch({
        type: ActionTypes.LOAD_PROJECTS_FULLFILLED,
        projectList: response.data,
      }); // // Should return an array of project names
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

export function mergeProjects(dispatch, projects, callback) {
  dispatch(() => {
    axios.put(`${rootUrl}/projects`, projects, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      dispatch({
        type: ActionTypes.MERGE_PROJECTS_FULLFILLED,
      }); // Please check mergeProjectsRequested in aliases4projects for details
      setTimeout(() => {
        dispatch({
          type: ActionTypes.POST_MERGE_PROJECTS,
        });
      }, 3000); // Change back synchronizing status
      if (callback)callback();
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

export function newProject(dispatch, projectName) {
  dispatch(() => {
    axios.post(`${rootUrl}/projects`, { projectName }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      dispatch({
        type: ActionTypes.NEW_PROJECT_FULLFILLED,
        projectName,
      }); // No data is required from the server here, since we only need the name, which is already known
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

export function loadProject(dispatch, projectName) {
  dispatch(() => {
    axios.get(`${rootUrl}/project/${projectName}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      dispatch({
        type: ActionTypes.LOAD_RESOURCES_FULLFILLED,
        currentProject: response.data,
      }); // Should return current project
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

export function deleteProject(dispatch, projectName) {
  dispatch(() => {
    axios.delete(`${rootUrl}/project/${projectName}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      dispatch({
        type: ActionTypes.DELETE_PROJECT_FULLFILLED,
        projectName,
        projectList: response.data,
      }); // Should return new project list
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

// Here are two put project methods
// Should check the keys in updatedProject
export function updateProject(dispatch, projectName, updatedProj, callback) {
  dispatch(() => {
    axios.put(`${rootUrl}/project/${projectName}`, updatedProj, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      dispatch({
        type: ActionTypes.UPDATE_PROJECT_FULLFILLED,
        activeProj: updatedProj.projectName,
        currentProject: response.data.currentProject,
        projectList: response.data.projectList,
      }); // Should return new current project and project list
      if (callback)callback();
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

export function addResources(dispatch, projectName, tabResources) {
  dispatch(() => {
    axios.post(`${rootUrl}/resources/${projectName}`, tabResources, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
      // We want to add the resource to our resources (or maybe update it)
      dispatch({
        type: ActionTypes.ADD_RESOURCES_FULLFILLED,
        currentProject: response.data,
      }); // Should return new current project
    }).catch((error) => {
      serverError(dispatch, error);
    });
  });
}

export function deleteResources(dispatch, projectName, urls) {
  dispatch(() => {
    console.log(urls);
    axios.delete(`${rootUrl}/resources/${projectName}`,
      { data: urls, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }) // Super tricky!
      .then((response) => {
      // Find the urls in the array tabUrls
        dispatch({
          type: ActionTypes.DELETE_RESOURCES_FULLFILLED,
          currentProject: response.data,
        }); // Should return new current project
      }).catch((error) => {
        serverError(dispatch, error);
      });
  });
}

export function updateResource(dispatch, updatedResource, projectName) {
  axios.put(`${rootUrl}/resources/${projectName}`, updatedResource, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then((response) => {
    dispatch({
      type: ActionTypes.UPDATE_RESOURCE_FULLFILLED,
      resource: response.data,
    });
    // updatedResource would always contain the url, but may not contain other keys
    // Should return the updated resource
  }).catch((error) => {
    serverError(dispatch, error);
  });
}
