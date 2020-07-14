
// 省市区

import { get, post } from '@/common/request';

export interface GetAreaParams {
  cityId: number | string;
}
// 获取区
export async function getAreas(params: GetAreaParams) {
  let [err, data] = await get({ url: `/regions/cities/${params.cityId}` });
  if (err || !data) return [];
  data = Array.isArray(data) ? data : [];
  return data.map((v: any) => ({
    level: 3,
    label: v.value,
    value: v.key,
    isLeaf: true,
  }));
}

export interface GetCityParams {
  provinceId: number | string;
}
// 获取市
export async function getCitys(params: GetCityParams) {
  let [err, data] = await get({ url: `/regions/provinces/${params.provinceId}` });
  if (err || !data) return [];
  data = Array.isArray(data) ? data : [];
  return data.map((v: any) => ({
    level: 2,
    label: v.value,
    value: v.key,
    isLeaf: false,
  }));
}

// 获取省
export async function getProvs() {
  let [err, data] = await get({ url: `/regions/provinces` });
  if (err || !data) return [];
  data = Array.isArray(data) ? data : [];
  return data.map((v: any) => ({
    level: 1,
    label: v.value,
    value: v.key,
    isLeaf: false,
  }));
}