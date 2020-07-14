import { get, post, put, del } from '@/common/request';
import config from '@/config/index';


// 获取职位列表
export async function deptPositions() {
  let [err, data] = await get({ url: `/deptPositions`, params: { size: 100 }, showToast: false });
  if (err || !data) return false;
  let { records = [] } = data;
  return {
    records,
  };
}

export interface employeeParams {
  bizType?: number;
  realName?: string;
  deptPositionId?: number;
  employeeStatus?: number;
  page: number;
  size: number;
  sortBy: string;
}
// 员工查询
export async function getEmployee(params: employeeParams) {
  let [err, data] = await get({ url: `/employees`, params, showToast: false });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records,
  };
}

export interface setBizTypeParams {
  userId: number;
  password?: string;
}
// 设置运营子账号
export async function setBizType({ userId, password }: setBizTypeParams) {
  return await put({
    url: `/employees/bizType/${userId}`,
    params: { password },
    showToast: true,
    successToast: true,
  });
}

// 设置密码
export async function setPassword({ userId, password }: setBizTypeParams) {
  return await put({
    url: `/employees/password/${userId}`,
    params: { password },
    showToast: true,
    successToast: true,
  });
}

// 停用运营子账号
export async function delBizType({ userId }: setBizTypeParams) {
  return await del({ url: `/employees/bizType/${userId}`, showToast: true, successToast: true });
}

// 批量删除
export async function deleteEmployees({ id }: any) {
  return await del({ url: `/employees/batches/${id}`, showToast: true, successToast: true });
}

// 批量删除
export async function batchDeleteEmployees({ ids }: any) {
  return await del({ url: `/employees/batches/${ids}`, showToast: true, successToast: true });
}

// 获取员工详情
export async function getEmployeeDetail({ id }: any) {
  let [err, data] = await get({ url: `/employees/${id}`, showToast: true, successToast: false });
  if (err || !data) return false;
  let {
    realName = '', // 真实姓名
    cellphone = '', // 手机号
    employeeStatus, //
    deptPositionId, //
    bizType,
    roleIds,
  } = data;
  return {
    realName,
    cellphone,
    employeeStatus: employeeStatus || '',
    deptPositionId: deptPositionId || '',
    bizType,
    roleIds,
  };
}

export interface EmployeesParams {
  id?: string; // 员工id
  realName: string; // 员工姓名
  cellphone: string; //手机号
  deptPositionId: string | number; // 员工职位
  employeeStatus: string | number; // 员工状态
  roleIds: string | number;  // 员工角色
}
// 新增员工
export async function addEmployees(params: EmployeesParams) {
  return await post({ url: `/employees`, params, showToast: true, successToast: true });
}

// 编辑员工
export async function putEmployees(params: EmployeesParams) {
  return await put({ url: `/employees`, params, showToast: true, successToast: true });
}
