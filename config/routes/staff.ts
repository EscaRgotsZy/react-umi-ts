
// 员工管理

export default [{
  path: '/staff',
  name: '员工管理',
  icon: 'team',
  access: 'STAFF',
  routes: [
    {
      path: '/staff/list',
      name: '员工列表',
      component: './staff/list',
      access: 'STAFF_LIST',
    },
    {
      path: '/staff/list/add',
      name: '添加员工',
      component: './staff/list/edit',
      hideInMenu: true,
      exact: true,
      access: 'STAFF_LISTNEW',
    },
    {
      path: '/staff/list/:id/edit',
      name: '编辑员工',
      component: './staff/list/edit',
      hideInMenu: true,
      exact: true,
      access: 'STAFF_LISTEDIT',
    },
    {
      path: '/staff/occupation',
      name: '职位管理',
      component: './staff/occupation',
      access: 'STAFF_OCCUPATION',
    },
    {
      component: './404',
    },
  ],
}]
