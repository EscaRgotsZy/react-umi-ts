import { get, post, put, del } from '@/common/request';
// 使用列表
export async function getCashCouponsList(params:any) {
    let [err, data] = await get({ url: `/cash-coupons/employee-details`, params });
    if (err || !data) return {};
    let { total, records } = data;
    return {
        total,
        records
    }
}
// 员工使用记录   /cash-coupons/use-details
export async function getUsageRecordInfo(params:any) {
    let [err, data] = await get({ url: `/cash-coupons/use-details`, params });
    if (err || !data) return {};
    let { total, records } = data;
    return {
        total,
        records
    }
}