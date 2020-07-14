import { get, post, del, put } from '@/common/request';

// 获取团建费 获取员工人数
export async function moneyNum() {
  let [err, data] = await get({ url: `/home/money-num` });
  if (err || !data) return null;
  let { totalMoney = 0, employeeNums = 0 } = data;
  return {
    totalMoney,
    employeeNums,
  };
}

export interface TeamFeeIncomeParams {
  page: number;
  size: number;
  startDate?: string;
  endDate?: string;
}
// 查询团建费收益
export async function teamFeeIncome(params: TeamFeeIncomeParams) {
  let [err, data] = await get({ url: `/home/team-fee-income`, params });
  if (err || !data) return null;
  let { total = 0, records = [] } = data;
  return {
    total,
    records,
  };
}
