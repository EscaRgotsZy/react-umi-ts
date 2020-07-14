import { get, post, put, del } from '@/common/request';
import config from '@/config/index';

export interface GetRoleParams {
  companyId?: any;	  // 企业ID
  dataPerm?: any;	    //数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）
  page: any;	        // 起始页
  remark?: any;	      // 备注
  resourceIds?: any;	// 资源ID
  roleId?: any;	      // 角色ID
  roleKey?: any;	    // 角色权限字符串
  roleName?: any;	    // 角色名称
  size: any;	        // 每页行数
  status?: any;
}
// 获取角色列表
export async function getRoleLists(params?: GetRoleParams) {
  let [err, data] = await get({ baseUrl: config.controlService, url: `/control/role`, params, showToast: false });
  if (err || !data) return { total: 0, records: [] };
  let { total, records } = data;
  records = Array.isArray(records) ? records : [];
  return {
    total,
    records
  }
}

// 删除角色
export async function delRole( id : any) {
  let [err, data] = await del({ baseUrl: config.controlService, url: `/control/role/${id}`, showToast: true, successToast: true });
  if (err) return false
  return true
}


// 编辑角色
export async function putRole(params: any) {
  let [err, data] = await put({ baseUrl: config.controlService, url: `/control/role`, params, showToast: true, successToast: true });
  if (err) return false
  return true
}
// 新增角色
export async function saveRole(params: any) {
  let [err, data] = await post({ baseUrl: config.controlService, url: `/control/role`, params, showToast: true, successToast: true });
  if (err) return false
  return true
}
// 查询角色信息
export async function getRoleInfo(id: number) {
  let [err, data] = await get({ baseUrl: config.controlService, url: `/control/role/${id}`, showToast: false, successToast: false });
  if (err || !data) return {}
  data.resourceIds =  Array.isArray(data.resourceList) ? data.resourceList.map((item:any)=>item.resourceId):[]
  return data
}
