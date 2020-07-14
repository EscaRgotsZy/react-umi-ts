
import styles from './index.less'
import React, { useState, useMemo } from 'react'
import { connect } from 'umi'
import { Empty, Spin } from 'antd'
import { ComponentListData, CurComponentType } from '@/models/renovation'



import Tab from '../../assembly/tab'
import Icon from '../../assembly/icon'
import Img from '../../assembly/img'
import Welfare from '../../assembly/welfare'
import Label from '../../assembly/label'
import Title from '../../assembly/title'
import Goods from '../../assembly/goods'
import Placeholder from '../../assembly/placeholder'


interface RightNodeProps {
  slotName: string;
  dispatch: any;
  curComponent: CurComponentType;
  componentLoading: boolean;
}
const RightNode: React.FC<RightNodeProps> = (props) => {
  const { curComponent, componentLoading } = props;
  const empty = useMemo(() => {
    return !ComponentListData.has(curComponent.type)
  }, [curComponent])

  function curComponents(index: number) {
    let _components;
    switch (index) {
      case 1:
        _components = <Tab />
        break;
      case 2:
        _components = <Icon />
        break;
      case 3:
        _components = <Img />
        break;
      case 4:
        _components = <Welfare />
        break;
      case 5:
        _components = <Label />
        break;
      case 6:
        _components = <Title />
        break;
      case 8:
        _components = <Goods />
        break;
      case 7:
        _components = <Placeholder />
        break;
    }
    return _components || null
  }

  return (
    <Spin spinning={componentLoading}>
      <div className={styles.title}>
        <span>组件设置</span>
        <span>{ComponentListData.get(curComponent.type) && ComponentListData.get(curComponent.type)['title']}</span>
      </div>
      <div>
        {
          empty ? <Empty description="请先选择组件" image={Empty.PRESENTED_IMAGE_SIMPLE} /> : curComponents(curComponent.type)
        }
      </div>
    </Spin>
  )
}

export default connect(({renovation}:any)=>({
  curComponent: renovation.curComponent,
  componentLoading: renovation.componentLoading,
}))(RightNode)