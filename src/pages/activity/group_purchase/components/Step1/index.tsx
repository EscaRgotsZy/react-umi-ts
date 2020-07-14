import React, { useState } from 'react';
import { Card, Button, BackTop, message } from 'antd';
import { connect } from 'umi';
import { StateType } from '@/models/group_purchase'
import GoodsModal from './goodsModal'
import Goods from './goods'
import SetSku from './setSku'

interface Step1Props {
  dispatch?: any;
  selGoods: any;
  activityStatus: any;
  
}

const Step1: React.FC<Step1Props> = (props) => {
  const { dispatch, selGoods, activityStatus } = props;
  

  const [visible, setVisible] = useState(false)



  function handleDelGoods(productId: number) {
    dispatch({
      type: 'group_purchase/changeGoods',
      payload: selGoods.filter((x: any) => x.productId !== productId)
    })
  }

  function setSkuMergePrice(record:any, value:string, type: 'mergePrice' | 'mergeLevelRate'){
    let { productId, skuId } = record
    let newSelGoods = selGoods.map((v:any)=>{
      if(v.productId === productId){
        let productSkus = v.productSkus.map((x:any)=>{
          if(x.skuId === skuId){
            return {
              ...x,
              [type]: value
            }
          }
          return x
        })
        return {
          ...v,
          productSkus
        }
      }
      return v;
    })
    dispatch({
      type: 'group_purchase/changeGoods',
      payload: newSelGoods
    })
  }


  function hanldeNext(){
    if(selGoods.length === 0)return message.warn('请选择商品');
    let finish = true
    selGoods.forEach((v:any)=>{
      let { productSkus } = v;
      productSkus.forEach((x:any)=>{
        let { mergePrice, mergeLevelRate } = x;
        if( !mergePrice &&  mergePrice !== 0){
          finish = false
        }
        if( !mergeLevelRate &&  mergeLevelRate !== 0){
          finish = false
        }
      })
    })
    if(!finish) return message.warn('团购价和返积分不能为空')
    dispatch({
      type: 'group_purchase/changeStep',
      payload: 'step2'
    });
    window.scrollTo(0, 0)
  }
  function batchSetSku(productId:number, rowKeys:any[], mergePrice:number, mergeLevelRate:number){
    let newSelGoods = selGoods.map((v:any)=>{
      if(v.productId === productId){
        let productSkus = v.productSkus.map((x:any)=>{
          if(rowKeys.includes(x.skuId)){
            return {
              ...x,
              mergePrice,
              mergeLevelRate
            }
          }
          return x
        })
        return {
          ...v,
          productSkus
        }
      }
      return v;
    })
    dispatch({
      type: 'group_purchase/changeGoods',
      payload: newSelGoods
    })
  }
  return (
    <>
      <Card style={{ padding: '0 100px' }}>

        <div>
          商品管理：<Button onClick={() => setVisible(true)} disabled={activityStatus.isRead}>添加商品</Button>
        </div>

        {
          selGoods.map((v: any, i:number) => {
            return (
              <div style={{ marginTop: 20 }} key={i}>
                <Goods data={v} handleDelGoods={handleDelGoods} disabled={activityStatus.isRead}/>
                <SetSku data={v} setSkuMergePrice={setSkuMergePrice} batchSetSku={batchSetSku} disabled={activityStatus.isRead}/>
              </div>
            )
          })
        }

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
          <Button type="primary" onClick={hanldeNext} >下一步</Button>
        </div>
      </Card>
      <GoodsModal visible={visible} close={() => setVisible(false)} />
      <BackTop />
    </>
  );
};


export default connect(({ group_purchase }: { group_purchase: StateType }) => ({
  selGoods: group_purchase.selGoods,
  activityStatus: group_purchase.activityStatus,
}))(Step1);

