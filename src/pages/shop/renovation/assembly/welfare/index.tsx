
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { connect } from 'umi'
import Preview from '../components/preview'
import SaveBtn from '../components/save-btn'
import SelLayer from '../components/sel-layer/welfare-layer'
import { message } from 'antd'

interface WelfareProps {
  dispatch: any;
  welfareData: any;
}
const Welfare: React.FC<WelfareProps> = (props) => {
  const { dispatch, welfareData } = props;
  const [visible, setVisible] = useState(false)// 是否显示选择分类弹框
  const [tag, setTag] = useState<any>({})// 

  useEffect(()=>{
    setTag({
      id: welfareData.id,
      name: welfareData.name,
    })
  }, [welfareData])

  return (
    <>
      <div className={styles.welfareComponents}>
        <Preview src={require('@/assets/renovation/6-preview.png')} />


        <div className={styles['welfare-add-wrap']}>
          <div className={styles['content']}>
            <div className={styles['sel-btn']} onClick={() => {
              setVisible(true)
            }}>选择活动页面</div>
            {
              tag.id && <span className={styles['sel-text']}>{tag.name}</span>
            }
          </div>
        </div>

      </div>
      <SaveBtn loading={false} submit={():any => {
        if(!tag.id)return message.warn('请选择活动页面');
        dispatch({
          type: 'renovation/submitWelfare',
          payload: tag.id
        })
      }} />

      {
        visible && (
          <SelLayer
            visible={visible}
            handleClose={() => {
              setVisible(false)
            }}
            handleOk={(tagInfo: any) => {
              setTag(tagInfo)
              setVisible(false)
            }} />
        )
      }
    </>
  )
}

export default connect(({ renovation }: any) => ({
  welfareData: renovation.welfareData,
}))(Welfare)