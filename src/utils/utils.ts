import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { message } from 'antd'
import config from '@/config';
import moment from 'moment';
import { tokenManage } from '@/constants/storageKey';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 获取连接参数
export function getUrlSearch(search: string, name: string) {
  if (!search) return '';
  const paramsString = search.substring(1);
  const searchParams = new URLSearchParams(paramsString);
  return searchParams.get(name);
}

// 睡眠
export function sleep(duration=500){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve()
    }, duration)
  })
}

// 复制
export function Copy(value:string, showSucess=true) {
  showSucess && message.success('复制成功！');
  var input:any = document.createElement('input')
  input.value = value;
  document.body.appendChild(input)
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input)
}

// 图片格式处理
export function handlePicUrl(src: any) {
  // exclude contains base64 or /static
  if (src && !src.includes(';base64') && !src.includes('/static/img')) {
      // if src is Array
      if (src instanceof Array) {
          src = src[0];
      }

      // if src contains commas, split the first
      src = src ? src.split(',')[0] : '';

      // if src does not contain ([http | https]://), splice pic server address
      if (!src.match(/(http)s?:\/\//)) {
          src = config.baseImgUrl + src;
      }
  }

  return src;
}


// 处理禁用日期函数
export function setDisabledDate(current: any) {
  return current && current < moment().startOf('day');
}

// 处理禁用时间函数
export function setDisabledTime(date: any, type: string) {
  function range(start: any, end: any) {
      const result = [];
      for (let i = start; i <= end; i++) {
          result.push(i);
      }
      return result;
  };
  function formatHours(date: any, type: string) {
      let hour = moment().hour();
      let disabledHours = [];
      const chosedDate = type == "date" ? moment(date).date() : moment(date[0]).date();
      if (moment().date() == chosedDate) {
          disabledHours = range(0, 24).splice(0, hour);
      };
      return disabledHours;
  };
  function formatMinutes(date: any, type: string) {
      let minute = moment().minute();
      let disabledMinutes = [];
      const chosedDate = type == "date" ? moment(date).date() : moment(date[0]).date();
      if (moment().date() == chosedDate) {
          disabledMinutes = range(0, 60).splice(0, minute + 1);
      };
      return disabledMinutes;
  };

  if (type === "start") {
      return {
          disabledHours: () => formatHours(date, 'range'),
          disabledMinutes: () => formatMinutes(date, 'range'),
          disabledSeconds: () => []
      };
  }
}

// 下载
export function downloadFile({ url, method, headers, paramName, param, fileName }: any) {
  if (!url.match(/(http)s?:\/\//)) {
    url = config.server + url;
  }
  let fetchBody: any;
  if (method == 'GET') {
    fetchBody = fetch(`${url}?${paramName}=${param}`, {
      method: method,
      headers: headers == 'default' ? {
        "content-type": "application/json",
        'Authorization': tokenManage.get(),
        'platform': 'corp'
      } : headers,
    })
  }
  if (method == 'POST') {
    fetchBody = fetch(url, {
      method: 'POST',
      headers: {
        "content-type": "application/json",
        'Authorization': tokenManage.get(),
        'platform': 'corp'
      },
      body: JSON.stringify(param)
    })
  }
  fetchBody.then((res: any) => res.blob())
    .then((data: any) => {
      let blobUrl = (window.URL || window.webkitURL).createObjectURL(data)
      let obj: any = {
        a: document.createElement('a')
      }
      obj.a.style.display = 'none'
      obj.a.href = blobUrl
      obj.a.download = fileName
      obj.a.click()
      delete obj.a
    })
}
// 处理上传文件props
export function handleUploadProps(url: any, fileName:any = 'file', headers:any = 'default', showBoolean:any) {
  if (!url.match(/(http)s?:\/\//)) {
    url = config.server + url;
  }
  return {
    action: url,
    name: fileName,
    headers: headers == 'default' ? {
      Authorization: tokenManage.get(),
      platform: 'corp'
    } : headers,
    showUploadList: showBoolean,
  }
}

// 格式化金额为千位分隔，不支持四舍五入
// num: 金额
// point: 小数点后几位，默认0
export function formatMoney(num: any, point = 0) {
  let str = num * 1 ? (num * 1).toFixed(point) : (0).toFixed(point)
  let re = `\\d(?=(\\d{3})+${point > 0 ? '\\.' : '$'})`
  return str.replace(new RegExp(re, 'g'), $0 => $0 + ',')
}
