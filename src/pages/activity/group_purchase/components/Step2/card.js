import React from 'react'
import styles from './card.less'

export default class Card extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    let { data={}, index=''} = this.props;
    return (
      <div className={styles._card} style={{backgroundColor: 'white', position: 'relative', borderRadius: 5, overflow: 'hidden' }}>
        <div><img src={data.productPic}/></div><span className="field">{data.productName}</span>{ index === '' ? null: <><label></label><em>{index}</em></>}
      </div>
    )
  }
}