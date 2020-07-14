import { get, post, put, del } from '@/common/request';
import formatSrc from '@/common/formatSrc'

// 查询广告位 get
export async function getBannerList(){
  let [err, data] = await get({url: `/adverts`})
  if(err || !data)return []
  let { records } = data;
  records = Array.isArray(records)?records:[];
  return records.map((v:any) => {
      let { picList } = v;
      picList = Array.isArray(picList)?picList:[];
      let pic = picList[0] || ''
      return {
        key: v.id,
        ...v,
        pic: formatSrc(pic)
      }
    })
}

// 查询广告项 get
export function getAdvertItems(params:any){
  return get({url: `/advertItems`, params})
}
//  添加广告项 POST
export function addAdvertItems(params:any){
  return post({url: `/advertItems`, params})
}
//  编辑广告项 PUT
export function putAdvertItems(params:any){
  return put({url: `/advertItems`, params})
}
//  编辑广告项排序 PUT
export function putAdvertItemsEditSeq(params:any){
  return put({url: `/advertItems/editSeq`, params})
}
//  删除广告项 DELETE
export function deleteAdvertItems({id}:any){
  return del({url: `/advertItems/${id}`})
}
// 批量删除广告
export function batchDelAdvert(ids:any){
  return del({url: `/advertItems/${ids}`})
}
//  查询状态正常的专题活动列表
export function getNormalThemes(){
  return get({url: `/theme/normalThemes`})
}


