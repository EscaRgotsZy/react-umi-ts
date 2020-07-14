

import React from 'react'
import Operation from './operation'
import { connect } from 'umi'
import { StateType } from '@/models/freight'
import Title from './title'

import styles from './picked-up.less'

interface PickedUpProps {
  dispatch?: any;
  isPickedUp: any;
}
const pickedUp: React.FC<PickedUpProps> = (props) => {
  const { isPickedUp, dispatch } = props
  if(!isPickedUp)return null
  return (
    <>
      <Title value={'支持自提'} />
      <div className={styles.wrap}>
        <div className={styles.leftContent}>自提方式</div>
        <div className={styles.rightContent}>
          <div className={styles.rightItem}><span style={{ paddingLeft: '30px' }}>快递方式：</span></div>
          <div className={styles.rightItem}><span style={{ paddingLeft: '100px' }}>免邮费</span></div>
        </div>
        <Operation tip="是否删除自提方式?" showEdit={false} handleDel={()=>{
          dispatch({
            type: 'freight/savePickedUp',
            payload: false
          })
        }}/>
      </div>
    </>
  )
}

export default connect(({ freight }: { freight: StateType }) => ({
  isPickedUp: freight.isPickedUp,
}))(pickedUp);
