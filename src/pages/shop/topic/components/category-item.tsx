import styles from './index.less';

import React from 'react';

export default ({data, selCategory, del}:any) => (
  <div className={`${styles.categoryItem} ${del?styles.del:''}`} onClick={()=>selCategory(data.id)}>{data.name}</div>
)
