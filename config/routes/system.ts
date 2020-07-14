
// 系统管理


// 员工管理

export default [{
  path: '/system',
  name: '系统管理',
  icon: 'setting',
  access: 'SYSTEM',
  routes: [
    {
      path: '/system/role',
      name: '角色管理',
      component: './system/role/list',
      access: 'ROLE'
    },
    {
      path: '/system/resource',
      name: '菜单管理',
      component: './system/resource/list',
      access: 'RESOURCE'
    },
    {
      component: './404',
    },
  ],
}]
