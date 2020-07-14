import React, { Component } from 'react';
import {Card, Form, Row, Col, Input, Select, Table, Divider, DatePicker } from 'antd';
import {
  CouponItemDetail,
  userCouponList
}from '@/services/activity/coupon';
import { handlePicUrl } from '@/utils/utils';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const FormItem = Form.Item;

interface UserState{
  loading: boolean,
  couponId: string,  //id
  couponName: string, //名称
  couponType: number | string,//类型
  description: string,//描述
  fullPrice: number | string,//消费额
  offPrice: number | string,//优惠额
  startTime: number,
  endTime: string,
  getLimit: number | string,//限领
  couponNumber: number | string,//发放数
  goodsList: Array<any>,//关联商品[]
  usersList: Array<any>,
  total_goods: number,
  pageNum_user: number,
  pageSize_user: number,
  total_user: number,
  pageNum_goods: number,
  pageSize_goods: number,
  shopId: number |string, 
  shopName: string, 
  logoPic: string, 
  shopType: number | string,
}
interface UserProp {
  history: any;
  match: any;
}
export default class watchCoupon extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props:UserProp) {
    super(props)
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      couponId: this.props.match.params.id,
      couponName: '', //名称
      couponType: '',//类型
      description: '',//描述
      fullPrice: '',//消费额
      offPrice: '',//优惠额
      startTime: 0,
      endTime: '',
      getLimit: '',//限领
      couponNumber: '',//发放数
      goodsList: [],//关联商品
      usersList: [],//关联用户
      total_goods: 0,
      pageNum_user: 1,
      pageSize_user: 5,
      total_user: 0,
      pageNum_goods: 1,
      pageSize_goods: 5,
      shopId:'', 
      shopName:'', 
      logoPic:'', 
      shopType:'',
    }
  }
  //关联商品头
  goodsColumns = [
    {
      title: '商品图片',
      dataIndex: 'productPic',
      render: (text:any, record:any) => <>
        <img width='65' height="65" src={ text && handlePicUrl(text) } />
       </>
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
    },
  ]
  //关联用户头
  userColumns = [
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '领取时间',
      dataIndex: 'createTime',
    },
    {
      title: '使用时间',
      dataIndex: 'useTime',
      render:(text:any)=><>
        {text?text:"空"}
      </>
    },
    {
      title: '状态',
      render: (record:any) => <>
        {record.useStatus == '1' ? '可使用' :record.useStatus == '2' ? '已使用' : '已过期'}
      </>
    },
  ]
  componentDidMount() {
    this.getDataList()
    this.getUserCouponInfo()
  }
  //获取数据
  getDataList = async ():Promise<any> => {
    let { couponId } = this.state;
    this.setState({ loading: true });
    let res = await CouponItemDetail( couponId );
    this.setState({ loading: false });
    let { data } = res || {}
    let { coupon={}, productList={} } = data;
    let { total } = productList
    //遍历关联商品
    let goodsList = productList && productList.length != 0 ? productList.records.map((v:any) => {
      let productPic = v.productPic || ''
      if (productPic) {
        productPic = handlePicUrl(productPic) 
      }
      return {
        key: v.productId,
        ...v,
        productPic
      }
    }) : []
    this.setState({
      couponId: coupon.couponId,//id
      couponName: coupon.couponName, //名称
      couponType: coupon.couponType,//类型
      description: coupon.description,//描述
      fullPrice: coupon.fullPrice,//消费额
      offPrice: coupon.offPrice,//优惠额
      getLimit: coupon.getLimit,//限领
      couponNumber: coupon.couponNumber,//发放数
      goodsList,//关联商品[]
      total_goods: total || 0
    }) 
    this.formRef.current.setFieldsValue({
      activityTime: [moment(coupon.startTime), moment(coupon.endTime)],
    })
  }
  //获取关联用户信息列表
  getUserCouponInfo = async () => {
    let id = this.state.couponId
    this.setState({ loading: true });
    let res = await userCouponList(id);
    this.setState({ loading: false });
    let { records=[], total } = res;
    let usersList = records && records.length != 0 ? records.map((v:any) => {
      return {
        ...v,
      }
    }) : [];
    this.setState({
      usersList, //关联用户[]
      total_user: total || 0
    })
  }
  //商品页面切换
  onTableChange_goods = ({ current: pageNum_goods, pageSize: pageSize_goods }:any) => {
    this.setState({
      pageNum_goods,
      pageSize_goods
    }, this.getDataList)
  }
  //用户页面切换
  onTableChange_user = ({ current: pageNum_user, pageSize: pageSize_user }:any) => {
    this.setState({
      pageNum_user,
      pageSize_user
    }, this.getUserCouponInfo)
  }
  //查看优惠券
  renderWatchConpon = () => {

    let { goodsList, usersList, couponName, couponType, description, fullPrice, offPrice, startTime, endTime, getLimit, couponNumber, pageNum_user, pageSize_user, total_user, pageNum_goods, pageSize_goods, total_goods } = this.state
    //userlist分页
    const pagination_user = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum_user,
      pageSize: pageSize_user || 5,
      total: total_user,
      showTotal: (t:number) => <div>共{t}条</div>
    }
    //商品分页
    const pagination_goods = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum_goods,
      pageSize: pageSize_goods || 5,
      total: total_goods,
      showTotal: (t:number) => <div>共{t}条</div>
    }
    return (
      <>
        <PageHeaderWrapper
          title={"优惠券详细"}
        />
        <Card >
          <Form 
            layout="inline" 
            ref={this.formRef}
          >
            <Row style={{width:'100%'}}>
              <Col md={10} sm={10} offset={2} >
                <FormItem label="优惠券名称：">
                  <Input value={couponName} disabled style={{width:'400px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}/>
                </FormItem>
              </Col>
              <Col md={10} sm={10} offset={2} >
                <FormItem label="有效期：" name="activityTime">
                  <RangePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: 400 }}
                    disabled= {true}
                  />
                </FormItem>
              </Col>
            </Row >
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={10} sm={10} offset={2}>
                <FormItem label="面额（元）：">
                  <Input value={offPrice} disabled={true} style={{width:'200px'}}/>
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={10} sm={10} offset={2}>
                <FormItem label="优惠券类型：">
                  {/* <Select style={{width: 150}} value={couponType==='product'?'商品券':'通用券'} disabled>               */}
                  <Select style={{ width: 150 }} value='商品券' disabled={true}>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            {couponType === 'product' &&
              <Row style={{ width:'100%',marginTop: '20px' }}>
                <Col md={8} sm={8} offset={4}>
                  <Table
                    rowKey={record => record.productId}
                    dataSource={goodsList}
                    columns={this.goodsColumns}
                    pagination={pagination_goods}
                    onChange={this.onTableChange_goods}
                    bordered
                    style={{ textAlign: 'center', alignItems: 'center', width: '800px', marginLeft: '85px' }}
                  >
                  </Table>
                </Col>
              </Row>
            }
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={10} sm={10} offset={2}>
                <FormItem label="可发放总数：">
                  <Input value={couponNumber} disabled={true} style={{width:'200px'}}/>
                </FormItem>
              </Col>
              <Col md={10} sm={10} offset={2}>
                <FormItem label="每人限领：">
                  <Input value={getLimit} disabled={true} style={{width:'200px'}}/>
                  <span>（如果限领为0,则用户领取不了!）</span>
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={10} sm={10} offset={2}>
                <FormItem label="消费金额：">
                  <Input value={fullPrice} disabled={true} style={{width:'200px'}}/>
                </FormItem>
              </Col>
              <Col md={10} sm={10} offset={2}>
                <FormItem label="优惠券描述：">
                  <TextArea rows={2} cols={50} value={description} style={{ borderColor: '#d9d9d9',width:'400px',padding:'10px' }} disabled></TextArea>
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={20} sm={20} offset={2} style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Table
                  rowKey={record => record.id}
                  dataSource={usersList}
                  columns={this.userColumns}
                  pagination={pagination_user}
                  onChange={this.onTableChange_user}
                  bordered
                  style={{ textAlign: 'center', alignItems: 'center' }}
                >
                </Table>
              </Col>
            </Row>
          </Form>
        </Card>
      </>
    )
  }
  render() {
    return (
      <>
        <div>
          <Card>
            <div>{this.renderWatchConpon()}</div>
          </Card>
        </div>
      </>
    )
  }

}

