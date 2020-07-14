import { Local } from '@/utils/storage';

const APP_TOKEN = 'APP_TOKEN'; // 登录验证
const USER_ID = 'USER_ID'; //
const USER_INFO = 'USER_INFO'; //
const DEFAULT_COMPANY = 'DEFAULT_COMPANY'; //
const DEFAULT_ROUTERS = 'DEFAULT_ROUTERS'; // 登录路由
const COMPANIES_INFO = 'COMPANIES_INFO';
// token管理
export let tokenManage = {
  get: () => Local.getItem(APP_TOKEN) || '',
  set(value: any) {
    Local.setItem(APP_TOKEN, value);
  },
  clear() {
    Local.removeItem(APP_TOKEN);
  },
};

// userId管理
export let userIdManage = {
  get: () => Local.getItem(USER_ID) || '',
  set(value: any) {
    Local.setItem(USER_ID, value);
  },
  clear() {
    Local.removeItem(USER_ID);
  },
};

// userInfo管理
export let userInfoManage = {
  get: () => Local.getItem(USER_INFO) || '',
  set(value: any) {
    Local.setItem(USER_INFO, value);
  },
  clear() {
    Local.removeItem(USER_INFO);
  },
};
// userCompaniesManage管理

export let userCompaniesManage = {
  get: () => Local.getItem(COMPANIES_INFO) || '',
  set(value: any) {
    Local.setItem(COMPANIES_INFO, value);
  },
  clear() {
    Local.removeItem(COMPANIES_INFO);
  },
};
// 登录场景 - 默认企业管理
export let DefaultCompany = {
  get: () => Local.getItem(DEFAULT_COMPANY) || '',
  set(value: any){
    Local.setItem(DEFAULT_COMPANY, value)
  },
  clear(){
    Local.removeItem(DEFAULT_COMPANY)
  }
}
// 登录场景 - 默认路由
export let defaultRouters = {
  get: () => Local.getItem(DEFAULT_ROUTERS) || '',
  set(value: any){
    Local.setItem(DEFAULT_ROUTERS, value)
  },
  clear(){
    Local.removeItem(DEFAULT_ROUTERS)
  }
}
