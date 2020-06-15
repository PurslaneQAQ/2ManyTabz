// Reference: https://medium.com/@jrcreencia/persisting-redux-state-to-local-storage-f81eb0b90e7e
import Values from '../../shared/values';

function loadFile(fileName, getDefault) {
  try {
    const serializedState = localStorage.getItem(fileName);
    if (serializedState === null) {
      return getDefault();
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return getDefault();
  }
}

function saveFile(fileName, obj) {
  try {
    const serializedState = JSON.stringify(obj);
    localStorage.setItem(fileName, serializedState);
  } catch (err) {
    console.log(err);
  }
}

export function loadProjectList() {
  return loadFile('projectList', () => ([Values.defaultProject]));
}

export function loadTabList() {
  return loadFile('tabList', () => ({}));
}

export function loadcurrentProject(projectName) {
  return loadFile(`proj-${projectName}`, () => (JSON.parse(Values.emptyProject)));
}

export function loadPreferences() {
  return loadFile('preferences', () => (JSON.parse(Values.defaultPreferences)));
}

export function saveProjectList(projectList) {
  return saveFile('projectList', projectList);
}

export function saveTabList(tabList) {
  return saveFile('tabList', tabList);
}

export function savecurrentProject(projectName, projectNote, resources) {
  return saveFile(`proj-${projectName}`, { projectName, projectNote, resources });
}

export function removeProject(projectName) {
  localStorage.removeItem(`proj-${projectName}`);
}

export function savePreferences(preferences) {
  return saveFile('preferences', preferences);
}

export function saveUserToken(token) {
  localStorage.setItem('token', token);
}

export function removeUserToken() {
  localStorage.removeItem('token');
}
