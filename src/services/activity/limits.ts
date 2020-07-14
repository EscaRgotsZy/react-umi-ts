import { get, post } from '@/common/request';
//-----------列表页

// 商品限购列表查询
export interface limitsParams {
  status: string | number, 
  productId: string | number,
  limitType: string | number,
  limitUserType: string | number,
  page: number;
  size: number;
  sortBy: string;
}
export async function GetLimitsList(params: limitsParams) {
  let [err, data] = await get({ url: `/marketingRules`, params, showToast: false });
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

// 上线/下线/删除
export async function UpdateLimitsItem({ limitsId, status}: any) {
  return await get({ url: `/marketingRules/update/${limitsId}/${status}`, showToast: true, successToast: true });
} 
// 查询商品限购详情
export async function watchLimitsItemDetail(limitsId: string) {
  let [err, data] = await get({ url: `/marketingRules/${limitsId}`, showToast: true, successToast: false });
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
  status: string | number,
  page: number;
  size: number;
}
export async function getGoodsList(params:goodsListParams) {
  let [err, data] = await get({ url: `/marketingRules/select/product`, params, showToast: true, });
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
//商品单品sku列表
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
//新增post
export interface addLimitsItemParams {
  limitType: number | string;         //公共参数
  limitUserType: number | string;     //公共参数
  productId: number | string;         //公共参数
  marketingProductForms: Array<any>;  //公共参数
  isManySku: number | string;         //多sku
  limitNumber: number | string;       //多sku
}
export async function addLimitsItem(params: addLimitsItemParams){
  return await post({url: `/marketingRules`, params, showToast: true, successToast: true })
}

