import { get, post, put, del } from '@/common/request';
import config from '@/config/index';

export interface GetResourceParams {
  companyId?: any;	  // 企业ID
  dataPerm?: any;	    //数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）
  page: any;	        // 起始页
  remark?: any;	      // 备注
  resourceIds?: any;	// 资源ID
  roleId?: any;	      // 角色ID
  roleKey?: any;	    // 角色权限字符串
  roleName?: any;	    // 角色名称
  size: any;	        // 每页行数
  sortBy?: any;	      // 显示顺序
  status?: any;
  parentId?: number;
}
// 获取资源列表
export async function getResourceLists(params: any) {
  let [err, data] = await get({ baseUrl: config.controlService, url: `/control/resource`, params, showToast: false });
  if (err || !data) return { total: 0, records: [] };
  let { total, records } = data;
  records = Array.isArray(records) ? records.map(item => {
    item.key = item.resourceId;
    item.title = item.resourceName;
    item.value = item.resourceId;
    item.icon = '';
    item.children = Array.isArray(item.resources) ? item.resources.map((ele: any) => {
      ele.key = ele.resourceId;
      ele.title = ele.resourceName;
      ele.value = ele.resourceId;
      ele.icon = '';
      return {
        ...ele,
        grade:2
      }
    }) : []
    return {
      ...item,
      grade:1
    }
  }) : [];
  return {
    total,
    records
  }
}
// 增加资源
export async function saveResource(params: any) {
  let [err, data] = await post({ baseUrl: config.controlService, url: `/control/resource`, params, showToast: true, successToast: true });
  if (err) return false
  return true
}

// 编辑资源
export async function putResource(params: any) {
  let [err, data] = await put({ baseUrl: config.controlService, url: `/control/resource`, params, showToast: true, successToast: true });
  if (err) return false
  return true
}

// 删除资源
export async function delResource({ id }: any) {
  let [err, data] = await del({ baseUrl: config.controlService, url: `/control/resource/${id}`, showToast: true, successToast: true });
  if (err) return false
  return true
}


