import { get, post} from '@/common/request';

export interface sellProdParams {
  productName?: string;
  status: number | string;
  outerId?: any;
  page: number;
  size: number;
  sortBy?: string;
}
// 获取上线商品列表
export async function getSellingProd(params: sellProdParams) {
  let [err, data] = await get({ url: `/productManagement/productInfos`, params, showToast: false });
  if (err || !data) return false;
  let { records = [], total } = data;
  return {
    records: Array.isArray(records)?records: [],
    total,
  };
}
// 下线
export async function offlineProd({ productId, status }: any) {
  let [err,data] =  await get({
    url: `/productManagement/updatestatus/${productId}/${status}`,
    showToast: true,
    successToast: false,
  });
  if(err) return false
  return data
}
// 批量下线
export async function batchOnOffLine(params: any) {
  let [err,data]=  await post({
    url: `/products/batchOnOffLine`,
    params,
    showToast: true,
    successToast: false,
  });
  if(err) return false
  return data
}


