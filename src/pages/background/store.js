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
  loadProjectList, loadPreferences, saveProjectList, savecurrentProject, savePreferences,
} from './localstorage';
import reducer from './reducers/index';

// const logger = createLogger({
//   collapsed: true,
// });

const initialState = {
  tabs: {
    tabList: {},
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

checkSignStatus(store.dispatch);

store.subscribe(throttle(() => {
  saveProjectList(store.getState().projects.projectList);
  savePreferences(store.getState().preferences);
  const { currentProject, activeProj, synchronizing } = store.getState().projects;
  const { authenticated } = store.getState().auth;
  const { synchronize } = store.getState().preferences;
  if (!authenticated || (synchronize === 1 && synchronizing !== 1)) {
    if (currentProject.projectName === activeProj) savecurrentProject(currentProject.projectName, currentProject.projectNote, currentProject.resources);
  }
}, 1000));

export default store;
