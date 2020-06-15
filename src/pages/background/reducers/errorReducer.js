import ActionTypes from '../../../shared/actionTypes';

const errorReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.SERVER_ERROR:
      return { ...state, errorMsg: action.error };
    case ActionTypes.CHROME_ERROR:
      return { ...state, errorMsg: action.error };
    case ActionTypes.FRONTEND_ERROR:
      return { ...state, errorMsg: action.error };
    case ActionTypes.AUTH_ERROR:
      return { ...state, errorMsg: action.message };
    case ActionTypes.IGNORE_ERROR:
      return { ...state, errorMsg: '' };
    default:
      return state;
  }
};

export default errorReducer;
