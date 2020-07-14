import { get, post, put} from '@/common/request';
//列表页
export interface couponListParams {
  sortBy: string,
  couponName: string,
  status: string | number,
  page: number,
  size: number,
}
export async function getCouponList(params: couponListParams){
  let [err, data] = await get({ url:`/coupons`, params, showToast:false, successToast: false })
  if(err || !data) return {
    total:0,
    data:[]
  }
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
// 上线/下线
export async function UpdateCouponItem({ id, status}: any) {
  return await put({ url: `/coupons/${id}/${status}`, showToast: true, successToast: true });
} 
// 查询优惠券详情 /coupons/couponInfo/
export async function CouponItemDetail(id: string) {
  let [err, data] = await get({ url: `/coupons/couponInfo/${id}`, showToast: false, successToast: false });
  if (err || !data) return false;
  return {
    data,
  };
}
//获取关联用户信息   
export async function userCouponList(id: string){
  let [err, data] = await get({url:`/coupons/userCouponInfo/${id}`, showToast: false, successToast: false})
  if(err || !data) return {
    total:0,
    data:[]
  }
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}

//查询商品  
export interface goodsListParams{
  productName: string,
  page: number,
  size: number,
}
//
export async function getGoodsList(params: goodsListParams){
  let [err,data] = await get({ url:`/products/giftProducts`, params, showToast: false, successToast: false})
  if(err || !data) return {
    total: 0,
    data: []
  };
  let { total, records = [] }= data;
  return {
    total: total,
    records: Array.isArray(records) ? records : []
  }

}

//新增优惠券
export interface addCouponItemParams{
  couponName: string,//优惠券名称 
  startTimeStr: string, //开始时间
  endTimeStr: string, //结束时间
  couponType: string | number,
  offPrice: string | number,// 面额
  fullPrice: string | number,// 满多少
  couponNumber: string | number,// 可发放数量
  getLimit: string | number,// 每人限制领取
  description: string,// 说明
  prodIdList:any,// 商品列表 String
}
export async function addCouponItem(params:addCouponItemParams){
  return await post({url:`/coupons`, params, showToast: true, successToast: true})
}