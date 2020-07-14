import styles from './index.less';
import React, { Component, } from 'react';
import moment from 'moment';
import { Card, Form, Row, Col, Input, Select, Button, Popconfirm, Modal, message, DatePicker, Drawer, Switch, Pagination } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  getOrdersList,
  getLogisticsList,
  postRemarkShopOrder,
  getExportOrdersParams,
  putDeliverGoods,
  exportOrders,
} from '@/services/deal/order';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { handlePicUrl, getPageQuery } from '@/common/utils';
import config from '@/config/index'
import TextArea from 'antd/lib/input/TextArea';
const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const tabList = [
  {
    key: '-1',
    tab: '所有订单',
  },
  {
    key: '1',
    tab: '待付款',
  },
  {
    key: '2',
    tab: '待发货',
  },
  {
    key: '3',
    tab: '待收货',
  },
  {
    key: '4',
    tab: '已经完成',
  },
  {
    key: '5',
    tab: '已取消',
  },
  {
    key: '6',
    tab: '已售后',
  },
];
function showAction(item: any) {
  let active = -1;
  let { orderStatus, bizType, isHead, mergeStatus } = item;
  if (orderStatus == 2 && bizType == 2 && mergeStatus == 0) {
    active = 1;
  } else if (orderStatus == 2 && bizType == 2 && mergeStatus == 1) {
    active = 2;
  } else if (orderStatus == 2 && bizType != 4 && bizType != 2) {
    active = 2;
  } else if (orderStatus == 2 && bizType == 4 && mergeStatus == 1 && isHead == true) {
    active = 6;
  } else if (orderStatus == 2 && bizType == 4 && mergeStatus == 0 && isHead == true) {
    active = 7;
  } else if (orderStatus == 3 && !isHead) {
    active = 3;
  } else if (orderStatus == 3 && isHead == true) {
    active = 4;
  } else {
    active = 5
  }
  return active;
}
function showSelect(item: any) {
  let active = -1;
  let { orderStatus, bizType, isHead, mergeStatus, logisticsStatus } = item;
  if (orderStatus == 2 && logisticsStatus == false && bizType == 1) {//普通
    active = 1;
  } else if (orderStatus == 2 && logisticsStatus == false && bizType == 2 && mergeStatus == '1') {//拼团
    active = 1;
  } else if (orderStatus == 2 && logisticsStatus == false && bizType == 3) {//预售
    active = 1;
  } else if (orderStatus == 2 && logisticsStatus == false && bizType == 4 && mergeStatus == '1' && isHead == true) {//团购
    active = 1;
  } else {
    active = -2
  }
  return active;
}
const orderStatusList = [
  '未知状态', "待付款", "待发货", "已发货", "已完成", "已取消", "已售后", "申请售后", "支付中", "支付失败"
]
const bizTypeList = ['普通订单', '拼团订单', '预售订单', '团购订单']
interface UserProp {
  history: any;
  match: any;
  location: any;
  tabChange: any
}
interface UserState {
  visibleModal: boolean,
  drawerVisialbe: boolean,
  isBatchDeliver: boolean,
  isMergeOrder: boolean,
  orderFields: Array<any>,
  batchOrderList: Array<any>,
  currentTab: any,
  pageInfo: any,
  startTime: string,
  endTime: string,
  payStartDate: string,
  payEndDate: string,
  companys: Array<any>,
  searchParams: any,
  loading: boolean,
  total: number,
  tableList: Array<any>,
  paramsDataList: Array<any>,
  showRemarksVisibale: boolean,
  remarksText: string,
  orderNo: number | string,
  addRemarks: boolean,
  orderNos: any,
  saveSend: boolean,
  logisticsId: any,
  orderRecord: any,
  downloadLoading: boolean,
}
export default class OrderManage extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  shopRemarkRef: React.RefObject<any>;
  deliveryRef: React.RefObject<any>;
  isBatchlogisticsRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.shopRemarkRef = React.createRef();
    this.deliveryRef = React.createRef();
    this.isBatchlogisticsRef = React.createRef();
    let searchParams = getPageQuery();
    this.state = {
      visibleModal: false,
      drawerVisialbe: false,
      isBatchDeliver: false,
      isMergeOrder: true,//是否合并相同订单
      orderFields: [],//自定义导出参数
      batchOrderList: [], //批量发货 orderNo集合
      currentTab: searchParams.key || '-1',
      searchParams: {},
      pageInfo: {
        pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
        pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
      },
      total: 0,
      startTime: '',
      endTime: '',
      payStartDate: '',
      payEndDate: '',
      companys: [],
      loading: false,
      tableList: [],
      paramsDataList: [],
      showRemarksVisibale: false,
      remarksText: '',
      orderNo: '',
      addRemarks: false,
      orderNos: [],
      saveSend: false,
      logisticsId: '',
      orderRecord: '',
      downloadLoading: false,
    }
  }
  currentTab: any = '';
  componentDidMount() {
    let { startTime = '', endTime = '', payStartDate = '', payEndDate = '', bizType = '', refundStatus = '', remarkStatus = '', shopName = '', orderNo = '', groupOrderNo = '', employeeName = '', realname = '', phone = '', } = this.state.searchParams;
    if (startTime) {
      this.formRef.current.setFieldsValue({ orderTime: [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')] }, this.getDataList);
      this.setState({
        startTime,
        endTime
      })
    }
    if (payStartDate) {
      this.formRef.current.setFieldsValue({ payTime: [moment(payStartDate, 'YYYY-MM-DD HH:mm:ss'), moment(payEndDate, 'YYYY-MM-DD HH:mm:ss')] }, this.getDataList);
      this.setState({
        payStartDate,
        payEndDate
      })
    }
    if (bizType) {
      this.formRef.current.setFieldsValue({ bizType }, this.getDataList);
    }
    if (refundStatus) {
      this.formRef.current.setFieldsValue({ refundStatus }, this.getDataList);
    }
    if (remarkStatus) {
      this.formRef.current.setFieldsValue({ remarkStatus }, this.getDataList);
    }
    if (shopName) {
      this.formRef.current.setFieldsValue({ shopName }, this.getDataList);
    }
    if (orderNo) {
      this.formRef.current.setFieldsValue({ orderSearch: 'orderNo', searchValue: orderNo }, this.getDataList);
    }
    if (groupOrderNo) {
      this.formRef.current.setFieldsValue({ orderSearch: 'groupOrderNo', searchValue: groupOrderNo }, this.getDataList);
    }
    if (employeeName) {
      this.formRef.current.setFieldsValue({ orderSearch: 'employeeName', searchValue: employeeName }, this.getDataList);
    }
    if (realname) {
      this.formRef.current.setFieldsValue({ orderSearch: 'realname', searchValue: realname }, this.getDataList);
    }
    if (phone) {
      this.formRef.current.setFieldsValue({ orderSearch: 'phone', searchValue: phone }, this.getDataList);
    }
    if (!startTime && !endTime && !payStartDate && !payEndDate && !bizType && !refundStatus && !remarkStatus && !shopName && !orderNo && !groupOrderNo && !employeeName && !realname && !phone) {
      this.getDataList()
    }
    this.getLogistics();
  }
  //获取物流公司列表
  getLogistics = async (): Promise<false | void> => {
    let res: any = await getLogisticsList();
    if (!res) return false;
    let logisticsList = res.data || [];
    this.setState({
      companys: logisticsList
    })
  }
  // GET数据List
  getDataList = async (): Promise<false | void> => {
    let { pageInfo } = this.state;
    let size = pageInfo.pageSize;
    let page = pageInfo.pageNum;
    let { startTime, endTime, payStartDate, payEndDate } = this.state;
    let { bizType, orderSearch, searchValue, refundStatus, remarkStatus, shopName, } = this.formRef.current.getFieldsValue();
    //  orderNo, groupOrderNo, employeeName, realname, phone,
    let orderStatus = this.currentTab == '-1' ? '' : this.currentTab;
    let params: any = {
      orderStatus,
      bizType,
      refundStatus: refundStatus == -1 ? 0 : refundStatus == -2 ? '' : refundStatus,
      remarkStatus,
      shopName,
      startTime,
      endTime,
      payStartDate,
      payEndDate,
      page: page,
      size: size,
      sortBy: '-createTime'
    }
    if (orderSearch == 'orderNo') {
      params.orderNo = searchValue && searchValue.trim() || undefined;
      this.props.history.push({ search: `key=${this.currentTab}&orderStatus=${orderStatus}&bizType=${bizType || ''}&orderNo=${searchValue || ''}&refundStatus=${refundStatus || ''}&remarkStatus=${remarkStatus || ''}&shopName=${shopName || ''}&startTime=${startTime || ''}&endTime=${endTime || ''}&payStartDate=${payStartDate || ''}&payEndDate=${payEndDate || ''}&pageNum=${page}&pageSize=${size}` })
    } else if (orderSearch == 'groupOrderNo') {
      params.groupOrderNo = searchValue && searchValue.trim() || undefined;
      this.props.history.push({ search: `key=${this.currentTab}&orderStatus=${orderStatus}&bizType=${bizType || ''}&groupOrderNo=${searchValue || ''}&refundStatus=${refundStatus || ''}&remarkStatus=${remarkStatus || ''}&shopName=${shopName || ''}&startTime=${startTime || ''}&endTime=${endTime || ''}&payStartDate=${payStartDate || ''}&payEndDate=${payEndDate || ''}&pageNum=${page}&pageSize=${size}` })
    } else if (orderSearch == 'employeeName') {
      params.employeeName = searchValue;
      this.props.history.push({ search: `key=${this.currentTab}&orderStatus=${orderStatus}&bizType=${bizType || ''}&employeeName=${searchValue || ''}&refundStatus=${refundStatus || ''}&remarkStatus=${remarkStatus || ''}&shopName=${shopName || ''}&startTime=${startTime || ''}&endTime=${endTime || ''}&payStartDate=${payStartDate || ''}&payEndDate=${payEndDate || ''}&pageNum=${page}&pageSize=${size}` })
    } else if (orderSearch == 'realname') {
      params.realname = searchValue;
      this.props.history.push({ search: `key=${this.currentTab}&orderStatus=${orderStatus}&bizType=${bizType || ''}&realname=${searchValue || ''}&refundStatus=${refundStatus || ''}&remarkStatus=${remarkStatus || ''}&shopName=${shopName || ''}&startTime=${startTime || ''}&endTime=${endTime || ''}&payStartDate=${payStartDate || ''}&payEndDate=${payEndDate || ''}&pageNum=${page}&pageSize=${size}` })
    } else if (orderSearch == 'phone') {
      params.phone = searchValue;
      this.props.history.push({ search: `key=${this.currentTab}&orderStatus=${orderStatus}&bizType=${bizType || ''}&phone=${searchValue || ''}&refundStatus=${refundStatus || ''}&remarkStatus=${remarkStatus || ''}&shopName=${shopName || ''}&startTime=${startTime || ''}&endTime=${endTime || ''}&payStartDate=${payStartDate || ''}&payEndDate=${payEndDate || ''}&pageNum=${page}&pageSize=${size}` })
    } else {
      this.props.history.push({ search: `key=${this.currentTab}&orderStatus=${orderStatus}&bizType=${bizType || ''}&refundStatus=${refundStatus || ''}&remarkStatus=${remarkStatus || ''}&shopName=${shopName || ''}&startTime=${startTime || ''}&endTime=${endTime || ''}&payStartDate=${payStartDate || ''}&payEndDate=${payEndDate || ''}&pageNum=${page}&pageSize=${size}` })
    }
    this.setState({ loading: true });
    let res: any = await getOrdersList(params);
    this.setState({ loading: false })
    if (!res) return false;
    let { data = [] } = res;
    let tableList: any = data && data.records && data.records.length != 0 && data.records.map((v: any, i: number) => ({
      key: v.userId,
      ...v
    })) || [];
    this.setState({
      tableList,
      total: data && data.total || 0
    })
  }
  // 搜索
  query = () => {
    this.setState({
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      }
    }, () => {
      this.getDataList();
    })

  }
  // 重置
  reset = () => {
    this.formRef.current.resetFields();
    this.setState({
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      }
    }, () => {
      this.getDataList();
    })
  }
  //打开自定义盒子
  openDrawer = () => {
    this.getExportParams();
    this.setState({
      drawerVisialbe: true
    })
  }
  //获取导出参数
  getExportParams = async (): Promise<false | void> => {
    this.setState({ loading: true });
    let res = await getExportOrdersParams();
    this.setState({ loading: false })
    if (!res) return false;
    let { data } = res || [];
    let paramsDataList = data && data.length != 0 && data.map((v: any, i: number) => ({
      ...v
    })) || [];
    this.setState({
      paramsDataList,
    })
  }
  //是否合并相同订单 switch
  handelSwitch = (flag: boolean) => {
    let { paramsDataList } = this.state;
    if (flag == true) {
      paramsDataList.map((v, i) => {
        if (i < 11) {
          paramsDataList[i].check = true
        }
      })
    }
    this.setState({
      isMergeOrder: flag
    })
  }
  //选择参数
  toggleParams = (flag: boolean, index: number) => {
    let { paramsDataList = [], isMergeOrder } = this.state;
    if (isMergeOrder == true && index < 11) {
      paramsDataList[index].check = true
    } else {
      paramsDataList[index].check = flag;
    }
    this.setState({ paramsDataList })
  }
  //自定义导出handleCustomExport
  handleExport1 = () => {
    let orderStatus = this.currentTab == '-1' ? '' : this.currentTab;
    let { startTime, endTime, payStartDate, payEndDate, isMergeOrder, paramsDataList } = this.state;
    var orderFields;
    if (this.state.drawerVisialbe == true) {
      let orderFieldsList = paramsDataList.filter(item => item.check === true) || [];
      orderFields = orderFieldsList && orderFieldsList.length > 0 && orderFieldsList.map(v => v.englishName);
    }
    let { bizType, orderNo, refundStatus, remarkStatus, userName, shopName, phone } = this.formRef.current.getFieldsValue();
    let query: any = {
      orderStatus,
      bizType,
      orderNo: (orderNo && orderNo.trim()) || undefined,
      startTime,
      endTime,
      payStartDate,
      payEndDate,
      refundStatus,
      remarkStatus,
      userName,
      shopName,
      phone,
      isMergeOrder,
    }
    if (this.state.drawerVisialbe == true) {
      query.orderFields = orderFields;
    }
    this.downloadOrders(query);
  }
  handleExport = () => {
    let { startTime, endTime, payStartDate, payEndDate, isMergeOrder, paramsDataList } = this.state;
    let { bizType, orderSearch, searchValue, refundStatus, remarkStatus, shopName } = this.formRef.current.getFieldsValue();
    let orderStatus = this.currentTab == '-1' ? '' : this.currentTab;
    let params: any = {
      orderStatus,
      bizType,
      refundStatus: refundStatus == -1 ? 0 : refundStatus == -2 ? '' : refundStatus,
      remarkStatus,
      shopName,
      startTime,
      endTime,
      payStartDate,
      payEndDate,
      isMergeOrder,
    }

    if (orderSearch == 'orderNo') {
      params.orderNo = searchValue && searchValue.trim() || undefined;
    } else if (orderSearch == 'groupOrderNo') {
      params.groupOrderNo = searchValue && searchValue.trim() || undefined;
    } else if (orderSearch == 'employeeName') {
      params.employeeName = searchValue;
    } else if (orderSearch == 'realname') {
      params.realname = searchValue;
    } else if (orderSearch == 'phone') {
      params.phone = searchValue;
    }
    var orderFields;
    if (this.state.drawerVisialbe == true) {
      let orderFieldsList = paramsDataList.filter((item:any) => item.check === true) || [];
      orderFields = orderFieldsList && orderFieldsList.length > 0 && orderFieldsList.map(v => v.englishName);
    }

    if (this.state.drawerVisialbe == true) {
      params.orderFields = orderFields;
    }
    this.downloadOrders(params);
  }
  // 下载订单数据
  async downloadOrders(query: any): Promise<false | void> {
    this.setState({downloadLoading: true})
    let res = await exportOrders(query)
    this.setState({downloadLoading: false, drawerVisialbe: false})
    if (!res) return false;
    let { filePath } = res;
    if(filePath){
      location.href = `${config.baseImgUrl}${filePath}`
    }
  }
  //交易快照
  goSnapshot = (orderItem: any) => {
    let { itemId } = orderItem
    this.props.history.push(`/deals/order/snapshop?snapshotId=${itemId}`)
  }
  // 下单时间
  checkOrderDate: any = (date: any, dateString: string) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    })
  }
  // 付款时间
  checkPayDate: any = (date: any, dateString: string) => {
    this.setState({
      payStartDate: dateString[0],
      payEndDate: dateString[1],
    })
  }
  // 查看物流
  showLogistics = (orderNo: number | string) => {
    return `#/deal/order/logistics?orderNo=${orderNo}`
  }
  // 查看备注
  showShopRemark = (record: any) => {
    let { shopRemark } = record;
    this.setState({ showRemarksVisibale: true, remarksText: shopRemark })
  }
  // 增加备注
  addRemarksPost = async ():Promise<any> => {
    let { orderNo } = this.state;
    let { shopRemark } = this.shopRemarkRef.current.getFieldsValue();
    let query = {
      orderNo,                // 订单号
      shopRemark,             // 商家备注
    }
    let res = await postRemarkShopOrder(query);
    this.setState({ addRemarks: false })
    if (!res) return false;
    message.success('添加备注成功');
    this.getDataList();
  }
  // 查看订单详情
  showOrderDetail = (orderNo: number | string) => {
    return `#/deal/order/details?orderNo=${orderNo}`
  }
  //选择发货订单
  orderChecked = (item: any, idx: number | string) => {
    let { batchOrderList = [] } = this.state;
    let orderNo = item.orderNo;
    if (batchOrderList.includes(orderNo)) {
      batchOrderList = batchOrderList.filter(item => item !== orderNo);
    } else {
      batchOrderList.push(orderNo);
    }
    this.setState({ batchOrderList })
  }
  //批量发货
  batchDelivery = ():any => {
    let { batchOrderList } = this.state;
    if (batchOrderList.length < 1) return message.error("请先选择需要批量发货的订单！")
    this.setState({ isBatchDeliver: true, orderNos: batchOrderList, saveSend: true, })
    setTimeout(()=>{
      this.isBatchlogisticsRef.current.setFieldsValue({ logisticsId: 0, dvyFlowId: '' })
    },20)
    
  }
  //团长发货按钮，未成团提示
  popMessage = () => {
    message.warn('尚未成团，不可发货!');
  }
  //设置物流公司
  changeLogistics = (e: any) => {
    this.setState({
      logisticsId: e
    })
    this.formRef.current.setFieldsValue({
      dvyFlowId: '',
    });
  }
  // 确认发货
  saveSend = (item: any) => {
    let orderNos: Array<any> = [];
    let orderNo = item.orderNo;
    orderNos = orderNos.concat(orderNo);
    this.setState({ orderRecord: item, orderNos, isBatchDeliver: false, saveSend: true })
  }
  // 发货
  saveSendPost = async () => {
    let { isBatchDeliver } = this.state;
    let formRef = isBatchDeliver ? this.isBatchlogisticsRef : this.deliveryRef
    formRef.current.validateFields()
      .then((values: any) => {
        let { orderNos } = this.state;
        let { logisticsId, dvyFlowId } = values;
        let query = { orderNos, logisticsId, dvyFlowId };
        this.sendHttp(query)
      })
      .catch((errorInfo: any) => {
        console.log('有错误:  ', errorInfo)
      })

  }
  //closeDeliveryModal
  closeDeliveryModal = () => {
    let { isBatchDeliver } = this.state;
    this.setState({
      saveSend: false,
      logisticsId: '-1'
    })
    let formRef = isBatchDeliver ? this.isBatchlogisticsRef : this.deliveryRef;
    formRef.current.setFieldsValue({ logisticsId: '', dvyFlowId: '' })
  }
  sendHttp = async (query: any):Promise<false | void> => {
    let { isBatchDeliver } = this.state;
    let res = await putDeliverGoods(query);
    if (!res) return false;
    this.setState({ saveSend: false, batchOrderList: [], isBatchDeliver: false })
    let formRef = isBatchDeliver ? this.isBatchlogisticsRef : this.deliveryRef;
    formRef.current.setFieldsValue({ logisticsId: '', dvyFlowId: '' })
    message.success('发货成功');
    this.getDataList()
  }

  openModal = (flag = false) => {
    this.setState({ visibleModal: flag })
  }
  // 切换tab
  tabChange = (type: any) => {
    this.currentTab = type;
    this.setState({ currentTab: type }, () => {
      this.reset();
    });
  }
  renderForm = () => {
    return (
      <Form layout="inline"
        ref={this.formRef}
      >
        <Row style={{ width: '100%' }}>
          <Col md={18} sm={18}>
            <Row>
              <Col style={{ margin: '10px 0' }}>
                <FormItem label="订单搜索： " name='orderSearch'>
                  <Select style={{ minWidth: '120px', maxWidth: '250px' }}>
                    <Option value='orderNo'>订单编号</Option>
                    <Option value='groupOrderNo'>虚拟订单编号</Option>
                    <Option value='employeeName'>员工姓名</Option>
                    <Option value='realname'>收货人姓名</Option>
                    <Option value='phone'>收货人手机号</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={{ margin: '10px 0' }}>
                <FormItem label="" name='searchValue'>
                  <Input style={{ maxWidth: '400px' }}
                    placeholder={'请输入订单搜索内容'}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col style={{ margin: '10px 0' }}>
                <Form.Item label="下单时间：" name='orderTime'>
                  <RangePicker
                    showTime={{
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    onChange={this.checkOrderDate}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
              <Col style={{ margin: '10px 0' }}>
                <Form.Item label="付款时间：" name='payTime' >
                  <RangePicker
                    showTime={{
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    onChange={this.checkPayDate}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col style={{ margin: '10px 0' }}>
                <FormItem label="订单类型： " style={{ marginRight: '10px' }} name='bizType'>

                  <Select style={{ width: '200px' }}>
                    <Option value='1'>普通订单</Option>
                    <Option value='2'>拼团订单</Option>
                    <Option value='3'>预售订单</Option>
                    <Option value='4'>团购订单</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={{ margin: '10px 0' }}>
                <FormItem label="售后状态： " style={{ marginRight: '10px' }} name='refundStatus'>
                  <Select style={{ width: '200px' }}>
                    <Option value='-2'>全部</Option>
                    <Option value='-1'>未售后</Option>
                    <Option value='1'>处理中</Option>
                    <Option value='2'>处理完成</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col style={{ margin: '10px 0' }}>
                <FormItem label="店铺名称：" style={{ marginRight: '10px' }} name='shopName'>
                  <Input style={{ width: '200px' }} />
                </FormItem>
              </Col>
              <Col style={{ margin: '10px 0' }}>
                <FormItem label="备注状态： " style={{ marginRight: '10px' }} name='remarkStatus'>
                  <Select style={{ width: '200px' }}>
                    <Option value='1'>未备注</Option>
                    <Option value='2'>已备注</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row>

            </Row>
          </Col>
          <Col md={6} sm={6} >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Button type="primary" style={{ width: '100px' }} onClick={this.query} icon={<SearchOutlined />} >{' '}搜索{' '}</Button>
              <Button type="primary" style={{ margin: '12px 0', width: '100px' }} onClick={this.reset} icon={<ReloadOutlined />}>{' '}重置{' '}</Button>
              <Button type="primary" style={{ width: '100px' }} onClick={this.handleExport} loading={this.state.downloadLoading} icon={<DownloadOutlined />}>{' '}导出{' '}</Button>
              <Button type="primary" style={{ margin: '12px 0', width: '100px' }} onClick={this.openDrawer}>{' '}自定义导出{' '}</Button>
              {this.currentTab == 2 &&
                <Button type="primary" style={{ marginBottom: '5px', width: '100px' }} onClick={this.batchDelivery} >批量发货</Button>
              }
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
  // 分页页数变化
  onTableChange: any = (page: number | string, pageSize: number | string) => {
    Object.assign(this.state.pageInfo, { pageNum: page, pageSize: pageSize })
    this.getDataList()
  }
  // 每页条数变化
  onShowSizeChange = (current: number | string, size: number | string) => {
    Object.assign(this.state.pageInfo, { pageNum: current, pageSize: size })
    this.getDataList()
  }

  render() {
    const { currentTab } = this.state;
    let { tableList, paramsDataList } = this.state;
    const modalInputLayout = {
      labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    }
    return (
      <>
        <PageHeaderWrapper
          title='订单管理'
          onTabChange={this.tabChange}
          tabList={tabList}
          tabActiveKey={currentTab}
        />
        <Card bordered={false} style={{ margin: '20px' }}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card className={styles.form}>
          <div className={styles.formWraper}>
            <div className={styles.formCloumns}>
              <ul className={styles.formCloumnsUl} >
                <li>商品信息</li>
                <li>单价/数量</li>
                <li>实付款</li>
                <li>员工姓名</li>
                <li>收货人姓名</li>
                <li>配送方式</li>
                <li>订单状态</li>
                <li>操作</li>
              </ul>
            </div>
            <div className={styles.formCon}>
              <div className={styles.formConWraper} >
                {tableList && tableList.length > 0 && tableList.map((item, idx) => (
                  <div key={idx} className={styles.formConWraperBox}>
                    <div className={styles.formConHead}>
                      {showSelect(item) == 1 &&
                        <span className={`${styles.checkBox} ${this.state.batchOrderList.includes(item.orderNo) ? styles.checked : ''}`} onClick={() => this.orderChecked(item, idx)}></span>
                        // 188FFF 蓝色
                      }
                      <span className={styles.spanPaddingL40} >订单编号：{item.orderNo}</span>
                      {item.bizType == 4 &&
                        <span className={styles.spanPaddingR50}>虚拟订单编号：{`${item.groupOrderNo != 'null' ? item.groupOrderNo : '暂未生成'}`}</span>
                      }
                      <span className={styles.spanPaddingR50}>下单时间：<i>{item.createTime}</i></span>
                      <span className={styles.spanPaddingR50}>订单类型：<i>{bizTypeList[item.bizType - 1]}</i></span>
                      {item.bizType == 4 && item.isHead == true &&
                        <span>身份：团长</span>
                      }
                    </div>
                    <ul className={styles.formConUl} >
                      <li className={styles.formConUlLiFir}>
                        {/* 此处循环订单所有商品 */}
                        {item && item.orderItems && item.orderItems.length > 0 && item.orderItems.map((orderItem: any, index: number) => (
                          <div className={`${styles.ulLiFirWraper} ${(item.orderItems.length > 1 && index != item.orderItems.length - 1) ? styles.borderBottom : ''}`} key={index}>
                            <div className={styles.firLiDivL}>
                              <div className={styles.firLiImgDiv}>
                                <img src={handlePicUrl(orderItem.productPic)} />
                              </div>
                              <div className={styles.firLiDivM}>
                                <p>{orderItem.productName}</p>
                                <p>{orderItem.productAttr}</p>
                                <p>
                                  <span>产品编码：{orderItem.outerId ? orderItem.outerId : '无'}</span>
                                  {/* <span onClick={()=>this.goSnapshot(orderItem)}>交易快照</span> */}
                                </p>
                              </div>
                            </div>
                            <div className={styles.firLiDivR} >
                              <p>¥{orderItem.presentPrice}</p>
                              <p>{orderItem.quantity}件</p>
                            </div>
                          </div>
                        ))
                        }
                      </li>
                      <li className={styles.formConUlLi}>¥{item.actualAmount ? item.actualAmount : '0'}</li>
                      <li className={styles.formConUlLi}>{item.employeeName ? item.employeeName : "无"}</li>
                      <li className={styles.formConUlLi}>{item.realname ? item.realname : "无"}</li>
                      <li className={styles.formConUlLi}>{item.logisticsStatus == true ? '快递' : "自提"}</li>
                      <li className={styles.formConUlLi}>{orderStatusList[item.orderStatus]}</li>
                      <li className={`${styles.formConUlLi} ${styles.formConUlLiLayout}`}>
                        {showAction(item) == 1 && <>
                          <Button size="small" danger className={styles.btnMargin} onClick={this.popMessage}>确认发货</Button>
                        </>
                        }
                        {showAction(item) == 7 && <>
                          <Button size="small" danger className={styles.btnMargin} onClick={this.popMessage}>确认发货</Button>
                          <span style={{ margin: '5px 5px 5px 0', color: 'red', cursor: 'default' }}>（团长）</span>
                        </>
                        }
                        {showAction(item) == 2 &&
                          <Popconfirm
                            title="是否确认发货操作?"
                            onConfirm={() => this.saveSend(item)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button size="small" danger className={styles.btnMargin} >确认发货</Button>
                          </Popconfirm>
                        }
                        {showAction(item) == 6 &&
                          <Popconfirm
                            title="是否确认发货操作?"
                            onConfirm={() => this.saveSend(item)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <div>
                              <Button size="small" danger className={styles.btnMargin} >确认发货</Button>
                              <span className={styles.aMargin} >（团长）</span>
                            </div>
                          </Popconfirm>
                        }
                        {showAction(item) == 3 &&
                          <a className={styles.aMargin} >已经发货</a>
                        }
                        {showAction(item) == 4 &&
                          <a className={styles.aMargin} >已经发货（团长）</a>
                        }
                        {showAction(item) == 5 &&
                          <span></span>
                        }
                        {/* 售后状态时，没有根据售后状态再去细分，与罗沟通过 */}
                        {(item.orderStatus == 3 || item.orderStatus == 4 || item.orderStatus == 6 || item.orderStatus == 7) &&
                          <Button type='primary' size="small" style={{ margin: '5px 0' }}>
                            <a href={this.showLogistics(item.orderNo)}>订单跟踪</a>
                          </Button>
                        }
                        <Button type='primary' size="small" style={{ margin: '5px 0' }}>
                          <a href={this.showOrderDetail(item.orderNo)}>订单详情</a>
                        </Button>
                        {!item.shopRemark &&
                          <Button type='primary' size="small" style={{ margin: '5px 0' }} onClick={() => this.setState({ addRemarks: true, orderRecord: item, orderNo: item.orderNo })}>
                            增加备注
                                  </Button>
                        }
                        {item.shopRemark &&
                          <Button type='primary' size="small" style={{ margin: '5px 0' }} onClick={() => this.showShopRemark(item)}>
                            查看备注
                                  </Button>
                        }
                      </li>
                    </ul>
                  </div>
                ))
                }
              </div>
            </div>
          </div>
          {/* 分页 */}
          <div className={styles.pageNationDiv} >
            <Pagination
              showSizeChanger
              showQuickJumper
              current={this.state.pageInfo.pageNum}
              pageSize={this.state.pageInfo.pageSize || 10}
              total={this.state.total}
              showTotal={(t) => <div>共{t}条</div>}
              onChange={this.onTableChange}
              onShowSizeChange={this.onShowSizeChange}
            />
          </div>

        </Card>
        <Modal
          title={'增加备注'}
          visible={this.state.addRemarks}
          onCancel={() => this.setState({ addRemarks: false })}
          onOk={this.addRemarksPost}
        >
          <Form
            ref={this.shopRemarkRef}
          >
            <Form.Item label="备注内容(*必填)：" name='shopRemark' rules={[{ required: true, message: '请输入要备注的内容' }]}>
              <TextArea></TextArea>
            </Form.Item>
          </Form>
        </Modal>

        {/* 确认发货 */}
        <Modal
          title={'确认发货'}
          visible={this.state.saveSend}
          onCancel={this.closeDeliveryModal}
          onOk={() => this.saveSendPost()}
        >
          {this.state.isBatchDeliver == false &&
            <Row>
              <Form {...modalInputLayout}
                ref={this.deliveryRef}
                initialValues={{
                  logisticsId: '-1'
                }}
              >
                <Col span={24}>

                  <Form.Item label="物流公司: " style={{ marginBottom: '5px' }} name='logisticsId' rules={[{ required: true, message: '请选择物流公司' }]}>
                    <Select style={{ width: '250px' }} onChange={(e) => this.changeLogistics(e)}>
                      <Option value='-1'> </Option>
                      {
                        this.state.companys && this.state.companys.length > 0 && this.state.companys.map((item) => {
                          return <Option value={item.id} key={item.id}>{item.name}</Option>
                        })
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="物流单号: "
                    style={{ marginBottom: '5px' }}
                    name='dvyFlowId'
                    rules={[{ required: this.state.logisticsId == '0' ? false : true, message: '请输入物流单号' }]}
                  >
                    <Input style={{ width: '250px' }} disabled={this.state.logisticsId == '0' ? true : false} />
                  </Form.Item>
                </Col>
              </Form>
            </Row>
          }
          {this.state.isBatchDeliver == true &&
            <Row>
              <Form {...modalInputLayout}
                ref={this.isBatchlogisticsRef}
                initialValues={{
                  logisticsId: 0,
                }}
              >
                <Col span={24}>
                  <Form.Item
                    label="物流公司: "
                    style={{ marginBottom: '5px' }}
                    name='logisticsId'
                    rules={[{ required: true, message: '请选择物流公司' }]}
                  >
                    <Select style={{ width: '250px' }} onChange={(e) => this.changeLogistics(e)} >
                      <Option value={0}>自提</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="物流单号: " style={{ marginBottom: '5px' }} name='dvyFlowId'>
                    <Input style={{ width: '250px' }} disabled={true} />
                  </Form.Item>
                </Col>
              </Form>
            </Row>
          }
        </Modal>
        <Modal
          visible={this.state.showRemarksVisibale}
          onCancel={() => this.setState({ showRemarksVisibale: false })}
          footer={null}
          title={'查看备注'}
        >
          <ul>
            <li style={{ fontSize: '16px' }}>
              <span>备注内容：&emsp; </span><span>{this.state.remarksText}</span>
            </li>
            <li></li>
          </ul>
        </Modal>
        <Drawer
          title="选择自定义导出参数"
          height={500}
          placement="top"
          closable={true}
          onClose={() => this.setState({ drawerVisialbe: false })}
          visible={this.state.drawerVisialbe}
          footer={
            <div style={{textAlign:'right'}}>
              <Button onClick={this.handleExport} type="primary" loading={this.state.downloadLoading}>确定导出</Button>
            </div>
          }
        >
          <div className={styles.switchBtn}>
            合并相同订单：
            <Switch defaultChecked onChange={this.handelSwitch} />
          </div>
          <div>
            <ul className={styles.paramsUl} >
              {paramsDataList && paramsDataList.length > 0 && paramsDataList.map((item, i) => {
                return <li key={i} className={`${item.check == true ? styles.active : ''}`} onClick={() => this.toggleParams(!item.check, i)}>{item.chineseName}</li>
              })}
            </ul>
          </div>
        </Drawer>
      </>
    )
  }
}
