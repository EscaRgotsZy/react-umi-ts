import { get, post, put, del } from '@/common/request';
export async function getAccountTotal() {
    let [err, data] = await get({ url: `/company/account/findInfo` });
    if (err || !data) return false;
    let { balance } = data;
    return balance
}
// 申请充值列表
export async function getReChargeRecordList(params: any) {
    let [err, data] = await get({ url: `/company/order/findPage`, params });
    if (err || !data) return {};
    let { total, records } = data;
    return {
        total,
        records
    }
}
// 撤销申请
export async function revokeApply(id: number | string) {
    let [err, data] = await post({ url: `/company/order/cancelCompanyOrder/${id}` })
    if (err) return false;
    return 1
}
// 充值申请详情
export async function getReChargeRecordInfo(id: number | string) {
    let [err, data] = await get({ url: `/company/order/findOrderDetail/${id}`, });
    if (err || !data) return {};
    return {
        data
    }
}

// 发票列表
export async function getInvoiceDataList(params: any) {
    let [err, data] = await get({ url: `/company/order/findInvoicePage`, params });
    if (err || !data) return {};
    let { total, records } = data;
    records = records.map((v: any) => ({
        ...v,
        invoiceName: v.invoiceTitle,
        invoiceNumber: v.taxpayerNo,
        invoiceType: v.typeId,
        invoiceId: v.id,
    }))
    return {
        total,
        records
    }
}
// 新增充值申请
export async function subMitreChargeApply(params: any) {
    let [err, data] = await post({ url: `/company/order/save`, params })
    if (err) return false;
    return data
}

