import ActionTypes from '../../../shared/actionTypes';

export default function tabReducer(state = {}, action) {
  const newState = state;
  switch (action.type) {
    case ActionTypes.GET_TABS_FULLFILLED:
      return {
        ...state, ...action.tabs,
      };
    case ActionTypes.TABS_REMOVED:
      return {
        ...state, ...action.tabs,
      };
    case ActionTypes.TABS_UPDATED:
      return {
        ...state, ...action.tabs,
      };
    case ActionTypes.SWITCH_TAB_FULLFILLED:
      return { ...state, activeTab: action.activeTab };
    case ActionTypes.MOVE_TAB:
      return { ...state, movingTab: action.movingTab };
    case ActionTypes.UPDATE_TAB_PROJ:
      newState.tabList[state.activeWindow][action.tabId].project = action.project;
      return { ...newState };
    default:
      return state;
  }
}
