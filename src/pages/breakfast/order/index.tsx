import styles from './index.less'
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, TimePicker, Form, message, Select, Input, Button, Tooltip, Modal } from 'antd';
import { QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons'
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { getShopList } from '@/services/common/index'

const format = 'HH:mm';
const FormItem = Form.Item;
const Option = Select.Option;

const BreakfastOrder = () => {
  const [form] = Form.useForm()
  const [shopList, setShopList] = useState([])// 店铺列表
  const [qrcodeShow, setQrcodeShow] = useState(false)
  const [url, setUrl] = useState('')


  useEffect(() => {
    getShopLists()
  }, [])

  async function getShopLists() {
    let params = {
      page: 1,
      size: 499
    }
    let res = await getShopList(params)
    let { records } = res;
    setShopList(records)
  }
  function generate() {
    form.validateFields(['env', 'shopId', 'type', 'status', 'startTime', 'endTime', 'switchTime'])
      .then((values) => {
        let { env, shopId, type, status, startTime, endTime, switchTime } = values
        localStorage.shopId = shopId;
        type = type === '-1' ? '' : type;
        status = checkStatus(status)
        startTime = moment(startTime).format(format) + ':00'
        endTime = moment(endTime).format(format) + ':00'
        switchTime = moment(switchTime).format(format) + ':00'
        var domain = env === 'prod' ? 'http://m.fulimall.net' : env === 'pre' ? 'http://pre-m.fulimall.net' : 'http://10.10.4.105:1000'
        let queryParams = `?env=${env}&shop-id=${shopId}&start-time=[t-1]${startTime}&end-time=[t]${endTime}&next-time=[t]${switchTime}&status=${status}&type=${type}`
        let url = `${domain}/module/index.html${queryParams}`
        setUrl(url)
        setQrcodeShow(true)
      })
      .catch(() => { })
  }

  function checkStatus(status: string) {
    if (status === '-1') {
      return ''
    }
    if (status === '-2') {
      return '2,3'
    }
    return status
  }
  function downloadCode() {
    var Qr: any = document.getElementById('qrid');
    let image = new Image();
    image.src = Qr.toDataURL("image/png");
    var a_link: any = document.getElementById('aId');
    a_link.href = image.src;
  }
  return (
    <PageHeaderWrapper>
      <Card>

        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
          form={form}
          initialValues={{
            env: 'test',
            shopId: localStorage.shopId ? localStorage.shopId : '',
            status: '2',
            type: '1',
            startTime: moment('08:00', format),
            endTime: moment('08:00', format),
            switchTime: moment('12:00', format),
          }}
        >
          <FormItem label="环境" name="env" rules={[
            { required: true, message: '选择环境' },
          ]}>
            <Select
              style={{ width: '300px' }}
              placeholder="请选择"
            >
              <Option value={'test'}>测试环境</Option>
              <Option value={'pre'}>预发布</Option>
              <Option value={'prod'}>线上</Option>
            </Select>
          </FormItem>
          <FormItem label="店铺id" name="shopId" rules={[
            { required: true, message: '请选择店铺' },
          ]}>
            <Select
              style={{ width: '300px' }}
              placeholder="请选择店铺"
            >
              {
                shopList.map((v: any) => <Option value={String(v.shopId)} key={v.shopId}>{v.shopName || ''}</Option>)
              }
            </Select>
          </FormItem>
          <FormItem label="订单类型" name="type" rules={[
            { required: true, message: '请选择订单类型' },
          ]}>
            <Select
              style={{ width: '300px' }}
              placeholder="请选择"
            >
              <Option value="-1" selected>全部类型</Option>
              <Option value="1">普通订单</Option>
              <Option value="2">拼团订单</Option>
              <Option value="3">预售订单</Option>
              <Option value="4">团购订单</Option>
            </Select>
          </FormItem>
          <FormItem label="订单状态" name="status" rules={[
            { required: true, message: '请选择订单状态' },
          ]}>

            <Select
              style={{ width: '300px' }}
              placeholder="请选择"
            >
              <Option value="-1" selected>全部状态</Option>
              <Option value="-2">待发货 + 待收货</Option>
              <Option value="1">待付款</Option>
              <Option value="2">待发货</Option>
              <Option value="3">待收货</Option>
              <Option value="4">已完成</Option>
              <Option value="5">已取消</Option>
              <Option value="6">已退货</Option>
              <Option value="7">申请售后</Option>
              <Option value="8">支付中</Option>
              <Option value="9">支付失败</Option>
            </Select>
          </FormItem>
          <FormItem label={
            <span>
              开始时间&nbsp;
                <Tooltip title="查出当前时间之后的订单">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
            name="startTime" rules={
              [
                { required: true, message: '请选择' },
              ]
            }>
            <TimePicker format={format} />
          </FormItem>
          <FormItem label={
            <span>
              结束时间&nbsp;
              <Tooltip title="查出当前时间之前的订单">
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
            name="endTime"
            rules={[
              { required: true, message: '请选择' },
            ]}
          >
            <TimePicker format={format} />
          </FormItem>
          <FormItem label={
            <span>
              切换时间点&nbsp;
              <Tooltip title={() => <div>如果开始时间是：八点<br />结束时间是：八点<br />当前时间是：十点<br /><span style={{ color: 'red' }}>情况一</span><em style={{ fontSize: '12px', color: '#888' }}>（当前已经过了切点时间）</em><br />切点时间设置成九点，你将会看到今天八点到明天八点的订单<br />
                <span style={{ color: 'red' }}>情况二<em style={{ fontSize: '12px', color: '#888' }}>（切点时间还没有过）</em></span><br />切点时间设置成十一点，你将会看到昨天八点到今天八点的订单</div>}>
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
            name="switchTime"
            rules={[
              { required: true, message: '请选择' },
            ]}
          >
            <TimePicker format={format} />
          </FormItem>

          <FormItem wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" style={{ marginTop: 50 }} onClick={generate}>生成地址</Button>
          </FormItem>

        </Form>


      </Card>
      <Modal
        title={`生成成功`}
        visible={qrcodeShow}
        onOk={() => setQrcodeShow(false)}
        onCancel={() => setQrcodeShow(false)}
        wrapClassName={styles.modal}
        maskClosable={false}
      >
        <div className={styles.qrcodeBox}>
          <p className={styles.qrcodeTitle}><em>{url}</em>
            <CopyToClipboard text={url}
              onCopy={() => message.success('复制成功~')}>
              <span className={styles.copy}>复制</span>
            </CopyToClipboard>
          </p>
          <QRCode
            value={url}
            size={200}
            id='qrid'
            fgColor="#000000"
          />
          <a id='aId' download={"早餐订单.png"} onClick={downloadCode} style={{ marginTop: 25 }}>
            <Button type="primary" shape="round" icon={<DownloadOutlined />} >点击下载</Button>
          </a>
        </div>
      </Modal>
    </PageHeaderWrapper>
  )
}


export default BreakfastOrder