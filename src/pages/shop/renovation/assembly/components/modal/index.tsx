import styles from './index.less'
import React, { useState } from 'react'
import { Modal, Alert, Radio } from 'antd'
import classnames from 'classnames'
import { SectionToChinese } from '@/utils/math'


interface listType {
  value: number;
  src: string;
}
interface ModalLayerProps {
  visible: boolean;// 是否显示
  title?: string;// modal 标题
  value?: number;// 默认选中
  tip?: String;// 提示文案
  list: Array<listType>;// 数据列表
  handleClose: Function;
  handleOk: Function;
}
const ModalLayer: React.FC<ModalLayerProps> = (props) => {
  let { visible, handleClose, handleOk, tip, list, value, title } = props;
  const [val, setVal] = useState(value)

  return (
    <Modal
      title={title}
      onOk={() => {
        handleOk(val)
      }}
      onCancel={() => handleClose()}
      width={900}
      visible={visible}
    >
      <div className={styles['style-modal']}>
        {
          tip && <Alert message={tip} type="success" />
        }
        <ul className={styles['style-ul']}>
          {
            (list as listType[]).map((v: listType, i:number) => (
              <li className={styles['style-li']} key={i}>
                <div className={classnames({
                  [styles['content']]: true,
                  [styles['active']]: val === v.value,
                })}
                onClick={()=> { 
                  setVal(v.value)
                }}
                >
                  <div className={styles['goods-img']}>
                    <img src={v.src} />
                  </div>
                </div>
                <div className={styles['radio']}>
                  <Radio checked={val === v.value} onChange={()=> setVal(v.value)}>样式{SectionToChinese(i+1)}</Radio>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    </Modal>
  )
}

export default ModalLayer