import { get, put, post, del } from '@/common/request';
// --------------------------  列表页   ------------------------
// 赠品列表查询get   /giftActives
export interface getGiftsActivityParams {
  page: number;
  size: number;
  status: string | number, 
  productId: string | number,
  productName: string,
  sortBy: string;
}
export async function getGiftsActivityList(params: getGiftsActivityParams) {
  let [err, data] = await get({ url: `/giftActives`, params, showToast: false });
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
export async function onLineGiftsActivity(id:number) {
  return await put({ url: `/giftActives/${id}`, showToast: true, successToast: true });
}
//下线   del
export async function offLineGiftsActivity(id: number) {
  return await del({ url: `/giftActives/${id}`, showToast: true, successToast: true });
}
// --------------------------  详情页   ------------------------/giftActives/{id}
// 查询赠品详情 GET /giftActives
export async function getGiftsInfo ( id: any ){
  let [err, data] = await get({ url: `/giftActives/${id}`, showToast: false, successToast: false });
  if (err || !data) return false;
  return {
    data,
  };
} 

//查询上线商品 /products/giftProducts
export async function getOnlineGoods ( productId: any ){
  let [err, data] = await get({ url: `/products/giftProducts?productId=${productId}`, showToast: false, successToast: false });
  if (err || !data) return false;
  return {
    data,
  };
} 

//查询该店铺未参与赠品活动的上线商品  /products/notJoinProducts
export interface getNotJoinProductsParams {
  productId: string | number,
  productName: string,
  page: number,
  size: number
}
export async function getNotJoinProducts(params: getNotJoinProductsParams) {
  let [err, data] = await get({ url: `/products/notJoinProducts`, params, showToast: false });
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

//查询赠品列表 /products/giftProducts
export interface getGiftsListParams {
  productId: string | number,
  productName: string,
  page: number,
  size: number
}
export async function getGiftsList ( params: getGiftsListParams ){
  let [err, data] = await get({ url: `/products/giftProducts`, params, showToast: false, successToast: false });
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

//新增  /giftActives 
export interface addGiftsActivityParams {
  productId: number,
  productName: string,
  endTimeStr: string,
  startTimeStr: string,
  // status: number,
  fullValue: number,
  giftActivityProducts: Array<any>,
}
export async function addGiftsActivity(params: addGiftsActivityParams) {
  return await post({ url: `/giftActives `, params, showToast: true, successToast: true });
}