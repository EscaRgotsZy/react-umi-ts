import styles from './index.less'
import React, { ReactNode } from 'react'
import classnames from 'classnames'

interface SlotMap {
  [key: string]: ReactNode
}
interface EditRenovationProps {
  children?: Array<ReactNode>,
}
const EditRenovation: React.FC<EditRenovationProps> = (props) => {
  let slotMap: SlotMap = {}
  Array.isArray(props.children) && props.children.forEach((v: any) => slotMap[v.props.slotName] = v)

  return (
    <>
      <div className={classnames([styles.stage, styles.clearfix])}>
        {/* 组件库 */}
        <div className={classnames([styles.components, styles.fl])}>
          {slotMap['left']}
        </div>

        {/* 排版 */}
        <div className={styles.iphoneBox}>
          {slotMap['middle']}
        </div>

        {/* 组件设置 */}
        <div className={classnames([styles.setting, styles.fr])}>
          {slotMap['right']}
        </div>
      </div>
    </>
  )
}

export default EditRenovation