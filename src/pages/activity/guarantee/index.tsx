import React, { Component }from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { sleep } from '@/utils/utils'
import GuaranteeCharge from './subpage/guarantee_charge';
import GuaranteeFree from './subpage/guarantee_free';
interface UserState {
  currentTab: any,
}
interface UserProp {
  history: any;
  match: any;
  location: any;
}
const tabList = [
  {
    key: '1',
    name: 'tab1',
    tab: '收费服务',
  },
  {
    key: '2',
    name: 'tab2',
    tab: '免费服务',
  },
];

export default class cashCouponManage extends Component<UserProp, UserState> {
  constructor(props: UserProp) {
    super(props);
    const { key = '1' } = props.location.query;
    this.state = {
      currentTab: key,
    }
  }
  componentWillUnmount(){

  }
  // 切换tab
  tabChange = async (type: string | number) => {
    this.setState({ currentTab: type + '' })
  }
  render() {
    const { currentTab } = this.state;
    return (
      <>
        <PageHeaderWrapper
          title={currentTab == '1' ? "收费服务" : "免费服务"}
          onTabChange={this.tabChange}
          tabList={tabList}
          tabActiveKey={currentTab}
        />
        <div>
          {
            currentTab == '1' ? <GuaranteeCharge history={this.props.history} /> : <GuaranteeFree history={this.props.history} />
          }
        </div>
      </>
    )
  }
}