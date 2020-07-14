import { get, post, put, del } from '@/common/request';

export interface GetWithdrawParams{
  page: number;
  size: number;
  status?: string
}
// 获取提现记录列表
export async function getWithdraw(params: GetWithdrawParams){
  let [err, data] = await get({url: `/team-bulid-fee/withdraw-records`, params});
  if(err || !data)return {total: 0, records: []};
  let { total, records } = data;
  return {
    total,
    records: Array.isArray(records) ? records: []
  }
}
