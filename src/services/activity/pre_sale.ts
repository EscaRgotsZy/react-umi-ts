import { get, post } from '@/common/request';
// --------------------------  列表页   ------------------------
// 预售活动列表查询get
export interface preSaleListParams {
  status: string | number, 
  presellName: string,
  productId: string | number,
  page: number;
  size: number;
  sortBy: string;
}
export async function GetPreSaleList(params: preSaleListParams) {
  let [err, data] = await get({ url: `/presellActivity`, params, showToast: false });
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
// 上线get
export async function onLinePresellActivity({ id, status}: any) {
  return await get({ url: `/presellActivity/onLine/${id}/${status}`, showToast: true, successToast: true });
}
//下线get
export async function offLinePresellActivity({ id, status}: any) {
  return await get({ url: `/presellActivity/offLine/${id}/${status}`, showToast: true, successToast: true });
}
//删除get
export async function delPresellActivity({ id, status}: any) {
  return await get({ url: `/presellActivity/${id}/${status}`, showToast: true, successToast: true });
}
// --------------------------  新增页   ------------------------

//查看 /presellActivity{id}   get
export async function watchPreSaleDetail(id: string) {
  let [err, data] = await get({ url: `/presellActivity/${id}`, showToast: true, successToast: false });
  if (err || !data) return false;
  return {
    data,
  };
}
//新增 /presellActivity post
export interface addPreSaleItemParams {
  id: string|number,
  startTime: string|number,
  deliveryTime: string|number,
  endTime: string|number,
  finalPayEndTime: string|number,
  finalPayStartTime: string|number,
  limitUserType: string|number,
  payPrecent: string|number,
  payType: string|number,
  presellName: string,
  presellProductVOList: Array<any>,
  productId: string|number,
  shopId: string|number,
}
export async function AddPreSaleItem(params: addPreSaleItemParams) {
  let [err, data] = await post({ url: `/presellActivity`, params, showToast: true, successToast: true });
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
//编辑   /presellActivity/updatePresell    post
export async function EditPreSaleItem(params: addPreSaleItemParams) {
  let [err, data] = await post({ url: `/presellActivity/updatePresell`, params, showToast: true, successToast: true });
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
//挑选商品列表 get
export interface goodsListParams {
  productName: string,
  productId: string | number,
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