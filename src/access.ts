
const routerDynamic = (initialState: any) => {
  initialState = Array.isArray(initialState) ? initialState :  [];
  let activity = {
    ACTIVITY: initialState.includes('ACTIVITY') || false,
    GROUPPURCHASE: initialState.includes('GROUPPURCHASE') || false,
    // GROUPPURCHASEEDIT: true,
    // NEWGROUPPURCHASE: true,
    LIMITS: initialState.includes('LIMITS') || false,
    // LIMITSDETAIL: true,
    // NEWLIMITS: true,
    PRESALE: initialState.includes('PRESALE') || false,
    // PRESALEDETAIL: true,
    // PRESALEEDIT: true,
    // NEWPRESALE: true,
    ASSEMBLE: initialState.includes('ASSEMBLE') || false,
    // ASSEMBLEDETAIL: true,
    // NEWASSEMBLE: true,
    // ASSEMBLEEDIT: true,
    // ASSEMBLECOPY: true,
    COUPON: initialState.includes('COUPON') || false,
    // COUPONDETAIL: true,
    GIFT: initialState.includes('GIFT') || false,
    // GIFTDETAIL: true,
    // NEWGIFT: true,
    GUARANTEE: initialState.includes('GUARANTEE') || false,
    // GUARANTEENAME: true,
    SERVICEDESCRIPTION: initialState.includes('SERVICEDESCRIPTION') || false,
  }

  let breakfast = {
    BREAKFAST: initialState.includes('BREAKFAST') || false,
    BREAKFASTORDER: initialState.includes('BREAKFASTORDER') || false,
    BREAKFASTSUBSCRIBE: initialState.includes('BREAKFASTSUBSCRIBE') || false,
  }

  let cash = {
    CASH: initialState.includes('CASH') || false,
    CASHRECHARGE: initialState.includes('CASHRECHARGE') || false,
    // RECHARGESETTING: true,
    // RECHARGEDETAIL: true,
    CASHISSUANCE: initialState.includes('CASHISSUANCE') || false,
    // ISSUANCESETTING: true,
    // ISSUANCEDETAIL: true,
    CASHUSAGERECORD: initialState.includes('CASHUSAGERECORD') || false,
    // USAGERECORDSTAFF: true,
    CASHINVOICERECORDS: initialState.includes('CASHINVOICERECORDS') || false,
    // CASHINVOICERECORDSDETAIL: true,
    CASHINVOICESETTINGLIST: initialState.includes('CASHINVOICESETTINGLIST') || false,
    // CASHINVOICESETTINGDETAIL: true,
    // CASHADDINVOICETITLE: true,
  }

  let customer = {
    CUSTOMER: initialState.includes('CUSTOMER') || false,
    CUSTOMERLIST: initialState.includes('CUSTOMERLIST') || false,
    CUSTOMERTAG: initialState.includes('CUSTOMERTAG') || false,
    // CUSTOMERDETAIL: true,
    // CUSTOMERRELATIVELIST: true,
  }

  let deal = {
    DEAL: initialState.includes('DEAL') || false,
    DEALORDER: initialState.includes('DEALORDER') || false,
    // DEALORDERDETAILS: true,
    // DEALORDERLOGISTICS: true,
    // DEALORDERSNAPASHOP: true,
    DEALREFUND: initialState.includes('DEALREFUND') || false,
    // DEALREFUNDDETAILS: true,
  }

  let goods = {
    GOODS: initialState.includes('GOODS') || false,
    GOODSCATE: initialState.includes('GOODSCATE') || false,
    // GOODSPUBLISH: true,
    GOODSSELL: initialState.includes('GOODSSELL') || false,
    GOODSWAREHOUSE: initialState.includes('GOODSWAREHOUSE') || false,
    GOODSCLASSIFY: initialState.includes('GOODSCLASSIFY') || false,
    // NEWGOODSCLASSIFY: true,
    GOODSTAG: initialState.includes('GOODSTAG') || false,
  }

  let logistics = {
    LOGISTICS: initialState.includes('LOGISTICS') || false,
    LOGISTICSFREIGHT: initialState.includes('LOGISTICSFREIGHT') || false,
    // LOGISTICSFREIGHTUSAGE: true,
    // LOGISTICSFREIGHTEDIT: true,
    // LOGISTICSFREIGHTNEW: true,
  }

  let rebate = {
    REBATE: initialState.includes('REBATE') || false,
    REBATEDETAIL: initialState.includes('REBATEDETAIL') || false,
    REBATECASHOUT: initialState.includes('REBATECASHOUT') || false,
    REBATERECORD: initialState.includes('REBATERECORD') || false,
  }

  let receipt = {
    RECEIPT: initialState.includes('RECEIPT') || false,
  }

  let shop = {
    SHOP: initialState.includes('SHOP') || false,
    SHOP_RENOVATION: initialState.includes('SHOP_RENOVATION') || false,
    // SHOP_RENOVATIONNEW: true,
    // SHOP_RENOVATIONADD: true,
    // SHOP_RENOVATIONEDIT: true,
    SHOP_NEW: initialState.includes('SHOP_NEW') || false,
    SHOP_CLASSIFY: initialState.includes('SHOP_CLASSIFY') || false,
    SHOP_AFTERMARKET: initialState.includes('SHOP_AFTERMARKET') || false,
    // SHOP_AFTERMARKETNEW: true,
    // SHOP_AFTERMARKETEDIT: true,
    SHOP_TOPIC: initialState.includes('SHOP_TOPIC') || false,
    // SHOP_TOPICNEW: true,
    // SHOP_TOPICEDIT: true,
    SHOP_ADSENSE: initialState.includes('SHOP_ADSENSE') || false,
    // SHOP_ADSENSEDETAIL: true,
  }

  let staff = {
    STAFF: initialState.includes('STAFF') || false,
    STAFF_LIST: initialState.includes('STAFF_LIST') || false,
    // STAFF_LISTNEW: true,
    // STAFF_LISTEDIT: true,
    STAFF_OCCUPATION: initialState.includes('STAFF_OCCUPATION') || false,
  }
  let system = {
    SYSTEM: initialState.includes('SYSTEM') || false,
    ROLE: initialState.includes('ROLE') || false,
    RESOURCE: initialState.includes('RESOURCE') || false,
  }
  return {
    ...activity,      // 促销管理
    ...breakfast,     // 早餐管理
    ...cash,          // 现金券管理
    ...customer,      // 客户管理
    ...deal,          // 订单管理
    ...goods,         // 商品管理
    ...logistics,     // 物流管理
    ...rebate,        // 团建费管理
    ...receipt,       // 发票管理
    ...shop,          // 店铺管理
    ...staff,         // 员工管理
    ...system,        // 系统管理
  }

};
export default routerDynamic;
