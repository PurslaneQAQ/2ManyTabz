import React, { Component } from 'react';
import { connect } from 'react-redux';
import Resource from './resource';
import { requestOpenTabs } from '../../../../shared/actions/tabactions';
import '../../scss/resourceview.scss';

class ResourceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        type: '0',
        content: '',
      },
      displayResource: '',
    };
    this.setFilterType = this.setFilterType.bind(this);
    this.setFilterContent = this.setFilterContent.bind(this);
    this.setDisplayResource = this.setDisplayResource.bind(this);
  }

  setFilterType(type) {
    this.setState((prevState) => (
      { filter: { ...prevState.filter, type } }
    ));
  }

  setFilterContent(content) {
    this.setState((prevState) => (
      { filter: { ...prevState.filter, content } }
    ));
  }

  setDisplayResource(url) {
    this.setState({ displayResource: url });
  }

  render() {
    const { resources, activeProj } = this.props;
    const { filter } = this.state;
    const filteredResources = {};
    const content = filter.content.toLowerCase();
    Object.values(resources).forEach((tab) => {
      if (content === ''
      || (filter.type === '0' && (tab.tags && tab.tags.includes(content)))
      || (filter.type === '1' && tab.title.toLowerCase().indexOf(content) !== -1)) {
        filteredResources[tab.url] = tab;
      }
    });
    const resourceList = Object.values(filteredResources).map((tab) => {
      return (
        <Resource key={tab.url}
          tab={tab}
          displayResource={this.state.displayResource}
          setDisplay={this.setDisplayResource}
          setFilterContent={(tag) => { if (this.state.filter.type !== '1') this.setFilterType('0'); this.setFilterContent(tag); }}
        />
      );
    });
    return (
      <div>
        <div>
          <select name="type" value={filter.type} onChange={(e) => { this.setFilterType(e.target.value); }}>
            <option value="0">tag</option>
            <option value="1">title</option>
          </select>
          <input type="text" name="content" value={filter.content} onChange={(e) => { this.setFilterContent(e.target.value); }} />
          <button type="button"
            onClick={() => { this.props.requestOpenTabs(Object.keys(filteredResources), activeProj); }}
          >Open All
          </button>
        </div>
        <ul id="resource-list">{resourceList}</ul>
      </div>
    );
  }
}

const mapStateToProps = (reduxState) => ({
  resources: reduxState.projects.currentProject.resources,
  activeProj: reduxState.projects.activeProj,
});

export default connect(mapStateToProps, { requestOpenTabs })(ResourceView);
