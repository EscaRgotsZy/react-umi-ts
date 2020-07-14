import styles from './index.less'
import React from 'react'
import classnames from 'classnames';


interface ModalProps {
  children?: any;
}
const Modal:React.FC<ModalProps> = (props) => {
  let { children=null,  } = props;

  return (
    <>
    <div className={classnames({
      [styles.mask]: true,
      [styles.in]: true,
    })}></div>
    <div className={classnames({
      [styles['modal-container']]: true
    })}>
      {/* 标题 */}
      <div className={styles.title}></div>

      {/* 内容 */}
      <div className={styles.content}>
        {children}
      </div>

      {/* 操作按钮 */}
      <div className={styles.btns}>

      </div>
    </div>
    </>
  )
}

export default Modal