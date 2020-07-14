import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd'
import ClassifyList from './components/list'
import ClassifyEdit from './components/edit'
const { TabPane } = Tabs;

import { SectionToChinese } from '@/utils/math'
import { TabType } from '@/services/shop/classify'

interface UserProp {
  history: any;
  location: any;
}
const Classify: React.FC<UserProp> = (props) => {


  const [curGrade, setCurGrade] = useState('1')// 当前展示的等级
  const [tabList, setTabList] = useState([{
    type: TabType.list,
    grade: 1,// 当前层级
    parentId: '',// 父级
    curGrade: 1,// 当前层级
    refresh: false,// 是否刷新
    data: {},// 数据
  }]);

  function tabDecorator(item:any){
    setTabList(tabList.concat([item]))
    setCurGrade(String(item.grade))
  }

  // 刷新当前tab数据
  function refresh(){
    let newTabList = tabList.slice(0, tabList.length-1);
    let grade = newTabList[newTabList.length - 1]['grade']
    newTabList = newTabList.map((v, i)=>{
      if(v.grade === grade){
        return {
          ...v, refresh: !v.refresh
        }
      }
      return v
    });
    setTabList(newTabList)
    setCurGrade(String(grade))
  }

  // 返回
  function backTab(){
    let newTabList = tabList.slice(0, tabList.length-1);
    let grade = newTabList[newTabList.length - 1]['grade']
    setTabList(newTabList)
    setCurGrade(String(grade))
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Tabs onChange={(key) => {
          setCurGrade(key)

          setTabList(tabList.filter((v:any)=> v.grade <= key))
        }} activeKey={curGrade} type="card">
          {
            tabList.map(v => {
              if (v.type === TabType.list) {
                return (
                  <TabPane tab={`${SectionToChinese(v.grade)}级类目列表`} key={String(v.grade)}>
                    <ClassifyList grade={v.grade} parentId={v.parentId} tabDecorator={tabDecorator} refresh={v.refresh}/>
                  </TabPane>
                )
              } else {
                return (
                  <TabPane tab={`${v.type === TabType.edit? '编辑':'新增'}${SectionToChinese(v.curGrade)}级类目`} key={String(v.grade)}>
                    <ClassifyEdit type={v.type} data={v.data} curGrade={v.curGrade} refresh={refresh} backTab={backTab}/>
                  </TabPane>
                )
              }
            })
          }
        </Tabs>

      </Card>
    </PageHeaderWrapper>
  )
}
export default Classify
