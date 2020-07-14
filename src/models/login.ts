import { stringify } from 'querystring';
import { history, Reducer, Effect, request, useModel } from 'umi';
import { goLogin, getUserInfo, getCompaniesInfo, getRouters } from '@/services/common';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { DefaultCompany, tokenManage } from '@/constants/storageKey';

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
        const response = yield call(goLogin, payload);
        yield call(getCompaniesInfo);
        yield call(getUserInfo);
        yield put({
          type: 'changeLoginStatus',
          payload: 'ok',
        });
        if (response) {

          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params as { redirect: string };
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }
          history.replace(redirect || '/');
        }
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
