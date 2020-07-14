

import styles from './default-configuration.less'
import React from 'react'
import { Input, Checkbox, Select, Tag } from 'antd';
import classnames from 'classnames'
import { connect } from 'umi';
import { StateType, Mode } from '@/models/freight'
import Operation from './operation'
import Title from './title'

import { excludeArr, toNumber } from './util'

const { Option } = Select;



interface AppointConfigurationProps {
  dispatch?: any;
  deliveryCompanyList: any;
  chargeMode: any;
  areaDeliveryWay: any;
  selectedAll: any[];
}
const appointConfiguration: React.FC<AppointConfigurationProps> = (props) => {
  const { dispatch, deliveryCompanyList, chargeMode, areaDeliveryWay, selectedAll } = props;


  

  function setInput(index:number, type: string, val: string | number | boolean) {
    dispatch({
      type: 'freight/setAreaDeliveryWay',
      payload: areaDeliveryWay.map((v:any, i:number)=>{
        if(i === index){
          return {
            ...v,
            [type]: val
          }
        }
        return v;
      })
    })
  }
  function List(props:any) {
    let { data, index } = props;
    return (
      <div className={styles.wrap}>
        <div className={styles.leftContent}>
          {
            (data.districtInfo || []).map((v:any, i:number)=>(
              <Tag color="magenta" key={i}>{v.title}</Tag>
            ))
          }
        </div>
        <div className={styles.rightContent}>
          <div className={styles.rightItem}>
            <div className={styles.center} style={{ flex: .66 }}>
              {
                chargeMode === Mode.isByPiece ? <span>1件</span> : (
                  <Input
                    style={{ height: 30, width: 100 }}
                    value={data.firstPiece}
                    addonAfter={'千克'} onChange={e => setInput(index, 'firstPiece', toNumber(e.target.value, data.firstPiece))} />
                )
              }
            </div>

            <div className={styles.center} style={{ flex: .66 }}>
              <Input
                style={{ height: 30, width: 100 }}
                value={data.firstPieceFee}
                addonAfter={'元'} onChange={e => setInput(index, 'firstPieceFee', toNumber(e.target.value, data.firstPieceFee))} />
            </div>
            <div className={styles.center} style={{ flex: 1 }}>
              <div style={{ whiteSpace: 'nowrap' }}>每增加</div>
              <Input
                style={{ height: 30, width: 100, marginLeft: 5 }}
                value={data.addPiece}
                addonAfter={`${chargeMode === Mode.isByPiece ? '件' : '千克'}`} onChange={e => setInput(index, 'addPiece', toNumber(e.target.value, data.addPiece))} />

            </div>
            <div className={styles.center} style={{ flex: 1 }}>
              <div style={{ whiteSpace: 'nowrap' }}>增加运费</div>
              <Input
                style={{ height: 30, width: 100, marginLeft: 5 }}
                value={data.addPieceFee}
                addonAfter={`元`} onChange={e => setInput(index, 'addPieceFee', toNumber(e.target.value, data.addPieceFee))} />

            </div>
          </div>

          <div className={classnames({
            [styles.rightItem]: true,
            [styles.borderTB]: true,
            [styles.pl20]: true
          })}>
            <Checkbox
              checked={!!data.isConditionPinkage}
              onChange={(e) => setInput(index, 'isConditionPinkage', e.target.checked ? 1 : 0)}
            >指定条件包邮</Checkbox>
            <span style={{ marginLeft: 10 }}>满</span>
            <Input
              style={{ height: 30, width: 120, margin: '0 8px' }}
              value={data.fullMinusCount}
              onChange={e => setInput(index, 'fullMinusCount', toNumber(e.target.value, data.fullMinusCount))}
              addonAfter={
                <Select className="select-after" value={data.fullMinusUnit} onChange={e => setInput(index, 'fullMinusUnit', e)}>
                  <Option value={2}>元</Option>
                  <Option value={1}>件</Option>
                </Select>
              }
            />

            <span> 包邮(券前价格)</span>
          </div>

          <div className={classnames({
            [styles.rightItem]: true,
            [styles.pl20]: true,
          })}>
            <Checkbox
              checked={!!data.isDeliveryCompany}
              onChange={(e) => setInput(index, 'isDeliveryCompany', e.target.checked ? 1 : 0)}
            >指定快递公司</Checkbox>
            <Select style={{ width: 150, marginLeft: 10 }}
              value={data.deliveryCompanyId}
              onChange={(e: any) => setInput(index, 'deliveryCompanyId', e)} placeholder='请选择物流公司'>
              {
              deliveryCompanyList.map((v:any, i:number)=>(
                <Option key={i} value={v.id}>{v.name}</Option>
              ))
            }
            </Select>
          </div>
        </div>
        <Operation tip={'是否删除指定区域运费配置?'} showEdit 
        handleEdit={()=>{
          // 打开选择区域弹框
          dispatch({
            type: 'freight/setShowAreaLayer', payload: true
          })
          // 配置弹框类型
          dispatch({
            type: 'freight/saveCurLayerInfo', payload: {
              type: 'edit',
              tag: 1,
              index,
              selected: data.districts
            }
          })
        }}
        handleDel={()=>{
          dispatch({
            type: 'freight/saveSelectedAll',
            payload: excludeArr(selectedAll, data.districts)
          })
          let newArr = [...areaDeliveryWay]
          newArr.splice(index, 1)
          dispatch({
            type: 'freight/setAreaDeliveryWay',
            payload: newArr
          })
        }}/>
      </div>
    )
  }
  if(!areaDeliveryWay.length)return null;
  return (
    <>
      <Title value={'指定特殊区域'} />
      {
        areaDeliveryWay.map((v:any, i:number) => <List data={v} index={i} key={i}/>)
      }
    </>
  )
}

export default connect(({ freight }: { freight: StateType }) => ({
  deliveryCompanyList: freight.deliveryCompanyList,
  chargeMode: freight.chargeMode,
  areaDeliveryWay: freight.areaDeliveryWay,
  selectedAll: freight.selectedAll,
}))(appointConfiguration);