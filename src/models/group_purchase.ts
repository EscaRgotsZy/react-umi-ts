/**
 * 多人团开团
 */
import { Effect, Reducer } from 'umi';
import { getGrouponInfo } from '@/services/activity/group_purchase'
import { Modal } from 'antd'

export interface StateType {
  activityId?: any;
  activityStatus?: any;
  current?: string;
  activityInfo?: any;
  selGoods?: any[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchActivity: Effect;
    setStatus: Effect;
    changeStep: Effect;
    changeGoods: Effect;
  };
  reducers: {
    saveActivityId: Reducer<StateType>;
    saveCurrentStep: Reducer<StateType>;
    saveGoods: Reducer<StateType>;
    saveStatus: Reducer<StateType>;
    saveActivityInfo: Reducer<StateType>;
    clearState: Reducer<StateType>;
  };
}


const Model: ModelType = {
  namespace: 'group_purchase',

  state: {
    current: 'step1',
    activityId: '',
    selGoods: [],
    activityInfo: {
      groupName: '',
      activityTime: '',
      backgroundColor: "#F3B74B",
      countDown: "24",
      limitNumber: 0,
      limitUserType: 1,
      peopleNumber: 0,
      groupPic: '',
      sharePic: '',
      shareTitle: "限时超低价，快来抢购吧，超多商品，琳琅满目",
      shareContent: "爱拼才会赢，团购万家亲，超多商品，限时超低价，快来抢购吧～",
    },
    activityStatus: {
      isAdd: false,
      isEdit: false,
      isRead: false,
    }
  },

  effects: {
    *setStatus({ payload }, { put }) {
      let { id, copy, read } = payload;
      let activityStatus = {
        isAdd: !id,
        isEdit: !!id,
        isRead: !!read,
      }
      if (id || copy) {
        yield put({
          type: 'fetchActivity',
          payload: {
            id: id || copy,
            type: !!copy ? 2 : 1,
            activityStatus
          }
        })
      }
      yield put({
        type: 'saveStatus',
        payload: activityStatus
      });
    },
    *changeStep({ payload }, { put }) {
      yield put({
        type: 'saveCurrentStep',
        payload: payload,
      });
    },
    *changeGoods({ payload }, { put }) {
      yield put({
        type: 'saveGoods',
        payload: payload,
      });
    },
    *fetchActivity({ payload }, { call, put }) {
      let { activityStatus, ...params} = payload;
      const res = yield call(getGrouponInfo, params)

      if (res) {
        let { id, activityInfo, selGoods } = res;

        if(activityStatus.isAdd){
          let offLineGoodsList = selGoods.filter((v:any)=> v.status !== 1)
          let occupiedGoodsList = selGoods.filter((v:any)=> !v.groupBuyProductStatus)
          offLineGoodsList.length && Modal.warning({
            content: offLineGoodsList.map((v:any)=> `商品：${v.productName}已下线。`)
          })
          occupiedGoodsList.length && Modal.warning({
            content: occupiedGoodsList.map((v:any)=> `商品：${v.productName}已参加了其他活动。`)
          })
          yield put({
            type: 'saveGoods',
            payload: selGoods.filter((v:any)=> v.status === 1 && v.groupBuyProductStatus)
          })
        }else{
          yield put({
            type: 'saveGoods',
            payload: selGoods
          })
        }

        yield put({
          type: 'saveActivityInfo',
          payload: activityInfo
        })
        yield put({
          type: 'saveActivityId',
          payload: id
        })
      }
    },
  },

  reducers: {
    saveStatus(state, { payload }) {
      return {
        ...state,
        activityStatus: payload,
      };
    },
    saveCurrentStep(state, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },
    saveGoods(state, { payload }) {
      return {
        ...state,
        selGoods: payload,
      };
    },
    saveActivityInfo(state, { payload }) {
      return {
        ...state,
        activityInfo: payload,
      };
    },
    saveActivityId(state, { payload }) {
      return {
        ...state,
        activityId: payload,
      };
    },
    clearState(state, { payload }) {
      return {
        current: 'step1',
        activityId: '',
        selGoods: [],
        activityInfo: {
          groupName: '',
          activityTime: '',
          backgroundColor: "#F3B74B",
          countDown: "24",
          limitNumber: 0,
          limitUserType: 1,
          peopleNumber: 0,
          groupPic: '',
          sharePic: '',
          shareTitle: "限时超低价，快来抢购吧，超多商品，琳琅满目",
          shareContent: "爱拼才会赢，团购万家亲，超多商品，限时超低价，快来抢购吧～",
        },
        activityStatus: {
          isAdd: false,
          isEdit: false,
          isRead: false,
        }
      }
    },
  },
};

export default Model;
