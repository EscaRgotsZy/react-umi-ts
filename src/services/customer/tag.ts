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
  let [err, data] = await get({ url: `/user-tags`, params, showToast: false, successToast: false })
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
// 获取所有用户标签 
export async function getAllTagList() {
  let [err, data] = await get({ url: `/user-tags/tagInfos` })
  if (err || !data) return {
    data: []
  }
  return {
    data: Array.isArray(data) ? data : [],
  };
}
// 删除
export async function deleteTagItem(id: any) {
  return await del({ url: `/user-tags/${id}`, showToast: true, successToast: true });
}
//新增
export interface addTagItemParams {
  name: string,
  groupId: number | string,
}
export async function addTagItem(params: addTagItemParams) {
  return await post({ url: `/user-tags`, params, showToast: true, successToast: true });
}
//编辑
export interface editTagItemParams {
  id: number|string,
  name: string,
  groupId: number | string,
}
export async function editTagItem(params: editTagItemParams) {
  let {id, ...data} = params
  return await put({ url: `/user-tags/${id}`, params:data, showToast: true, successToast: true });
}
//批量分组
export interface batchTagGroupParams {
  groupId: string | number; 
  tagIds: Array<any>
}
export async function batchTagGroup(params:batchTagGroupParams) {
  return await post({ url: `/user-tag-groups/batch`, params, showToast: false, successToast: false });
}
//------------------标签组
export interface tagGroupListParams {
  name: string,
  page: number,
  size: number,
  sortBy: string,
}
export async function getTagGroupList(params: tagGroupListParams) {
  let [err, data] = await get({ url: `/user-tag-groups`, params, showToast: false, successToast: false })
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
//获取所有标签组 
export async function getAllTagGroupList() {
  let [err, data] = await get({ url: `/user-tag-groups/userTagGroupInfos` })
  if (err || !data) return {
    data: []
  }
  return {
    data: Array.isArray(data) ? data : [],
  };
}
// 删除
export async function deleteTagGroupItem(id: any) {
  return await del({ url: `/user-tag-groups/${id}`, showToast: true, successToast: true });
}
//新增
export interface addTagGroupItemParams {
  name: string,
}
export async function addTagGroupItem(params: addTagGroupItemParams) {
  return await post({ url: `/user-tag-groups`, params, showToast: true, successToast: true });
}
//修改
export interface editTagGroupItemParams {
  name: string,
  id: string,
}
export async function editTagGroupItem(params:editTagGroupItemParams) {
  const {id, ...data} = params
  return await put({ url: `/user-tag-groups/${id}`,params: data, showToast: true, successToast: true });
}