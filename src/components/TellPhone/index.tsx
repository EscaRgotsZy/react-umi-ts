
import styles from './index.less'
import React from 'react'

export default (props:any) => <div className={styles.pvBox} style={props.style}>
<div className={styles.pvDeviceBg}>
  <div className={styles.pvDeviceHd}>
<div className={styles.productTitle}>{props.title || '商城首页'}</div>
  </div>
  <div className={styles.pvDeviceBd} >
    {props.children}
  </div>
</div>
</div>