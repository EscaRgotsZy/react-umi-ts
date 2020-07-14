
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { connect } from 'umi'
import { message } from 'antd'
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from '@/models/renovation'
import Modal from '../components/modal'
import Preview from '../components/preview'
import SaveBtn from '../components/save-btn'
import SelLayer from '../components/sel-layer/goods-layer'

interface GoodsProps {
  dispatch: any;
  goodsData: any;
}
const Goods: React.FC<GoodsProps> = (props) => {
  const { dispatch, goodsData } = props;
  const [styleVisible, setStyleVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [goodsList, setGoodsList] = useState([])

  useEffect(()=>{
    setGoodsList(goodsData)
  }, [goodsData])

  function save():any {
    if(!goodsList.length)return message.warn('请选择商品');
    dispatch({
      type: 'renovation/submitGoods',
      payload: goodsList.map((v:any, i:number)=>(
        {
          productId: v.id,// 商品Id
          productName: v.name,// 商品名称
          seq: i
        }
      ))
    })
  }
  return (
    <>
      <div className={styles.goodsComponents}>
        <Preview src={require('@/assets/renovation/4-preview.png')} />

        <div className={styles['goods-wrap']}>
          <div className={styles['goods-title']}>
            <div className={styles.btnBox}>
              <div className={styles.point}>*</div>
              <div className={styles.btn} onClick={() => {
                setVisible(true)
              }}>选择商品</div>
            </div>
            <span>上下拖动可排序</span>
          </div>
          <div className={styles['goods-list']}>
            <Container onDrop={record => {
              let newList = applyDrag(goodsList, record)
              setGoodsList(newList)
            }}>
              {
                goodsList.map((v:any, i) => {
                  return (
                    <Draggable key={v.id}>
                      <div className={styles['goods-item']}>
                        <img src={v.img} />
                        <span>{v.name}</span>
                        <a onClick={()=>{
                          let newList = applyDrag(goodsList, {
                            addedIndex: null,
                            removedIndex: i,
                          })
                          setGoodsList(newList)
                        }}>删除</a>
                      </div>
                    </Draggable>
                  )
                })
              }
            </Container>

          </div>
        </div>

        <Modal
          title={'选择商品模块样式'}
          visible={styleVisible}
          value={1}
          list={[
            { value: 1, src: require('@/assets/renovation/4-preview.png') },
            { value: 2, src: require('@/assets/renovation/5-preview.png') },
          ]}
          tip={'样式1、2图中尺寸仅作示例，实际展示尺寸根据【设置-通用设置-商品图片】处设置而定'}
          handleClose={() => setStyleVisible(false)}
          handleOk={() => setStyleVisible(false)}
        />
      </div>
      <SaveBtn loading={false} submit={save} />

      {
        visible && (
          <SelLayer
            visible={visible}
            handleClose={() => {
              setVisible(false)
            }}
            handleOk={(goods: any) => {
              setGoodsList(goods)
              setVisible(false)
            }} />
        )
      }
    </>
  )
}

export default connect(({ renovation }: any) => ({
  goodsData: renovation.goodsData,
}))(Goods)