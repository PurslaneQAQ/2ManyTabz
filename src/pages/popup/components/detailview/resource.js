import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { requestOpenTabs } from '../../../../shared/actions/tabactions';
import { requestDeleteResource, requestUpdateResource } from '../../../../shared/actions/projectactions';

const Resource = (props) => {
  const { tab, activeProj, displayResource } = props;
  if (tab.url === displayResource) {
    return (
      <li key={tab.url} className="edit-resource">
        <div>
          <img alt=" " src={tab.icon} />
          <span className="full-title">{ tab.title }</span>
          <FontAwesomeIcon
            className="btn"
            icon="chevron-up"
            onClick={(e) => { e.stopPropagation(); props.setDisplay(''); }}
          />
        </div>
        <div className="url"> { tab.url } </div>
        <div className="resource-control">
          <input type="text"
            className="tags-input"
            placeholder="Enter tags for the resource. Split by ','"
            defaultValue={tab.tags.join(', ')}
            onBlur={(e) => {
              const tags = e.target.value.split(',').map((tag) => {
                return tag.replace(/(^\s*)|(\s*$)/g, '').toLowerCase();
              }).filter((tag) => {
                if (tag.length === 0) return false;
                return true;
              });
              if (tags.length > 0 || tab.tags.length !== 0) { props.requestUpdateResource(tab.url, { tags }, activeProj); }
            }}
          />
          <button type="button" onClick={() => props.requestDeleteResource([tab.url], activeProj)}>
            <FontAwesomeIcon icon={['far', 'trash-alt']} />
          </button>
        </div>
      </li>
    );
  } else {
    return (
      <li key={tab.url} onClick={() => { props.requestOpenTabs(tab.url, activeProj); }}>
        <div>
          <img alt=" " src={tab.icon} />
          <span className="cut-title">{ tab.title }</span>
          <FontAwesomeIcon
            className="btn"
            icon="chevron-down"
            onClick={(e) => { e.stopPropagation(); props.setDisplay(tab.url); }}
          />
        </div>
        <div className="tags-container">
          { tab.tags.map((tag) => (
            <button className="tag" type="button" key={tag} onClick={(e) => { e.stopPropagation(); props.setFilterContent(tag); }}>{tag}</button>
          )) }
        </div>
      </li>
    );
  }
};

const mapStateToProps = (reduxState) => ({
  activeProj: reduxState.projects.activeProj,
});

export default connect(mapStateToProps, { requestOpenTabs, requestDeleteResource, requestUpdateResource })(Resource);
