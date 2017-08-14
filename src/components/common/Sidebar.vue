<template>
    <div class="sidebar">

        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened  @select="handleSelect">
            <template v-for="item in userMenu">
                <template v-if="item.roles">
                    <el-submenu :index="item.menu.menuCode" >
                        <template slot="title"><i class="fa fa-bars"></i>{{ item.menu.menuName }}</template>

                        <el-menu-item v-for="(subItem,i) in item.roles" :key="i" :route="subItem" :index="subItem.roleCode">
                            <i class="menu-icon fa fa-caret-right"></i>{{ subItem.roleName }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <!-- <template v-else>
                    <el-menu-item index="item.menu.autoId">
                        {{ item.menu.roleName }}
                    </el-menu-item>
                </template> -->
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userMenuUrl: '../../../static/userMenu.json',//列表页面
                userMenu: []
            }
        },
        created(){
            this.getData();
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            },
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
        methods: {
            getData() {
              this.$axios.get(this.userMenuUrl).then((res) => {
                this.userMenu = res.data.userMenu;
              })
            },
        	handleSelect(key, keyPath,selectComponent) {
        		var vm = this;
        		var path;
    	    	if(keyPath.length >=2){
    	    		path = keyPath[1];
    	    	}else{
    	    		path = keyPath[0];
    	    	}
                path = path.toLowerCase().replace(/\_/g, '');
    	    	var tabsLength = vm.editableTabs.length;
    	    	const editableTab = {
			      	title: selectComponent.route.roleName,
			      	name: tabsLength+'',
			      	path: path
    	    	}

    	    	var addNewTab = true;

    	    	vm.editableTabs.forEach(function(tab,index){
	          		if (tab.path === path) {
	          			vm.$store.dispatch('changeTabactiveindex', index);
	          			vm.$store.dispatch('changeCurrentView', tab.path);
	          			addNewTab = false;
	          			return true;
		            }
	          	})

    	    	if(addNewTab){
    	    		vm.$store.dispatch('addTabs', editableTab);
	    	    	vm.$store.dispatch('changeTabactiveindex', tabsLength);
	    	    	vm.$store.dispatch('changeCurrentView', path);
    	    	}
    	    }
        }
    }
</script>

<style scoped>
    .fa {
      margin-right: 10px;
    }
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 60px;
        bottom:0;
    }
    .sidebar > ul {
        height:100%;
        background-color: #F2F2F2;
    }
    .el-menu .el-menu-item {
        border-top: 1px solid #E5E5E5;
        border-right: 1px solid #F2F2F2;
        color: #585858;
        background-color: #fffdfd;
    }
    .el-menu .el-menu-item.is-active {
        background-color: #fff;
    }
    .el-menu>li.el-submenu {
        list-style: none;
        border-bottom: 1px solid #E5E5E5;
    }
    .el-menu-item, .el-submenu__title {

    }
</style>
