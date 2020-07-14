import styles from './index.less'
import React from 'react'
import classnames from 'classnames';

interface PreviewProps {
  src: any;
  hasEdit?: boolean;
  handleEdit?: Function;
}
const Preview: React.FC<PreviewProps> = (props) => {
  const { src, hasEdit = false, handleEdit = () => { } } = props;
  return (
    <>
      <div className={classnames({
        [styles.template]: true,
        [styles['border-bottom-none']]: hasEdit,
      })}>
        <img src={src} draggable={false} />
      </div>
      {
        hasEdit && (
          <div className={styles.styleBtn} onClick={()=> handleEdit()}>
            修改样式
          </div>
        )
      }
    </>
  )

}

export default Preview