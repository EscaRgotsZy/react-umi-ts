import { get, post, del } from '@/common/request';
import config from '@/config/index';
export interface sellProdParams {
  productName?: string;
  status: number | string;
  outerId?: any;
  page: number;
  size: number;
  sortBy: string;
}
export interface catesParams {
  id: number;
}
export interface editCatesParams {
  id: number;
  parentId?: number;
  name: string;
  seq: number | string;
  pic: string;
  categoryRelVOS: Array<any>;
}
// 获取一级品类 - 后端分类
export async function getFirstCateList() {
  let [err, data] = await get({
    url: `/customer/category/categories/firstCategory`,
    showToast: false,
  });
  if (err || !data) return [];
  return (Array.isArray(data) ? data : []).map((v) => {
    return {
      key: v.id,
      isLeaf: false,
      title: v.name,
      ...v,
    };
  });
}

// 获取下一级品类 - 后端分类
export async function getNextCateList({ categoryId }: any) {
  let [err, data] = await get({
    url: `/customer/category/categories/nextCategory/${categoryId}`,
    showToast: false,
  });
  if (err || !data) return [];
  let { categories = [] } = data;
  return (Array.isArray(categories) ? categories : []).map((v) => {
    return {
      key: v.id,
      isLeaf: v.grade >= 3,
      title: v.name,
      ...v,
    };
  });
}

// 查询一级类目 - 前端分类
export async function getParentCategories() {
  let [err, data]: any = await get({ url: `/customer/category/parentCategory`, showToast: false });
  if (err || !data) return [];
  return (Array.isArray(data) ? data : []).map((v) => {
    return {
      key: v.id,
      isLeaf: false,
      title: v.name,
      categoryId:v.id,
      ...v,

    };
  });
}

// 查询下级类目 - 前端分类
export async function getNextCategories(params: catesParams) {
  let [err, data] = await get({ url: `/customer/category/nextCategory`, params, showToast: false });
  if (err || !data) return [];
  return (Array.isArray(data) ? data : []).map((v) => {
    return {
      key: v.id,
      isLeaf: v.grade >= 3,
      title: v.name,
      categoryId:v.id,
      ...v,
    };
  });
}
// 查询前端分类详情( _Get )
export async function getCategoriesInfo(params: catesParams) {
  let [err, data] = await get({ url: `/customer/category/info`, params, showToast: false });
  if (err || !data) return false;
  return {
    data,
  };
}

// 编辑前端分类( _Post )
export async function editaddClassifyNav(params: editCatesParams) {
  let [err, data] = await post({
    url: `/customer/category/editCustomer`,
    params,
    showToast: false,
  });
  if (err || !data) return false;
  return true;
}

// 新增前端分类( _Post )
export async function saveClassifyNav(params: editCatesParams) {
  let [err, data] = await post({
    url: `/customer/category/saveCategory`,
    params,
    showToast: false,
  });
  if (err || !data) return false;
  return true;
}
// 删除前端分类( _Del )
export async function deleClassifyNav({ cateId }: any) {
  let [err, data] = await del({
    url: `/customer/category/delete/${cateId}`,
    showToast: true,
    successToast: true,
  });
  if (err || !data) return false;
  return true;
}
// 清除缓存( _Del )
export async function clearCache() {
  return await del({
    url: `/customer/category/clear-cache`,
    showToast: true,
    successToast: true,
  });
}
