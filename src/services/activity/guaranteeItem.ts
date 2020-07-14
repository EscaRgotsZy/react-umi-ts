import { get, post, put, del } from '@/common/request';
// ---------------------------------------保障项目开始
export interface guaranteeItemParams {
  page: number;
  size: number;
  isCharge: number | string;
}
// 保障服务查询
export async function GetGuaranteeItemList(params: guaranteeItemParams) {
  let [err, data] = await get({ url: `/guaranteeItems`, params, showToast: false });
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
// 查询保障名称   /guaranteeGroup
export async function getGuaranteeGroup(){
  let [err, data] = await get({ url: `/guaranteeGroup`, showToast: false });
  if (err || !data)
    return {
      data: [],
  };
  return {
    data: Array.isArray(data) ? data : [],
  };
}

export interface AddGuaranteeItemParams {
  id: string | number;
  guaranteeId: number | string;
  name: string;
  price: number;
  isCharge: number | string;
}
// 新增
export async function addGuaranteeItem(params: AddGuaranteeItemParams) {
  return await post({ url: `/guaranteeItems`, params, showToast: true, successToast: true });
}
// 编辑
export async function editGuaranteeItem(params: AddGuaranteeItemParams) {
  return await put({ url: `/guaranteeItems`, params, showToast: true, successToast: true });
}
// 删除
export async function delGuaranteeItem(id:string) {
  return await del({ url: `/guaranteeItems/${id}`, showToast: true, successToast: true });
}
