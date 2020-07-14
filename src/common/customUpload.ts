

import axios from 'axios';
import { message } from 'antd'
import { tokenManage } from '@/constants/storageKey';
import { uploadUrl } from '@/services/common/index'

export const requestUpload = (file: any) => {

  return new Promise((resolve) => {
    let param = new FormData()  // 创建form对象
    param.append('files', file)  // 通过append向form对象添加数据
    let options: any = {
      url: uploadUrl,
      method: 'post',
      data: param,
      headers: {
        Authorization: tokenManage.get(),
        platform: 'corp'
      }
    };
    axios
      .request(options)
      .then((result: any) => {
        let { code, data, message: desc } = result;
        if (code === 200) {
          resolve([false, data]);
        } else {
          message.error(desc.length > 30 ? desc.substr(0, 30) + '...' : desc);
          resolve([true, data]);
        }
      })
      .catch(() => { })
      .finally(() => { });
  });
}