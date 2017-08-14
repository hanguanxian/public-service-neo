<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
          <!-- <transition name="move" mode="out-in"><router-view></router-view></transition> -->
          <el-col :span="24" class="content-wrapper">
            <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click='tabToggle'>
              <el-tab-pane
                v-for="(item, index) in editableTabs"
                :label="item.title" :name="item.name" :key="item.name"
              >
              </el-tab-pane>
              <keep-alive>
                   <component :is='currentView'></component>
              </keep-alive>
             </el-tabs>
          </el-col>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import Readme from '../page/Readme.vue';
    import RoleAppVersion from '../page/RoleAppVersion.vue';
    import RoleExamineAppVersion from '../page/RoleExamineAppVersion.vue';
    import RoleAnnouncement from '../page/RoleAnnouncement.vue';
    import RoleAnnouncementPosition from '../page/RoleAnnouncementPosition.vue';
    import RoleBanner from '../page/RoleBanner.vue';
    import RoleBannerPosition from '../page/RoleBannerPosition.vue';
    export default {
        data () {
          	return {

          	};
        },
        computed: {
	        editableTabs() {
	          	return this.$store.state.editableTabs
	        },
	        editableTabsValue() {
	          	return this.$store.state.editableTabsValue
	        },
	        currentView() {
	          	return this.$store.state.currentView
	        }
	    },
        components:{
            'vHead' : vHead,
            'vSidebar' : vSidebar,
            'readme' : Readme,
            'roleappversion':RoleAppVersion,
            'roleexamineappversion' : RoleExamineAppVersion,
            'roleannouncement' : RoleAnnouncement,
            'roleannouncementposition' : RoleAnnouncementPosition,
            'rolebanner' : RoleBanner,
            'rolebannerposition' : RoleBannerPosition
        },
        methods: {
    	    removeTab(targetIndex) {
    	    	var vm = this;
    	    	if(vm.editableTabs.length == 1){//最后一个tab不可删除
    	    		return;
    	    	}

    	        var activeIndex = vm.editableTabsValue;
    	        if (activeIndex === targetIndex) {//若删除的是当前选中的tab,则往后的tab全部index-1,选中状态赋给相邻的tab
    	          	vm.editableTabs.forEach(function(tab,index){
    	          		if (tab.name === targetIndex) {
    	          			vm.$store.dispatch('removeTabs', index);
    	          			for(var i = index; i < vm.editableTabs.length; i++){
				        		vm.editableTabs[i].name = parseInt(vm.editableTabs[i].name) - 1 + "";
    	          			}

    		              	var nextTab = vm.editableTabs[index] || vm.editableTabs[index - 1];
    		              	if (nextTab) {
    		                	activeIndex = nextTab.name;
    		                	vm.$store.dispatch('changeCurrentView', nextTab.path);
    		                	vm.$store.dispatch('changeTabactiveindex', activeIndex);
    		              	}
    		              	return true;
    		            }
    	          	})
    	        }else{////若删除的不是当前选中的tab,则选中tab不变,但选中的tab往后的tab全部index-1
    	        	vm.editableTabs.forEach(function(tab,index){
    	          		if (tab.name === targetIndex) {
    		              	vm.$store.dispatch('removeTabs', index);
    		              	for(var i = index; i < vm.editableTabs.length; i++){
				        		vm.editableTabs[i].name = parseInt(vm.editableTabs[i].name) - 1 + "";
    	          			}

    		              	if(activeIndex >=　 index){
				        		vm.$store.dispatch('changeTabactiveindex', activeIndex - 1);
				        	}

    		              	return true;
    		            }
    	          	})
    	        }
    	    },
    	    tabToggle(tab){
    	    	var vm = this;
    	    	vm.editableTabs.forEach(function(item,index){
    	    		if(item.title == tab.label){
    	    			vm.$store.dispatch('changeTabactiveindex', index);
    	    			vm.$store.dispatch('changeCurrentView', item.path);
    	    		}
    	    	})
    	    }
        }
    }
</script>
<style scoped>
    .content {
        padding: 20px;
    }
    .content .table {
        padding: 10px;
    }
</style>
