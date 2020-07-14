import { get, post, put, del } from '@/common/request';
import config from '@/config/index';

export interface serviceExplainsParams {
  page: number;
  size: number;
}
// 服务查询
export async function GetServiceExplainsList(params: serviceExplainsParams) {
  let [err, data] = await get({ url: `/serviceExplains`, params, showToast: false });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}

export interface AddServiceExplainsParams {
  title: string;
  content: string;
}
export interface putServiceExplainsParams {
  id: string | number;
  title: string;
  content: string;
}

// 新增
export async function addServiceExplains(params: AddServiceExplainsParams) {
  return await post({ url: `/serviceExplains`, params, showToast: true, successToast: true });
}
// 编辑
export async function putServiceExplains(params: putServiceExplainsParams) {
  return await put({ url: `/serviceExplains`, params, showToast: true, successToast: true });
}
// 删除
export async function delServiceExplains({ id }: any) {
  return await del({ url: `/serviceExplains/${id}`, showToast: true, successToast: true });
}
