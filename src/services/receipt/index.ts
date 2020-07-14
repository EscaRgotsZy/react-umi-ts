import { get, post, del, put } from '@/common/request';

export interface FindSubByPageParams {
  hasInvoice?: number;
  size: number;
  page: number;
}
// 发票管理--- 订单查询
export async function findSubByPage(params: FindSubByPageParams) {
  let [err, data] = await get({ url: `/invoices/orders`, params });
  if (err || !data) return { total: 0, records: [] };
  let { total, records } = data;
  records = Array.isArray(records) ? records : [];
  records = records.map((v: any) => ({
    ...v,
    key: v.orderId,
  }));
  return {
    total,
    records,
  };
}

// 发票管理--- 查询发票抬头
export async function findInvoiceInfo() {
  let [err, data] = await get({ url: `/invoices` });
  if (err || !data) return null;
  let { invoiceTitle='', taxpayerNo='' } = data;
  return {
    invoiceTitle,
    taxpayerNo
  }
}

// 发票管理--- 查询开票金额
export async function findInvoiceListInfo({ids}:{ids:string}) {
  let [err, data] = await get({ url: `/invoice-subs/order-money/${ids}` });
  if (err || !data) return false;
  return data.subsTotal? data.subsTotal: data
}

export interface AddInvoiceSubListParams{
  invoiceTitle: string;
  taxpayerNo: string;
  invoiceAmount: number;
  subIds: Array<number>;
}
// 发票管理--- 查询开票金额
export async function addInvoiceSubList(params: AddInvoiceSubListParams) {
  let [err] = await post({ url: `/invoice-subs/batch`, params });
  return !err
}

export interface EditInvoiceInfoParams{
  invoiceTitle: string;
  taxpayerNo: string;
}
// 发票管理--- 编辑发票抬头
export async function editInvoiceInfo(params: EditInvoiceInfoParams) {
  let [err] = await put({ url: `/invoices`, params, successToast: true });
  return !err
}

// 发票管理--- 新增发票抬头
export async function addInvoice(params: EditInvoiceInfoParams) {
  let [err] = await post({ url: `/invoices`, params, successToast: true });
  return !err
}

