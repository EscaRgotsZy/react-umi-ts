
// 交易管理

export default [{
  path: '/deal',
  name: '交易管理',
  icon: 'transaction',
  access: 'DEAL',
  routes: [
    {
      path: '/deal/order',
      name: '订单管理',
      component: './deal/order',
      access: 'DEALORDER',

    },
    {
      path: '/deal/order/details',
      name: '订单详情',
      component: './deal/order/subpage/detail',
      hideInMenu: true,
      exact: true,
      access: 'DEALORDERDETAILS',

    },
    {
      path: '/deal/order/logistics',
      name: '物流追踪',
      component: './deal/order/subpage/logistics',
      hideInMenu: true,
      exact: true,
      access: 'DEALORDERLOGISTICS',

    },
    {
      path: '/deals/order/snapshop',
      name: '交易快照',
      component: './deal/order/subpage/snapshop',
      hideInMenu: true,
      exact: true,
      access: 'DEALORDERSNAPASHOP',

    },
    {
      path: '/deal/refund',
      name: '退货/退款',
      component: './deal/refund/index.tsx',
      access: 'DEALREFUND',

    },
    {
      path: '/deal/refund_details',
      name: '退款详情',
      component: './deal/refund/subpage/info',
      hideInMenu: true,
      exact: true,
      access: 'DEALREFUNDDETAILS',

    },
    {
      component: './404',
    },
  ],
}]
