import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/readme',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [{
          path: '/',
          component: resolve => require(['../components/page/Readme.vue'], resolve)
        },
        {
          path: '/roleappversion',
          component: resolve => require(['../components/page/RoleAppVersion.vue'], resolve)
        },
        {
          path: '/roleexamineappversion',
          component: resolve => require(['../components/page/RoleExamineAppVersion.vue'], resolve)
        },{
          path: '/roleannouncement',
          component: resolve => require(['../components/page/RoleAnnouncement.vue'], resolve)
        },{
           path: '/roleannouncementposition',
           component: resolve => require(['../components/page/RoleAnnouncementPosition.vue'], resolve) // Vue-Quill-Editor组件
        },{
           path: '/rolebanner',
           component: resolve => require(['../components/page/RoleBanner.vue'], resolve) // Vue-Quill-Editor组件
         },{
           path: '/rolebannerposition',
           component: resolve => require(['../components/page/RoleBannerPosition.vue'], resolve) // Vue-Core-Image-Upload组件
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
  ]
})
