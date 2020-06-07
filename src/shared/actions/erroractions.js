import ActionTypes from '../actionTypes';

export function ignoreError() {
  return {
    type: ActionTypes.IGNORE_ERROR,
  };
}

export function frontendError(error) {
  return {
    type: ActionTypes.FRONTEND_ERROR,
    error,
  };
}
