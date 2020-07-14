
// 促销管理

export default [{
  path: '/activity',
  name: '促销管理',
  icon: 'clock-circle',
  access:'ACTIVITY',

  routes: [
    {
      path: '/activity/group_purchase',
      name: '团购活动',
      component: './activity/group_purchase',
      access:'GROUPPURCHASE'
    },
    {
      path: '/activity/group_purchase/:id/edit',
      name: '编辑团购活动',
      component: './activity/group_purchase/edit',
      hideInMenu: true,
      exact: true,
      access:'GROUPPURCHASEEDIT'
    },
    {
      path: '/activity/group_purchase/add',
      name: '新建团购活动',
      component: './activity/group_purchase/edit',
      hideInMenu: true,
      exact: true,
      access:'NEWGROUPPURCHASE'
    },


    {
      path: '/activity/limits',
      name: '商品限购',
      component: './activity/limits',
      access:'LIMITS'
    },
    {
      path: '/activity/limits/:id/add_limits',
      name: '查看限购详情',
      component: './activity/limits/add_limits',
      hideInMenu: true,
      exact: true,
      access:'LIMITSDETAIL'

    },
    {
      path: '/activity/limits/add_limits',
      name: '添加商品限购',
      component: './activity/limits/add_limits',
      hideInMenu: true,
      exact: true,
      access:'NEWLIMITS'
    },
    {
      path: '/activity/pre_sale',
      name: '预售活动',
      component: './activity/pre_sale',
      access:'PRESALE'
    },
    {
      path: '/activity/pre_sale/:id/preSale_add/:type',
      name: '查看预售活动详情',
      component: './activity/pre_sale/preSale_add',
      hideInMenu: true,
      exact: true,
      access:'PRESALEDETAIL'
    },
    {
      path: '/activity/pre_sale/:id/preSale_add/:type',
      name: '编辑预售活动',
      component: './activity/pre_sale/preSale_add',
      hideInMenu: true,
      exact: true,
      access:'PRESALEEDIT'
    },
    {
      path: '/activity/pre_sale/preSale_add',
      name: '添加预售活动',
      component: './activity/pre_sale/preSale_add',
      hideInMenu: true,
      exact: true,
      access:'NEWPRESALE'
    },
    {
      path: '/activity/assemble',
      name: '拼团活动',
      component: './activity/assemble',
      access:'ASSEMBLE'
    },
    {
      path: '/activity/assemble/:id/add_assemble/:type',
      name: '查看拼团活动详情',
      component: './activity/assemble/add_assemble',
      hideInMenu: true,
      exact: true,
      access:'ASSEMBLEDETAIL'
    },
    {
      path: '/activity/assemble/add_assemble',
      name: '添加拼团活动',
      component: './activity/assemble/add_assemble',
      hideInMenu: true,
      exact: true,
      access:'NEWASSEMBLE'
    },
    {
      path: `/activity/assemble/:id/:productStatus/add_assemble/:type`,
      name: '编辑拼团活动',
      component: './activity/assemble/add_assemble',
      hideInMenu: true,
      exact: true,
      access:'ASSEMBLEEDIT'
    },
    {
      path: '/activity/assemble/:id/:productStatus/:currentTab/add_assemble/:type',
      name: '复制拼团活动',
      component: './activity/assemble/add_assemble',
      hideInMenu: true,
      exact: true,
      access:'ASSEMBLECOPY'
    },
    {
      path: '/activity/coupon',
      name: '优惠券管理',
      component: './activity/coupon',
      access:'COUPON'
    },
    {
      path: '/activity/coupon/couponDetail/:id',
      name: '优惠券详情',
      component: './activity/coupon/coupon_detail',
      hideInMenu: true,
      exact: true,
      access:'COUPONDETAIL'

    },
    {
      path: '/activity/gift',
      name: '赠品管理',
      component: './activity/gift',
      access:'GIFT'
    },
    {
      path: '/activity/gift/:id/add_gifts',
      name: '赠品详情',
      component: './activity/gift/add_gifts',
      hideInMenu: true,
      exact: true,
      access:'GIFTDETAIL'
    },
    {
      path: '/activity/gift/add_gifts',
      name: '新增赠品活动',
      component: './activity/gift/add_gifts',
      hideInMenu: true,
      exact: true,
      access:'NEWGIFT'
    },
    {
      path: '/activity/guarantee',
      name: '保障服务项目',
      component: './activity/guarantee',
      access:'GUARANTEE'
    },
    {
      path: '/activity/guarantee_name',
      name: '保障名称',
      component: './activity/guarantee/guarantee_name',
      hideInMenu: true,
      exact: true,
      access:'GUARANTEENAME'
    },
    {
      path: '/activity/service_description',
      name: '服务说明配置',
      component: './activity/service_description',
      access:'SERVICEDESCRIPTION'
    },
    {
      component: './404',
    },
  ],
}]
