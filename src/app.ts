import { getRouters } from '@/services/common/index';
import { getPageQuery } from '@/utils/utils';
import { history } from 'umi';

export async function getInitialState() {
  let data = await getRouters();
  data = Array.isArray(data) ? data.map((item:any)=>item.menuKey) :  [];
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
      redirect = '/'
      return;
    }

  }

  if( redirect || /\/user\/login/.test(location.hash)){
    setTimeout(()=>{
      history.replace(redirect || '/');
    }, 50)
  }

  return data;
}
