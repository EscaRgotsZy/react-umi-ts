import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps } from 'umi';
import { ConnectState } from '@/models/connect';
import { tokenManage } from '@/constants/storageKey';

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading } = this.props;
    const isLogin = tokenManage.get();
    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  loading: loading.models.user,
}))(SecurityLayout);
