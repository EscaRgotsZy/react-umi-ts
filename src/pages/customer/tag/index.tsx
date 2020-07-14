import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { sleep } from '@/utils/utils'
import Tag from './subpage/tag'
import TagGroup from './subpage/tagGroup'
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
    tab: '标签列表',
  },
  {
    key: '2',
    name: 'tab2',
    tab: '标签组列表',
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
          title={currentTab == '1' ? "标签列表" : "标签组列表"}
          onTabChange={this.tabChange}
          tabList={tabList}
          tabActiveKey={currentTab}
        />
        <div style={{ marginTop: '30px' }}>
          {
            currentTab == '1' ? <Tag history={this.props.history} /> : <TagGroup history={this.props.history} />
          }
        </div>
      </>
    )
  }
}
