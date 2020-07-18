import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import { goLogin, getUserInfo, getCompaniesInfo, getRouters } from '@/services/common';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { tokenManage } from '@/constants/storageKey';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}
const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        yield call(goLogin, payload);
        yield call(getCompaniesInfo);
        yield call(getUserInfo);
        yield put({
          type: 'changeLoginStatus',
          payload: 'ok',
        });
      } catch (e) {
        console.log('错误异常--', e)
      }

    },

    logout() {
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        tokenManage.clear()
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },

  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority('admin');
      return {
        ...state,
        status: payload,// 'ok' : 'error'
        type: 'account',
      };
    },
  },
};

export default Model;
