import { get, put, post } from '@/common/request';
// --------------------------  列表页   ------------------------
// 拼团活动列表查询get
export interface assembleListParams {
  page: number;
  size: number;
  status: string | number, 
  productId: string | number,
  mergeName: string,
  mergeType: string | number,
  limitType: string | number,
  limitUserType: string | number,
  sortBy: string;
}
export async function GetAssembleList(params: assembleListParams) {
  let [err, data] = await get({ url: `/mergeGroup`, params, showToast: false });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
// 上线   PUT
export async function onLineAssemble({ id, status}: any) {
  return await put({ url: `/admin/mergeGroup/onLine/${id}/${status}`, showToast: true, successToast: true });
}
//下线/删除   PUT
export async function offOrDelAssemble({ id, status}: any) {
  return await put({ url: `/admin/mergeGroup/updateStatus/${id}/${status}`, showToast: true, successToast: true });
}

// --------------------新增编辑页
// 查询拼团详情 GET 
export async function getAssembleInfo ( mergeId: string |number ){
  let [err, data] = await get({ url: `/mergeGroup/addUser/list?mergeId=${mergeId}`, showToast: true, successToast: false });
  if (err || !data) return false;
  return {
    data,
  };
} 
//挑选商品列表 get
export interface goodsListParams {
  productName: string,
  productId: string | number,
  outerId: string | number,
  page: number;
  size: number;
}
export async function getGoodsList(params:goodsListParams) {
  let [err, data] = await get({ url: `/s/mergeGroupActivity/selAllProd`, params, showToast: true, });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
//商品单品sku列表  get
export async function getGoodsSkuList({prodIds}:any) {
  let [err, data] = await get({ url: `/s/mergeGroupActivity/getProdToSku?prodIds=${prodIds}`, showToast: true, });
  if (err || !data)
    return {
      data: [],
    };
  return {
    data: Array.isArray(data) ? data : [],
  };
} 
//挑选赠品列表 get
export interface giftsListParams {
  productName: string,
  productId: string | number,
  page: number;
  size: number;
}
export async function getGiftsList(params:giftsListParams) {
  let [err, data] = await get({ url: `/products/giftProducts`, params, showToast: true, });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
//赠品单品sku列表  get
export async function getGiftsSkuList(prodIds:any) {
  let [err, data] = await get({ url: `/productSkus/${prodIds}`, showToast: true, });
  if (err || !data)
    return {
      data: [],
    };
  return {
    data: Array.isArray(data) ? data : [],
  };
} 
//挑选优惠券 get
export interface CouponListParams {
  page: number,
  size: number,
  productId: string | number,
  couponName: string,
  offPrice: number | string,
  startTimeStr: string | number,
  endTimeStr: string | number,
}
export async function getCouponsList(params:CouponListParams){
  let [err,data] = await get ({url:`/s/mergeGroupActivity/selCoupon`, params, showToast: true, successToast: false}) ;
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
//新增/编辑
export interface addAssembleParams {
  id: number | string,
  productId: number | string,
  giftNum: number | string,
  startTime: string,
  endTime: string,
  countDown: number,
  mergeName: string,
  peopleNumber: number | string,
  limitUserType: number | string,
  limitType: number | string,
  dtoList: Array<any>,
  isManySku: boolean,
  mergeCouponRelBOS: Array<any>,
  mergeGiftRelBOS: Array<any>,
  mergeType: number | string,
  limitNumber: number | string,
  limitDateType: number | string,
}
//新增
export async function addAssembleItem(params: addAssembleParams) {
  return await post({ url: `/s/mergeGroupActivity/saveCommit`, params, showToast: true, successToast: true });
}
//编辑
export async function editAssembleItem(params: addAssembleParams) {
  return await post({ url: `/s/mergeGroupActivity/updateMergeGroup`, params, showToast: true, successToast: true });
}