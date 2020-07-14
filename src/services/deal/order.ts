import { get, post, put, del } from '@/common/request';

export async function getOrdersList(params: any) {
  let [err, data] = await get({ url: `/orders/ordersManage`, params, showToast: false });
  if (err || !data) return [];
  return {
    data,
  };
}

export async function getLogisticsList() {
  let [err, data] = await get({ url: `/freightTemplates/companies`, showToast: false });
  if (err || !data) return [];
  return {
    data,
  };
}

export async function getExportOrdersParams() {
  let [err, data] = await get({ url: `/orders/orderFields`, showToast: false });
  if (err || !data) return false;
  return {
    data,
  };
}
export async function postRemarkShopOrder(params: any) {
  let [err, data] = await post({ url: `/orders/orderMange/remarkShopOrder`, params, showToast: true });
  if (err) return false;
  return true
}
export async function putDeliverGoods(params: any) {
  let [err, data] = await put({ url: `/orders/deliver`, params, showToast: false });
  if (err) return false;
  return true
}
// 订单详情
export async function getOrderDetailInfo(orderNo: number | string) {
  let [err, data] = await get({ url: `/orders/orderDetail/${orderNo}`, showToast: false });
  if (err || !data) return {};
  return {
    data,
  };
}
// 子订单详情
export async function getSubOrdersList(groupOrderNo: number | string) {
  let [err, data] = await get({ url: `/orders/orderDetail/${groupOrderNo}/subOrders`, showToast: false });
  if (err || !data) return [];
  return {
    data,
  };
}
// 物流追踪
export async function getExpress(orderNo: number | string) {
  let [err, data] = await get({ url: `/orders/express/${orderNo}`, showToast: false });
  if (err || !data) return [];
  return {
    data,
  };
}
// 交易快照
export async function getSnapshot(params:any) {
  let [err, data] = await get({ url: `/orders/snapshot`,params, showToast: false });
  if (err || !data) return {};
  return {
    data,
  };
}

// 订单导出
export async function exportOrders(params:any) {
  let [err, data] = await post({ url: `/orders/exportOrders`, params, showToast: true });
  if (err || !data) return false;
  return data
}
