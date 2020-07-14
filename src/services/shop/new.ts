import { get, post, put, del } from '@/common/request';

// 新增虚拟店铺
export async function addVisualShop(params:any) {
  return post({ url: `/shops/addVisualShop`, params, showToast: true, successToast: true });
}
