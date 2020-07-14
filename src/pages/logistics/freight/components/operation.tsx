import React from 'react'
import { Popconfirm } from 'antd';
import styles from './operation.less'

interface OperationProps{
  tip?: string;
  showEdit?: boolean;
  handleEdit?: Function;
  handleDel?: Function;
}
const operation:React.FC<OperationProps> = (props) => {
  const { tip, showEdit=false, handleDel=()=>{}, handleEdit=()=>{} } = props;
  return (
    <div className={styles.wrap}>
      <div className={styles.title} >操作</div>
      <div className={styles.content}>
        {
          showEdit && <span className={styles.btn} onClick={() => handleEdit()}>编辑</span>
        }
        <Popconfirm
          title={tip}
          onConfirm={() => handleDel()}
          okText="确定"
          cancelText="取消"
        >
          <span className={styles.btn}>删除</span>
        </Popconfirm>
      </div>
    </div>
  )
}
export default operation