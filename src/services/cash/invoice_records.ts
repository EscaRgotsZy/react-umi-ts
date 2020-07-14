import { get, put, post, del } from '@/common/request';
// 开票列表
export interface getInvoiceRecordsParams {
  page: number;
  size: number;
  invoiceStatus: string | number;
  productId: string | number;
  invoiceName: string;
  invoiceContent: string;
  startTime: string;
  endTime: string;
  sortBy: string;
}
export async function getInvoiceRecordsList(params: getInvoiceRecordsParams) {
  let [err, data] = await get({ url: `/recharge-invoices/billing-record`, params, showToast: false });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}
// 取消
export async function cancleCheck(orderNo:number) {
  return await put({ url: `/recharge-invoices/cancel/${orderNo}`, showToast: true, successToast: true });
}

// 发票详情
export async function getInvoiceInfo ( orderNo: number ){
  let [err, data] = await get({ url: `/recharge-invoices/${orderNo}/billing-details`, showToast: false, successToast: false });
  if (err || !data) return false;
  return {
    data,
  };
} 

// 开票设置列表
export interface getInvoiceSettingParams {
  page: number;
  size: number;
  invoiceTitle: string;
  sortBy: string;
}
export async function getInvoiceSettingList(params: getInvoiceSettingParams) {
  let [err, data] = await get({ url: `/recharge-invoices`, params, showToast: false });
  if (err || !data)
    return {
      total: 0,
      records: [],
    };
  let { records = [], total } = data;
  return {
    total,
    records: Array.isArray(records) ? records : [],
  };
}

// 删除
export async function deleteInvoiceSetting(id:number) {
  return await del({ url: `/recharge-invoices/${id}`, showToast: true, successToast: true });
}

// 开票详情
export async function getInvoiceSettingInfo(id:number) {
  let [err, data] = await get({url: `/recharge-invoices/${id}`, showToast: false, successToast: false});
  if(err || !data) return {};
  return {
    data
  }
}

// 新增发票抬头
export interface addInvoiceTitleParams{
  typeId: number, 
  invoiceTitle: string, 
  taxpayerNo: string, 
  openBank: string, 
  bankAccount: string,
  bankName: string,
  registerAddress: string,
  registerPhone: string,
  receiveName: string,
  receivePhone: string,
  receiveAddress: string,
}
export async function addInvoiceTitle(params: addInvoiceTitleParams) {
  return await post({ url: `/recharge-invoices`, params, showToast:true, successToast:true })
}