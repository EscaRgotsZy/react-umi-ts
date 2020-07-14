import React, { useState } from 'react';
import { Card, Button, Input, Select, Form, DatePicker, Radio, message } from 'antd';
import { connect } from 'umi';
import moment from 'moment'
import { StateType } from '@/models/group_purchase'
import { SketchPicker } from 'react-color';
import SingleUpload from '@/components/SingleUpload'
import GoodsSort from './goodsSort'
import { addGroupon, editGroupon } from '@/services/activity/group_purchase'
import { history } from 'umi';
import styles from './index.less'

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 11 },
    sm: { span: 11 },
  },
};

interface Step2Props {
  dispatch?: any;
  selGoods: any;
  activityInfo: any;
  activityStatus: any;
  activityId: any;
}
const Step2: React.FC<Step2Props> = (props) => {
  const { dispatch, selGoods, activityInfo, activityId, activityStatus } = props;
  const [form] = Form.useForm()
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState(activityInfo.backgroundColor)
  const [sharePic, setSharePic] = useState(activityInfo.sharePic)
  const [groupPic, setGroupPic] = useState(activityInfo.groupPic)



  function save() {
    form.validateFields().then(async (values:any) => {
      if (!groupPic) return message.warn('请上传活动页顶部图片')
      if (!sharePic) return message.warn('请上传微信分享图片')

      let { activityTime, backgroundColor, countDown, groupName, limitNumber, limitUserType, peopleNumber, shareContent, shareTitle } = values;
      let startTime = moment(activityTime[0]).valueOf()
      let endTime = moment(activityTime[1]).valueOf()

      let groupPurchaseProducts:any[] = []
      selGoods.forEach((goods:any, index:number) => {
         goods.productSkus.map((v:any) => {
          let tmp = {
            groupLevelRate: v.mergeLevelRate,
            groupPrice: v.mergePrice,
            productId: v.productId,
            seq: index + 1,
            skuId: v.skuId,
            skuName: goods.productName,
            skuPic: v.originPic,
            skuPrice: v.price,
          }
          groupPurchaseProducts.push(tmp)
        })
      })
      let params = {
        startTime,
        endTime,
        groupPic,
        groupName,
        countDown,
        limitNumber,
        limitUserType,
        peopleNumber,
        shareTitle,
        shareContent: shareContent || '爱拼才会赢，团购万家亲，超多商品，限时超低价，快来抢购吧～',
        sharePic,
        groupPurchaseProducts,
        backgroundColor: backgroundColor
      }

      let res;
      setSaveLoading(true)
      if(activityStatus.isAdd){
        res = await addGroupon(params);
      }
      if(activityStatus.isEdit){
        res = await editGroupon({...params, id: activityId});
      }
      setSaveLoading(false)
      if(!res)return false;
      message.success(activityStatus.isEdit ? '编辑成功' : '创建成功');
      history.goBack()
    })
  }

  function prevStep() {
    dispatch({
      type: 'group_purchase/saveActivityInfo',
      payload: {
        ...form.getFieldsValue(),
        sharePic,
        groupPic,
      }
    })
    dispatch({
      type: 'group_purchase/saveCurrentStep',
      payload: 'step1'
    })
  }

  return (
    <>
      <Form {...formItemLayout}
        form={form}
        initialValues={activityInfo}
      >
        <Card style={{ margin: '30px' }} title='基本信息'>
          <Form.Item label="活动名称" style={{ marginBottom: '10px' }} name="groupName" rules={[
            { required: true, message: '请输入活动名称' },
            { max: 15, message: '活动名称长度不能超过15个字' }
          ]}>
            <Input disabled={activityStatus.isRead}/>
          </Form.Item>

          <Form.Item label="活动时间" style={{ marginBottom: '10px' }} name="activityTime" rules={[
            { required: true, message: '请选择活动时间' },
          ]}>
            <RangePicker
              showTime={{
                hideDisabledOptions: true,
              }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={['开始时间', '结束时间']}
              allowClear={true}
              disabled={activityStatus.isRead}
            />
          </Form.Item>
          <Form.Item label="活动页顶部图片" style={{ marginBottom: '10px' }} name="groupPic">
            <SingleUpload valueUrl={groupPic} setImg={(url: string) => { setGroupPic(url) }} disabled={activityStatus.isRead}/>
          </Form.Item>
          <Form.Item label="网页背景色" style={{ marginBottom: '10px' }} name="backgroundColor" rules={[
            { required: true, message: '请选择网页背景色！' }
          ]}>
            <div className={styles.colorBox}>
              <div className={styles.swatch} onClick={() => {
                !activityStatus.isRead && setDisplayColorPicker(true)
              }} >
                <div className={styles.color} style={{ backgroundColor: backgroundColor }} />
              </div>
              {displayColorPicker ? <div className={styles.popover}>
                <div className={styles.cover} onClick={() => setDisplayColorPicker(false)} />
                <SketchPicker color={backgroundColor} onChange={(color) => {
                  form.setFieldsValue({ backgroundColor: color.hex })
                  setBackgroundColor(color.hex)
                }} />
              </div> : null}
            </div>
          </Form.Item>
        </Card>

        <Card style={{ margin: '30px' }} title='活动规则'>
          <Form.Item label="用户类型" style={{ marginBottom: '10px' }} name="limitUserType" rules={[
            { required: true, message: '请选择用户类型' },
          ]}>
            <Radio.Group disabled={activityStatus.isRead}>
              <Radio value={1}>仅限企业用户</Radio>
              <Radio value={2}>所有人</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="团购总单数" style={{ marginBottom: '10px' }} name="peopleNumber" rules={[
            { required: true, message: '请输入团购总单数' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '团购总单数仅支持正整数' }
          ]}>
            <Input min={0} style={{ width: '200px' }} disabled={activityStatus.isRead}/>
          </Form.Item>
          <Form.Item label="每一轮倒计时" style={{ marginBottom: '10px' }} name="countDown" rules={[
            { required: true, message: '请选择支付方式' }
          ]}>
            <Select style={{ width: 200 }} disabled={activityStatus.isRead}>
              <Option value="24">24小时</Option>
              <Option value="48">48小时</Option>
              <Option value="72">72小时</Option>
              <Option value="96">96小时</Option>
            </Select>
          </Form.Item>
          <Form.Item label="每人每件限购数量" style={{ marginBottom: '10px' }} name="limitNumber" rules={[
            { required: true, message: '请输入每人每件限购数量' },
            { pattern: /^[+]{0,1}(\d+)$/, message: '每人每件限购数量仅支持正整数' }
          ]}>
            <Input disabled={activityStatus.isRead} min={0} style={{ width: '200px' }} />
          </Form.Item>
        </Card>

        <Card style={{ margin: '30px' }} title='h5分享设置'>
          <Form.Item label="分享标题" style={{ marginBottom: '10px' }} name="shareTitle" rules={[
            { required: true, message: '请输入分享标题' },
            { max: 30, message: '分享标题不超过30个字' }
          ]}>
            <Input disabled={activityStatus.isRead} style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="分享描述" style={{ marginBottom: '10px' }} name="shareContent" rules={[
            { required: true, message: '请输入分享描述' },
            { max: 30, message: '分享描述不超过30个字' }
          ]}>
            <TextArea style={{ width: '300px' }} disabled={activityStatus.isRead}></TextArea>
          </Form.Item>
          <Form.Item label="微信分享图片" style={{ marginBottom: '10px' }} name="sharePic">
            <SingleUpload valueUrl={sharePic} setImg={(url: string) => { setSharePic(url) }} disabled={activityStatus.isRead}/>
          </Form.Item>
        </Card>
      </Form>

      <Card style={{ margin: '30px' }} title='商品排序'>
        <GoodsSort disabled={activityStatus.isRead} list={selGoods} sortGoodsIds={(newestGoods: any[]) => {
          dispatch({
            type: 'group_purchase/changeGoods',
            payload: newestGoods
          })
          if(!newestGoods.length){
            dispatch({
              type: 'group_purchase/saveCurrentStep',
              payload: 'step1'
            })
          }
        }} />
      </Card>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Button type="primary" onClick={prevStep} >上一步</Button>
        <Button type="primary" style={{ marginLeft: 20 }} disabled={activityStatus.isRead} loading={saveLoading}
          onClick={save}>提交</Button>
      </div>
    </>
  );
};

export default connect(({ group_purchase }: { group_purchase: StateType }) => ({
  selGoods: group_purchase.selGoods,
  activityInfo: group_purchase.activityInfo,
  activityStatus: group_purchase.activityStatus,
  activityId: group_purchase.activityId,
}))(Step2);