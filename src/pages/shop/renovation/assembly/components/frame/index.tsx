import styles from './index.less'
import React from 'react'

interface FrameProps {
  title?: string;
  children: any;
  hasDel?: boolean;
  handleDel?: Function;
  style?: any;
}
const Frame = (props: FrameProps) => (
  <div className={styles['tab-frame']} style={props.style || {}}>
    <div className={styles['frame-title']}>
      <span>{props.title || '菜单'}</span>
      {
        props.hasDel && <a className={styles['del']} onClick={() => {
          typeof props.handleDel === 'function' && props.handleDel()
        }}>删除</a>
      }
    </div>
    <div className={styles['frame-content']}>
      {props.children || ''}
    </div>
  </div>
)

export default Frame