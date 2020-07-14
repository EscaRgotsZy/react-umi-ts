

import styles from './default-configuration.less'
import React from 'react'
import { Input, Checkbox, Select } from 'antd';
import classnames from 'classnames'
import { connect } from 'umi';
import { StateType, Mode } from '@/models/freight'
import { toNumber } from './util'

const { Option } = Select;

interface DefaultConfigurationProps {
  dispatch?: any;
  deliveryCompanyList: any;
  chargeMode: any;
  defaultDeliveryWay: any;
}
const defaultConfiguration: React.FC<DefaultConfigurationProps> = (props) => {
  const { deliveryCompanyList, chargeMode, dispatch, defaultDeliveryWay } = props;



  function setInput(type: string, val: string | number | boolean) {
    dispatch({
      type: 'freight/setDefaultDeliveryWay',
      payload: {
        ...defaultDeliveryWay,
        [type]: val
      }
    })
  }
  return (

    <div className={styles.wrap} >
      <div className={styles.leftContent} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>默认方式</div>

      <div className={styles.rightContent}>
        <div className={styles.rightItem}>
          <div className={styles.center} style={{ flex: .66 }}>
            {
              chargeMode === Mode.isByPiece ? <span>1件</span> : (
                <Input
                  style={{ height: 30, width: 100 }}
                  value={defaultDeliveryWay.firstPiece}
                  addonAfter={'千克'} onChange={e => setInput('firstPiece', toNumber(e.target.value, defaultDeliveryWay.firstPiece))} />
              )
            }
          </div>

          <div className={styles.center} style={{ flex: .66 }}>
            <Input
              style={{ height: 30, width: 100 }}
              value={defaultDeliveryWay.firstPieceFee}
              addonAfter={'元'} onChange={e => setInput('firstPieceFee', toNumber(e.target.value, defaultDeliveryWay.firstPieceFee))} />
          </div>
          <div className={styles.center} style={{ flex: 1 }}>
            <div style={{ whiteSpace: 'nowrap' }}>每增加</div>
            <Input
              style={{ height: 30, width: 100, marginLeft: 5 }}
              value={defaultDeliveryWay.addPiece}
              addonAfter={`${chargeMode === Mode.isByPiece ? '件' : '千克'}`} onChange={e => setInput('addPiece', toNumber(e.target.value, defaultDeliveryWay.addPiece))} />

          </div>
          <div className={styles.center} style={{ flex: 1 }}>
            <div style={{ whiteSpace: 'nowrap' }}>增加运费</div>
            <Input
              style={{ height: 30, width: 100, marginLeft: 5 }}
              value={defaultDeliveryWay.addPieceFee}
              addonAfter={`元`} onChange={e => setInput('addPieceFee', toNumber(e.target.value, defaultDeliveryWay.addPieceFee))} />

          </div>
        </div>

        <div className={classnames({
          [styles.rightItem]: true,
          [styles.borderTB]: true,
          [styles.pl20]: true
        })}>
          <Checkbox
            checked={!!defaultDeliveryWay.isConditionPinkage}
            onChange={(e) => setInput('isConditionPinkage', e.target.checked ? 1 : 0)}
          >指定条件包邮</Checkbox>
          <span style={{ marginLeft: 10 }}>满</span>
          <Input
            style={{ height: 30, width: 120, margin: '0 8px' }}
            value={defaultDeliveryWay.fullMinusCount}
            onChange={e => setInput('fullMinusCount', toNumber(e.target.value, defaultDeliveryWay.fullMinusCount))}
            addonAfter={
              <Select className="select-after" value={defaultDeliveryWay.fullMinusUnit} onChange={e => setInput('fullMinusUnit', e)}>
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
            checked={!!defaultDeliveryWay.isDeliveryCompany}
            onChange={(e) => setInput('isDeliveryCompany', e.target.checked ? 1 : 0)}
          >指定快递公司</Checkbox>
          <Select style={{ width: 150, marginLeft: 10 }}
            value={defaultDeliveryWay.deliveryCompanyId}
            onChange={(e: any) => setInput('deliveryCompanyId', e)} placeholder='请选择物流公司'>
            {
              deliveryCompanyList.map((v: any, i: number) => (
                <Option key={i} value={v.id}>{v.name}</Option>
              ))
            }
          </Select>
        </div>
      </div>
    </div>

  )
}

export default connect(({ freight }: { freight: StateType }) => ({
  deliveryCompanyList: freight.deliveryCompanyList,
  chargeMode: freight.chargeMode,
  defaultDeliveryWay: freight.defaultDeliveryWay,
}))(defaultConfiguration);
