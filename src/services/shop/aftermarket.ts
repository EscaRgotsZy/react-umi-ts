import { get, post, put, del } from '@/common/request';

// 查询售后模板
export async function getAfterSaleList(params:any) {
  let [err, data] = await get({ url: `/afterSaleExplain`, params, showToast: true, successToast: false });
  if(err || !data)return {
    total: 0,
    records: []
  };
  let { total, records} = data;
  records = Array.isArray(records)?records:[];
  records = records.map((v:any)=>{
    let { items } = v;
    items = Array.isArray(items)?items:[];
    let content = ''
    if(items.length){
      content = items[0]['content']
    }
    return {
      ...v,
      content: content.length > 15? content.slice(0,15).concat('...'): content
    }
  })
  return {
    total,
    records
  }
}


// 根据id查询售后模板
export async function getAfterSaleListById(params:any) {
  let [err, data] = await get({ url: `/afterSaleExplain`, params, showToast: true, successToast: false });
  if(err || !data)return false;
  let { records } = data;
  let item = Array.isArray(records)?records[0]||{}: {};
  return item;
}

// 添加售后模板
export async function addAfterSaleList(params:any) {
  return post({ url: `/afterSaleExplain`, params, showToast: true, successToast: true });
}
// 编辑售后模板
export async function putAfterSaleList(params:any) {
  return put({ url: `/afterSaleExplain`, params, showToast: true, successToast: true });
}


// 根据id删除售后模板
export async function deleteTemplate(params:any) {
  return del({ url: `/afterSaleExplain/deleteTemplate/${params.id}`, showToast: true, successToast: true });
}
