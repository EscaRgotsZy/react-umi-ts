import { get, post, put, del } from '@/common/request';
import moment from 'moment'

/***********      列表页      **********/
// 获取页面列表
export interface RenovationParams{
  page: number;// 起始页
  size: number;// 每页行数
  pageType: number;// 页面类型 0：普通页面 、1：首页
  status?: number;// 状态 1：未发布、2：已发布
  title: string;// 页面标题
  sortBy?: string;// 排序:+为正序[asc], -为反序[desc],多字段排序用','分隔，如: sortBy=+name,-age
}
export async function getRenovation(params:RenovationParams) {
  let [err, data] = await get({ url: `/decoration-pages`, params, showToast: true, successToast: false });
  if(err || !data)return {
    total: 0,
    records: [],
  }
  let { total, records } = data;
  records = Array.isArray(records)? records: [];
  return {
    total: total,
    records: records.map((v:any)=>{
      let { id,
        pageType, // 页面类型 0：普通页面 、1：首页
        status,
        title, updateTime } = v;
      return {
        id,//
        pageType,
        isHome: pageType === 1,
        status,// 状态 1：未发布、2：已发布
        title,// 页面标题
        time: moment(updateTime).format('YYYY-MM-DD HH:mm:ss')
      }
    }),
  }
}


// 复制
export async function copyRenovation(params:any) {
  return post({ url: `/decoration-pages/pageCopy/${params.id}`, showToast: true, successToast: false });
}

// 发布
export async function publishRenovation(params:any) {
  return post({ url: `/decoration-pages/releasePage/${params.id}`, showToast: true, successToast: true });
}

// 删除
export async function delRenovation(params:any) {
  return del({ url: `/decoration-pages/${params.id}`, showToast: true, successToast: true });
}


// 取消装修页面
export async function cancelDecorationPage(params:any) {
  return post({ url: `/decoration-pages/cancelDecorationPage/${params.id}`, showToast: true, successToast: true });
}



/***********   新建页面   ***********/
// 新建页面

export interface AddPageParams{
  backColor: string;// 背景颜色
  description: string;// 分享描述
  pageType: number;// 页面类型 0：普通页面 、1：首页
  shareUrl: string;// 分享图片
  title: string;// 页面标题
  id?: number;
  layout?: string;// 页面布局 组件json串{[key:list<value>]}
  status?: number;// 状态 1：未发布、2：已发布
}

export async function addPage(params:AddPageParams) {
  return post({ url: `/decoration-pages`, params, showToast: true, successToast: true });
}
// 编辑页面信息
export async function putPage(params:AddPageParams) {
  return put({ url: `/decoration-pages`, params, showToast: true, successToast: true });
}
// 编辑回显
export async function getPage(params:any) {
  let [err, data] = await get({ url: `/decoration-pages/${params.id}`, showToast: true, successToast: false });
  if(err)return false;
  let { id, pageType, shareUrl, status, title, updateTime, backColor, description, decorationPageElementVOS } = data;
  let pageInfo = {
    id, pageType, shareUrl, status, title, updateTime, backColor, description
  };
  let componentsInfo = decorationPageElementVOS.map((v:any)=>{
    return {
      id: v.id,
      elementType: v.elementType,
      elementVOS: [],
    }
  });
  return {
    pageInfo,
    componentsInfo
  }
}




/***********     装修    ***********/
// 添加组件
interface AddComponentsParams{
  elementType: number;// 组件类型 1：分类TAB、2：ICON、3：图片导航、4：特价福利、5：标签TAB、6：标题 、7：空白占位 、8：商品组件
  pageId: number;// 装修页面id
}
export async function addComponents(params:AddComponentsParams) {
  return post({ url: `/decoration-pages-element/addPageElement`, params, showToast: true, successToast: false });
}

// 删除组件
export async function delComponents(params:any) {
  return del({ url: `/decoration-pages-element/deletePageElement/${params.id}`, showToast: true, successToast: false });
}

// 排序组件
export async function sortComponents(params:{ids:Array<number>}) {
  return post({ url: `/decoration-pages-element/sortPageElement`, params, showToast: true, successToast: false });
}


/***********     组件模块    ***********/

// 查询组件详情
export interface GetComponentInfoParams{
  pageElementId: string;// 装修页面组件Id
}
export async function getComponentInfo(params: GetComponentInfoParams) {
  let { pageElementId } = params
  return get({ url: `/elements/${pageElementId}`, showToast: true, successToast: false });
}


// 添加或修改图片导航组件 post

interface SetImgParams{
  pageElementId: string;// 装修页面组件Id
  data: any[];
}
export async function setImg(params: SetImgParams) {
  let { pageElementId, data } = params
  return post({ url: `/elements/${pageElementId}/banners`, params: data, showToast: true, successToast: true });
}

// 添加或修改Icon组件
interface iconType {
  elementColor: string;// 名称颜色
  elementName: string;// icon名称
  elementUrlType: number;// 链接类型 1：分类链接、2：商品详情、3：装修页面、4：自定义链接
  h5Url: string;// 链接地址
  imageUrl: string;// icon图片
  seq: number;// 	排序
  id?: number;// 组件Ids修改组件时必传
}
interface SetIconParams{
  pageElementId: string;// 装修页面组件Id
  data: Array<iconType>
}
export async function setIcon(params: SetIconParams) {
  let { pageElementId, data } = params
  return post({ url: `/elements/${pageElementId}/icons`, params: data, showToast: true, successToast: true });
}

// 添加商品组件
interface ElementProductsType{
  productId: number;// 商品Id
  productName: string;// 商品名称
  seq: number;// 排序
}
interface setGoodsParams{
  pageElementId: string;// 装修页面组件Id
  id?: number;//
  elementProducts: Array<ElementProductsType>;// 关联商品信息
}
export async function setGoods(params: setGoodsParams) {
  let { pageElementId, ...data } = params
  return post({ url: `/elements/${pageElementId}/products`, params: data, showToast: true, successToast: true });
}

// 添加空白占位组件
export interface SetPlaceholderParams{
  id?: number;// 组件Id,修改组件时必传
  pageElementId: string;// 装修页面组件Id
  placePx: string;// 占位符长度 单位：PX
}
export async function setPlaceholder(params: SetPlaceholderParams) {
  let { pageElementId, ...data } = params
  return post({ url: `/elements/${pageElementId}/space`, params: data, showToast: true, successToast: true });
}

// 保存或者修改Tab组件
interface SetTabParams{
  pageElementId: string;// 装修页面组件Id
  backgroundImage: string;// 背景图
  buttonImage: string;// 按钮图
  tabElements: Array<any>;// tab组件信息
}
export async function setTabs(params: SetTabParams) {
  let { pageElementId, ...data } = params
  return post({ url: `/elements/${pageElementId}/tabs`, params: data, showToast: true, successToast: true });
}

// 添加或修改标签组件
interface SetLableParams {
  pageElementId: string;// 装修页面组件Id
  elementProducts: any;// 运营干预品商品信息
  elementShops: any;// 关联店铺信息
  productType: string;// 商品类型 1：常规、2：拼团、3：团购 注：多个用逗号隔开
  tagElements: any;// 标签组件信息
}
export async function setLabel(params: SetLableParams) {
  let { pageElementId, ...data } = params
  return post({ url: `/elements/${pageElementId}/tags`, params: data, showToast: true, successToast: true });
}

// 添加特价福利组件
export interface SetWelFareParams{
  pageElementId: string;// 装修页面组件Id
  targetId: number;// 装修页面id
}
export async function setWelFare(params: SetWelFareParams) {
  let { pageElementId, ...data } = params
  return post({ url: `/elements/${pageElementId}/theme`, params: data, showToast: true, successToast: true });
}

// 添加标题组件
interface SetTitleParams {
  pageElementId: string;// 装修页面组件Id

  id?: number;// 组件Id,修改组件时必传
  elementColor: string;// 组件颜色
  elementUrlType: number;// 组件链接类型 1：分类链接、 2：商品详情、3：装修页面、4：自定义链接
  h5Url: string;// h5Url
  imageUrl: string;// 图片url
  mainTitle: string;// 主标题
  mainTitleColor: string;// 主标题颜色
  seq: number;// 排序
  subTitle: string;// 副标题
  subTitleColor: string;// 副标题颜色
  titleType: number;// 标题类型 1：文字 2：图片
  urlWord: string;// 链接文字
  urlWordColor: string;// 链接文字颜色
}
export async function setTitle(params: SetTitleParams) {
  let { pageElementId, ...data } = params
  return post({ url: `/elements/${pageElementId}/titles`, params: data, showToast: true, successToast: true });
}
