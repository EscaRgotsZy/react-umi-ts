import { get, put, post, del } from '@/common/request';
export async function findFreightTemplateList() {
    let [err, data] = await get({ url: `/freightTemplates/findFreightTemplateList`, });
    if (err || !data) return {};
    return {
        data
    }
}
export async function getFreTemCompanies() {
    let [err, data] = await get({ url: `/freightTemplates/companies`, });
    if (err || !data) return {};
    return {
        data
    }
}
export async function getAfterSaleOverlay(params: any) {
    let [err, data] = await get({ url: `/afterSaleExplain`, params });
    if (err || !data) return {};
    return {
        data
    }
}
export async function getFindAllProdTags(params: any) {
    let [err, data] = await get({ url: `/prodTag/findAllProdTags`, params });
    if (err || !data) return {};
    return {
        data
    }
}
export async function postSaveAfterSale(params: any) {
    let [err, data] = await post({ url: `/productManagement/s/saveAfterSale`, params, showToast: true, successToast: true });
    if (err) return false
    return true
}
export async function deleteAfterSale(params: any) {
    let [err, data] = await get({ url: `/productManagement/s/deleteAfterSale`, params });
    if (err || !data) return {};
    return {
        data
    }
}


export async function getServiceExplains(params: any) {
    let [err, data] = await get({ url: `/serviceExplains`, params });
    if (err || !data) return {};
    return {
        data
    }
}
export async function getGuaranteeGroup(params: any) {
    let [err, data] = await get({ url: `/guaranteeGroup/infos`, params });
    if (err || !data) return {};
    return {
        data
    }
}


export async function getFindTemplateInfo(id: any) {
    let [err, data] = await get({ url: `/freightTemplates/templateInfo/${id}`});
    if (err || !data) return {};
    return {
        data
    }
}