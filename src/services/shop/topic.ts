import { get, post, put, del } from '@/common/request';
import formatSrc from '@/common/formatSrc'

// 专题列表
export async function getSpecialList(params:any){
  let [err, data] = await get({url: `/theme/all`, params})
  if(err || !data)return {
    total: 0,
    records: []
  };
  let { total, records } = data;
  records = records.map((v:any) => ({
    ...v,
    key: v.themeId,
    topPic: formatSrc(v.topPic)
  }))
  return {
    total,
    records
  }
}


// 根据id删除
export function delSpecial({themeId}: any){
  return del({url: `/theme/${themeId}`, successToast: true})
}

// 根据id查专题信息
export async function getSpecial({themeId}:any){
  let [err, data] = await get({url: `/theme/${themeId}`})
  if(err)return false;
  let themeCategoryVOList = {}, themeProductVOS = {};
  (data.themeCategoryVOList || []).map((v:any)=>{
    themeCategoryVOList[v.categoryId] = v.categoryName
  });
  let goodsIds = (data.themeProductVOS || []).map((v:any)=>{
    themeProductVOS[v.productId] = {
      id: v.productId,
      name: v.productName,
      stocks: v.stocks,
      pic: formatSrc(v.productPic),
      price: v.presentPrice
    }
    return v.productId
  })
  return {
    themeName: data.themeName,
    topPic: data.topPic,
    color: data.backgroundColor,
    bizType: data.bizType,
    themeCategoryVOList,
    themeProductVOS,
    goodsIds,
    activityType: data.themeActivityVO? data.themeActivityVO.activityType: '',
  }
}
// 根据团购类型id查询商品列表
export async function allMergeGroup(params:any){
  let [err, data] = await get({url: `/allMergeGroup`, params})
  if(err || !data)return false;
  let list = Array.isArray(data)? data: [];
  return list.map(v=>({
    id: v.productId,
    name: v.productName,
    stocks: v.stocks,
    pic: formatSrc(v.productPic),
    price: v.presentPrice
  }))
}


// 新增专题
export function addSpecial(params:any){
  return post({url: `/theme/save`, params})
}

// 编辑专题
export function editSpecial(params:any){
  return post({url: `/theme/edit`, params})
}

// 获取普通商品列表
export async function getGoodsList(params:any){
  let [err, data] = await get({url: `/theme/selAllProd`, params})
  if(err)return {};
  let { total, records } = data;
  records = records.map(v=>({
    id: v.productId,
    name: v.productName,
    stocks: v.stocks,
    pic: formatSrc(v.productPic),
    price: v.presentPrice
  }))
  return {
    total,
    records
  }
}

// 查询一级类目
export async function getCategories(){
  let [err, data] = await get({url: `/customer/category/categories/firstCategory`})
  if(err || !data)return [];
  return data.map(v=> ({
    title: v.title,
    key: v.id,
    isLeaf: false
  }))
}
// 查询下级类目
export async function getSubCategories({categoryId}:any){
  let [err, data] = await get({url: `/customer/category/categories/nextCategory/${categoryId}`})
  if(err || !data)return [];
  let { categories } = data;
  return categories.map(v=> ({
    title: v.title,
    key: v.id,
    isLeaf: v.grade === 3
  }))
}
