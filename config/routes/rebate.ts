
// 团建费管理

export default [{
  path: '/rebate',
  name: '团建费管理',
  icon: 'money-collect',
  access: 'REBATE',
  routes: [
    {
      path: '/rebate/detail',
      name: '团建费明细',
      component: './rebate/detail',
      access: 'REBATEDETAIL',
    },
    {
      path: '/rebate/cash_out',
      name: '提现记录',
      component: './rebate/cash_out',
      access: 'REBATECASHOUT',
    },
    {
      path: '/rebate/record',
      name: '团建费记录',
      component: './rebate/record',
      access: 'REBATERECORD',
    },
    {
      component: './404',
    },
  ],
}]
