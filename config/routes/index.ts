export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/home',
            name: '首页',
            icon: 'home',
            component: './home',
          },
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/company',
            name: '企业信息',
            component: './user/company',
            hideInMenu: true,
            access:'companys'
          },
          ...require('./staff').default,        // 员工管理
          ...require('./customer').default,     // 客户管理
          ...require('./rebate').default,       // 团建费管理
          ...require('./cash').default,         // 现金券管理
          // ...require('./receipt').default,   // 发票管理 - 暂时不要
          ...require('./goods').default,        // 商品管理
          ...require('./deal').default,         // 交易管理
          ...require('./activity').default,     // 促销管理
          ...require('./logistics').default,    // 物流管理
          ...require('./shop').default,         // 店铺管理
          ...require('./breakfast').default,    // 早餐管理
          ...require('./system').default,       // 系统管理
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
