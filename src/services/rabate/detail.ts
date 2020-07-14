import { get, post, put, del } from '@/common/request';

export interface GetDetailParams{
  page: number;
  size: number;
}
// 获取明细列表
export async function getDetail(params: GetDetailParams){
  let [err, data] = await get({url: `/team-bulid-fee/details/`, params});
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

// 待入帐金额
export async function getWaitWithdrawAmount(){
  let [err, data] = await get({url: `/team-bulid-fee/waiting-money`});
  if(err || !data)return 0
  return typeof data === 'number'? data: 0;
}
// 获取可提现总金额
export async function getTotalAmount(){
  let [err, data] = await get({url: `/home/money-num`});
  if(err || !data)return 0
  let { totalMoney } = data;
  return typeof totalMoney === 'number'? totalMoney: 0;
}

export interface CashOutParams{
  bank: string;
  bankAccount: string;
  amount: number;
  bankAddress: string;
}
// 提现
export async function cashOut(params: CashOutParams){
  let [err] = await post({url: `/team-bulid-fee/withdraw`, params});
  if(err)return false;
  return true
}
