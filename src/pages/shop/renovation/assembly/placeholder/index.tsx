
import React, { useState } from 'react'
import { Slider } from 'antd'
import { connect } from 'umi'
import styles from './index.less'
import SaveBtn from '../components/save-btn'

interface PlaceholderProps {
  dispatch: any;
  placeholderData: any;
}
const Placeholder: React.FC<PlaceholderProps> = (props) => {
  const { placeholderData, dispatch } = props;

  return (
    <>
      <div className={styles.placeholderComponents}>
        <div className={styles.slider}>
          <Slider value={placeholderData.val} max={200} min={0} tooltipVisible={false} onChange={(e: any) => {
            dispatch({
              type: 'renovation/selPlaceholder',
              payload: {
                val: e
              }
            })
          }} />
        </div>
        <div className={styles['slider-value']}>
          <span>0</span>
          <span>{placeholderData.val}</span>
        </div>

        <div className={styles.tip}> ,如果想增大组件间的距离，可以使用空白占位组件，该组件是透明的，只做占据高度用</div>
      </div>
      <SaveBtn loading={false} submit={() => {
          dispatch({
            type: 'renovation/submitPlaceholder',
          })
      }} />
    </>
  )
}


export default connect(({ renovation }: any) => ({
  placeholderData: renovation.placeholderData,
}))(Placeholder)