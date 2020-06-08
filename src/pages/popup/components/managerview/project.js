/* eslint-disable react/button-has-type */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Values from '../../../../shared/values';
import { switchProject } from '../../../../shared/actions/projectactions';
import { requestCloseTabs, updateTabProj } from '../../../../shared/actions/tabactions';

const Project = (props) => {
  const {
    projectTitle, example, ids, contains, movingTab,
  } = props;
  const projectClass = [];
  if (projectTitle === props.activeProj) projectClass.push('choosen');
  if (contains) projectClass.push('fits-filter');
  return (
    <li
      className={projectClass.join(' ')}
      onClick={() => { props.switchProject(projectTitle); }}
    >
      { movingTab ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="waiting-for-tab-mask"
          onMouseUp={() => { if (movingTab) props.updateTabProj(movingTab.tab.id, projectTitle); }}
        />
      ) : null}
      <span>
        <FontAwesomeIcon icon={['far', 'folder']} />
        <span>{projectTitle}</span>
        <span className="trim-example">{example ? `: ${example} ` : ''}</span>
        <span>{ids.length > 1 ? `and ${ids.length - 1} other tabs ` : ''}</span>
        {projectTitle === Values.defaultProject ? null : <button className="submit"><Link to={`/project/:${projectTitle}`}>Edit</Link></button> }
      </span>
      {ids.length > 0 ? (
        <FontAwesomeIcon
          className="btn"
          icon="window-close"
          onClick={(e) => { e.stopPropagation(); e.cancelBubble = true; props.requestCloseTabs(ids, props.activeProj); }}
        />
      ) : null}
    </li>
  );
};

const mapStateToProps = (reduxState) => ({
  activeProj: reduxState.projects.activeProj,
  movingTab: reduxState.tabs.movingTab,
});

export default connect(mapStateToProps, { switchProject, requestCloseTabs, updateTabProj })(Project);
