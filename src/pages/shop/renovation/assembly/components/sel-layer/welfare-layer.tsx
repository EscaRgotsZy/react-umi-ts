
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Modal, Tabs, message } from 'antd'
import Page from './meta/page'



interface SelLayerProps {
  visible: boolean;
  handleOk: Function;
  handleClose: Function;
}
const SelLayer: React.FC<SelLayerProps> = (props) => {
  let { visible, handleOk, handleClose } = props;
  let [data, setData] = useState<any>({})

  function handleSel(redord:any){
    setData(redord)
  }
  return (
    <Modal
      title={'选择活动页面'}
      onOk={() => {
        handleOk(data)
      }}
      onCancel={() => {
        handleClose()
      }}
      width={900}
      visible={visible}
    >
      <div className={styles['style-modal']}>
        <Page id={data.id} handleSel={handleSel}/>
      </div>
    </Modal>
  )
}

export default SelLayer