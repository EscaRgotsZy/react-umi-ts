
import styles from './unspecified-configuration.less'
import React from 'react'
import { Select, Tag } from 'antd'
import { connect } from 'umi';
import { StateType } from '@/models/freight'
import Title from './title'
import Operation from './operation'
import { excludeArr } from './util'


const { Option } = Select;

interface UnspecifiedConfigurationProps {
  dispatch?: any;
  notDeliveryWay: any[];
  selectedAll: any[];
}
const unspecifiedConfiguration: React.FC<UnspecifiedConfigurationProps> = (props) => {
  const { dispatch, selectedAll, notDeliveryWay } = props


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
          <div className={styles.rightItem}>不配送原因：</div>
          <div className={styles.rightItem}>
            <Select style={{ width: 300, marginLeft: '10px', borderRadius: 'initial' }}
              onChange={(text) => {
                let newNotDeliveryWay = [...notDeliveryWay].map((v, i)=>{
                  if(index === i){
                    return {
                      ...v,
                      notDeliveryReason: text
                    }
                  }
                  return v;
                })
                dispatch({
                  type: 'freight/setNotDeliveryWay',
                  payload: newNotDeliveryWay
                })
              }}
              value={data.notDeliveryReason}
            >
              <Option value="受台风等自然灾害影响">受台风等自然灾害影响</Option>
              <Option value="因距离远导致的运费上升">因距离远导致的运费上升</Option>
              <Option value="因商品重量大导致的运费上升">因商品重量大导致的运费上升</Option>
              <Option value="因国家会议导致的运费上升">因国家会议导致的运费上升</Option>
              <Option value="合作快递不配送该区域">合作快递不配送该区域</Option>
              <Option value="合作快递该区域服务差">合作快递该区域服务差</Option>
              <Option value="其他">其他</Option>
            </Select>
          </div>
        </div>
        <Operation tip={'是否删除不配送区域配置?'} showEdit 
        handleEdit={()=>{
          // 打开选择区域弹框
          dispatch({
            type: 'freight/setShowAreaLayer', payload: true
          })
          // 配置弹框类型
          dispatch({
            type: 'freight/saveCurLayerInfo', payload: {
              type: 'edit',
              tag: 2,
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
          let newArr = [...notDeliveryWay]
          newArr.splice(index, 1)
          dispatch({
            type: 'freight/setNotDeliveryWay',
            payload: newArr
          })
        }}/>
      </div>
    )
  }
  if(!notDeliveryWay.length)return null;
  return (
    <>
      <Title value={'不配送区域'} />
      {
        notDeliveryWay.map((v: any, i: number) => <List key={i} data={v} index={i}/>)
      }
    </>
  )
}

export default connect(({ freight }: { freight: StateType }) => ({
  notDeliveryWay: freight.notDeliveryWay,
  selectedAll: freight.selectedAll,
}))(unspecifiedConfiguration);