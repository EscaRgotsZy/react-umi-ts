import { get, put, post,del } from '@/common/request';

export async function getUseAttributeOverlay(params: any) {
    let [err, data] = await get({ url: `/productManagement/attributeOverlay`, params });
    if (err || !data) return {};
    return {
        data
    }
}
export async function postSaveAttributeOverlay(params: any) {
    let [err,data] = await post({ url: `/productManagement/userAttribute/save`, params, showToast: true, successToast: true });
    if(err) return false
    return true
}
export async function deleteAttributeOverlay(id: any) {
    let [err,data] = await del({ url: `/productManagement/userAttribute/delete/${id}` });
    if(err) return false
    return true
}
