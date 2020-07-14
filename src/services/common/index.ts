import { get, post } from '@/common/request';
import { tokenManage, userCompaniesManage, userInfoManage, defaultRouters } from '@/constants/storageKey';
import config from '@/config/index';
export const BatchImport: string = `${config.server}/employees/batch-import`;
// 上传图片 单个
export const pictureImport: string = `${config.server}/productManagement/prodpicture/save`;
// 上传图片 批量
export const uploadUrl = `${config.server}/commons/upload`


import formatSrc from '@/common/formatSrc'
// 登录
export interface LoginParamsType {
  userName: string;
  password: string;
}
export async function goLogin(params: LoginParamsType) {
  let [err, data] = await post({ baseUrl: config.loginServer, url: `/login`, params, showToast: false });
  if (err) return false;
  let token = data.token || '';
  tokenManage.set(token);
  return true;
}

// 查询店铺列表
export async function getShopList(params: any): Promise<any> {
  let [err, data] = await get({ url: `/shops/shopDetailsByParent`, params });
  if (err || !data) return {
    total: 0,
    records: []
  }
  let { total, records } = data;
  records = records.map((v: any) => ({
    ...v,
    groupPic: formatSrc(v.logoPic)
  }))
  return {
    total,
    records
  }
}
// 登录 获取企业列表
export async function getCompanies(params: any) {
  let [err, data] = await get({ url: `/companies/search`, params, showToast: false })
  if (err || !data) return []
  data = Array.isArray(data) ? data : [];
  return data
}
// 企业信息
export async function getCompaniesInfo() {
  let [err, data] = await get({ url: `/companies`, showToast: false })
  if (!err && data) {
    userCompaniesManage.set(data)
  }
  return true
}
// 用户信息
export async function getUserInfo() {
  let [err, data] = await get({ url: `/companies`, showToast: false })
  if (!err && data) {
    userInfoManage.set(data);
  }
  return true
}
// 当前路由权限
export async function getRouters(ID?:any) {
  let [err, data] = await get({ baseUrl: config.controlService, url: `/control/resource/user`, showToast: false });
  if (!err && data) {
    data = Array.isArray(data) ? data.map(item => item.menuKey) : [];
    return data
  } else {
    return []
  }
}
