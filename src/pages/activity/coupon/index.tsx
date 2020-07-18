import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { sleep } from '@/utils/utils'
import Coupon from './subpage/coupon'
import AddCoupon from './subpage/add_coupon'
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
    tab: '优惠券管理',
  },
  {
    key: '2',
    name: 'tab2',
    tab: '新增优惠券',
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

  // 切换tab
  tabChange = async (type: string | number) => {
    this.setState({ currentTab: type + '' })
    await sleep(500)
    this.props.history.push({
      query: {
        key: type
      }
    });
  }
  render() {
    const { currentTab } = this.state;
    return (
      <>
        <PageHeaderWrapper
          title={currentTab == '1' ? "优惠券管理" : "新增优惠券"}
          onTabChange={this.tabChange}
          tabList={tabList}
          tabActiveKey={currentTab}
        />
        <div style={{ marginTop: '30px' }}>
          {
            currentTab == '1' ? <Coupon/> : <AddCoupon history={this.props.history} tabChange={this.tabChange} />
          }
        </div>
      </>
    )
  }
}
