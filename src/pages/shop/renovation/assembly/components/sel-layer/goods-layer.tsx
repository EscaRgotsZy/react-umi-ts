
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Modal, Tabs, message } from 'antd'
import Goods from './meta/goods-multiple'



interface GoodsProps {
  visible: boolean;
  handleOk: Function;
  handleClose: Function;
}
const GoodsLayer: React.FC<GoodsProps> = (props) => {
  let { visible, handleOk, handleClose } = props;
  let [data, setData] = useState<any>({})

  function handleSel(redord:any){
    setData(redord)
  }
  return (
    <Modal
      title={'选择商品'}
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
        <Goods handleSel={handleSel}/>
      </div>
    </Modal>
  )
}

export default GoodsLayer