import { get, post, del } from '@/common/request';
import config from '@/config/index';

export interface MembersParams {
  page: number;
  size: number;
  sortBy: string;
  employeeUserId?: string;
  memberType?: number;
  cellphone?: string;
  realName?: string;
  tagName?: string;
  nickName?: string;
}
// 客户列表
export async function getMembers(params: MembersParams){
  let [err, data] = await get({url: `/members`, params});
  if(err || !data)return {total: 0, records: []};
  let { total, records } = data;
  return {
    total,
    records: Array.isArray(records) ? records: []
  }
}

// 获取邀请码
export async function getInviteCode(inviteCodeTypes:number){
  let [err, data] = await get({url: `/employees/invite-code/${inviteCodeTypes}`});
  if(err || !data)return false;
  let { inviteCode, companyId } = data;
  return {
    inviteCode, companyId
  }
}

// 获取客户详情信息
export async function getMembersInfo(params:any){
  let [err, data] = await get({url: `/members/detail/${params.userId}`});
  if(err || !data)return false;
  let { userId, memberType, employeeName, realName, nickName, cellphone, ordersCount, totalConsumption, availableIntegral, userTags, focusOfficialAccount } = data;
  const memberTypeTextMap = ['会员', '员工', '亲属'];
  return {
    userId: userId || '',
    memberType: memberType || '',// 客户类型 0 会员 1员工 2亲属
    employeeName: employeeName || '',
    realName: realName || '',
    nickName: nickName || '',
    cellphone: cellphone || '',
    memberTypeText: memberTypeTextMap[memberType] || '',
    ordersCount: ordersCount || 0,// 历史购买
    totalConsumption: totalConsumption || 0,// 历史消费
    availableIntegral: availableIntegral || 0,// 可用积分
    userTags: Array.isArray(userTags)? userTags :[],
    focusOfficialAccount
  }
}

// 或者指定客户的 -> 亲属列表
export async function getRelativesList({userId}:any){
  let [err, data] = await get({url: `/members/detail/${userId}/relatives`});
  if(err || !data)return [];
  return Array.isArray(data)?data:[];
}

// 获取客户地址
export async function getMembersAddress({userId}:any): Promise<Array<any>>{
  let [err, data] = await get({url: `/members/detail/${userId}/address`});
  if(err || !data)return [];
  return Array.isArray(data)? data: [];
}
// 添加标签
export interface AddTagsParams {
  userId: string | number;
  tagIds: Array<any>
}
export async function addTags(params: AddTagsParams) {
  return await post({ url: `/members/binding-tag`, params })
}
//删除标签 
export async function delTags(userId:string,tagId:string) {
  return await del({ url: `/members/delete-tag/${userId}/${tagId}` })
}
// 编辑客户信息
export interface EditorDetailParams{
  userId: string;
  memberType: number;
  realName: string;
  nickName: string;
  cellphone: string;
}
export async function editorDetail(params: EditorDetailParams) {
  let [err] = await post({ url: `/members/detail`, params })
  return !err
}
//批量打标 /user-tags/batch 
export interface batchTagsParams{
  userIds: Array<any>;//用户id集合
  tagIds: Array<any>;//标签id集合
}
export async function batchTags(params:batchTagsParams){
  return await post({ url: `/user-tags/batch`, params, showToast: false, successToast: false });
}
//获取所有标签
export async function getTagsList() {
  let [err, data] = await get({ url: `/user-tags`, showToast: false, successToast: false })
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
