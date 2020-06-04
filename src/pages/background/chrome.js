import ActionTypes from '../../shared/actionTypes';

// eslint-disable-next-line no-undef
const _chrome = chrome;

function chromeError(dispatch, error) {
  console.log(error);
  return dispatch({
    type: ActionTypes.CHROME_ERROR,
    error: error.toString(),
  });
}

// Reference: https://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas
// https://dev.to/tchan/web-automation-using-puppeteer-inside-a-chrome-extension-318o

function captureTab(callback) {
  try {
    _chrome.tabs.captureVisibleTab((imgUrl) => {
      if (!imgUrl) {
        callback();
        return;
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // set its dimension to target size
      canvas.width = 108;
      canvas.height = (canvas.width / 4) * 3;
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        const h = canvas.height;
        const w = (img.width * h) / img.height;
        ctx.drawImage(img, ((h * 4) / 3 - w) / 2, 0, w, h);
        // encode image to data-uri with base64 version of compressed image
        callback(canvas.toDataURL());
      };
      img.onerror = () => {
        console.log(`Error loading img ${imgUrl}`);
        callback();
      };
    });
  } catch (error) {
    console.log(error);
    callback();
  }
}

function updateTab(prevTab, tab, activeProj, projectList, projectMap) {
  const noChange = (prevTab
    && (projectMap ? projectMap[prevTab.project] : projectList.includes(prevTab.project))
    && (prevTab.url === tab.url));
  const project = noChange ? prevTab.project : activeProj;
  const screenshot = noChange ? prevTab.screenshot : null;
  return {
    icon: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    id: tab.id,
    project,
    screenshot,
  };
}

function handleUpdateEvent(dispatch, prevState, listenerMessage) {
  if (listenerMessage) { // method is called by listener, don't need to fetch all tabs
    const { type, tabId } = listenerMessage;
    const { tabList } = prevState.tabs;
    const tabWinList = {};
    switch (type) {
      case 'update':
        _chrome.tabs.get(tabId, (tab) => {
          const { projectList, activeProj } = prevState.projects;
          if (!tabList[tab.windowId])tabList[tab.windowId] = {};
          tabList[tab.windowId][tab.id] = updateTab(tabList[tab.windowId][tab.id], tab, activeProj, projectList);
          if (tab.active === true && tab.status === 'complete') { // Only capture when the active tab has been loaded
            captureTab((screenshot) => {
              tabList[tab.windowId][tab.id].screenshot = screenshot;
              dispatch({
                type: ActionTypes.GET_TABS_FULLFILLED,
                tabs: { tabList, activeTab: tab.id },
              });
            });
          } else {
            dispatch({
              type: ActionTypes.TABS_UPDATED,
              tabs: { tabList },
            });
          }
        });
        return;
      case 'remove':
        for (const window of Object.keys(tabList)) {
          if (tabList[window][tabId]) {
            Object.keys(tabList[window]).forEach((id) => {
              if (id !== `${tabId}`) { tabWinList[id] = tabList[window][id]; }
            });
            tabList[window] = tabWinList;
            break;
          }
        }
        dispatch({
          type: ActionTypes.TABS_REMOVED,
          tabs: { tabList },
          removed: tabId,
        });
        return;
      default:
        handleUpdateEvent(dispatch, prevState, null);
    }
  }
}

function updateTabs(dispatch, prevState, _activeProj) {
  const { projectList } = prevState.projects;
  try {
    const { tabList } = prevState.tabs;
    const activeProj = _activeProj || prevState.projects.activeProj;
    let activeTab = -1;
    _chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const activeWindow = tabs.length ? tabs[0].windowId : -1;
      const prevTabs = tabList[activeWindow] || {};
      tabList[activeWindow] = {};
      activeTab = -1; // check active tab
      let activeTabStatus = '';
      const projectMap = {};
      projectList.forEach((projectName) => {
        projectMap[projectName] = 1;
      });
      tabs.forEach((tab) => {
        if (tab.active) {
          activeTab = tab.id;
          activeTabStatus = tab.status;
        }
        tabList[activeWindow][tab.id] = updateTab(prevTabs[tab.id], tab, activeProj, projectList, projectMap);
      });
      if (activeTab !== -1 && activeTabStatus === 'complete') { // Only capture when the active tab has been loaded
        captureTab((screenshot) => {
          tabList[activeWindow][activeTab].screenshot = screenshot;
          dispatch({
            type: ActionTypes.GET_TABS_FULLFILLED,
            tabs: {
              tabList, activeTab, activeWindow,
            },
          });
        });
      } else {
        dispatch({
          type: ActionTypes.GET_TABS_FULLFILLED,
          tabs: {
            tabList, activeTab, activeWindow,
          },
        });
      }
    });
  } catch (error) {
    chromeError(dispatch, error);
  }
}

export {
  chromeError,
  updateTabs,
  handleUpdateEvent,
  _chrome as chrome,
};
