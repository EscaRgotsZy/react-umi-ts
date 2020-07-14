/**
 * 首页装修
 */
import { Reducer, Effect } from 'umi';
import { handlePicUrl } from '@/utils/utils'
import {
  getPage, sortComponents, delComponents, addComponents, getComponentInfo, // 中间部分
  GetComponentInfoParams,
  setPlaceholder, setTitle, setWelFare, setGoods, setImg, setIcon, setTabs, setLabel, // 右侧组件部分
  SetPlaceholderParams,
} from '@/services/shop/renovation';
import { getShopList } from '@/services/common/index'


export const applyDrag = (arr: any, dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

// 组件类型 1：分类TAB、2：ICON、3：图片导航、4：特价福利、5：标签TAB、6：标题 、7：空白占位 、8：商品组件
let componentStatus = new Map()
componentStatus.set(1, {
  title: '分类TAB',
  icon: require('@/assets/renovation/classify-icon.png'),
})
componentStatus.set(2, {
  title: 'ICON',
  icon: require('@/assets/renovation/icons-icon.png'),
})
componentStatus.set(3, {
  title: 'Banner',
  icon: require('@/assets/renovation/img-icon.png'),
})
componentStatus.set(4, {
  title: '特价福利',
  icon: require('@/assets/renovation/welfare-icon.png'),
})
componentStatus.set(5, {
  title: '标签TAB',
  icon: require('@/assets/renovation/tabbar-icon.png'),
})
componentStatus.set(6, {
  title: '标题',
  icon: require('@/assets/renovation/title-icon.png'),
})
componentStatus.set(7, {
  title: '空白占位',
  icon: require('@/assets/renovation/placeholder-icon.png'),
})
componentStatus.set(8, {
  title: '商品模块',
  icon: require('@/assets/renovation/goods-icon.png'),
})
export const imgItemData = {
  imageUrl: '',// 图片链接
  elementUrlType: 1,// 组件链接类型 1：分类链接、 2：商品详情、3：装修页面、4：自定义链接
  type: 1,// 1系统链接 2自定义链接
  h5Url: '',// 4：自定义链接 选择的信息
  tagInfo: {
    id: '',
    name: '',
    key: '',
  }
}

export const titleItemData = {
  titleType: 2,// 标题类型 1：文字 2：图片
  imageUrl: '',// 图片url
  elementColor: '#FFFFFF',// 组件颜色
  elementUrlType: '',// 组件链接类型 1：分类链接、 2：商品详情、3：装修页面、4：自定义链接
  h5Url: '',//
  mainTitle: '',// 主标题
  mainTitleColor: '#333333',// 主标题颜色
  subTitle: '',// 副标题
  subTitleColor: '#999999',// 副标题颜色
  urlWord: '',// 链接文字
  urlWordColor: '#999999',// 链接文字颜色
  tagInfo: {
    id: '',
    name: '',
    key: ''
  }
}
export const iconItemData = {
  elementColor: '#333333',// 名称颜色
  elementName: '',// icon名称
  imageUrl: '',// icon图片
  type: 1,// 1系统链接 2自定义链接
  h5Url: '',// 4：自定义链接 选择的信息
  tagInfo: {
    id: '',
    name: '',
    key: ''
  }
}
export const tabItemData = {
  elementName: '',//
  elementUrlType: 1,// Tab链接类型 1：分类链接、4：自定义链接	
  h5Url: '',
  tabCategory: []
}
export const LabelItemData = {
  elementName: '',// 	Tag名称
  elementTags: [],// 关联标签信息
}

      
export const ComponentListData = componentStatus;

export interface CurComponentType {
  type: number;
  id: number;
}
export interface StateType {
  pageId: number;
  shopList: any[];
  componentList: any[];
  curComponent: CurComponentType;
  componentLoading: boolean;

  placeholderData: any;
  titleData: any;
  welfareData: any;
  goodsData: any;
  imgData: any;
  iconData: any;
  tabData: any;
  labelData: any;
}

export interface RenovationModelType {
  namespace: string;
  state: StateType;
  effects: {
    getShops: Effect;
    getComponentsList: Effect;
    sortComponents: Effect;
    addComponents: Effect;
    delComponents: Effect;
    changeCurComponent: Effect;
    submitPlaceholder: Effect;
    submitWelfare: Effect;
    submitGoods: Effect;
    submitTitle: Effect;
    submitImg: Effect;
    submitIcon: Effect;
    submitTab: Effect;
    submitLabel: Effect;
  };
  reducers: {
    setShops: Reducer<StateType>;
    setPageId: Reducer<StateType>;
    reflow: Reducer<StateType>;
    selComponent: Reducer<StateType>;
    selComponentLoading: Reducer<StateType>;
    selPlaceholder: Reducer<StateType>;
    selTitle: Reducer<StateType>;
    selWelfare: Reducer<StateType>;
    selGoods: Reducer<StateType>;
    selImg: Reducer<StateType>;
    selIcon: Reducer<StateType>;
    selTab: Reducer<StateType>;
    selLabel: Reducer<StateType>;
    clear: Reducer<StateType>;
  };
}

const Model: RenovationModelType = {
  namespace: 'renovation',

  state: {
    pageId: -1,// 页面id
    shopList: [],// 店铺列表
    componentList: [],// 已选择的组件列表
    curComponent: {// 当前操作的组件
      type: -1,// 组件类型
      id: -1,// 组件id
    },
    componentLoading: false,// 加载组件数据或者提交组件数据

    placeholderData: {// 空白占位数据
      val: 0
    },

    titleData: titleItemData,// 标题组件 数据

    welfareData: {// 特价福利组件 数据
      id: '',
      name: ''
    },

    goodsData: [],// 商品组件 数据

    imgData: {// 图片组件 数据
      bannerType: 2,// 图片导航类型 1：胶囊图片 2：banner
      bannerElements: [imgItemData]
    },

    iconData: [iconItemData],// icon组件 数据

    tabData: {// tabbar组件 数据
      backgroundImage: '',// 
      buttonImage: '',// 
      tabElements: [
        tabItemData
      ],
    },

    labelData: {// label组件 数据
      elementProducts: [],// 干预品
      elementShops: [],// 店铺
      productType: ['1'],// 
      tagElements: [LabelItemData],// 
    }
    
  },

  effects: {
    *getShops({ payload }, { call, put }): any {
      const res = yield call(getShopList, { page:1, size: 499 });
      if (!res) return false;
      yield put({
        type: 'setShops',
        payload: res.records || []
      });
    },
    *getComponentsList({ payload }, { call, put }): any {
      let { id } = payload;
      yield put({
        type: 'setPageId',
        payload: id,
      });
      const res = yield call(getPage, { id });
      if (!res) return false;
      let { componentsInfo } = res;
      let newList = componentsInfo.map((v: any) => {
        return [v.elementType, {
          id: v.id,
          ...componentStatus.get(v.elementType)
        }]
      })
      yield put({
        type: 'reflow',
        payload: newList
      });
    },
    *addComponents({ record }, { call, put, select }): any {
      const { pageId, componentList } = yield select((state: any) => state.renovation);
      yield put({
        type: 'reflow',
        payload: applyDrag(componentList, record)
      });
      let { payload } = record;
      let elementType = payload[0];
      const [err, data] = yield addComponents({ elementType, pageId })
      if (err) {
        yield put({
          type: 'getComponentsList',
          payload: pageId
        });
        return false;
      }
      let { id } = data;
      let newPayload = [...payload];
      newPayload[1] = {
        ...newPayload[1],
        id
      }
      let newList = applyDrag(componentList, { ...record, payload: newPayload })
      yield put({
        type: 'sortComponents',
        payload: newList
      });

    },
    *sortComponents({ payload }, { call, put, select }) {
      yield put({
        type: 'reflow',
        payload
      });
      let ids = payload.map((v: any) => v[1]['id'])
      const [err] = yield call(sortComponents, { ids });
      const pageId = yield select((state: any) => state.renovation.pageId);
      if (err) {
        yield put({
          type: 'getComponentsList',
          payload: pageId
        });
      }
    },
    *delComponents({ payload }, { call, put }) {
      let { id, list } = payload;
      const [err] = yield call(delComponents, { id });
      if (!err) {
        yield put({
          type: 'reflow',
          payload: list
        });
        yield put({
          type: 'selComponent',
          payload: {
            type: -1,
            id: -1,
          }
        });
      }
    },
    // 选中的时候 回显组件数据
    *changeCurComponent({ payload }, { call, put }): any {
      let params: GetComponentInfoParams = {
        pageElementId: payload.id,
      }
      yield put({ type: 'selComponentLoading', payload: true })
      yield put({ type: 'selComponent', payload: payload })
      let [err, data] = yield call(getComponentInfo, params);
      yield put({ type: 'selComponentLoading', payload: false })
      if (err) return false;
      if (payload.type === 1) {// 分类TAB
        if(!data){
          yield put({
            type: 'selTab',
            payload: {// tabbar组件 数据
              backgroundImage: '',// 
              buttonImage: '',// 
              tabElements: [
                tabItemData
              ]
            }
          })
          return false;
        }
        let { elements:tabElements, backgroundImage, buttonImage } = data;
        tabElements = (tabElements || []).map((v:any)=>{
          return {
            elementName: v.elementName,
            elementUrlType: v.elementUrlType,
            h5Url: v.h5Url,
            tabCategory: v.elementCategories
          }
        })

        yield put({
          type: 'selTab',
          payload: {
            backgroundImage,
            buttonImage,
            tabElements
          }
        })
      }
      if (payload.type === 2) {// ICON
        if(!data){
          yield put({
            type: 'selIcon',
            payload: [iconItemData],
          })
          return false;
        }
        let res = data.elements || [];
        yield put({
          type: 'selIcon',
          payload: res.map((v:any)=>{
            let tagInfo = {
              id: v.targetId,
              name: v.targetName,
              key: v.elementUrlType + ''
            }
            return {
              elementColor: v.elementColor || '#333333',
              elementName: v.elementName,
              imageUrl: v.imageUrl,
              h5Url: v.h5Url,
              type: v.elementUrlType < 4?1:2,
              tagInfo,
            }
          })
        })
      }
      if (payload.type === 3) {// 图片导航
        if (!data){
          yield put({
            type: 'selImg',
            payload: {
              bannerType: 2,
              bannerElements: [imgItemData]
            }
          })
          return false;
        }
        yield put({
          type: 'selImg', payload: {
            bannerType: data.bannerType,
            bannerElements: (data.elements || []).map((v: any) => {
              let tagInfo = {
                id: v.targetId,
                name: v.targetName,
                key: v.elementUrlType + ''
              }
              return {
                imageUrl: v.imageUrl,// 图片链接
                elementUrlType: v.elementUrlType,// 组件链接类型 1：分类链接、 2：商品详情、3：装修页面、4：自定义链接
                type: v.elementUrlType <= 3? 1:2,// 1系统链接 2自定义链接
                h5Url: v.h5Url || '',// 4：自定义链接 选择的信息
                tagInfo
              }
            })
          }
        })

      }
      if (payload.type === 4) {// 特价福利
        if (!data){
          yield put({
            type: 'selWelfare',
            payload: {
              id: '',
              name: ''
            }
          })
          return false;
        }
        data = data || {};
        data = data.elements || []
        if(!data.length)return false;
        let res = data[0]
        yield put({ type: 'selWelfare', payload: { id: res.targetId, name: res.targetName } })
      }
      if (payload.type === 5) {// 标签TAB
        if(!data){
          yield put({
            type: 'selLabel',
            payload: {// label组件 数据
              elementProducts: [],// 干预品
              elementShops: [],// 店铺
              productType: ['1'],// 
              tagElements: [LabelItemData],// 
            }
          })
          return false;
        }
        let { productType, elementProducts, elementShops, elements } = data;
        productType = productType || '';
        productType = typeof productType === 'string' ? productType: '';
        elementShops = Array.isArray(elementShops)?elementShops:[];
        elementProducts = Array.isArray(elementProducts)?elementProducts:[];
        elements = Array.isArray(elements)?elements:[];

        yield put({
          type: 'selLabel',
          payload: {
            elementProducts: elementProducts.map((v:any)=>{// 干预品
              return {
                id: v.productId,
                name: v.productName,
                img: handlePicUrl(v.productPic),
                seq: v.seq || 0,
              }
            }),
            elementShops: elementShops.map((v:any)=> v.shopId),// 店铺
            productType: productType.split(','),// 
            tagElements: elements.map((v:any)=>{
              let elementTags = Array.isArray(v.elementTags)? v.elementTags: [];
              return {
                elementName: v.elementName || '',
                elementTags
              }
            })
          }
        })
      }
      if (payload.type === 6) {// 标题
        if (!data){
          yield put({
            type: 'selTitle',
            payload: titleItemData
          })
          return false;
        }
        data = data || {};
        data = data.elements || [];
        if(!data.length)return false;
        let res = data[0]

        yield put({
          type: 'selTitle', payload: {
            titleType: res.titleType,// 标题类型 1：文字 2：图片
            imageUrl: res.imageUrl,// 图片url
            elementColor: res.elementColor || '#FFFFFF',// 组件颜色
            h5Url: res.h5Url,//
            mainTitle: res.mainTitle || '',// 主标题
            mainTitleColor: res.mainTitleColor || '#333333',// 主标题颜色
            subTitle: res.subTitle || '',// 副标题
            subTitleColor: res.subTitleColor || '#999999',// 副标题颜色
            urlWord: res.urlWord || '',// 链接文字
            urlWordColor: res.urlWordColor || '#999999',// 链接文字颜色
            elementUrlType: res.elementUrlType,// 组件链接类型 1：分类链接、 2：商品详情、3：装修页面、4：自定义链接
            tagInfo: {
              id: res.targetId,
              name: res.targetName,
              key: res.elementUrlType + ''
            }
          }
        })
      }
      if (payload.type === 7) {// 空白占位
        if (!data){
          yield put({ type: 'selPlaceholder', payload: {val: 0}})
          return false;
        }
        let res = data.elements || []
        res = res[0] || {}
        yield put({ type: 'selPlaceholder', payload: { val: +res.placePx } })
      }
      if (payload.type === 8) {// 商品模块
        if (!data){
          yield put({
            type: 'selGoods', payload: []
          })
          return false;
        }
        let res = data || {};
        let elements = res.elements || [];
        if (!elements.length) return false;
        elements = elements[0] || {};
        let elementProducts = elements.elementProducts || []
        yield put({
          type: 'selGoods', payload: elementProducts.map((v: any) => ({
            id: v.productId,
            name: v.productName,
            img: handlePicUrl(v.productPic)
          }))
        })
      }

    },
    // 提交空白占位
    *submitPlaceholder({ payload }, { call, put, select }) {
      const { curComponent, placeholderData } = yield select((state: any) => state.renovation);
      let params: SetPlaceholderParams = {
        pageElementId: curComponent.id,
        placePx: placeholderData.val
      }
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setPlaceholder, params);
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交标题
    *submitTitle({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setTitle, { pageElementId: curComponent.id, ...payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交特价福利
    *submitWelfare({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setWelFare, { pageElementId: curComponent.id, targetId: payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交商品
    *submitGoods({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setGoods, { pageElementId: curComponent.id, elementProducts: payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交图片
    *submitImg({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setImg, { pageElementId: curComponent.id, data: payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交icon
    *submitIcon({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setIcon, { pageElementId: curComponent.id, data: payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交tab
    *submitTab({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setTabs, { pageElementId: curComponent.id, ...payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },
    // 提交label
    *submitLabel({ payload }, { call, put, select }) {
      const { curComponent } = yield select((state: any) => state.renovation);
      yield put({ type: 'selComponentLoading', payload: true })
      yield call(setLabel, { pageElementId: curComponent.id, ...payload });
      yield put({ type: 'selComponentLoading', payload: false })
    },

  },

  reducers: {
    setShops(state, { payload }) {
      return {
        ...(state as StateType),
        shopList: payload
      }
    },
    setPageId(state, { payload }) {
      return {
        ...(state as StateType),
        pageId: payload
      }
    },
    reflow(state, { payload }) {
      return {
        ...(state as StateType),
        componentList: payload
      }
    },
    selComponent(state, { payload }) {
      return {
        ...(state as StateType),
        curComponent: payload
      }
    },
    // 设置组件回显/提交 loading
    selComponentLoading(state, { payload }) {
      return {
        ...(state as StateType),
        componentLoading: payload
      }
    },

    // 设置空白组件信息
    selPlaceholder(state, { payload }) {
      return {
        ...(state as StateType),
        placeholderData: payload
      }
    },
    // 设置标题信息
    selTitle(state, { payload }) {
      return {
        ...(state as StateType),
        titleData: payload
      }
    },
    // 设置特价福利信息
    selWelfare(state, { payload }) {
      return {
        ...(state as StateType),
        welfareData: payload
      }
    },
    // 设置商品信息
    selGoods(state, { payload }) {
      return {
        ...(state as StateType),
        goodsData: payload
      }
    },
    // 设置图片
    selImg(state, { payload }) {
      return {
        ...(state as StateType),
        imgData: payload
      }
    },
    // 设置icon
    selIcon(state, { payload }) {
      return {
        ...(state as StateType),
        iconData: payload
      }
    },
    // 设置tab
    selTab(state, { payload }) {
      return {
        ...(state as StateType),
        tabData: payload
      }
    },
    // 设置label
    selLabel(state, { payload }) {
      return {
        ...(state as StateType),
        labelData: payload
      }
    },
    clear() {
      return {
        pageId: -1,// 页面id
        shopList: [],// 店铺列表
        componentList: [],// 已选择的组件列表
        curComponent: {// 当前操作的组件
          type: -1,// 组件类型
          id: -1,// 组件id
        },
        componentLoading: false,// 加载组件数据或者提交组件数据

        placeholderData: {// 空白占位数据
          val: 0
        },

        titleData: titleItemData,// 标题组件 数据

        welfareData: {// 特价福利组件 数据
          id: '',
          name: ''
        },

        goodsData: [],// 商品组件 数据

        imgData: {// 图片组件 数据
          bannerType: 2,// 图片导航类型 1：胶囊图片 2：banner
          bannerElements: [imgItemData]
        },

        iconData: [iconItemData],// icon组件 数据

        tabData: {// tabbar组件 数据
          backgroundImage: '',// 
          buttonImage: '',// 
          tabElements: [
            tabItemData
          ],
        },

        labelData: {// label组件 数据
          elementProducts: [],// 干预品
          elementShops: [],// 店铺
          productType: ['1'],// 
          tagElements: [LabelItemData],// 
        }

      }
    },
  },
};

export default Model;