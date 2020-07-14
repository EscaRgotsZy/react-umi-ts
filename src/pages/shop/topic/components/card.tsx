import React from 'react'


import styles from './card.less'

interface useProps{
  data: any;
  index: string | number;
}
export default class Card extends React.Component<useProps>{
  constructor(props:useProps){
    super(props)
  }


  render(){
    let { data={}, index=''} = this.props;
    return (
      <div className={styles._card} style={{backgroundColor: 'white', position: 'relative', borderRadius: 5, overflow: 'hidden' }}>
        <div><img src={data.pic}/></div><span className="field">{data.name}</span>{ index === '' ? null: <><label></label><em>{index}</em></>}
      </div>
    )
  }

}