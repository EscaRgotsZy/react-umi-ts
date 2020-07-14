import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Table, Button, Radio, Modal, message, DatePicker, InputNumber,Divider} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  watchPreSaleDetail,
  addPreSaleItemParams,
  goodsListParams,
  getGoodsList,
  getGoodsSkuList,
  AddPreSaleItem,
  EditPreSaleItem,
} from '@/services/activity/pre_sale';
import { handlePicUrl } from '@/utils/utils';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
interface UserState {
  loading: boolean,
  preSaleId: any,
  type: string,
  goodsPage: {
    pageSize: number,
    pageNum: number,
    total: number,
  },
  goodsLoading: boolean,
  skusLoading: boolean,
  GoodsVisiable: boolean,
  selectedRowKeys: Array<any>,
  selectedRows: Array<any>,
  selectGoods: any,
  initDataInfo: any,
  startTime: string|number,
  endTime: string|number,
  finalPayStartTime: string|number,
  finalPayEndTime: string|number,
  deliveryTime: string|number,//发货时间
  dataList: Array<any>,
  goodsDataList: Array<any>,
  payType: string|number,
  limitUserType: string|number,
}
interface UserProp {
  history: any;
  match: any;
}
export default class addPreSale extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  goodsFormRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.goodsFormRef = React.createRef();
    this.state = {
      loading: false,
      preSaleId: this.props.match.params.id,
      type: this.props.match.params.type,
      goodsPage: {
        pageSize: 5,
        pageNum: 1,
        total: 0,
      },
      goodsLoading: false,
      skusLoading: false,
      GoodsVisiable: false,
      selectedRowKeys: [],
      selectedRows: [],
      selectGoods: {},
      initDataInfo: '',
      startTime: '',
      endTime: '',
      finalPayStartTime: '',
      finalPayEndTime: '',
      deliveryTime: '', //发货时间
      dataList: [],
      goodsDataList: [],
      payType: '',
      limitUserType: '1',
    };
  }
  columns:Array<any> = [
    {
      title: '图片',
      width:'5%',
      render: ( record:any ) => {
          if (!record.pic) {
              return <img src={record.productPic && handlePicUrl(record.productPic)}  width='50' height='60' />
          } else {
              return <img src={record.pic && handlePicUrl(record.pic)} width='40' height='40' />
          }
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      width:'15%',
      render: ( text:any,record:any ) => {
          if (text) {
              return record.name
          } else {
              return record.productName
          }
      }
    },
    {
        title: '规格',
        width:'15%',
        dataIndex: 'saleProps',
    },
    {
        title: '销售价',
        dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
      render: ( text:any,record:any ) => {
        if (text) {
            return record.stocks
        } else {
            return record.stock
        }
      }
    },
    {
      title: '预售价(元)',
      dataIndex: 'preSalePrice',
      width: 200,
      render: (text:any,record:any, index:number) => <>
        <Input disabled={this.state.type == '1'} onChange={(e) => this.changePrice(e, index)} value={text} />
      </>
    },
  {
      title: '返佣比例',
      dataIndex: 'preLevelRate',
      width: 200,
      render: (text:any,record:any, index:number) => <>
      <div style={{display: 'flex',alignItems: 'center'}}>
        <Input disabled={this.state.type == '1'} onChange={(e) => this.changePreLeve(e, index)} value={text} />
        <span>%</span>
      </div>
      </>
  },
  ]
  goodsCloumns:Array<any> = [
    {
      title: '图片',
      dataIndex: 'productPic',
      render: (text:any) => (
        text ? <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '名称',
      dataIndex: 'productName',
      render: (text:any) => <>
          <div style={{ width: '360px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>商品名称:&nbsp;{text}</div>
      </>
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '操作',
      render: (record:any) => <>
          <Button type='primary' onClick={() => this.checkGoods(record)} >选择</Button>
      </>
    }
  ]
  advance_Price = ''// 批量预售价
  preLevelRate = ''// 批量返佣比例
  componentDidMount() {
    // 回显
    this.state.preSaleId && this.getPresellActivityInfo();
  }
  // 获取预售详情
  getPresellActivityInfo = async(): Promise<false | void> => {
    let { preSaleId,  } = this.state;
    let res = await watchPreSaleDetail( preSaleId );
    if (!res) return false;
    let { data } = res;
    let initDataInfo = {
        presellName: data.presellName,
        startTime: data.startTime,
        endTime: data.endTime,
        deliveryTime: data.deliveryTime,
        payPrecent: data.payPrecent,
        finalPayStartTime: data.finalPayStartTime,
        finalPayEndTime: data.finalPayEndTime,
        limitUserType: data.limitUserType,
        payType: data.payType
    };
    let dataList = data.presellProductVOList || [];
    let selectGoods = {
        productId: data.productId,
        productName: data.presellProductVOList && data.presellProductVOList[0].productName,
        productPic: data.presellProductVOList && data.presellProductVOList[0].productPic ? handlePicUrl(data.presellProductVOList[0].productPic) : '',
    };
    this.setState({
      initDataInfo,
      dataList,
      selectGoods,
      deliveryTime: data.deliveryTime,
      startTime: data.startTime,
      endTime: data.endTime,
      finalPayStartTime: data.finalPayStartTime,
      finalPayEndTime: data.finalPayEndTime,
      payType: data.payType,
    })
    this.formRef.current.setFieldsValue({
      presellName: data.presellName,
      activityTime: [moment(data.startTime), moment(data.endTime)],
      limitUserType: data.limitUserType=='1'?'1':"2",
      payType: data.payType=='1'?'1':"0",
      payPrecent: data.payPrecent,
      finalPayEndTime: [moment(data.finalPayStartTime), moment(data.finalPayEndTime)],
      deliveryTime: moment(data.deliveryTime),
    })
  }
  // input修改预售价
  changePrice = (e:any, index:number) => {
    let { dataList } = this.state;
    let value = e.target.value;
    dataList[index].preSalePrice = value;
    this.setState({ dataList })
  }
  // input修改返佣比例
  changePreLeve = (e:any, index:number) => {
      let { dataList } = this.state;
      let value = e.target.value;
      dataList[index].preLevelRate = value;
      this.setState({ dataList })
  }
  // 批量预售价
  changeInput = (e:any) => {
    let value = e.target.value;
    this.advance_Price = value;
  }
  // 批量返佣
  changeInputPre = (e:any) => {
    let value = e.target.value;
    this.preLevelRate = value;
  }
  // 一键操作 批量设置
  easyShuttle = ():any => {
    let { selectedRowKeys, dataList} = this.state;
    if (!selectedRowKeys || selectedRowKeys.length < 1 ) {
      message.error('请选择要批量设置的数据');
      return false
    }
    let newDataList:Array<any> = [];
    dataList.forEach((item)=>{
      if(!newDataList[item.skuId]){
        newDataList[item.skuId] = item
      }
    })
    selectedRowKeys && selectedRowKeys.length > 0 && selectedRowKeys.forEach(items => {
      if(newDataList[items]){
        newDataList[items].preSalePrice = this.advance_Price;
        newDataList[items].preLevelRate = this.preLevelRate;
      }
    })
    let new2:Array<any> =[];
    newDataList.forEach((item,index)=>{
      new2.push(item)
    })
    this.setState({ dataList })
  }
  // 活动时间
  checkDate = (date:any,dateString:any) => {
    this.setState({
        startTime: dateString[0],
        endTime: dateString[1],
      },()=>{
        this.setState({
            finalPayStartTime:'',
            finalPayEndTime: '',
            deliveryTime:''
        })
        this.formRef.current.resetFields(['finalPayEndTime','deliveryTime'])
    })
  }
  // 尾款时间
  checkFinalPayDate = (dateString:any) => {
    this.setState({
        finalPayStartTime: dateString[0],
        finalPayEndTime: dateString[1],
      },()=>{
        this.setState({ deliveryTime:'' })
        this.formRef.current.resetFields(['deliveryTime'])
    })
  }
  // 发货时间
  onChangeDyTime = (dateString:any) => {
    this.setState({ deliveryTime: dateString })
  }
  disabledDate = (current:any) => {
    return current && current < moment().startOf('day');
  }
  // 尾款结束时间限制
  disabledfinalPayDate = (current:any) => {
      let { endTime, } = this.state;
      return current && current < moment(endTime);
  }
  // 发货时间不能早于支付时间
  disabledDeliveryDate = (current:any):any => {
    let { finalPayEndTime, endTime, } = this.state;
    let { payType } = this.formRef.current.getFieldsValue();
    if (payType) {
        return current && current < moment(finalPayEndTime);
    }
    if (!payType) {
        return current && current < moment(endTime);
    }
  }
  // 禁止时间----开始
  disabledStartDate = (startValue:any) => {
      const { endTime } = this.state;
      if (!startValue || !endTime) {
          return false;
      }
      return startValue.valueOf() > endTime.valueOf();
  };
  // 禁止时间----结束
  disabledEndDate = (endValue:any) => {
      const { startTime } = this.state;
      if (!endValue || !startTime) {
          return false;
      }
      return endValue.valueOf() <= startTime.valueOf();
  };
  // 获取商品Sku
  getGoodsSku = async (productId: string )=> {
    this.setState({ skusLoading: true })
    let res =  await getGoodsSkuList( {prodIds: productId} );
    this.setState({ skusLoading: false })
    let { data } = res;
    let goodsSkuList = data.map((v: any) => ({
      key: v.skuId,
      ...v,
    }));
    this.setState({
      dataList: goodsSkuList,
    });
  }
  // 选择商品
  checkGoods = (record:any) => {
    this.setState({ selectGoods: record, GoodsVisiable: false }, () => {
        this.getGoodsSku(record.productId);
    })
  }
  //点击'选择商品'按钮
  chooseGoods = () => {
    this.setState({ GoodsVisiable: true },()=>{
      setTimeout(() => {
        this.getGoodsList();
      }, 100);
    })
  }
  // 获取商品list数据
  getGoodsList = async (): Promise<any> => {
    this.setState({ goodsLoading: true })
    let { productName='', productId='' } = this.goodsFormRef.current.getFieldsValue();
    let query: goodsListParams = {
      page: this.state.goodsPage.pageNum,
      size: this.state.goodsPage.pageSize,
      productId,
      productName,
    };
    let res = await getGoodsList ({ ...query });
    this.setState({ goodsLoading: false })
    let { records, total } = res;
    let goodsDataList = records.map((v: any) => ({
      key: v.id,
      ...v,
    }));
    this.state.goodsPage.total = total || 0,
    this.setState({
      goodsDataList,
    });
  }
  // 切换分页
  onGoodsTableChange = ({ current, pageSize }:any) => {
      Object.assign(this.state.goodsPage, { pageNum: current, pageSize: pageSize })
      this.getGoodsList()
  }
  // 预售活动信息 确定按钮
  saveInfo = ():any => {
    if (!this.state.selectGoods || !this.state.selectGoods.productId) {
      message.error('请选择商品！')
      return false
    };
    this.formRef.current.validateFields().then(( values:any ):any => {
        let { dataList, startTime, endTime, selectGoods, finalPayStartTime, finalPayEndTime ,deliveryTime } = this.state;
        // 时间戳转换
        startTime = startTime ? moment(startTime).valueOf() : '';
        endTime = endTime ? moment(endTime).valueOf() : '';
        finalPayStartTime = finalPayStartTime ? moment(finalPayStartTime).valueOf() : '';
        finalPayEndTime = finalPayEndTime ? moment(finalPayEndTime).valueOf() : '';
        deliveryTime = deliveryTime ? moment(deliveryTime).valueOf() : '';
        if(finalPayEndTime){
          if( finalPayEndTime > deliveryTime ){
            message.error('发货时间不能早于尾款支付时间');
            return false;
          }
        }
        dataList = dataList.map(item => {
          let obj = {
            preSalePrice: item.preSalePrice,
            price: item.price,
            productId: selectGoods.productId,
            productName: selectGoods.productName,
            productPic: selectGoods.productPic ? selectGoods.productPic.split(',')[0] : '',
            skuId: item.skuId,
            stock: item.actualStocks,
            preLevelRate: item.preLevelRate,
            presellId: '',
          }
          if (this.state.preSaleId) {
            obj.presellId = item.presellId;
          }
          return obj
        })
        let isOk = true;
        dataList && dataList.length > 0 && dataList.forEach(items => {
          if (!items.preSalePrice) {
              isOk = false
          }
        })
        if (!isOk) {
            message.error('请完成所有单品预售价设置');
            return false
        }
        if (!deliveryTime || deliveryTime === '') {
            message.error('请选择发货时间');
            return false
        }
        let query = {
            id:'',
            presellName: values.presellName,
            endTime,
            startTime,
            presellProductVOList: dataList || null,
            payType: values.payType,
            deliveryTime,
            productId: selectGoods.productId,
            shopId: selectGoods.shopId,
            finalPayEndTime,
            finalPayStartTime,
            payPrecent: values.payPrecent || '',
            limitUserType: values.limitUserType,
        }
        this.setSaveInfo(query);
    })
    .catch((err: Error) => {});
  }
  //提交
  setSaveInfo = async (query: addPreSaleItemParams) => {
    if (!this.state.preSaleId) {
      await AddPreSaleItem(query);
    } else {
      query.id = parseInt(this.state.preSaleId);
      await EditPreSaleItem(query);
    }
    this.props.history.push('/activity/pre_sale')
  }
  // 支付设置
  changePayType = (e:any) => {
    this.setState({
      payType: e.target.value
    })
  }
  // 用户类型
  changeLimitUserType = (e:any) => {
    this.setState({
      limitUserType: e.target.value
    })
  }
  //--------------------------------   render    -------------------------
  render() {
    let { dataList, goodsDataList, initDataInfo } = this.state;
    // 商品分页配置
    const goodsPagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.goodsPage.pageNum,
      pageSize: this.state.goodsPage.pageSize || 10,
      total: this.state.goodsPage.total,
      showTotal: (t:number) => <div>共{t}条</div>
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span:16 },
      },
    };
    const rowSelection:any = {
      onChange: (selectedRowKeys:any, selectedRows:any)=> {
        this.setState({ selectedRowKeys, selectedRows })
      },
    };
    return (
    <PageHeaderWrapper>
      <Card style={{ margin: '30px' }} title='基本信息'>
          <Form
            ref={this.formRef}
            initialValues={{
              presellName: initDataInfo && initDataInfo.presellName,
              activityTime: initDataInfo && [moment(initDataInfo.startTime), moment(initDataInfo.endTime)],
              limitUserType: (initDataInfo && initDataInfo.limitUserType) || '1',
              payType: initDataInfo && initDataInfo.payType == '1' ? '1' : '0',
              payPrecent: initDataInfo && initDataInfo.payPrecent,
              deliveryTime: initDataInfo && moment(initDataInfo.deliveryTime),
              finalPayEndTime: initDataInfo && initDataInfo.finalPayStartTime && initDataInfo.finalPayEndTime && [moment(initDataInfo.finalPayStartTime), moment(initDataInfo.finalPayEndTime)]
            }}
          >
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
                <FormItem
                  label="活动名称: "
                  name='presellName'
                  rules={[
                    {
                      required: true,
                      message: '请输入活动名称',
                    },
                    {
                      max: 15,
                      message: '活动名称不能超过50个字符'
                    }
                  ]}
                  style={{ margin: '20px' }}
                >
                  <Input disabled={this.state.type == '1'} style={{width:'500px'}}/>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
                <FormItem
                  label="活动时间："
                  style={{ margin: '20px', }}
                  name='activityTime'
                  rules={[
                    {
                      required: true,
                      message: '请选择活动时间',
                    }
                  ]}
                >
                  <RangePicker
                    disabledDate={this.disabledDate}
                    showTime={{
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    onChange={this.checkDate}
                    format="YYYY-MM-DD HH:mm:ss"
                    disabled={this.state.type == '1'}
                    style={{width:'380px'}}
                  />
                </FormItem>
                </Col>
              </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
                <FormItem label="活动商品：" style={{ margin: '20px' }} >
                  <Button type='primary' onClick={this.chooseGoods}  style={{ marginBottom: '3px' }} disabled={this.state.type == '1'}>选择商品</Button>
                </FormItem>
              </Col>
            </Row>
            { this.state.dataList && this.state.dataList.length > 0 &&
            <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{border: '1px solid #f2f2f2'}}>
              <Col span={20} offset={2} style={{ marginBottom: '20px' }}>
              { this.state.type != '1' &&
              <div style={{marginBottom:'20px'}}>
                <span>预售价：&nbsp;</span><Input style={{ width: '100px', marginRight: '20px', marginTop: '20px' }} onChange={(e) => this.changeInput(e)} />
                <span>返佣比例：&nbsp;</span><Input style={{ width: '100px', marginRight: '20px', marginTop: '20px' }} onChange={(e) => this.changeInputPre(e)} />
                <Button type='primary' onClick={() => this.easyShuttle()} >批量设置</Button>
              </div>}
              <Table
                rowKey={record => record.key}
                columns={this.columns}
                dataSource={ dataList }
                rowSelection={ this.state.type != '1' ? rowSelection : null}
                bordered={true}
                pagination={false}
              />
              </Col>
            </Row>
            }
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
              <FormItem
                label="用户类型: "
                name='limitUserType'
                rules={[
                  {
                    required: true,
                    message: '请选择用户类型',
                }
                ]}
                style={{ margin: '20px' }}
              >
                <Radio.Group disabled={this.state.type == '1'} onChange={(e)=>{this.changeLimitUserType(e)}}>
                    <Radio value='1'>仅限企业用户</Radio>
                    <Radio value='2'>所有人</Radio>
                </Radio.Group>
              </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
              <FormItem
                label="支付设置: "
                name='payType'
                rules={[
                  {
                    required: true,
                    message: '请选择支付方式',
                  }
                ]}
                style={{ margin: '20px' }}
              >
                <Radio.Group disabled={this.state.type == '1'} onChange={(e)=>{this.changePayType(e)}}>
                    <Radio value='0'>全额支付</Radio>
                    <Radio value='1'>定金支付</Radio>
                </Radio.Group>
              </FormItem>
              </Col>
            </Row>
            { this.state.payType =='1' &&
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
                <FormItem
                  label="定金百分比"
                >
                  <FormItem
                    name="payPrecent"
                    noStyle
                    rules={[
                    {
                      required: true,
                      message: '请设置定金百分比',
                    }
                    ]}
                  >
                    <InputNumber disabled={this.state.type == '1'? true : false} type='number' style={{ width: '100px' }}   />
                  </FormItem>
                  <span className="ant-form-text"> %</span>
                </FormItem>
              </Col>
            </Row>
            }
            { this.state.payType =='1' &&
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
              <FormItem
                label="尾款支付时间: "
              >
                <FormItem
                  name='finalPayEndTime'
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: '请选择尾款支付时间',
                    }
                  ]}
                >
                  <RangePicker
                      disabledDate={this.disabledfinalPayDate}
                      showTime={{
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                      }}
                      onChange={this.checkFinalPayDate}
                      format="YYYY-MM-DD HH:mm:ss"
                      disabled={this.state.type == '1' ? true : this.state.startTime ? false : true}
                  />
                </FormItem>
                {!this.state.startTime && <span style={{ marginLeft: '5px', color: '#e5004f' }} >请选择活动时间</span>}
              </FormItem>
              </Col>
            </Row>
            }
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={2}></Col>
              <Col>
              <FormItem
                label="发货时间: "
                name='deliveryTime'
                rules={[
                  {
                    required: true,
                    message: '请选择发货时间',
                  }
                ]}
                style={{ margin: '20px' }}
              >
                <DatePicker disabledDate={ this.disabledDeliveryDate } onChange={this.onChangeDyTime} disabled={this.state.type == '1'} />
              </FormItem>
            </Col>
          </Row>

            <Divider dashed />
            <Row>
              <Col span={24} style={{ display: 'flex',justifyContent: 'center',alignItems: 'center', marginTop: '20px' }}>
                <Button type='primary' onClick={() => this.props.history.goBack()}>返回</Button>
                {this.state.type == '1' ? false : true && <Button type='primary' style={{ margin: '15px' }} onClick={this.saveInfo}>提交</Button>}
              </Col>
            </Row>
        </Form>
      </Card>

      <Card title='添加预售说明' style={{ margin: '30px' }}>
        <ul>
          <li><i>1. </i>标记<span style={{ color: '#e5004f' }}>*</span>为必填项</li>
          <li><i>2. </i><span>预售时间：活动开始时间不早于当前时间，结束时间与开始时间必须相隔24小时以上，前台生效后可以在此时间段付定金。</span>为必填项</li>
          <li><i>3. </i><span>尾款时间：尾款支付开始时间为方案设置的预售结束时间， 3天后的第一个24点即结束时间，不可编辑！</span></li>
          <li><i>4. </i><span>发货时间： 晚于预售结束时间后的第一个24点,如果是定金支付则晚于尾款支付结束时间的第一个24点。!</span></li>
          <li><i>5. </i><span>如使用定金预售形式，建议先把要参加活动的商品库存设置为零，活动发布成功后，再把库存修改成正常库存。这样可防止商品被提前购买</span></li>
        </ul>
      </Card>
      <Modal
          width={800}
          title='选择商品'
          visible={this.state.GoodsVisiable}
          onCancel={() => this.setState({ GoodsVisiable: false })}
          onOk={() => this.setState({ GoodsVisiable: true })}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form {...formItemLayout} ref={this.goodsFormRef}>
            <Row>
              <Col span={11}>
                <FormItem
                  label="商品名称: "
                  name='productName'
                  style={{ margin: '5px 20px' }}
                >
                  <Input style={{ width: '150px' }} />
                </FormItem>
              </Col>
              <Col span={11}>
                <FormItem
                  label="商品ID: "
                  name='productId'
                  style={{ margin: '5px 20px' }}
                >
                  <Input style={{ width: '150px' }} />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <Button type='primary' onClick={this.getGoodsList}>搜索</Button>
        </div>
        <Table
          rowKey={record => record.productId}
          columns={ this.goodsCloumns }
          dataSource={goodsDataList}
          pagination={goodsPagination}
          onChange={this.onGoodsTableChange}
        />
      </Modal>
  </PageHeaderWrapper>
    )}
}
