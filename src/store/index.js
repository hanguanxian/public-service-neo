import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
    editableTabs: [{
      	title: '主页',
      	name: '0',
      	path: 'readme'
    }],
    editableTabsValue : '0',
    currentView : 'readme'
};

export default new Vuex.Store({
	  state,
  	mutations,
  	actions
})
