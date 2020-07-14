import { get, post, put, del } from '@/common/request';

export interface guaranteeNameParams {
  page: number;
  size: number;
}

// 保障名称查询
export async function GetGuaranteeNameList(params: guaranteeNameParams) {
  let [err, data] = await get({ url: `/guaranteeGroup/infos`, params, showToast: false });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [],total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}

export interface AddGuaranteeNameParams {
  id: string | number;
  name: string;
  isCharge: number | string;
}

// 新增
export async function addGuaranteeName(params: AddGuaranteeNameParams) {
  return await post({ url: `/guaranteeGroup`, params, showToast: true, successToast: true });
}
// 编辑
export async function putGuaranteeName(params: AddGuaranteeNameParams) {
  return await put({ url: `/guaranteeGroup`, params, showToast: true, successToast: true });
}
// 删除
export async function delGuaranteeName(id: string) {
  return await del({ url: `/guaranteeGroup/${id}`, showToast: true, successToast: true });
}