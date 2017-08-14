import * as types from './mutation-types'

export default {
  [types.ADD_TABS] (state, tab) {
    state.editableTabs.push(
      Object.assign(tab)
    )
  },
  [types.REMOVE_TABS] (state, index) {
    state.editableTabs.splice(index,1);
  },
  [types.CHANGE_TABACTIVEINDEX] (state, index) {
    state.editableTabsValue = index + ''
  },
  [types.CHANGE_CURRENTVIEW] (state, path) {
    state.currentView = path
  },
};