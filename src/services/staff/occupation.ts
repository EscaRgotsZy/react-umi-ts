import { get, post, put, del } from '@/common/request';
import config from '@/config/index';

export interface DeptPositionsParams {
  page: number;
  size: number;
}
// 获取职位列表
export async function deptPositions(params: DeptPositionsParams) {
  let [err, data] = await get({ url: `/deptPositions`, params, showToast: false });
  if (err || !data) return false;
  let { records, total = 0 } = data;
  return {
    records: Array.isArray(records) ? records : [],
    total,
  };
}

export interface AddDeptPositionsParams {
  id?: string;
  positionTitle: string;
}

// 新增职位 or 编辑
export async function addDeptPositions(params: AddDeptPositionsParams) {
  return await put({ url: `/deptPositions`, params, showToast: true, successToast: true });
}

// 删除职位
export async function delDeptPositions({ id }: any) {
  return await del({ url: `/deptPositions/${id}`, showToast: true, successToast: true });
}
