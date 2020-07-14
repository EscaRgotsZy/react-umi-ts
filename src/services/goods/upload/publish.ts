import { get, put, post } from '@/common/request';
// 获取商品详情
export async function findProductDetail(productId:string | number) {
    let [err, data] = await get({ url: `/products/findProductDetail/${productId}`,});
    if (err || !data) return {};
    return {
        data
    }
}

//商品属性应用
export async function getApplyProperty(params:any) {
  let [err, data] = await get({ url: `/productManagement/applyProperty`,params});
  if (err || !data) return {};
  return {
      data
  }
}
 //  保存商品 POST
export async function postSaveProd(params: any) {
  let [err,data] = await post({ url: `/productManagement/saveProd`, params, showToast: false, successToast: false });
  if(err) return false
  return true
}

