
// 物流管理

export default [{
  path: '/logistics',
  name: '物流管理',
  icon: 'bar-chart',
  access: 'LOGISTICS',
  routes: [
    {
      path: '/logistics/freight',
      name: '运费模板',
      component: './logistics/freight/list',
      access: 'LOGISTICSFREIGHT',
    },
    {
      path: '/logistics/freight/:id/usage',
      name: '运费模板使用情况',
      component: './logistics/freight/usage',
      hideInMenu: true,
      exact: true,
      access: 'LOGISTICSFREIGHTUSAGE',
    },
    {
      path: '/logistics/freight/:id/edit',
      name: '编辑运费模板',
      component: './logistics/freight/edit',
      hideInMenu: true,
      exact: true,
      access: 'LOGISTICSFREIGHTEDIT',
    },
    {
      path: '/logistics/freight/add',
      name: '新增运费模板',
      component: './logistics/freight/edit',
      hideInMenu: true,
      exact: true,
      access: 'LOGISTICSFREIGHTNEW',
    },
    {
      component: './404',
    },
  ],
}]
