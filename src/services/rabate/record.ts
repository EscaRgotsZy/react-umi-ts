import { get, post, put, del } from '@/common/request';

export interface GetBuildFeeParams{
  page: number;
  size: number;
}
// 获取团建费列表
export async function getBuildFee(params: GetBuildFeeParams){
  let [err, data] = await get({url: `/team-bulid-fee/records`, params});
  if(err || !data)return {total: 0, records: []};
  let { total, records } = data;
  records = Array.isArray(records) ? records: [];
  records = records.map((v:any, i:number)=>({
    ...v,
    key: i
  }))
  return {
    total,
    records
  }
}