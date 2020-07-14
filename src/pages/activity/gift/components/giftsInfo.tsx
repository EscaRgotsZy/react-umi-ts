import styles from '../add_gifts/index.less';
import React from 'react'

interface giftsProps{
  data:any,
  idx: number,
  delCurrentGifts: Function,
  giftId: string,
}
const GiftsList: React.FC<giftsProps> = (props) => {
  let { productPic, productName, productId,skuMaxPrice, stocks } = props.data
  return (
  <>
    <div className={styles.l}><img width='80' height="80" src={productPic} /></div>
    <div className={styles.divstyle}>
        <p className={styles.pstyle} >商品名称：{productName}</p>
        <p style={{ color: '#fff', marginBottom: '0' }}>商品ID：{productId}</p>
    </div>
    <span className={styles.text}>原价：{skuMaxPrice}</span>
    <span className={styles.text}>库存：{stocks}</span>
    {!props.giftId && <span className={styles.close} onClick={() => props.delCurrentGifts(props.data, props.idx)}>X</span>}
  </>
  )
}
export default GiftsList