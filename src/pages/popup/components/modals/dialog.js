import React from 'react';
import { withRouter } from 'react-router-dom';

const Dialog = (props) => {
  const { content, returnTo, waitFor } = props;
  return (
    <div>
      <div>{content}</div>
      <div className="button-row">
        <button type="button"
          className="primary"
          onClick={() => {
            props.history.push({ pathname: returnTo, state: { [waitFor]: true } });
          }}
        > Yes
        </button>
        <button type="button"
          onClick={() => {
            props.history.goBack();
          }}
        >No
        </button>
      </div>
    </div>
  );
};
export default withRouter(Dialog);
