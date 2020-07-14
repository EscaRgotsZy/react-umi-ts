
// 客户管理

export default [{
  path: '/customer',
  name: '客户管理',
  icon: 'user',
  access: 'CUSTOMER',
  routes: [
    {
      path: '/customer/list',
      name: '客户列表',
      component: './customer/list',
      access: 'CUSTOMERLIST',
    },
    {
      path: '/customer/tag',
      name: '用户标签',
      component: './customer/tag',
      access: 'CUSTOMERTAG',
    },
    {
      path: '/customer/list/:id',
      name: '客户详情',
      component: './customer/list/detail',
      hideInMenu: true,
      exact: true,
      access: 'CUSTOMERDETAIL',
    },
    {
      path: '/customer/list/relative/:id',
      name: '亲属列表',
      component: './customer/list/relative',
      hideInMenu: true,
      exact: true,
      access: 'CUSTOMERRELATIVELIST',
    },
    {
      component: './404',
    },
  ],
}]
