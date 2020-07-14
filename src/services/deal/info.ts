import { get, post, put, del } from '@/common/request';


export async function getRefundDetail(refundId: any) {
    let [err, data] = await get({ url: `/refunds/refundDetail/${refundId}`, refundId, showToast: false });
    if (err || !data) return {};
    return {
        data,
    };
}
export async function getReturnDetail(refundId: any) {
    let [err, data] = await get({ url: `/refunds/returnDetail/${refundId}`,  showToast: false });
    if (err || !data) return {};
    return {
        data,
    };
}
//发送审核
export async function postAuditRefund(params: any) {
    let [err, data] = await post({ url: `/refunds/s/auditRefund`, params, showToast: false ,successToast: false});
    if (err || !data) return {};
    return {
        data,
    };
}
export async function postAuditItemReturn(params: any) {
    let [err, data] = await post({ url: `/refunds/auditItemReturn`, params, showToast: false ,successToast: false});
    if (err || !data) return {};
    let { records = [] } = data;
    return {
        records,
    };
}
