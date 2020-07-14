import styles from './footer.less'
import React, { useState } from 'react'
import { connect, history } from 'umi';
import classnames from 'classnames'
import { Button } from 'antd'
import Preview from './preview'
import { publishRenovation } from '@/services/shop/renovation'

interface BtnBoxProps {
  collapsed: any;
  pageId: string;
}
const BtnBox: React.FC<BtnBoxProps> = (props) => {
  let { collapsed, pageId } = props;
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <>
      <div className={classnames({
        [styles['btn-box']]: true,
        [styles.collapsed]: collapsed,
      })}>
        <Button onClick={()=>{
          history.goBack()
        }}>保存</Button>
        <Button type="primary" loading={loading} onClick={async ()=>{
          setLoading(true)
          await publishRenovation({id: pageId})
          setLoading(false)
        }}>发布</Button>
        <Button type="primary" ghost onClick={()=> setVisible(true)}>预览</Button>
      </div>
      <div className={styles.placeholderBtn}></div>
      <Preview id={pageId} visible={visible} onClose={()=>setVisible(false)}/>
    </>
  )
}

export default connect(({ global, renovation }: any) => ({
  collapsed: global.collapsed,
  pageId: renovation.pageId,
}))(BtnBox);
