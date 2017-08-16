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
                let data = {"userMenu":[{"menu":{"autoId":13,"projectId":"5","menuCode":"sys-app-version","menuName":"版本管理","sort":0},"roles":[{"autoId":21,"projectId":"5","roleCode":"ROLE_APP_VERSION","roleName":"版本控制列表","roleAlias":"版本控制列表","roleUrl":"/sys-app-version/sys_app_version_list_page.do","roleClass":"com.jingyuanfinance.web.controller.SysAppVersionController.sysAppVersionListPage","projectName":null,"sort":null},{"autoId":23,"projectId":"5","roleCode":"ROLE_EXAMINE_APP_VERSION","roleName":"版本控制审核列表","roleAlias":"版本控制审核列表","roleUrl":"/sys-app-version/examine_sys_app_version_list_page.do","roleClass":"com.jingyuanfinance.web.controller.SysAppVersionController.examineSysAppVersionListPage","projectName":null,"sort":null}]},{"menu":{"autoId":14,"projectId":"5","menuCode":"announcement","menuName":"公告管理","sort":4},"roles":[{"autoId":20,"projectId":"5","roleCode":"ROLE_ANNOUNCEMENT","roleName":"公告列表","roleAlias":"公告列表","roleUrl":"/announcement/announcement-list-page.do","roleClass":"com.jingyuanfinance.web.controller.AnnouncementMainController.getAnnouncementPage","projectName":null,"sort":null},{"autoId":22,"projectId":"5","roleCode":"ROLE_ANNOUNCEMENT_POSITION","roleName":"公告位配置","roleAlias":"公告位配置","roleUrl":"/announcement/position_list_page.do","roleClass":"com.jingyuanfinance.web.controller.AnnouncementMainController.getAnnouncementPositionPage","projectName":null,"sort":null}]},{"menu":{"autoId":15,"projectId":"5","menuCode":"banner","menuName":"banner图管理","sort":5},"roles":[{"autoId":24,"projectId":"5","roleCode":"ROLE_BANNER","roleName":"banner图列表","roleAlias":"banner图列表","roleUrl":"/banner/banner_list_page.do","roleClass":"com.jingyuanfinance.web.controller.BannerController.getBannerPage","projectName":null,"sort":null},{"autoId":25,"projectId":"5","roleCode":"ROLE_BANNER_POSITION","roleName":"banner图位配置","roleAlias":"banner图位配置","roleUrl":"/banner/position_list_page.do","roleClass":"com.jingyuanfinance.web.controller.BannerController.getBannerPositionPage","projectName":null,"sort":null}]}]};
              this.userMenu = data.userMenu;
            //   this.$axios.get(this.userMenuUrl).then((res) => {
            //     this.userMenu = res.data.userMenu;
            //   })
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
