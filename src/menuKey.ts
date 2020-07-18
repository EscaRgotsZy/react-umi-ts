

const routerDynamicMenuKey = {
  // activity  促销管理
  'GROUPPURCHASE': require('./pages/activity/group_purchase'),
  'LIMITS': require('./pages/activity/limits'),
  'PRESALE': require('./pages/activity/pre_sale'),
  'ASSEMBLE': require('./pages/activity/assemble'),
  'COUPON': require('./pages/activity/coupon'),
  'GIFT': require('./pages/activity/gift'),
  'GUARANTEE': require('./pages/activity/guarantee'),
  'SERVICEDESCRIPTION': require('./pages/activity/service_description'),

  // breakfast  早餐管理
  'BREAKFASTORDER': require('./pages/breakfast/order'),
  'BREAKFASTSUBSCRIBE': require('./pages/breakfast/subscribe'),

  //  cash 现金券管理
  'CASHRECHARGE': require('./pages/cash/recharge'),
  'CASHISSUANCE': require('./pages/cash/issuance'),
  'CASHUSAGERECORD': require('./pages/cash/usagerecord'),
  'CASHINVOICERECORDS': require('./pages/cash/invoice_records/invoice_record_list'),
  'CASHINVOICESETTINGLIST': require('./pages/cash/invoice_records/invoice_setting_list'),

  //  customer 客户管理
  'CUSTOMERLIST': require('./pages/customer/list'),
  'CUSTOMERTAG': require('./pages/customer/tag'),

  //  deal 订单管理
  'DEALORDER': require('./pages/deal/order'),
  'DEALREFUND': require('./pages/deal/refund/index'),

  //  goods  商品管理
  'GOODSCATE': require('./pages/goods/publish/cate/index'),
  'GOODSSELL': require('./pages/goods/sell'),
  'GOODSWAREHOUSE': require('./pages/goods/warehouse'),
  'GOODSCLASSIFY': require('./pages/goods/classify/edit'),
  'GOODSTAG': require('./pages/goods/tag'),

  //  logistics  物流管理
  'LOGISTICSFREIGHT': require('./pages/logistics/freight/list'),

  //  rebate 团建费管理
  'REBATEDETAIL': require('./pages/rebate/detail'),
  'REBATECASHOUT': require('./pages/rebate/cash_out'),
  'REBATERECORD': require('./pages/rebate/record'),

  //  shop  店铺管理
  'SHOP_RENOVATION': require('./pages/shop/renovation/list'),
  'SHOP_NEW': require('./pages/shop/new'),
  'SHOP_CLASSIFY': require('./pages/shop/classify'),
  'SHOP_AFTERMARKET': require('./pages/shop/aftermarket'),
  'SHOP_TOPIC': require('./pages/shop/topic'),
  'SHOP_ADSENSE': require('./pages/shop/adsense'),

  //  staff  员工管理
  'STAFF_LIST': require('./pages/staff/list'),
  'STAFF_OCCUPATION': require('./pages/staff/occupation'),

  //  system  系统管理
  'ROLE': require('./pages/system/role/list'),
  'RESOURCE': require('./pages/system/resource/list'),
}

export default routerDynamicMenuKey;
