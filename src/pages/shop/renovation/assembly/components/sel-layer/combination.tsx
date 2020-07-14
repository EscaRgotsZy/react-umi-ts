
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Modal, Tabs, message } from 'antd'
import Page from './meta/page'
import Goods from './meta/goods'
import Type from './meta/type'
const { TabPane } = Tabs;



interface SelLayerProps {
  visible: boolean;
  handleOk: Function;
  handleClose: Function;
  // tabKey: string;
  // id: number;
}
const SelLayer: React.FC<SelLayerProps> = (props) => {
  let { visible, handleOk, handleClose } = props;
  let [tabKey, setTabKey] = useState('1')

  function handleSel(key:string, redord:any){

    handleOk({
      ...redord,
      key
    })
  }
  return (
    <Modal
      title={'页面'}
      footer={null}
      width={900}
      visible={visible}
      onCancel={()=>{
        handleClose()
      }}
    >
      <div className={styles['style-modal']}>
        <Tabs defaultActiveKey={tabKey} animated={false} size="small" onChange={(key)=>{
          setTabKey(key)
        }}>
          <TabPane tab="商品分组" key={'1'}>
            <Type id={1} handleSel={(record: any)=> handleSel('1', record)}/>
          </TabPane>
          <TabPane tab="商品详情" key="2">
            <Goods id={1} handleSel={(record: any)=> handleSel('2', record)}/>
          </TabPane>
          <TabPane tab="装修页面" key="3">
            <Page id={1} handleSel={(record: any)=> handleSel('3', record)}/>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  )
}

export default SelLayer