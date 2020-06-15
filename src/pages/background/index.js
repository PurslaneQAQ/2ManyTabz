// import throttle from 'lodash.throttle';
import store from './store';
import { handleUpdateEvent, chrome } from './chrome';

// chrome.tabs.onCreated.addListener(() => { updateTabs(store.dispatch, store.getState()); });
chrome.tabs.onActivated.addListener((info) => { handleUpdateEvent(store.dispatch, store.getState(), { type: 'update', tabId: info.tabId }); }); // Use the same method as update
chrome.tabs.onUpdated.addListener((tabId) => { handleUpdateEvent(store.dispatch, store.getState(), { type: 'update', tabId }); });
chrome.tabs.onRemoved.addListener((tabId) => { handleUpdateEvent(store.dispatch, store.getState(), { type: 'remove', tabId }); });
// setInterval(() => { handleUpdateEvent(store.dispatch, store.getState(), { type: 'refresh' }); }, 12000);
