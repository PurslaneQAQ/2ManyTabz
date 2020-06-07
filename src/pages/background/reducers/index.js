import { combineReducers } from 'redux';

import tabReducer from './tabReducer';
import projectReducer from './projectReducer';
import preferenceReducer from './preferenceReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  tabs: tabReducer,
  projects: projectReducer,
  preferences: preferenceReducer,
  auth: authReducer,
  error: errorReducer,
});
