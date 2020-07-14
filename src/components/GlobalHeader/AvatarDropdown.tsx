import { LogoutOutlined, SettingOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { history, ConnectProps, connect } from 'umi';
import { userInfoManage } from '@/constants/storageKey'
import { ConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends Partial<ConnectProps> {
  currentUser?: any;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }
    if (key === 'info') {
      history.push(`/company`);
    }
  };

  render(): React.ReactNode {
    const { menu } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            个人中心
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}
        <Menu.Item key="info">
          <InfoCircleOutlined />
          企业信息
        </Menu.Item>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            style={{ backgroundColor: '#87d068', color: '#fff' }}
            icon={<UserOutlined />}
          />
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          <span className={styles.name}>{userInfoManage.get()['companyName'] || '管理员'}</span>
        </span>
      </HeaderDropdown>
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
