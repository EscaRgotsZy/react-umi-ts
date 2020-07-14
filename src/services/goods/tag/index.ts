import { get, post, put, del } from '@/common/request';
//---------------标签
export interface tagListParams {
  name: string,
  groupId: string | number,
  page: number,
  size: number,
  sortBy: string,
}
export async function getTagList(params: tagListParams) {
  let [err, data] = await get({ url: `/product-tags`, params, showToast: false, successToast: false })
  if (err || !data) return {
    total: 0,
    data: []
  }
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
//标签详情 /product-tags/{id}
export async function getTagItemInfo(id:any) {
  let [err, data] = await get({ url: `/product-tags/${id}` })
  if (err || !data) return {
    data: []
  }
  return {
    data
  };
}

// 删除
export async function deleteTagItem(id: any) {
  return await del({ url: `/product-tags/${id}`, showToast: true, successToast: true });
}
//新增
export interface addTagItemParams {
  name: string,
  groupId: number | string,
  categoryIds: Array<any>,
  searchKeyword: string
}
export async function addTagItem(params: addTagItemParams) {
  return await post({ url: `/product-tags`, params, showToast: true, successToast: true });
}
//编辑
export interface editTagItemParams {
  id: string | number,
  name: string,
  groupId: number | string,
  categoryIds: Array<any>,
  searchKeyword: string
}
export async function editTagItem(params: editTagItemParams) {
  let {id, ...data} = params
  return await put({ url: `/product-tags/${id}`, params:data, showToast: true, successToast: true });
}
//关联品类 
//  查询一级类目 _Get /customer/category/categories/firstCategory 
export async function getFirstCategory (){
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
//  查询下级类目 _Get /customer/category/categories/nextCategory/${categoryId}
export async function getNextCategory ({ categoryId }: any){
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
//批量分组
export interface batchTagGroupParams {
  groupId: string | number;
  tagIds: Array<any>
}
export async function batchTagGroup(params:batchTagGroupParams) {
  return await post({ url: `/product-tag-group/batch`, params, showToast: false, successToast: false });
}
//------------------标签组
export interface tagGroupListParams {
  name: string,
  page: number,
  size: number,
  sortBy: string,
}
export async function getTagGroupList(params: tagGroupListParams) {
  let [err, data] = await get({ url: `/product-tag-group`, params, showToast: false, successToast: false })
  if (err || !data) return {
    total: 0,
    data: []
  }
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
//获取全量标签组
export async function getAllTagGroupList() {
  let [err, data] = await get({ url: `/product-tag-group/groups`})
  if (err || !data) return {
    data: []
  }
  return {
    data: Array.isArray(data) ? data : [],
  };
}
// 删除
export async function deleteTagGroupItem(id: any) {
  return await del({ url: `/product-tag-group/${id}`, showToast: true, successToast: true });
}
//新增
export interface addTagGroupItemParams {
  name: string,
}
export async function addTagGroupItem(params: addTagGroupItemParams) {
  return await post({ url: `/product-tag-group`, params, showToast: true, successToast: true });
}
//修改
export interface editTagGroupItemParams {
  name: string,
  id: string,
}
export async function editTagGroupItem(params:editTagGroupItemParams) {
  const {id, ...data} = params
  return await put({ url: `/product-tag-group/${id}`,params: data, showToast: true, successToast: true });
}


// 所有标签 - 不带分页
export interface GetProductTagAllParams{
  groupId: number;// 标签组Id
  name: string;// 标签名称
}
export async function getProductTagAll(params:GetProductTagAllParams) {
  return await get({ url: `/product-tags/chooseProductTags`, params, showToast: true, successToast: false });
}

// 所有标签组 - 不带分页
export async function getProductGroupTagAll() {
  return await get({ url: `/product-tag-group/groups`, showToast: true, successToast: false });
}