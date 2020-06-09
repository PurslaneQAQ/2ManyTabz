# 2 Many Tabz

![Team Photo](other_img/2.png)
[*how?*](https://help.github.com/articles/about-readmes/#relative-links-and-image-paths-in-readme-files)

TODO: short project description, some sample screenshots or mockups

## Work flow and updates
5.19 update( A prototype):
![prototype](other_img/1.png)

5.20 MockUp(UI design)
![UI](other_img/UI_design/1.png)
![UI](other_img/UI_design/2.png)
![UI](other_img/UI_design/3.png)
![UI](other_img/UI_design/4.png)
![UI](other_img/UI_design/5.png)
![UI](other_img/UI_design/6.png)
![UI](other_img/UI_design/7.png)


## Architecture

In this part, we will explain how did our team split things up and collaborate with each other.
![architecture](other_img/3.jpeg)

In general, we have three teams each working on a specific task.

### Team 1: UI team
Members: Katherine Taylor, Yunjin Tong（Jackson Harris）

Responsibility: 
* design popup UI (finished)
* implement the popup interface
* cooperate with the other 2 teams.


### Team 2: Tab management team
Members: Yaorui Zhang, Jialing Wu

Responsibility:
* offer tab management api methods(basically developed from chrome.tabs)
* interact with all the tab changes in the chrome browser
* offer tab information to the server team and UI team
* There are five methods that can be leveraged by the UI and Server teams.

#### Methods we've implemented:
1. list all the tabs information in the browser(this method is offered for the UI team).
2. jump to method: if you click the tab, it will direct to the corresponding tab in the chrome(this method is offered for the UI team)
3. close method: delete tabs you don't want(this method is offered for the UI team)
4. open tab: facilitate the history data to be opened in the chrome browser. In general, The history data are stored in different project folders, each time we want to open one tab, this method can help open the current tab in the chrome browser(this method is for the server team and UI team).
5. open tabs: this method is also for the server team. This method can opens all the tabs in one project folder(this method is for the server team and UI team).

### Team 3: Server team
Members: Nathan Albrinck, Jackson Harris

Responsibility:
* User Auth
* Database
* collaborate with the other teams

### Front-end: 
#### App
* Routing to 3 pages and modals
* A footer to control login status
 (Links to an external site.)TabManager:

#### TabView
* Filter tabs according to title
* Switch between grid view and list view
* Capture and show the screenshot for the grid view
* Click to go to a tab
* Click to close a tab
* Drag a tab to a project

#### PojectList:
* Show project list (projectName + tabName + and n other tabs)
* Show projects with tabs that fulfill the filter as strong
* Switch active project (class : choosen)
* Close all the tabs in the project
* Create a new project (check if the name exists)
* (Links to an external site.)ProjectDetail:

#### ProjectEditor:
* Edit the name and note of a project
* TabView:
* Basicly the same as tab manager (open/close), but can not drag a tab
* Add a tab to current project

#### ResourceView:
* Add all opened tabs in the project to resource
* Filter: select box + input, filter by tab or title
* OpenAll: open all the tabs that fits the filter
* Open one tab: by clicking a resource
* Update the resource: when the title and icon of the resource * doesn't match the tab with same url
* Resource: Display the title and tags of a resource
* Click the down button to show detail of the resource and edit the tags
* Bluring event would upload the change of the tags
* Delete the resource

#### Delete Project:
* Delete project and go back to tab manager if succeed

#### Modal
  Recently we have a synchronize modal, a dialog modal and an error modal
  What works:
  * Click the background to close the modal and go back
  
  ##### Synchronize modal
    * To switch the synchronize status
    * When synchronize is choosen, wait for synchronizing

### Store
* For the front end, data is stored in the background
* Pop up page use actions (redux for chrome would send them as messages) to change data in store 
* Several listeners are added to listen to tab update/ activate / remove events
* Since direct communication (through stringified js objects, could not convey functions) can not handle promises or handle error, we use aliases to conduct actions in background pages
* Data in store:
```js
const initialState = {
  tabs: {
    tabList: {}, 
    activeTab: -1,
    activeWindow: -1,
    movingTab: null,
  },
  projects: {
    projectList: loadProjectList(), // An array of projects, Load from local storage
    currentProject: JSON.parse(Values.emptyProject), // { projectName: '', projectNote: '', resources: {} },
    activeProj: Values.defaultProject,
    error: '',
    synchronizing: 0, 
  },
  preferences: loadPreferences(), 
  // displayType: 0 -> ListView, 1 -> GridView
  // synchronize: -1 -> unknown, 0 -> don't synchronize, 1 -> synchronize
  auth: {
    authenticated: false,
    userName: '', 
    error: '',
  },  
};
```
A listener is added to store. If the state of store has been changed, write the new preferences to local storage. If has been logged in and not using synchronize, would not update project info, otherwise write the new project list and new current project

### Communicate with Backend

* Methods are defined in src/modules/ajax.js
* Methods are called from src/background/aliases4project;  
  Could refer to local methods for inspiration!
     
### Back-end: 

 * Tab Model
     * Opened At  
     // 'Open at' time of a tab is not provided by chrome.tabs, so PLZ get rid of it for now!  
     * URL
     * Name
     * Tags 
     * Custom Notes  
     // Don't have this info, and maybe not necessary? 
 * Project/Folder Model
     * Name
     * List of tabs
     * Custom Notes
 * User model?
     * Definitely don't want on front-end, should be able to derive info from computer/browser..

TODO:  descriptions of code organization and tools and libraries used

## Setup
Because this is an extension, prior to publication on the Chrome webstore, users need to do a teeny bit of work to view the extension for themselves (as opposed to having an already-hosted web application).
* First, make sure to clone this repo with `git clone https://github.com/dartmouth-cs52-20S/project-2-many-tabz.git` in a directory of your choice. 
* Next, simply fire up Chrome and navigate to [chrome://extensions/](chrome://extensions/). 
* Ensure Developer Mode is activated (click the radio button at the top right of this page).
<!-- * Click the Load Unpacked button, and select the /src folder of this github repository. -->
<!-- Then We'll do something different to use react！  -->
* Enter the project-2-many-tabs folder, do yarn install.
* Do yarn build (if you are using Windows system, do yarn winbuild)
* Click the Load Unpacked button, and select the /dist folder of this github repository.
<!-- Then the same -->
* Turn on the extension by clicking the blue radio button at the bottom right corner of the extension box.
* Click the refresh icon on the extension box anytime you pull a new update from this repository. Turn on the extension by clicking the blue radio button at the bottom right corner of the extension box.
* Click the refresh icon on the extension box anytime you pull a new update from this repository.

## Deployment
Once you've finished the above, just click the new 2ManyTabs icon in your chrome window to pull up our beauiful UI and interact with the app!


## Screenshots
![communication among 3 parts](other_img/communication_for_3_parts.png)

## GIFs

### login and synchronize
![login and synchronize](other_img/login_and_synchronize.gif)

### Add All Tabs
![Add All Tabs](other_img/addAllTabs.gif)

### Switch Views
![Switch Views](other_img/switchViews.gif)

## Authors
* Yaorui Zhang
* Jialing Wu
* Katherine Taylor
* Jackson Harris
* Nathan Albrinck
* Yunjin Tong
  
## Acknowledgments


### References:

Redux for Chrome Extensions:
https://thoughtbot.com/blog/redux-for-chrome-extensions
(Super useful!!)
