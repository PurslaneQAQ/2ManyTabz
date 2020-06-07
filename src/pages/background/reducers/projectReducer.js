import ActionTypes from '../../../shared/actionTypes';
import Values from '../../../shared/values';

export default function projectReducer(state = {}, action) {
  const newState = state;
  switch (action.type) {
    case ActionTypes.SWITCH_PROJECT:
      return { ...state, activeProj: action.projectName };

    case ActionTypes.LOAD_PROJECTS_FULLFILLED:
      return { ...state, projectList: [...(new Set([Values.defaultProject, ...action.projectList]))] };

    case ActionTypes.NEW_PROJECT_FULLFILLED:
      state.projectList.push(action.projectName);
      return { ...state, activeProj: action.projectName };

    case ActionTypes.MERGING_PROJECTS:
      return { ...state, synchronizing: 1 };

    case ActionTypes.MERGE_PROJECTS_FULLFILLED:
      return { ...state, synchronizing: 2 };

    case ActionTypes.DELETE_PROJECT_FULLFILLED:
      if (state.activeProj === action.projectName) {
        newState.activeProj = Values.defaultProject;
        newState.currentProject = JSON.parse(Values.emptyProject);// default value
      }
      return { ...newState, projectList: [...(new Set([Values.defaultProject, ...action.projectList]))] };

    case ActionTypes.POST_MERGE_PROJECTS:
      return { ...state, synchronizing: 0 };

    case ActionTypes.UPDATE_PROJECT_FULLFILLED:
      return {
        ...state,
        activeProj: action.activeProj,
        projectList: [...(new Set([Values.defaultProject, ...action.projectList]))],
        currentProject: action.currentProject,
        error: '',
      };

    case ActionTypes.ADD_RESOURCES_FULLFILLED:
      return { ...state, currentProject: action.currentProject };

    case ActionTypes.UPDATE_RESOURCE_FULLFILLED:
      newState.currentProject.resources[action.resource.url] = action.resource;
      return { ...newState };

    case ActionTypes.DELETE_RESOURCES_FULLFILLED:
      return { ...state, currentProject: action.currentProject };

    case ActionTypes.LOAD_RESOURCES_FULLFILLED:
      return { ...state, currentProject: action.currentProject };

    case ActionTypes.DEAUTH_USER:
      return { ...state, synchronizing: 0 };

    case ActionTypes.AUTH_ERROR:
      return { ...state, synchronizing: 0 };

    default:
      return state;
  }
}
