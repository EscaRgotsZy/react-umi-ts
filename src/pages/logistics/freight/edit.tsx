import styles from './edit.less'
import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Radio, Divider, Button, message } from 'antd'
import { connect } from 'umi';
import { StateType, Mode } from '@/models/freight'
import ChoiceProvince from '@/components/ChoiceProvince'
import RegionLayer from './components/region-layer'
import DefaultConfiguration from './components/default-configuration'
import PickedUp from './components/picked-up'
import AppointConfiguration from './components/appoint-configuration'
import UnspecifiedConfiguration from './components/unspecified-configuration'

import { addFreightTemplates, putFreightTemplates } from '@/services/logistics/freight'


const formItemLayout = { labelCol: { xs: { span: 4 }, sm: { span: 4 }, }, wrapperCol: { lg: { span: 16 }, md: { span: 16 }, xs: { span: 16 }, sm: { span: 16 }, }, };

interface EditFreightProps {
  history: any;
  match: any;
  dispatch?: any;
  baseInfo: any;
  detailStatus: any;
  isPickedUp: any;
  chargeMode: any;
  defaultDeliveryWay: any;
  areaDeliveryWay: any[];
  notDeliveryWay: any[];
  editId: string;
}


const EditFreight: React.FC<EditFreightProps> = (props) => {
  const { dispatch, history, match, editId, detailStatus, baseInfo, isPickedUp, chargeMode: cMode, defaultDeliveryWay, areaDeliveryWay, notDeliveryWay } = props;
  const [form] = Form.useForm()
  
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [city, setCity] = useState<any[]>([])

  useEffect(()=>{
    // 回显
    form.setFieldsValue({ address: baseInfo.addr, name: baseInfo.name })
    setCity(baseInfo.addr)
  }, [baseInfo, cMode])
  useEffect(()=>{
    // 回显
    form.setFieldsValue({ chargeMode: cMode })
  }, [cMode])

  useEffect(() => {
    dispatch({
      type: 'freight/setStatus',
      payload: {
        id: match.params.id,
        copy: history.location.query.copy,
      }
    })
    dispatch({ type: 'freight/fetchArea' })
    dispatch({ type: 'freight/fetchCompanies' })
    return () => {
      dispatch({
        type: 'freight/clearState',
      })
    }
  }, [])




  function checkParams(){
    let isSuccess = checkDefault() && checkDeliveryWay() && checkNotDeliveryWay();
    return isSuccess;
  }
  function checkDefault(){
    let errText = ``;
    if(defaultDeliveryWay.isDeliveryCompany === 1 && !defaultDeliveryWay.deliveryCompanyId) {
      errText = '请选择 ->> 快递公司'
    }
    if(defaultDeliveryWay.isConditionPinkage === 1 && !defaultDeliveryWay.fullMinusCount) {
      errText = '请输入 ->> 包邮条件'
    }
    if(!defaultDeliveryWay.addPieceFee) {
      errText = '请输入 ->> 每增加xxx的费用'
    }
    if(!defaultDeliveryWay.addPiece) {
      errText = '请输入 ->> 每增加'
    }
    if(!defaultDeliveryWay.firstPieceFee && defaultDeliveryWay.firstPieceFee !== 0) {
      errText = '请输入 ->> 配送价格'
    }
    if(cMode === 1 && !defaultDeliveryWay.firstPiece) {
      errText = '请输入 ->> 多少千克'
    }
    errText && message.error(`默认方式 ->> ${errText}`)
    return !errText
  }
  function checkDeliveryWay(){
    let errText = ``;
    areaDeliveryWay.forEach((v:any)=>{
      if(v.isDeliveryCompany === 1 && !v.deliveryCompanyId) {
        errText = '请选择 ->> 快递公司'
      }
      if(v.isConditionPinkage === 1 && !v.fullMinusCount) {
        errText = '请输入 ->> 包邮条件'
      }
      if(!v.addPieceFee) {
        errText = '请输入 ->> 每增加xxx的费用'
      }
      if(!v.addPiece) {
        errText = '请输入 ->> 每增加'
      }
      if(!v.firstPieceFee && v.firstPieceFee !== 0) {
        errText = '请输入 ->> 配送价格'
      }
      if(cMode === 1 && !v.firstPiece) {
        errText = '请输入 ->> 多少千克'
      }
    })
    errText && message.error(`指定特殊区域 ->> ${errText}`)
    return !errText
  }
  function checkNotDeliveryWay(){
    let errText = ``;
    notDeliveryWay.forEach((v:any)=>{
      if(!v.notDeliveryReason){
        errText = '请选择 ->> 不配送原因'
      }
    })
    errText && message.error(`不配送区域 ->> ${errText}`)
    return !errText
  }

  // 提交
  function save() {
    form.validateFields()
      .then((values):any => {
        let { name, address, chargeMode } = values;
        
        let defaultArr:any[] = [], areaDeliveryWayArr:any[] = [], notDeliveryWayArr:any[] = [];

        let isSuccess = checkParams();
        if(!isSuccess)return false;

        // 组装数据 - 拼成后端需要的格式
        defaultArr = [{
          ...defaultDeliveryWay,
          type: 0,
          firstPiece: chargeMode === 2? 1: defaultDeliveryWay.firstPiece
        }]

        if(areaDeliveryWay.length){
          areaDeliveryWayArr = areaDeliveryWay.map(v=>{
            return {
              ...v,
              type: 1,
              firstPiece: chargeMode === 2? 1: v.firstPiece,
              districtInfo: JSON.stringify(v.districtInfo.map((o:any)=> ({title: o.title, key: o.key}))),
              districts: v.districts.reduce((mo:any[], o:any)=>{
                if(o.level === 3){
                  mo.push({
                    districtId: o.key,
                    districtName: o.title
                  })
                }
                return mo
              }, [])
            }
          })
        }

        if(notDeliveryWay.length){
          notDeliveryWayArr = notDeliveryWay.map(v=>{
            return {
              ...v,
              type: 2,
              districtInfo: JSON.stringify(v.districtInfo.map((o:any)=> ({title: o.title, key: o.key}))),
              districts: v.districts.reduce((mo:any[], o:any)=>{
                if(o.level === 3){
                  mo.push({
                    districtId: o.key,
                    districtName: o.title
                  })
                }
                return mo
              }, [])
            }
          })
        }
        

        let params: any = {
          name,// 模板名称
          chargeMode: chargeMode,// 计费方式： 1按重量 2按件数
          areaId: address[2],
          cityId: address[1],
          provinceId: address[0],
          defaultDeliveryWay: {type: 0, deliveryWays: defaultArr},// 默认方式
          areaDeliveryWay: {type: 1, deliveryWays: areaDeliveryWayArr},// 指定区域
          notDeliveryWay: {type: 2, deliveryWays: notDeliveryWayArr},// 不配送区域
          selfTaking: {},
        }

        if(isPickedUp){// 设置自提
          params.selfTaking = {
            type: 3,
            deliveryWays: [{ fullMinusCount: 0, fullMinusUnit: 2, isConditionPinkage: true, type: 3 }]
          }
        }
        submitSave(params)
      })
  }

  async function submitSave(params:any):Promise<false | void>{
    let res;
    setSaveLoading(true)
    if (detailStatus.isAdd) {
      res = await addFreightTemplates(params);
    }
    if (detailStatus.isEdit) {
      params.id = editId;
      res = await putFreightTemplates(params);
    }
    setSaveLoading(false)
    let [err] = res;
    if(err)return false;
    cancel()
  }

  // 取消
  function cancel() {
    history.goBack();
  }

  function showAreaLayer(tag:number){
    // 打开选择区域弹框
    dispatch({
      type: 'freight/setShowAreaLayer', payload: true
    })
    // 配置弹框类型
    dispatch({
      type: 'freight/saveCurLayerInfo', payload: {
        type: 'add',
        tag,
        index: 0,
        selected: []
      }
    })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Form
          form={form}
          {...formItemLayout}
          initialValues={{
            chargeMode: cMode
          }}
        >
          <Form.Item label="模版名称：" style={{ marginBottom: 10 }} name="name" rules={[
            { required: true, message: '请输入模板名称' },
            { max: 50, message: '模版名称长度过长!' },
          ]}>
            <Input placeholder='请输入模板名称' style={{ width: 350 }} />
          </Form.Item>
          <Form.Item label="发货地址：" style={{ marginBottom: 10 }} name="address" rules={[
            { required: true, message: '请选择发货地址' },
          ]}>
            <ChoiceProvince value={city} cityChange={(value: Array<string>) => {
              setCity(value)
              form.setFieldsValue({ address: value })
            }} />
          </Form.Item>
          <Form.Item label="计费方式：" style={{ marginBottom: '5px' }} name="chargeMode" rules={[{ required: true, message: '请选择是否限购!' }]}>
            <Radio.Group onChange={(e)=>{ dispatch({type: 'freight/saveMode', payload: e.target.value}) }}>
              <Radio value={Mode.isByPiece}>按件数计费</Radio>
              <Radio value={Mode.isByweight}>按重量计费</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="快递方式：" style={{ marginBottom: '5px' }}  >

            <DefaultConfiguration />
            <PickedUp />
            <AppointConfiguration />
            <UnspecifiedConfiguration />

            <div className={`${styles.btnBox} ${styles.pt20}`} >
              {
                !isPickedUp && (
                  <Button style={{ margin: '10px' }} onClick={() => {
                    dispatch({
                      type: 'freight/savePickedUp',
                      payload: true,
                    })
                  }} >设置自提快递方式</Button>
                )
              }
              <Button style={{ margin: '10px' }} onClick={showAreaLayer.bind(null, 1)}>设置指定区域运费</Button>
              <Button style={{ margin: '10px' }} onClick={showAreaLayer.bind(null, 2)}>设置不配送区域</Button>
            </div>

          </Form.Item>
        </Form>
        <Divider dashed />
        <div className={styles.btnBox}>
          <Button style={{ margin: '10px' }} onClick={cancel} >取消</Button>
          <Button type='primary' style={{ margin: '10px' }} onClick={save} loading={saveLoading}>确定</Button>
        </div>


      </Card>

      <RegionLayer />
    </PageHeaderWrapper>
  )
}

export default connect(({ freight }: { freight: StateType }) => ({
  editId: freight.editId,
  detailStatus: freight.detailStatus,
  baseInfo: freight.baseInfo,
  isPickedUp: freight.isPickedUp,
  chargeMode: freight.chargeMode,
  defaultDeliveryWay: freight.defaultDeliveryWay,
  areaDeliveryWay: freight.areaDeliveryWay,
  notDeliveryWay: freight.notDeliveryWay,
}))(EditFreight);