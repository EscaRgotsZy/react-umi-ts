
import React from 'react'
import styles from './goods.less'


interface GoodsProps {
  data: any;
  handleDelGoods: Function;
  disabled: boolean;
}

const Goods: React.FC<GoodsProps> = (props) => {
  let { productId, productName, productPic, presentPrice, actualStocks } = props.data;

  return (
    <ul className={styles.ulstyle}>
      <li className={styles.listyle} style={{ background: '#0b2138' }}>
        <div className={styles.l}><img width='80' height="80" onClick={() => { }} src={productPic} /></div>
        <div className={styles.divstyle}>
          <p className={styles.pstyle} >商品名称：{productName}</p>
          <p style={{ color: '#fff', marginBottom: '0' }}>商品ID：{productId}</p>
        </div>
        <span className={styles.text}>原价：{presentPrice}</span>
        <span className={styles.text}>库存：{actualStocks}</span>
        {
          !props.disabled && <span className={styles.close} onClick={() => props.handleDelGoods(productId)}>X</span>
        }
      </li>
    </ul>
  )
}

export default Goods