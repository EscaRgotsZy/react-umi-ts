/**
 * 物流模板
 */
import { Effect, Reducer } from 'umi';
import { getFreTemInfo, getOptionDistrict, getCompanies } from '@/services/logistics/freight'


export const Mode = {
  isByweight: 1,
  isByPiece: 2,
}

export interface CurLayerInfoType {
  type: 'add' | 'edit';
  tag: 1 | 2;
  index: number;
  selected: any[]
}
export interface StateType {
  editId: string;
  deliveryCompanyList: any[];
  baseInfo: any;
  detailStatus: any;
  areaList: any[];
  isPickedUp: boolean;
  chargeMode: number;
  defaultDeliveryWay: any,
  areaDeliveryWay: any[],
  notDeliveryWay: any[],
  showAreaLayer: boolean,
  selectedAll: any[],
  curLayerInfo: CurLayerInfoType
}




export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    setStatus: Effect;
    fetchFreight: Effect;
    fetchArea: Effect;
    fetchCompanies: Effect;
  };
  reducers: {
    saveEditId: Reducer<StateType>;
    saveMode: Reducer<StateType>;
    setBaseInfo: Reducer<StateType>;
    saveArea: Reducer<StateType>;
    saveStatus: Reducer<StateType>;
    saveCompanies: Reducer<StateType>;
    savePickedUp: Reducer<StateType>;
    setDefaultDeliveryWay: Reducer<StateType>;
    setAreaDeliveryWay: Reducer<StateType>;
    setNotDeliveryWay: Reducer<StateType>;
    setShowAreaLayer: Reducer<StateType>;
    saveCurLayerInfo: Reducer<StateType>;
    saveSelectedAll: Reducer<StateType>;
    clearState: Reducer<StateType>;
  };
}

export const DefaultDeliveryWayItem = {
  firstPiece: '',// 1件 / 几千克
  firstPieceFee: '',// 1件多少元 / 几千克多少元
  addPiece: '',// 每增加
  addPieceFee: '',// 每增加 xx 多少费用
  deliveryCompanyId: '',// 关联快递公司id
  fullMinusCount: '',// 满减数量
  fullMinusUnit: 2,// 默认单位是元 （1 件 2元）
  isConditionPinkage: 0,// 是否指定条件包邮：1是 0否
  isDeliveryCompany: 0,// 是否指定快递公司：1是 0否
}

export const AreaDeliveryWayItem = {
  ...DefaultDeliveryWayItem,
  districts: [],// 接口需要 {key: 130100, title: "石家庄市"}
  districtInfo: '',// 前端显示用 {key: 130100, title: "石家庄市"}
}


export const NotDeliveryWayItem = {
  districts: [],// 接口需要 {key: 130100, title: "石家庄市"}
  districtInfo: '',// 前端显示用 {key: 130100, title: "石家庄市"}
  notDeliveryReason: '',// 因国家会议导致的运费上升
}

const Model: ModelType = {
  namespace: 'freight',

  state: {
    editId: '',// 编辑id
    detailStatus: {// 页面打开状态
      isAdd: false,
      isEdit: false,
    },
    deliveryCompanyList: [],// 快递公司列表
    areaList: [],// 地区列表
    chargeMode: 2,// 计费模式  1按重量 2按件数

    baseInfo: {
      name: '',// 模板名称
      addr: [],// 发货地址
    },

    isPickedUp: false,// 是否自提

    defaultDeliveryWay: {// 默认配置
      ...DefaultDeliveryWayItem
    },
    areaDeliveryWay: [],// 指定包含的地区
    notDeliveryWay: [],// 指定不包含地区

    showAreaLayer: false,
    selectedAll: [],// 已选列表 - 全量的
    curLayerInfo: {
      type: 'add',// add 新增 edit 编辑
      tag: 1,// 1指定包含区域 2指定不包含区域
      index: 0,// 第几个
      selected: [],// 当前已选择的
    },
  },

  effects: {
    *setStatus({ payload }, { call, put }) {
      let { id, copy } = payload;
      if (id) {
        yield put({
          type: 'saveEditId',
          payload: id
        })
      }
      if (id || copy) {
        yield put({
          type: 'fetchFreight',
          payload: id || copy,
        })
      }
      yield put({
        type: 'saveStatus',
        payload: {
          isAdd: !id,
          isEdit: !!id,
        }
      });
    },
    *fetchFreight({ payload }, { call, put }): any {
      const res = yield call(getFreTemInfo, { id: payload })
      console.log("*fetchFreight -> res", res)
      if (!res) return false;
      let { name, provinceId, cityId, areaId, chargeMode, selfTaking, defaultDeliveryWay, areaDeliveryWay, notDeliveryWay } = res;
      defaultDeliveryWay = defaultDeliveryWay || {};
      areaDeliveryWay = areaDeliveryWay || {};
      notDeliveryWay = notDeliveryWay || {};
      let defaultArea = defaultDeliveryWay.deliveryWays || [];
      let way = areaDeliveryWay.deliveryWays || [];
      let notWay = notDeliveryWay.deliveryWays || [];
      let selectAll:any = [];
      yield put({
        type: 'setBaseInfo',
        payload: {
          name,
          addr: [provinceId + '', cityId + '', areaId + '']
        }
      })
      yield put({
        type: 'saveMode',
        payload: chargeMode
      })
      yield put({
        type: 'savePickedUp',
        payload: !!selfTaking
      })
      yield put({
        type: 'setDefaultDeliveryWay',
        payload: defaultArea[0] || DefaultDeliveryWayItem
      })
      yield put({
        type: 'setAreaDeliveryWay',
        payload: way.map((v: any) => {
          let districtInfo = [];
          try{
            districtInfo = JSON.parse(v.districtInfo);
          }catch(err) {}

          let districts = (v.districts || []).map((o: any) => {
            let obj = {
              key: o.districtId,
              title: o.districtName,
              level: 3
            }
            selectAll.push(obj)
            return obj
          })

          return {
            ...v,
            districtInfo,
            districts
          }
        })
      })
      yield put({
        type: 'setNotDeliveryWay',
        payload: notWay.map((v: any) => {
          let districtInfo = [];
          try{
            districtInfo = JSON.parse(v.districtInfo);
          }catch(err) {}

          let districts = (v.districts || []).map((o: any) => {
            let obj = {
              key: o.districtId,
              title: o.districtName,
              level: 3
            }
            selectAll.push(obj)
            return obj
          })
          return {
            ...v,
            districtInfo,
            districts
          }
        })
      })
      yield put({
        type: 'saveSelectedAll',
        payload: selectAll
      })
    },
    // 获取地区
    *fetchArea({ payload }, { call, put }) {
      const res = yield call(getOptionDistrict, payload)
      yield put({
        type: 'saveArea',
        payload: res
      });
    },
    // 获取快递公司列表
    *fetchCompanies({ payload }, { call, put }) {
      const res = yield call(getCompanies, payload)
      yield put({
        type: 'saveCompanies',
        payload: res
      });
    }
  },

  reducers: {
    saveEditId(state, { payload }): StateType {
      return {
        ...(state as StateType),
        editId: payload,
      };
    },
    saveStatus(state, { payload }): StateType {
      return {
        ...(state as StateType),
        detailStatus: payload,
      };
    },
    saveArea(state, { payload }): StateType {
      return {
        ...(state as StateType),
        areaList: payload,
      };
    },
    saveCompanies(state, { payload }): StateType {
      return {
        ...(state as StateType),
        deliveryCompanyList: payload,
      };
    },
    savePickedUp(state, { payload }): StateType {
      return {
        ...(state as StateType),
        isPickedUp: payload,
      };
    },
    setBaseInfo(state, { payload }): StateType {
      return {
        ...(state as StateType),
        baseInfo: payload,
      };
    },
    saveMode(state, { payload }): StateType {
      return {
        ...(state as StateType),
        chargeMode: payload,
      };
    },
    setDefaultDeliveryWay(state, { payload }): StateType {
      return {
        ...(state as StateType),
        defaultDeliveryWay: payload,
      };
    },
    setAreaDeliveryWay(state, { payload }): StateType {
      return {
        ...(state as StateType),
        areaDeliveryWay: payload,
      };
    },
    setNotDeliveryWay(state, { payload }): StateType {
      return {
        ...(state as StateType),
        notDeliveryWay: payload,
      };
    },
    setShowAreaLayer(state, { payload }): StateType {
      return {
        ...(state as StateType),
        showAreaLayer: payload,
      };
    },
    saveCurLayerInfo(state, { payload }): StateType {
      return {
        ...(state as StateType),
        curLayerInfo: payload,
      };
    },
    saveSelectedAll(state, { payload }): StateType {
      return {
        ...(state as StateType),
        selectedAll: payload,
      };
    },

    clearState(state, { payload }): StateType {
      return {
        editId: '',// 编辑id
        detailStatus: {// 页面打开状态
          isAdd: false,
          isEdit: false,
        },
        deliveryCompanyList: [],// 快递公司列表
        areaList: [],// 地区列表
        chargeMode: 2,// 计费模式  1按重量 2按件数

        baseInfo: {
          name: '',// 模板名称
          addr: [],// 发货地址
        },

        isPickedUp: false,// 是否自提

        defaultDeliveryWay: {// 默认配置
          ...DefaultDeliveryWayItem
        },
        areaDeliveryWay: [],// 指定包含的地区
        notDeliveryWay: [],// 指定不包含地区

        showAreaLayer: false,
        selectedAll: [],// 已选列表 - 全量的
        curLayerInfo: {
          type: 'add',// add 新增 edit 编辑
          tag: 1,// 1指定包含区域 2指定不包含区域
          index: 0,// 第几个
          selected: [],// 当前已选择的
        },
      }
    },
  },
};

export default Model;
