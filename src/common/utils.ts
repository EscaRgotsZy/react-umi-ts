import moment from 'moment';
import { parse, stringify } from 'qs';
import { message } from 'antd';
import config from '@/config/index';
import { tokenManage } from '@/constants/storageKey';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}





export function Copy(value: any, showSucess = true) {
  showSucess && message.success('复制成功！');
  var input: any = document.getElementById("input");
  input.value = value; // 修改文本框的内容
  input.select(); // 选中文本
  document.execCommand("copy");
}


// 图片格式处理
export function handlePicUrl(src: any) {
  // exclude contains base64 or /static
  if (src && !src.includes(';base64') && !src.includes('/static/img')) {
    // if src is Array
    if (src instanceof Array) {
      src = src[0]
    }

    // if src contains commas, split the first
    src = src ? src.split(',')[0] : ''

    // if src does not contain ([http | https]://), splice pic server address
    if (!src.match(/(http)s?:\/\//)) {
      src = (config.baseImgUrl + src)
    }
  }

  return src
}
// 处理禁用日期函数
export function setDisabledDate(current: any) {
  return current && current < moment().startOf('day');
}

// 处理禁用时间函数
export function setDisabledTime(date: any, type: any) {
  function range(start: any, end: any) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  };
  function formatHours(date: any, type: any) {
    let hour = moment().hour();
    let disabledHours = [];
    const chosedDate = type == "date" ? moment(date).date() : moment(date[0]).date();
    if (moment().date() == chosedDate) {
      disabledHours = range(0, 24).splice(0, hour);
    };
    return disabledHours;
  };
  function formatMinutes(date: any, type: any) {
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

/**
 * 下载 文件
 * e.g.
 * downloadFile({
      url: '/orders/exportOrders',
      method: 'POST',
      headers: 'default',
      paramName: 'body',
      param: query,
      fileName: '订单数据.xlsx'
    })
 */

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