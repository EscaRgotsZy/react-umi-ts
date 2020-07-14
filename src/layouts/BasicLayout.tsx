import { Helmet, HelmetProvider } from 'react-helmet-async';
import ProLayout, {
  MenuDataItem,
  getMenuData,
  getPageTitle,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
} from '@ant-design/pro-layout';
import styles from './BasicLayout.less'
import React from 'react';
import { Link, connect, Dispatch } from 'umi';
import { Result, Button, ConfigProvider } from 'antd';
import classnames from 'classnames';
import zhCN from 'antd/es/locale/zh_CN';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.png';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });


const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    collapsed,
    location = {
      pathname: '/',
    },
  } = props;

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    title: '企业管理平台',
    ...props,
  });
  setTimeout(()=>{
    document.title = title;
  }, 50)
  return (
    <HelmetProvider>
      {/* tips Helmet 设置没有用  */}
      {/* <Helmet>
        <title>{title}</title>
      </Helmet> */}
      <div className={classnames({[styles.basicLayout]: true, [styles.collapsed]: collapsed})}>
        <ProLayout
          logo={logo}
          menuHeaderRender={(logoDom, titleDom) => (
            <Link to="/">
              {logoDom}
              {titleDom}
            </Link>
          )}
          onCollapse={handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: '首页',
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
                <span>{route.breadcrumbName}</span>
              );
          }}
          menuDataRender={menuDataRender}
          rightContentRender={() => <RightContent />}
          {...props}
          {...settings}
        >
          <ConfigProvider locale={zhCN}>
            <Authorized authority={authorized!.authority} noMatch={noMatch}>
              {children}
            </Authorized>
          </ConfigProvider>
        </ProLayout>
        {/* <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      /> */}
      </div>
    </HelmetProvider>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
