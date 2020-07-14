
// 早餐管理

export default [{
  path: '/breakfast',
  name: '早餐管理',
  icon: 'clock-circle',
  access:'BREAKFAST',
  routes: [
    {
      path: '/breakfast/order',
      name: '早餐订单',
      component: './breakfast/order',
      access:'BREAKFASTORDER'
    },
    {
      path: '/breakfast/subscribe',
      name: '预约推送',
      component: './breakfast/subscribe',
      access:'BREAKFASTSUBSCRIBE'
    },
    {
      component: './404',
    },
  ],
}]
