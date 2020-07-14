

import React from 'react';
import { Card } from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import OnLine from './components/on_line'



const TitleMap = {
  1: '首页轮播广告位',
  2: '首页专题区',
  3: '首页3号位',
}

const AdsenseDetail = (props:any) => {

  let advertId = props.match.params.id
  return (
    <PageHeaderWrapper title={TitleMap[advertId]}>
      <Card>
        <OnLine advertId={advertId}/>
      </Card>
    </PageHeaderWrapper>
  )
}


export default AdsenseDetail



