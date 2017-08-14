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
        }//,
        // {
        //   path: '/roleacttargetrate',
        //   component: resolve => require(['../components/page/RoleActTargetRate.vue'], resolve) // vue-datasource组件
        // },
        // {
        //   path: '/roleregulardqtarget',
        //   component: resolve => require(['../components/page/RoleRegularDqtarget.vue'], resolve) // Vue-Quill-Editor组件
        // },
        // {
        //   path: '/roleregulardqtargetexamine',
        //   component: resolve => require(['../components/page/RoleRegularDqtargetExamine.vue'], resolve) // Vue-Quill-Editor组件
        // },
        // {
        //   path: '/rolepaymentwithdrawconfig',
        //   component: resolve => require(['../components/page/RolePaymentWithdrawConfig.vue'], resolve) // Vue-Core-Image-Upload组件
        // },
        // {
        //   path: '/rolepaymentorder',
        //   component: resolve => require(['../components/page/RolePaymentOrder.vue'], resolve) // vue-schart组件
        // },
        // {
        //   path: '/rolepaymentordersplit',
        //   component: resolve => require(['../components/page/RolePaymentOrderSplit.vue'], resolve) // 拖拽列表组件
        // }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
  ]
})
