import { get, post, put, del } from '@/common/request';
export async function getAccountTotal() {
    let [err, data] = await get({ url: `/company/account/findInfo` });
    if (err || !data) return false;
    let { balance } = data;
    return balance
}

// 员工列表
export async function getStaffDataList(params:any) {
    let [err, data] = await get({ url: `/employees`, params });
    if (err || !data) return {};
    let { total, records } = data;
    return {
        total,
        records
    }
}
// 部分发放
export async function subMitIssuPart(params:any) {
    let [err, data] = await post({ url: `/grant/part`, params });
    if (err) return false;
    return data
}
// 批量发放
export async function subMitIssuBatch(params:any) {
    let [err, data] = await post({ url: `/grant/batch`, params });
    if (err) return false;
    return data
}
// 发放明细列表
export async function getGrantList(params:any) {
    let [err, data] = await get({ url: `/grant`, params });
    if (err || !data) return {};
    let { total, records } = data;
    return {
        total,
        records
    }
}
// 员工发放明细
export async function getGrantRecord(params:any) {
    let [err, data] = await get({ url: `/grant/detail`, params });
    if (err || !data) return {};
    let { total, records } = data;
    return {
        total,
        records
    }
}

