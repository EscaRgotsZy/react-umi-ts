import styles from './info.less';
import React, { Component, } from 'react';
import moment from 'moment';
import { Card, Form, Row, Col, Input, Modal, Radio, Checkbox, Button, Table, message, Breadcrumb, } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { getPageQuery, handlePicUrl } from '@/common/utils'
const dealStatusList = ['待审核', '同意', '平台审核通过', '退款中', '退款完成', '商家待收货', '商家确认收货', '7', '8', '9', '10', '不同意', '退款失败', '卖家弃货', '待退货', '未收到货', '已收到货'];

import {
  getRefundDetail,
  getReturnDetail,
  postAuditRefund,
  postAuditItemReturn,
} from '@/services/deal/info';
interface UserProp {
  history: any;
  match: any;
  location: any;
}
interface UserState {
  confirmLoading: boolean,
  pageNum: number | string,
  pageSize: number | string,
  total: number | string,
  day: number | string,
  hour: number | string,
  minute: number | string,
  second: number | string,
  typeStatus: boolean,
  dealStatus: boolean,
  refundId: number | string,
  loading: boolean,
  refundDetailsInfo: any,
  refundStatus: number | string,
  imgList: Array<any>,
  imgVisiable: boolean,
  returnGoodsStatus: number | string,
  okBtnLoading: boolean,
  photoVoucher: any,
}
export default class OrderManage extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  formRef_1: React.RefObject<any>;
  formRef_2: React.RefObject<any>;
  formRef_3: React.RefObject<any>;
  formRef_4: React.RefObject<any>;
  formRef_5: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    let searchParams = getPageQuery();
    this.formRef = React.createRef();
    this.formRef_1 = React.createRef();
    this.formRef_2 = React.createRef();
    this.formRef_3 = React.createRef();
    this.formRef_4 = React.createRef();
    this.formRef_5 = React.createRef();
    this.state = {
      confirmLoading: false,// 添加 loading
      pageNum: 1,
      pageSize: 10,
      total: 0,
      day: 0,     //倒计时--天
      hour: 0,    //倒计时--时
      minute: 0,  //倒计时--分
      second: 0,   //倒计时--秒
      typeStatus: searchParams.t == 'goods' ? true : false,
      dealStatus: searchParams.s == '0' ? true : false,
      refundId: searchParams.refundId,
      loading: false,
      refundDetailsInfo: {},
      refundStatus: '',
      imgList: [],
      imgVisiable: false,
      returnGoodsStatus: '',
      okBtnLoading: false,
      photoVoucher: '',
    }
  }
  userId = '';
  detailStatusList: Array<any> = [];
  goodStatusList: Array<any> = [];
  timer: any = '';//倒计时
  componentDidMount() {
    this.getDataList();
  }
  handleStatus = (status: number | string) => {
    // const dealStatusList =
    // ['待审核', '同意', '平台审核通过', '退款中', '退款完成',
    //  '商家待收货', '商家确认收货', '7', '8', '9', '10', '不同意',
    //  '退款失败', '卖家弃货', '待退货', '未收到货', '已收到货'];
    this.detailStatusList = [
      { title: '买家申请退款', active: status != -1 },
      { title: '商家处理退款申请', active: status == 1 || status == 2 || status == 3 || status == 4 || status == 11 || status == 12 || status == 17 },
      { title: '审核通过，退款完成', active: status == 1 || status == 2 || status == 4 || status == 17 },
    ]

    this.goodStatusList = [
      { title: '买家申请退货', active: status == 0 || status == 1 || status == 2 || status == 4 || status == 5 || status == 6 || status == 11 || status == 13 || status == 14 || status == 15 || status == 16 },
      { title: '商家处理退货申请', active: status == 1 || status == 2 || status == 3 || status == 4 || status == 5 || status == 6 || status == 11 || status == 12 || status == 13 || status == 14 || status == 15 || status == 16 },
      { title: '买家退货给商家', active: status == 5 || status == 6 || status == 16 },
      { title: '确认收货，平台审核', active: status == 16 },
    ]
  }
  setFrom = (refundDetailsInfo: any) => {
    if (!refundDetailsInfo) return false
    this.formRef.current && this.formRef.current.setFieldsValue({
      isAgree: 1,
      isJettison: false,
      sellerMessage: refundDetailsInfo.sellerMessage,
    });
    this.formRef_1.current && this.formRef_1.current.setFieldsValue({
      userName: refundDetailsInfo.userName,
      returnNo: refundDetailsInfo.returnNo,
      orderNo: refundDetailsInfo.orderNo,
      applyTime: moment(refundDetailsInfo.applyTime).format('YYYY-MM-DD'),
      buyerMessage: refundDetailsInfo.buyerMessage,
      productAmount: refundDetailsInfo.productAmount,
      refundAmount: refundDetailsInfo.refundAmount ? refundDetailsInfo.refundAmount : '0',
      extraAmount: refundDetailsInfo.extraAmount ? refundDetailsInfo.extraAmount : "0",
      refundIntegral: refundDetailsInfo.refundIntegral,
      deductRefundIntegral: refundDetailsInfo.deductRefundIntegral,
      cashCoupon: ((refundDetailsInfo.deductRefundAmount > 0) || (refundDetailsInfo.deductRefundIntegral > 0)) ? "现金券不足" : refundDetailsInfo.cashCoupon,
      deductRefundAmount: refundDetailsInfo.deductRefundAmount,
      reasonInfo: refundDetailsInfo.reasonInfo,
    });
    this.formRef_2.current && this.formRef_2.current.setFieldsValue({
      status: (refundDetailsInfo.status == -1) ? '已撤销' : dealStatusList[refundDetailsInfo.status],

    });
    this.formRef_3.current && this.formRef_3.current.setFieldsValue({
      sellerMessage: refundDetailsInfo.sellerMessage,
    });
    this.formRef_4.current && this.formRef_4.current.setFieldsValue({
      payChannel: refundDetailsInfo.payChannel,
    });
    this.formRef_5.current && this.formRef_5.current.setFieldsValue({
      refundAmount: refundDetailsInfo.refundAmount ? refundDetailsInfo.refundAmount : '0',
    });
  }
  // 查询数据
  getDataList = async () => {
    this.setState({ loading: true });
    let res;
    if (!this.state.typeStatus) {
      res = await getRefundDetail(this.state.refundId);
    } else {
      res = await getReturnDetail(this.state.refundId);
    }
    this.setState({ loading: false })
    if (!res) {
      this.setState({ loading: false })
      return false
    };
    let refundDetailsInfo = res.data || '';
    refundDetailsInfo.endTime && this.countFun(refundDetailsInfo.endTime); // 倒计时

    let { status } = refundDetailsInfo; // 订单状态
    this.handleStatus(status);
    this.setState({
      refundDetailsInfo,
      refundStatus: refundDetailsInfo.status,
      imgList: refundDetailsInfo.exchangeOrderVoucherVOS,
      returnGoodsStatus: refundDetailsInfo.status,
      loading: false
    }, () => {
      this.setFrom(refundDetailsInfo);
    })
  }

  // 倒计时
  countFun = (end: any) => {
    let now_time = Date.parse(new Date() + '');
    var remaining = end - now_time;

    this.timer = setInterval(() => {
      //防止出现负数
      if (remaining > 1000) {
        remaining -= 1000;
        let day = Math.floor((remaining / 1000 / 3600) / 24);
        let hour = Math.floor((remaining / 1000 / 3600) % 24);
        let minute = Math.floor((remaining / 1000 / 60) % 60);
        let second = Math.floor(remaining / 1000 % 60);

        this.setState({
          day: day,
          hour: hour < 10 ? "0" + hour : hour,
          minute: minute < 10 ? "0" + minute : minute,
          second: second < 10 ? "0" + second : second
        })
      } else {
        clearInterval(this.timer);
        //倒计时结束时触发父组件的方法
        //this.props.timeEnd();
      }
    }, 1000);
  }

  // 刷新
  refresh = (onTableStatus: number | string) => {
    if (onTableStatus) {
      this.setState({
        pageNum: 1,
        pageSize: 10,
      }, () => {
        this.getDataList();
      })
    } else {
      this.getDataList();
    }
  }
  //提交前再次确认订单状态的变化
  checkDataAgain = async (query: any) => {
    // query = query;
    let res;
    if (!this.state.typeStatus) {
      res = await getRefundDetail(this.state.refundId);
    } else {
      res = await getReturnDetail(this.state.refundId);
    }
    if (!res) {
      this.setState({ loading: false })
      return false
    };
    let refundDetailsInfo = res.data || '';
    let { status } = refundDetailsInfo; // 订单状态
    if (status != 0) {
      message.warn("此订单已撤销申请售后，不能审核处理操作！")
      return false
    } else {
      this.sendResult(query);
    }
  }
  // 确认提交数据
  handleSubmit = async () => {
    this.formRef.current.validateFields()
      .then((values: any) => {
        let { isAgree, sellerMessage, isJettison } = values
        let { refundId } = this.state;
        isJettison = isJettison ? true : false;
        isAgree = isAgree == 1 ? true : false;
        let query;
        if (!this.state.typeStatus) {
          query = { isAgree, sellerMessage, refundId };
        } else {
          query = { isAgree, sellerMessage, refundId, isJettison };
        }
        this.checkDataAgain(query);
      })
      .catch((errorInfo: any) => {
        console.log('有错误:  ', errorInfo)
      })

  };
  // 发送审核
  sendResult = async (query: any) => {
    this.setState({ okBtnLoading: true });
    let res;
    if (!this.state.typeStatus) {
      res = await postAuditRefund(query);
      if (!res) return false;
      message.success('审核成功');
      this.props.history.push('/deal/refund?key=2');
    } else {
      res = await postAuditItemReturn(query);
      if (!res) return false;
      message.success('审核成功');
      this.props.history.push('/deal/refund?key=1');
    }
    this.setState({ okBtnLoading: false });

  }
  // 返回按钮
  backs = () => {
    this.props.history.goBack()
  }
  // 放大凭证
  showBigVoucher = (data: any) => {
    let { photoVoucher } = data;
    this.setState({
      imgVisiable: true,
      photoVoucher
    })
  }
  render() {

    const { typeStatus, loading, day, hour, minute, second, refundDetailsInfo, imgList, photoVoucher, dealStatus } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 6 },
      },
    };
    let voucherList = imgList && imgList.length > 0 && imgList.map(item =>
      <img height="100" src={handlePicUrl(item.photoVoucher)} onClick={() => this.showBigVoucher(item)} style={{ width: '100px', height: '100px', margin: '0 10px', border: '1px solid #ddd' }} />
    ) || [];
    return (
      <>
        <Card>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="">首页</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>交易管理</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="/#deal/refund">{typeStatus ? '退货列表' : '退款列表'}</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{typeStatus ? '退货详情' : '退款详情'} </Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <div className={styles.pageContent}>
          {!typeStatus && <Card style={{ marginTop: 20 }} hoverable loading={loading}>
            <div className={styles.alert} >
              <h4>提示：</h4>
              <ul>
                <li>1. 收到买家仅退款申请，请在
                          <em>
                    <span> {day}天</span>
                    <span>{hour}时</span>
                    <span>{minute}分</span>
                    <span>{second}秒 </span>
                  </em>
                        处理本次退款，如逾期未处理，将<em>自动同意退款</em>。
                        </li>
                <li>2. 需你同意退款申请，买家才能退货给你。买家退货后你需再次<em>确认收货</em>后，退款将自动原路退回至买家付款账户。</li>
                <li>3. 建议你与买家协商后，再确定是否拒绝退款。如你拒绝退款后，买家可修改退款申请协议重新发起退款。 也可直接发起维权申请，将会由有商城客服介入处理。</li>
              </ul>
            </div>
          </Card>}
          {typeStatus && <Card style={{ marginTop: 20 }} hoverable loading={loading}>
            <div className={styles.alert} >
              <h4>提示：</h4>
              <ul>
                <li>1. 若提出申请后，商家拒绝退款或退货，可再次提交申请或选择<em>"商品投诉"</em>请求商城客服人员介入。</li>
                <li>2. 成功完成退款/退货；经过商城审核后，会将退款金额以<em>"预存款"</em>的形式返还到您的余额账户中（充值卡部分只能退回到充值卡余额）。</li>
              </ul>
            </div>
          </Card>}
          {!typeStatus && <div className={styles.retStep}>
            <ul className={styles.retStepUl}>
              <li className={this.detailStatusList && this.detailStatusList[0] && this.detailStatusList[0].active ? styles.moneyDone : ''}><span>买家申请退款</span></li>
              <li className={this.detailStatusList && this.detailStatusList[1] && this.detailStatusList[1].active ? styles.moneyDone : ''}><span>商家处理退款申请</span></li>
              <li className={this.detailStatusList && this.detailStatusList[2] && this.detailStatusList[2].active ? styles.moneyDone : ''}><span>审核通过，退款完成</span></li>
            </ul>
          </div>}
          {typeStatus &&
            <div className={styles.retStepCom}>
              <ul>
                <li className={this.goodStatusList && this.goodStatusList[0] && this.goodStatusList[0].active ? styles.goodsDone : ''}><span>买家申请退货</span></li>
                <li className={this.goodStatusList && this.goodStatusList[1] && this.goodStatusList[1].active ? styles.goodsDone : ''}><span>商家处理退货申请</span></li>
                <li className={this.goodStatusList && this.goodStatusList[2] && this.goodStatusList[2].active ? styles.goodsDone : ''}><span>买家退货给商家</span></li>
                <li className={this.goodStatusList && this.goodStatusList[3] && this.goodStatusList[3].active ? styles.goodsDone : ''}><span>确认收货，平台审核</span></li>
              </ul>
            </div>}
          <Card title={`买家退${typeStatus ? '货' : '款'}申请`} bordered={false} style={{ marginTop: 20 }} loading={loading}>
            <Form
              {...formItemLayout}
              ref={this.formRef_1}
            >
              <Form.Item label="用户名：" name='userName'>
                <Input disabled />
              </Form.Item>

              <Form.Item label="退款编号：" name='returnNo' >
                <Input disabled />
              </Form.Item>

              <Form.Item label="订单编号：" name='orderNo'>
                <Input disabled />
              </Form.Item>

              <Form.Item label="申请时间：" name='applyTime'>
                <Input disabled />
              </Form.Item>



              <Form.Item label="退款原因：" name='buyerMessage'>
                <TextArea disabled></TextArea>
              </Form.Item>

              <Form.Item label="商品金额：" name='productAmount'>
                <Input disabled />
              </Form.Item>

              <Form.Item label="退款金额：" name='refundAmount'>
                <Input disabled />
              </Form.Item>
              <Form.Item label="有偿服务金额：" name='extraAmount'>
                <Input disabled />
              </Form.Item>
              <Form.Item label="退返现金券：" name='refundIntegral'>
                <Input disabled />
              </Form.Item>
              <Form.Item label="扣除退还现金券：" name='deductRefundIntegral'>
                <Input disabled />
              </Form.Item>
              <Form.Item label="扣回现金券：" name='cashCoupon'>
                <Input disabled />
              </Form.Item>

              <Form.Item label="扣回现金：" name='deductRefundAmount'>
                <Input disabled />
              </Form.Item>

              <Form.Item label="退款说明：" name='reasonInfo'>
                <TextArea disabled></TextArea>
              </Form.Item>
              <Form.Item label="涉及商品：">
                <Table
                  rowKey={record => record.id}
                  columns={[
                    {
                      title: '涉及商品名称',
                      dataIndex: 'productName',
                      render: (text) => <div style={{ width: '370px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</div>
                    },
                    {
                      title: '商品规格',
                      dataIndex: 'productAttr',
                      render: (text) => <div style={{ width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</div>
                    },
                  ]}
                  locale={
                    { emptyText: '暂无数据' }
                  }
                  dataSource={refundDetailsInfo && refundDetailsInfo.exchangeOrderItems || []}
                  pagination={false}
                  bordered
                />
              </Form.Item>
              <Form.Item label={`凭证上传`}>
                <>
                  {voucherList}
                </>
              </Form.Item>
            </Form>
          </Card>

          {/* ----- 凭证图片放大开始----- */}
          <Modal
            visible={this.state.imgVisiable}
            onCancel={() => { this.setState({ imgVisiable: false }) }}
            footer={null}
            closable={false}
          >
            <img width='100%' src={handlePicUrl(photoVoucher)} />
          </Modal>
          {/* ----- 凭证图片放大结束----- */}


          {dealStatus &&
            <Card title='我的处理意见' bordered={false} style={{ marginTop: 20 }} hoverable loading={this.state.loading}>

              <Form {...formItemLayout}
                ref={this.formRef}
              >
                <Form.Item label="是否同意："
                  rules={[{ required: true, message: '请选择是否同意退款申请' }]}
                  name='isAgree'
                >
                  <Radio.Group>
                    <Radio style={{ margin: '0 20px' }} value={1}>同意</Radio>
                    <Radio style={{ margin: '0 20px' }} value={-1}>不同意</Radio>
                  </Radio.Group>
                </Form.Item>
                {
                  typeStatus && this.formRef.current && this.formRef.current.getFieldValue('isAgree') == 1 &&
                  <Form.Item label="是否弃货" name='isJettison'>
                    <Checkbox style={{ margin: '0 20px' }} >弃货 ( 如果选择弃货买家将不用退回原商品!! )</Checkbox>
                  </Form.Item>
                }
                <Form.Item label="处理意见：" name='sellerMessage' rules={[{ required: true, message: '请选择处理意见信息' }]}>
                  <TextArea></TextArea>
                </Form.Item>
              </Form>
              <ul style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <li style={{ margin: '20px 40px' }}><Button onClick={this.handleSubmit} loading={this.state.okBtnLoading} >确定</Button></li>
                <li style={{ margin: '20px 40px' }}><Button onClick={this.backs}>返回</Button></li>
              </ul>
            </Card>}




          {!dealStatus &&
            <Card title='我的处理意见' bordered={false} style={{ marginTop: 20 }} hoverable loading={this.state.loading}>
              <Row>
                <Col span={12}>
                  <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}
                    ref={this.formRef_2}
                  >
                    <Form.Item label="审核状态: " name='status'>
                      <Input disabled />
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={12}>
                  <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} ref={this.formRef_3}>
                    <Form.Item label="处理意见: " name='sellerMessage'>
                      <Input disabled />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          }
          {(!dealStatus && !typeStatus) && (this.detailStatusList && this.detailStatusList[2] && this.detailStatusList[2].active) &&
            <Card title='退款详细' bordered={false} style={{ marginTop: 20 }} hoverable>
              <Row>
                <Col span={12}>
                  <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                    ref={this.formRef_4}
                  >
                    <Form.Item label="支付方式: " name='payChannel'>
                      <Input disabled />
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={12}>
                  <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                    ref={this.formRef_5}
                  >
                    <Form.Item label="退款金额: " name='refundAmount'>
                      <Input disabled />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Card>
          }
          {!dealStatus &&
            <Card style={{ border: '0px' }}>
              <ul style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <li style={{ margin: '20px 40px' }}><Button onClick={this.backs}>返回</Button></li>
              </ul>
            </Card>
          }
        </div>
      </>
    )
  }
}
