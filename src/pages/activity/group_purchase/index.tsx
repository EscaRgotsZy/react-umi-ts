import React, {useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd'
import List from './components/index-list'


const tabList = [
  {
    key: '2',
    tab: '待发布',
  },
  {
    key: '1',
    tab: '上线中',
  },
  {
    key: '-1',
    tab: '已下线',
  },
  {
    key: '-3',
    tab: '已过期',
  },
  {
    key: '3',
    tab: '已删除',
  },
]

interface UserProp {
  location: any;
  history: any;
}
const GroupActivity: React.FC<UserProp> = (props) => {
  let { status = '2' } = props.location.query;
  let [tabIndex, setTabIndex] = useState<string>(status);
  return (
    <PageHeaderWrapper
      tabActiveKey={tabIndex}
      onTabChange={setTabIndex}
      tabList={tabList}
      >
      <Card>
        <List status={tabIndex}/>
      </Card>
    </PageHeaderWrapper>
  )
}

export default GroupActivity;
