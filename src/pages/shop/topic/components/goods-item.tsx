import styles from './index.less';

import React from 'react';

export default ({data, checked, selGoods, del}:any) => (
  <div className={styles.proItemBox} onClick={()=> selGoods(data)}>
    <div className={`${styles.proItem } ${ checked? '':styles.down} ${ del? styles.del:''}`} >
      <img src={data.pic} />
      <div className={styles.proInfo}>
        <span className={styles.proName}>{data.name}</span>
        <span className={styles.price}>￥{data.price}</span>
      </div>
    </div>
  </div>
)
