import { applyMiddleware, createStore } from 'redux';
import { wrapStore, alias } from 'react-chrome-redux';
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import throttle from 'lodash.throttle';
import Values from '../../shared/values';
import { checkSignStatus } from '../../modules/ajax';
import tabAliases from './aliases/aliases4tabs';
import projectAliases from './aliases/aliases4projects';
import loginAliases from './aliases/aliases4login';
import {
  loadProjectList, loadPreferences, loadTabList, saveTabList, saveProjectList, savecurrentProject, savePreferences,
} from './localstorage';
import reducer from './reducers/index';
import ActionTypes from '../../shared/actionTypes';

// const logger = createLogger({
//   collapsed: true,
// });

const initialState = {
  tabs: {
    tabList: loadTabList(), // An object of tabs
    activeTab: -1,
    activeWindow: -1,
    movingTab: null,
  },
  projects: {
    projectList: loadProjectList(), // An array of projects
    currentProject: JSON.parse(Values.emptyProject), // { projectName: '', projectNote: '', resources: {} }
    activeProj: Values.defaultProject, // General
    synchronizing: 0,
  },
  preferences: loadPreferences(),
  // View: 0 -> ListView, 1 -> GridView
  // Synchronize: -1 -> unknown, 0 -> don't synchronize, 1 -> synchronize
  auth: {
    authenticated: false,
    userName: '',
  },
  error: {
    errorMsg: '',
  },
};

const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    alias({ ...tabAliases, ...projectAliases, ...loginAliases }),
    thunk,
    // logger, // NOTE: logger _must_ be last in middleware chain
  ),
);

wrapStore(store, {
  portName: 'Tabs Comminication',
});

const initCheck = () => {
  checkSignStatus(store.dispatch);
  const activeProj = localStorage.getItem('activeProj');
  if (activeProj) {
    store.dispatch({
      type: ActionTypes.SWITCH_PROJECT,
      projectName: activeProj,
    });
  }
};

initCheck();

let currentValue = store.getState();
store.subscribe(throttle(() => {
  const previousValue = currentValue;
  currentValue = store.getState();
  if (previousValue.projects !== currentValue.projects) {
    saveProjectList(currentValue.projects.projectList);
    const { currentProject, activeProj, synchronizing } = currentValue.projects;
    const { authenticated } = currentValue.auth;
    const { synchronize } = currentValue.preferences;
    if (!authenticated || (synchronize === 1 && synchronizing !== 1)) {
      if (currentProject.projectName === activeProj) savecurrentProject(currentProject.projectName, currentProject.projectNote, currentProject.resources);
    }
  }
  if (previousValue.preferences !== currentValue.preferences) {
    savePreferences(currentValue.preferences);
  }
  if (previousValue.tabs !== currentValue.tabs) {
    saveTabList(currentValue.tabs.tabList);
  }
}, 500));

export default store;
