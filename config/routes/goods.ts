
// 商品管理

export default [{
  path: '/goods',
  name: '商品管理',
  icon: 'gift',
  access: 'GOODS',
  routes: [
    {
      path: '/goods/cate',
      name: '商品发布',
      component: './goods/publish/cate/index',
      access: 'GOODSCATE',
    },
    {
      path: '/goods/cate/publish',
      name: '商品信息',
      hideInMenu: true,
      component: './goods/publish/index',
      access: 'GOODSPUBLISH',
    },
    {
      path: '/goods/sell',
      name: '商品出售',
      component: './goods/sell',
      access: 'GOODSSELL',
    },
    {
      path: '/goods/warehouse',
      name: '商品仓库',
      component: './goods/warehouse',
      access: 'GOODSWAREHOUSE',
    },
    {
      path: '/goods/classify/edit',
      name: '分类导航',
      component: './goods/classify/edit',
      access: 'GOODSCLASSIFY',
    },
    {
      path: '/goods/classify/add',
      name: '分类导航',
      component: './goods/classify/add',
      hideInMenu: true,
      exact: true,
      access: 'NEWGOODSCLASSIFY',
    },
    {
      path: '/goods/tag',
      name: '商品标签',
      component: './goods/tag',
      access: 'GOODSTAG',
    },
    {
      component: './404',
    },
  ],
}]
