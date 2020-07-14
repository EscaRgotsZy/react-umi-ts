import React, { Component } from 'react';
import {Card, Form, Row, Col, Input, Select, Table, Button, Divider, Modal, message, DatePicker } from 'antd';
import {
  goodsListParams,
  getGoodsList,
  addCouponItemParams,
  addCouponItem
}from '@/services/activity/coupon';
import { handlePicUrl } from '@/utils/utils';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const FormItem = Form.Item;
interface UserState {
  loading: boolean, 
  pageSize: number,
  pageNum: number,
  total: number,
  openModal: boolean,
  couponType: string,
  goodsArr: Array<any>,
  selectedRows_goods: Array<any>,
  selectedRowKeys_goods: Array<any>,
  showInfo: boolean,
  goodsList: Array<any>,
  minGoodsPrice: number,
  startTime: string,
  endTime: string
}
interface UserProp  {
  history: any;
  tabChange: any
}
export default class AddCoupon extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  formGoodsRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.formGoodsRef = React.createRef();
    this.state = {
      loading: false, 
      pageNum: 1,
      pageSize: 5,
      total: 0,
      openModal: false,
      couponType: "common",
      goodsArr: [],// 已选择的商品数据
      selectedRows_goods: [],// 选择的商品数据
      selectedRowKeys_goods: [],// 选择的商品id
      showInfo:false,      //提示文字
      goodsList:[],
      minGoodsPrice: 0,
      startTime: '',
      endTime: '',
    }
  }
  columns:Array<any> = [
    {
        title: '商品名称',
        dataIndex: 'productName',
    },
    {
        title: '商品价格',
        dataIndex: 'presentPrice',
    },
    {
        title: '操作',
        render: (record:any) =><>
        <Button type="danger" onClick={() => this.delGoods(record)}>删除</Button>
        </>  
    },
  ]
  goodsColumns:Array<any> = [
    {
        title: '图片',
        render:(text:any,record:any) =><>
            <img width='80' height="80" src={record.productPic && handlePicUrl(record.productPic)} />
        </>
    },
    {
        title: '名称',
        dataIndex: 'productName',
    },
    {
        title: '价格',
        dataIndex: 'presentPrice',
    },
    {
        title: '库存',
        dataIndex: 'actualStocks',
    },
  ]
  componentDidMount() {

  }
  //商品券选择弹窗
  openModal = (flag = true) => {
    this.setState({
        openModal: flag
    })
    setTimeout(()=>{this.getGoodsList()},100)
  }
  //弹窗商品查询列表
  getGoodsList = async():Promise<any> => {
    let { productName='' } = this.formGoodsRef.current.getFieldsValue();
    let params:goodsListParams = {
        productName: productName && productName.trim(),      //名称
        page: this.state.pageNum,
        size: this.state.pageSize
    }
    this.setState({ loading: true });
    let res = await getGoodsList(params);
    this.setState({ loading: false })
    if (!res) return false;
    let { records=[], total } = res;
    let goodsList = records.map((v, i) => {
        let productPic = v.productPic || ''
        if (productPic) {
            productPic = handlePicUrl(productPic)
        }
        return {
            key: v.productId,
            ...v,
            productPic,
        }
    })
    this.setState({
      goodsList,
      total: total || 0
    })
  }
  //商品搜索
  goodsSearch = () => {
    this.setState({
        pageNum: 1,
        pageSize: 5,
        selectedRows_goods: [],
        selectedRowKeys_goods: [],
    }, this.getGoodsList)
  }
  //商品页面切换
  onTableChange = ({ current: pageNum, pageSize: pageSize }:any) => {
    this.setState({
        pageNum,
        pageSize
    }, this.getGoodsList)
  }
  //添加商品
  addGoods = ():any => {
    let { selectedRows_goods, selectedRowKeys_goods } = this.state;
    if(!selectedRowKeys_goods.length) return message.warn('请至少选择一个商品')
    let goodsArr = selectedRowKeys_goods.map( (v:any) => selectedRows_goods[v])
    let priceArr = goodsArr.map(v=>{
        return v.presentPrice
    })
    let minGoodsPrice = Math.min(...priceArr)
    this.setState({
        goodsArr,
        minGoodsPrice
    })
    this.openModal(false)
  }
  //删除商品
  delGoods = ({productId}:any) => {
    let { selectedRowKeys_goods, goodsArr } = this.state;
    selectedRowKeys_goods = [...selectedRowKeys_goods];
    selectedRowKeys_goods.splice(selectedRowKeys_goods.indexOf(productId), 1)
    goodsArr = [...goodsArr]
    goodsArr = goodsArr.reduce((mo, v)=>{
        if(v.productId !== productId){
            mo.push(v)
        }
        return mo;
    }, [])
    let priceArr = goodsArr.map(v=>{
        return v.presentPrice
    })
    let minGoodsPrice = Math.min(...priceArr)
    this.setState({ selectedRowKeys_goods, goodsArr, minGoodsPrice })
  }
  //
  checkValue = (rule:any, value:any, callback:any):any => {
    if(! /(^[0-9]*[1-9][0-9]*$)/.test(value)) return message.warn('面额为正整数，请输入正确格式');
    let { minGoodsPrice } = this.state
    if(value > minGoodsPrice*0.5) {
      this.setState({
          showInfo: true
      })
    }else{
      this.setState({
          showInfo: false
      })
    }
  }
  //时间选择
  disabledDate = (current:any) => {
    return current && current < moment().startOf('day');
  }
  // 活动时间
  checkDate = (date:any,dateString:any) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }
  //优惠券类型
  changeCouponType = (value: any) => {
    this.setState({
      couponType: value
    })
  }
  // 确定
  handleSubmit = () => {
    this.formRef.current
      .validateFields()
      .then(( values:any ):any => {
        let { couponName, startTimeStr, endTimeStr, couponType, offPrice, couponNumber, fullPrice, getLimit, description } = values;
        let { minGoodsPrice, startTime, endTime,selectedRowKeys_goods} = this.state;
        let idsArr  = this.state.selectedRowKeys_goods;
        let prodIdList = idsArr.join(",");
        if(!selectedRowKeys_goods.length) return message.warn('请至少选择一个商品')
        if(startTimeStr > endTimeStr) return message.warn('结束时间不能小于开始时间');
        if(Number(getLimit) > Number(couponNumber)) return message.warn('每人领取数量应当小于发放的数量');
        if (Number(getLimit) > 100) return message.warn('每人最多限领100张');
        if (Number(couponNumber) > 999999) return message.warn('发放数量最大为六位数字');
        if (description.length > 300) return message.warn('最多可填300字的描述文字');
        if(offPrice > minGoodsPrice) return message.warn('优惠券面额不得大于商品最小价格');
        if(fullPrice < minGoodsPrice) return message.warn('消费金额必须大于商品的最小价格');
        if(!prodIdList)return message.warn('商品券必须关联至少一个商品');
        let params:addCouponItemParams = {
            couponName,//优惠券名称 
            startTimeStr: startTime,
            endTimeStr: endTime,
            couponType,
            offPrice,// 面额
            fullPrice,// 满多少
            couponNumber,// 可发放数量
            getLimit,// 每人限制领取
            description,// 说明
            prodIdList,// 商品列表 String
        }
        this.saveCommit(params)
      }).catch((err: Error) => {});
  }
  
  //新增优惠券
  saveCommit = async (params:addCouponItemParams) => {
    await addCouponItem(params);
    this.props.tabChange(1)
  }

  render() {
    let {  loading,openModal, showInfo, goodsList, goodsArr,pageNum, pageSize, total, selectedRowKeys_goods,couponType} = this.state;
    // 商品选择详细
    const rowSelection_goods = {
      selectedRowKeys: selectedRowKeys_goods,
      onChange: (selectedRowKeys:any, selectedRows:any):any => {
        let {selectedRows_goods} = this.state
        selectedRows.forEach((v:any)=>{
            if( v && !selectedRows_goods[v['productId']]){
                selectedRows_goods[v['productId']] = v
            }
        })
        this.setState({ selectedRows_goods, selectedRowKeys_goods: selectedRowKeys })
      },
    };
    //商品分页
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum,
      pageSize: pageSize || 10,
      total: total,
      showTotal: (t:number) => <div>共{t}条</div>
    }
    return (
      <div>
        <Card>
          <Form 
            layout="inline" 
            ref={this.formRef}
            initialValues = {{
              
            }}
          >
            <Row style={{width:'100%'}}>
                <Col md={12} sm={12} offset={1}>
                  <FormItem 
                    label="优惠券名称：" 
                    name="couponName"
                    rules={
                      [{ required: true, message: '请输入新增的优惠券名称' }]
                    } 
                  >
                    <Input placeholder="名称" style={{width:'400px'}}/>
                  </FormItem>
                </Col>
                <Col md={10} sm={10} offset={1}>
                  <FormItem
                  label="有效期：" 
                  name="activityTime"
                  rules={[
                    {
                      required: true,
                      message: '请选择时效时间',
                    }
                  ]}
                  >
                  <RangePicker
                    showTime={{
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    onChange={this.checkDate}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: 400 }}
                  />
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={12} sm={12} offset={1}>
                <FormItem 
                  label="优惠券类型：" 
                  name="couponType"
                  rules={
                    [{ required: true, message: '请选择优惠券类型' }]
                  } 
                >
                  <Select style={{ width: 120 }} placeholder="请选择" onChange={this.changeCouponType}>
                    {/* <Option value="common">通用券</Option> */}
                    <Option value="product">商品券</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            { couponType == 'product' && <>
            <Row style={{width:'100%'}}>
              <Col md={20} sm={20} offset={1}>
                <FormItem label="选择商品：">
                  <Button type="primary" onClick={()=>{this.openModal(true)}}>选择</Button>
                  <Table
                    loading={loading}
                    dataSource={goodsArr}
                    pagination={false}
                    columns={this.columns}
                    style={{width:1100, marginTop: 24, textAlign: 'center',borderLeft:'1px solid #f1f1f1',borderRight:'1px solid #f1f1f1' }}
                  >
                  </Table>
                </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            </>
            }
            <Row style={{width:'100%'}}>
              <Col md={12} sm={12} offset={1}>
                <FormItem label="面额（元）：" required={true}>
                  <FormItem 
                    noStyle
                    name="offPrice"
                    rules={
                      [{ required: true, pattern: /(^[0-9]*[1-9][0-9]*$)/, message: '请输入正确格式' }]
                    } 
                  >
                    <Input style={{width:'120px'}}/>
                  </FormItem>
                  <span>（所填面值额为大于0的整数!）</span> 
                  {showInfo == true && 
                        <span style={{color:'red'}}>你所设的面额值已大于商品最小价格的50%</span>
                    }
                </FormItem>
              </Col>
              <Col md={10} sm={10} offset={1}>
                  <FormItem 
                    label="可发放总数：" 
                    name="couponNumber"
                    rules={
                      [{ required: true, pattern: /(^[0-9]\d*$)/, message: '请输入正确格式' }]
                    } 
                  >
                    <Input placeholder="总数" style={{width:'120px'}}/>
                  </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={12} sm={12} offset={1}>
                <FormItem label="每人限领：" required={true}>
                  <FormItem 
                    noStyle
                    name="getLimit"
                    rules={
                      [{ required: true, pattern: /(^[0-9]\d*$)/, message: '请输入正确格式' }]
                    } 
                  >
                    <Input placeholder="0" style={{width:'120px'}}/>
                  </FormItem>
                  <span>（如果为0,则用户领取不了!）</span> 
                </FormItem>
              </Col>
              <Col md={10} sm={10} offset={1}>
                  <FormItem 
                    label="消费金额（元）：" 
                    name="fullPrice"
                    rules={
                      [{ required: true, pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确格式' }]
                    } 
                  >
                    <Input placeholder="0.00" style={{width:'120px'}}/>
                  </FormItem>
              </Col>
            </Row>
            <Divider dashed />
            <Row style={{width:'100%'}}>
              <Col md={12} sm={12} offset={1}>
                  <FormItem 
                    label="优惠券描述：" 
                    name="description"
                    rules={
                      [{ required: true, message: '请填写优惠券内容描述' }]
                    } 
                  >
                    <TextArea allowClear cols={80} rows={5} style={{width:'400px'}}/>
                  </FormItem>
                </Col>
              </Row>
              <Divider dashed />
              <Row style={{width:'100%'}}>
                  <Col md={2} sm={2} offset={11} >
                      <Button type="primary" size="large" onClick={this.handleSubmit}>新增</Button>
                  </Col>
              </Row>
          </Form>
      </Card>
        <Modal
        width='960px'
        title={`选择商品`}
        visible={openModal}
        onOk={this.addGoods}
        onCancel={() => this.openModal(false)}
        maskClosable={false}
        centered={true}
        >
          <Form layout="inline" ref={this.formGoodsRef}>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ padding: "10px 0" }}>
              <Col md={21} sm={21}>
                <FormItem label="名称：" name="productName" style={{marginBottom: 10}}>
                  <Input placeholder="商品名称" />
                </FormItem>
              </Col>
              <Col md={3} sm={3}>
                <FormItem label="">
                    <Button type="primary" onClick={this.goodsSearch}>搜索</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Card>
            <div>当前已选择<span style={{color:'red',padding:'5px'}}>{selectedRowKeys_goods.length}</span>条</div>
            <Table
                loading={loading}
                size="small"
                dataSource={goodsList}
                rowSelection={rowSelection_goods}
                onChange={this.onTableChange}
                pagination={pagination}
                columns={this.goodsColumns}
                style={{marginTop: 10, textAlign: 'center' }}
            >
            </Table>
          </Card>
        </Modal>
      </div>
    )
  }
}

