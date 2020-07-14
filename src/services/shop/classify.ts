import { get, post, put, del } from '@/common/request';

export const TabType = {
  list: 'LIST',
  add: 'ADD',
  edit: 'EDIT',
}

// 根据条件查询店铺分类列表
export async function findShopCategoryList(params:any) {
  let [err, data] = await get({ url: `/shops/findShopCategoryList`, params, showToast: true, successToast: false });
  if(err || !data)return {
    total: 0,
    records: []
  }
  let { total, records } = data;
  records = Array.isArray(records)?records:[];
  records = records.map((v:any)=>{
    return {
      ...v
    }
  })
  return {
    total,
    records
  }
}

// 删除店铺分类
export async function deleteShopCategory(params:any) {
  return del({ url: `/shops/deleteShopCategory/${params.id}`, params, showToast: true, successToast: false });
}
// 下线/上线店铺分类
export async function lineShopCategory(params:any) {
  return post({ url: `/shops/lineShopCategory`, params, showToast: true, successToast: true });
}
// 添加修改店铺分类信息
export async function saveShopCategory(params:any) {
  return post({ url: `/shops/saveShopCategory`, params, showToast: true, successToast: false });
}
