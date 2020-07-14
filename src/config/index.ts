import logo from '../assets/logo.png';

let server = '';// 接口地址
let loginServer = '';// 登录接口地址
let controlService = '';// 权限接口地址
let h5Path = '';// 各环境域名路径
switch (REACT_APP_ENV) {
  case 'prod':
    h5Path = 'http://m.fulimall.net';
    server = 'http://api.fulimall.net/api/corp';
    loginServer = 'http://api.fulimall.net/api/passport/corp';
    controlService = 'http://10.10.4.112:8000'
    break;
  case 'pre':
    h5Path = 'http://pre-m.fulimall.net';
    server = 'http://pre-api.fulimall.net/api/corp';
    loginServer = 'http://pre-api.fulimall.net/api/passport/corp';
    controlService = 'http://10.10.4.112:8000'
    break;
  case 'dev':
    h5Path = 'http://10.10.4.105:1000';
    server = 'http://10.10.4.112:8000/api/corp';
    loginServer = 'http://10.10.4.112:8000/api/passport/corp';
    controlService = 'http://10.10.4.112:8000'
    break;
  case 'test':
    h5Path = 'http://10.10.4.105:1000';
    server = 'http://10.10.4.160:30915/api/corp';
    loginServer = 'http://10.10.4.160:30915/api/passport/corp';
    controlService = 'http://10.10.4.112:8000'
    break;
  default:
    h5Path = 'http://10.10.4.112:8000';
    server = 'http://10.10.4.112:8000/api/corp';
    loginServer = 'http://10.10.4.112:8000/api/passport/corp';
    controlService = 'http://10.10.4.112:8000'
    break;
}

let baseImgUrl = '';
switch (REACT_APP_ENV) {
  case 'prod':
    baseImgUrl = 'http://nengliang-shop.oss-cn-shanghai.aliyuncs.com/';
    break;
  case 'pre':
    baseImgUrl = 'http://fulimall-pre.oss-cn-shanghai.aliyuncs.com/';
    break;
  case 'dev':
    baseImgUrl = 'http://fulimall-test.oss-cn-shanghai.aliyuncs.com/';
    break;
  case 'test':
    baseImgUrl = 'http://fulimall-test.oss-cn-shanghai.aliyuncs.com/';
    break;
  default:
    baseImgUrl = 'http://fulimall-test.oss-cn-shanghai.aliyuncs.com/';
    break;
}

export default {
  projectName: '企业管理平台', // 项目的名字
  debug: true, //debug模式
  logo: logo, // 项目logo
  loginRedirectUrl: '/home',
  baseImgUrl, // 图片服务器地址
  h5Path,// 福利商城地址
  server, // 接口服务地址
  loginServer,// 登录服务地址
  controlService,// 权限接口地址
  h5Url:
    REACT_APP_ENV === 'prod'
      ? 'http://m.fulimall.net/'
      : REACT_APP_ENV === 'pre'
        ? 'http://pre-m.fulimall.net/'
        : 'http://10.10.4.105:1000/',
  excludeURIs: [// header里面不需要 token的接口列表
    '/login', '/companies/search'
  ],
};
