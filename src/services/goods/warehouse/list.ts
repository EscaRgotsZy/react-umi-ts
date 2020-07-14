import { get, put, post } from '@/common/request';
import config from '@/config/index';
export interface sellProdParams {
  productName?: string;
  status: number | string;
  outerId?: any;
  page: number;
  size: number;
  sortBy: string;
}
// 获取上线商品列表
export async function getSellingProd(params: sellProdParams) {
  let [err, data] = await get({ url: `/productManagement/productInfos`, params, showToast: false });
  if (err || !data) return false;
  let { records = [], total } = data;
  return {
    records,
    total,
  };
}
// 上线
export async function editOnLine({ productId, status }: any) {
  return await get({
    url: `/productManagement/updatestatus/${productId}/${status}`,
    showToast: true,
    successToast: true,
  });
}
// 删除
export async function deleteDustbin({ productId }: any) {
  return await put({
    url: `/productManagement/product/deleteDustbin/${productId}`,
    showToast: true,
    successToast: true,
  });
}
// 批量上线
export async function batchOnOffLine(params: any) {
  let [err,data] =  await post({
    url: `/products/batchOnOffLine`,
    params,
    showToast: true,
    successToast: false,
  });
  if(err) return false
  return true
}
//获取所有标签
export interface allTagListParams {
  name: string,
  groupId: string | number,
}
export async function getAllTagList() {//后期需要条件搜索时再加 allTagListParams
  let [err, data] = await get({ url: `/product-tags/chooseProductTags`})
  if (err || !data) return {
    data: []
  }
  return {
    data: Array.isArray(data) ? data : [],
  };
}
// 批量打标
export interface batchParams{
  productId: Array<any>;
  tagNames: Array<any>;
}
export async function commitBatchTag(params:batchParams) {
  return await post({ url: `/product-tags/batch`, params, showToast: false, successToast: false })
}
