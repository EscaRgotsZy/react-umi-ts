import { get, post, put, del } from '@/common/request';

export async function getRefundList(params:any) {
  let [err, data] = await get({ url: `/refunds/refundList`, params, showToast: false });
  if (err || !data) return {data: {}};
  return {
    data,
  };
}
export async function postReceiveGoods(params:any) {
    let [err, data] = await post({ url: `/refunds/receiveGoods`, params, showToast: false });
    if (err || !data) return false;
    let { records = [] } = data;
    return {
      records,
    };
  }