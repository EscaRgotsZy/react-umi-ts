import { get, post, put, del } from '@/common/request';
import formatSrc from '@/common/formatSrc'
import moment from 'moment'

// 团购列表
export async function getGrouponList(params:any){
  let [err, data] = await get({url: `/groupBuy`, params});
  if(err || !data)return {total: 0, records: []};
  let { total, records } = data;
  records = records.map((v:any) => ({
    ...v,
    groupPic: formatSrc(v.groupPic)
  }))
  return {
    total,
    records
  }
}

// 上线团购
export async function onLineGroupon({id}:any){
  return await get({url: `/groupBuy/${id}`, successToast: true});
}

// 团购活动下线
export async function offLineGroupon({id}:any){
  return await get({url: `/groupBuy/offLine/${id}`, successToast: true});
}

// 删除团购活动
export async function delGroupon({id}:any){
  return await del({url: `/groupBuy/${id}`});
}

// 检查是否可以发布团购活动
export async function getOnLineGroupon(){
  let [err, data] =  await get({url: `/groupBuy/check`});
  if(err) return {};
  return {
    data
  }
}




// 商品列表
export async function getProductList(params:any) {
  let [err, data] = await get({ url: `/groupBuy/selAllProd`, params })
  if( err || !data)return {
    total: 0,
    records: []
  }
  let { total, records } = data;
  records = Array.isArray(records)? records: [];
  records = records.map((item:any) => {
    let productSkus = item.skuList || [];
    return {
      productId: item.productId,
      productName: item.productName,
      productPic: formatSrc(item.productPic),
      presentPrice: item.presentPrice,
      actualStocks: item.actualStocks,
      productSkus: productSkus.map((v:any)=>{
        let { actualStocks, name, skuId, price, pic, mergePrice, mergeLevelRate, productId } = v;
        return {
          actualStocks, name, skuId, price, pic: formatSrc(pic), originPic: formatSrc(pic), mergePrice, mergeLevelRate, productId,  sel: true
        }
      })
    }
  })
  return {
    total,
    records
  }
}


// 根据id查团购信息
export async function getGrouponInfo(params:any) {
  let [err, data] = await get({ url: `/groupBuy/info/${params.id}/${params.type}` })
  if(err || !data)return false;
  let {
    groupName,
    backgroundColor,
    countDown,
    limitNumber,
    groupPic,
    sharePic,
    limitUserType,
    peopleNumber,
    shareContent,
    shareTitle,
    startTime,
    endTime,
    products,
    id,
  } = data;

  let activityInfo = {
    groupName,
    backgroundColor,
    countDown,
    activityTime: [moment(startTime), moment(endTime)],
    limitNumber,
    limitUserType,
    peopleNumber,
    groupPic,
    sharePic,
    shareTitle,
    shareContent,
  }
  products = Array.isArray(products)? products: [];
  let selGoods = products.map((v:any)=>{
    let productSkus = Array.isArray(v.groupBuyProducts)? v.groupBuyProducts: [];
    productSkus = productSkus.map((x:any)=>{
      let { skuPic: pic, actualStocks, skuName:name, skuId, skuPrice: price, groupPrice:mergePrice, groupLevelRate:mergeLevelRate } = x;
      return {
        pic: formatSrc(pic), 
        actualStocks, 
        name, 
        skuId, 
        price, 
        originPic: formatSrc(pic), 
        mergePrice, 
        mergeLevelRate, 
        productId: v.productId,  
        sel: true
      }
    })
    return {
      productId: v.productId,
      productName: v.productName,
      productPic: formatSrc(v.productPic),
      presentPrice: v.presentPrice,
      actualStocks: v.actualStocks,
      status: v.status,// 1 上线 其他 下线
      groupBuyProductStatus: v.groupBuyProductStatus,// 复制团购活动时商品状态 true: 可用、false：不可用 参加了其他活动
      productSkus,
    }
  })
  return {
    id,
    activityInfo,
    selGoods
  }
}


// 新增团购
export async function addGroupon(params:any) {
  let [err] = await post({ url: `/groupBuy`, params })
  return !err
}

// 编辑团购
export async function editGroupon(params:any) {
  let [err] = await put({ url: `/groupBuy`, params })
  return !err
}

