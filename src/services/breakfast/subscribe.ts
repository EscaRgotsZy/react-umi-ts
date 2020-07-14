import { get, post, put, del } from '@/common/request';

var domain = process.env.CY_APP_ENV === 'prod' ? 'http://api.fulimall.net' : process.env.CY_APP_ENV === 'pre' ? 'http://pre-api.fulimall.net' : 'http://10.10.4.112:8000/api/mall'

// 查询广告位 get
export async function getTask(){
  let [err, data] = await get({baseUrl: domain, url: `/timed-task/1`, showToast: true})
  if(err || !data)return false;
  let { executeDate, executeTime, id, isEnable } = data;
  return {
    executeDate, executeTime, id, isEnable
  }
}

// 编辑保存
export async function putTask(params:any){
  let { id, ...data} = params
  let [err] = await put({baseUrl: domain, url: `/timed-task/${id}`, params: data, showToast: true})
  if(err)return false;
  return true
}