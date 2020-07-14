import React from 'react'
interface CouponProps {
  data: any;
  deleCps: Function;
  type: string;
  idx:number;
}
const CouponList: React.FC<CouponProps> = (props) => {
  let { offPrice, couponName, fullPrice, couponType } = props.data;

  return (
    <>
    <div style={{padding:'15px',display:'flex',border:'1px solid #ddd',width: '350px'}}>
      <div style={{fontWeight:'bold',fontSize:'20px',display:'flex',alignItems:'center'}}>{offPrice}元券</div>
      <div style={{marginLeft:'30px',flex:1}} >
        <div>{couponName}</div>
        <div style={{display:'flex',alignItems:'center',paddingTop:'10px',justifyContent:'space-between'}} >
          <div>满{fullPrice}可用</div>
          <div>{couponType === 'product' ? '商品券' : '通用券'}</div>
        </div>
      </div>
    </div>
    { props.type!='1' &&
    <div style={{ marginLeft: '20px', color: '#02A7F0',cursor:'pointer' }} onClick={() => props.deleCps(props.idx)}>移除</div>
    }
    </>
  )
}

export default CouponList