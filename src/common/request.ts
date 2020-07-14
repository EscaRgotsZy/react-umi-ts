import axios from 'axios';
import QS from 'qs';
import { message } from 'antd';
import { history } from 'umi';
import config from '@/config/index';
import { tokenManage } from '@/constants/storageKey';

axios.defaults.timeout = 60000; // 请求超时时间
// axios.defaults.baseURL = config.server;
axios.defaults.withCredentials = true;

// 请求拦截器
axios.interceptors.request.use(
  (options) => {
    options.headers['Content-Type'] = 'application/json';
    return options;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      history.push('/user/login');
      return;
    }
    return response.data;
  },
  (error) => {
    console.log('error', error);
    return {
      message: '网络请求异常, 请检查您的网络设置后刷新重试!',
    };
  },
);

function checkToken(url:string){
  let len = config.excludeURIs.filter(v=> url.indexOf(v) >= 0)
  if(len.length){
    return {}
  }
  return {
    Authorization: tokenManage.get()
  }
}

interface SendRequestParamsType {
  baseUrl?: string; // domain
  url?: string; // 接口地址
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'; // 请求方式
  params?: object; // 请求参数
  options?: object; // axios 自定义配置
  showToast?: boolean; // 接口报错是否弹错误信息
  successToast?: boolean; // 接口成功是否提示
}
function sendRequest(payload: SendRequestParamsType): Promise<any> {
  let { baseUrl=config.server, url, method, params, options, showToast = true, successToast = false } = payload;
  
  let defaultOptions: any = {
    url: baseUrl + url,
    method,
    transformRequest: [
      function (data?: object) {
        return JSON.stringify(data);
      },
    ],
    paramsSerializer: function (params?: object) {
      return QS.stringify(params);
    },
  };

  if (method == 'GET') {
    defaultOptions.params = params;
  } else {
    defaultOptions.data = params;
  }
  let _options: any = Object.assign({}, defaultOptions, options || {});

  _options.headers = {
    ..._options.headers,
    ...checkToken(url as string),
    platform: 'corp'
  };
  return new Promise((resolve) => {
    axios
      .request(_options)
      .then((result: any) => {
        let { code, data, message: desc } = result;
        if (code === 200) {
          resolve([false, data]);
          successToast && message.success(desc);
        } else {
          if (showToast && desc)
            message.error(desc.length > 30 ? desc.substr(0, 30) + '...' : desc);
          if (showToast && !desc) message.error(`${code} 业务异常`);
          resolve([true, data]);
        }
      })
      .catch(() => {})
      .finally(() => {});
  });
}
export let get = (options: object) => sendRequest({ ...options, method: 'GET' });
export let post = (options: object) => sendRequest({ ...options, method: 'POST' });
export let put = (options: object) => sendRequest({ ...options, method: 'PUT' });
export let del = (options: object) => sendRequest({ ...options, method: 'DELETE' });
