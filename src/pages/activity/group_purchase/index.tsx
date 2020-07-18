import React, {useState, useMemo, useRef} from 'react';
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
  const listRef:any = useRef(null)
  let [tabIndex, setTabIndex] = useState<string>(status);

  const child = useMemo(() => <List ref={listRef} status={tabIndex}/>, [tabIndex]);

  function onTabChange(e:string){
    listRef!.current!.resetPage()
    setTabIndex(e)
  }
  return (
    <PageHeaderWrapper
      tabActiveKey={tabIndex}
      onTabChange={onTabChange}
      tabList={tabList}
      >
      <Card>
        { child }
      </Card>
    </PageHeaderWrapper>
  )
}

export default GroupActivity;
