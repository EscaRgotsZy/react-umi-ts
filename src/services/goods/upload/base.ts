import { get, put, post,del } from '@/common/request';
// 获取店铺列表
export async function getShopDetailsByParent(params: any) {
    let [err, data] = await get({ url: `/shops/shopDetailsByParent`, params });
    if (err || !data) return {};
    return {
        data
    }
}
// 选择参数模板 GET
export async function getUserParamOverlay(params: any) {
    let [err, data] = await get({ url: `/productManagement/userParamOverlay`, params });
    if (err || !data) return {};
    return {
        data
    }
}
// 新增虚拟店铺
export async function postSaveUserParam(params: any) {
    let [err,data] = await post({ url: `/productManagement/userParam/save`, params, showToast: true, successToast: true });
    if(err) return false
    return true
}

export async function deleteUserParam(id: any) {
    let [err,data] = await del({ url: `/productManagement/userParam/delete/${id}` });
    if(err) return false
    return true
}
// 获取品牌列表
export async function getBrandList(params: any) {
    let [err, data] = await get({ url: `/brands`, params });
    if (err || !data) return {};
    return {
        data
    }
}
//获取标签列表
export async function getTagList() {
    let [err, data] = await get({ url: `/product-tags` })
    if (err || !data) return {};
    let { records = [] } = data;
    return {
      records: Array.isArray(records) ? records : [],
    };
}