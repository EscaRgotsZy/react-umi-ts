// 现金券管理
export default [{
    path: '/cash',
    name: '现金券管理',
    icon: 'transaction',
    access:'CASH',
    routes: [
      {
        path: '/cash/recharge',
        name: '现金券充值',
        component: './cash/recharge',
        access:'CASHRECHARGE'
      },
      {
        path: '/cash/recharge/setting',
        name: '充值信息',
        component: './cash/recharge/subpage/setting',
        hideInMenu: true,
        exact: true,
        access:'RECHARGESETTING'
      },
      {
        path: '/cash/recharge/info',
        name: '充值申请详情',
        component: './cash/recharge/subpage/info',
        hideInMenu: true,
        exact: true,
        access:'RECHARGEDETAIL'
      },
      {
        path: '/cash/issuance',
        name: '现金券发放',
        component: './cash/issuance',
        access:'CASHISSUANCE'
      },
      {
        path: '/cash/issuance/setting',
        name: '发放信息',
        component: './cash/issuance/subpage/setting/index',
        hideInMenu: true,
        exact: true,
        access:'ISSUANCESETTING'
      },
      {
        path: '/cash/issuance/info',
        name: '发放详情',
        component: './cash/issuance/subpage/info',
        hideInMenu: true,
        exact: true,
        access:'ISSUANCEDETAIL'
      },
      {
        path: '/cash/usagerecord',
        name: '现金券使用记录',
        component: './cash/usagerecord',
        access:'CASHUSAGERECORD'
      },
      {
        path: '/cash/usagerecord/staff',
        name: '员工使用记录',
        component: './cash/usagerecord/subpage/staff',
        hideInMenu: true,
        exact: true,
        access:'USAGERECORDSTAFF'
      },
      {
        path: '/cash/invoice_records/invoice_record_list',
        name: '发票记录',
        component: './cash/invoice_records/invoice_record_list',
        access:'CASHINVOICERECORDS'
      },
      {
        path: '/cash/invoice_records/invoice_record_detail/:orderNo',
        name: '发票记录详情',
        component: './cash/invoice_records/invoice_record_detail',
        hideInMenu: true,
        exact: true,
        access:'CASHINVOICERECORDSDETAIL'
      },
      {
        path: '/cash/invoice_records/invoice_setting_list',
        name: '开票设置',
        component: './cash/invoice_records/invoice_setting_list',
        hideInMenu: true,
        exact: true,
        access:'CASHINVOICESETTINGLIST'
      },
      {
        path: '/cash/invoice_records/invoice_setting_detail/:id',
        name: '开票设置详情',
        component: './cash/invoice_records/invoice_setting_detail',
        hideInMenu: true,
        exact: true,
        access:'CASHINVOICESETTINGDETAIL'
      },
      {
        path: '/cash/invoice_records/add_invoice_title',
        name: '新增发票抬头',
        component: './cash/invoice_records/add_invoice_title',
        hideInMenu: true,
        exact: true,
        access:'CASHADDINVOICETITLE'
      },
      {
        component: './404',
      },
    ],
  }]
