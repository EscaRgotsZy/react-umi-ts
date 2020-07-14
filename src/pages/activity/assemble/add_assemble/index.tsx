import React, { Component }  from 'react';
import { Table, Input, Button, Form, Card, message, InputNumber, Row, Col, Modal, DatePicker, Select, Divider,Radio,} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import CouponList from '@/pages/activity/assemble/components/couponList'
import {
  getAssembleInfo,
  goodsListParams,
  getGoodsList,
  getGoodsSkuList,
  giftsListParams,
  getGiftsList,
  getGiftsSkuList,
  CouponListParams,
  getCouponsList,
  addAssembleParams,
  addAssembleItem,
  editAssembleItem,
} from '@/services/activity/assemble';
import { handlePicUrl } from '@/utils/utils';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
interface UserState {
  loading: boolean,
  skusLoading: boolean,
  goodsLoading: boolean,
  cpsLoading: boolean,
  giftSkusLoading: boolean,
  giftLoading: boolean,
  asbLoading: boolean,
  mergeId: number | string,   //拼团项id
  type: string,   
  productStatus: string | number,  //商品状态
  assembleStatus: number | string ,  //商品状态
  goodsSkuVisible: boolean,
  goodsVisible: boolean,
  couponVisible: boolean,
  giftSkuVisible: boolean,
  giftVisible: boolean,
  limitType: number | string, //限购类型
  checkGoodsSkuList: Array<any>, //
  selectedCpsList: Array<any>,
  checkGiftSkus: Array<any>,
  mergeTypeStatus: number | string,
  limitUserType: number | string,
  productId: number | string,
  productName: string,
  productPic: string,
  startValue: string,
  endValue: string,
  startTime: string,
  endTime: string,
  giftNum: number | string,
  totalLimitNumber: number | string,
  mergeLevelRate: number | string,
  mergePrice: number | string,
  firstPersonPrice: number | string,
  checkGoodsInfoData: Array<any>,
  checkSetSkusRowsKeys: Array<any>,
  selectedGoodsSkusRows: Array<any>,
  goodsSkusRowKey: Array<any>,
  goodsSkuList: Array<any>,
  goodsDataList: Array<any>,
  selectedCpsRows: Array<any>,
  selectedCpsRowKeys: Array<any>,
  couponsDataList: Array<any>,
  getGiftProductId: number | string,
  giftSkusRowKeys: Array<any>,
  giftSkusRows: Array<any>,
  giftSkusDataList: Array<any>,
  giftDataList: Array<any>,
  isManySku: boolean,
  spuLimitDateType: string | number,
  initDataInfo: any,
}
interface UserProp {
  history: any;
  match: any;
}

export default class addAssemble extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  goodsModalFormRef: React.RefObject<any>;//商品
  giftsModalFormRef: React.RefObject<any>;//赠品
  couponModalFormRef: React.RefObject<any>;//优惠券
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.goodsModalFormRef = React.createRef();
    this.giftsModalFormRef = React.createRef();
    this.couponModalFormRef = React.createRef();
    this.state = {
      loading: false,
      skusLoading: false,
      goodsLoading: false,
      cpsLoading: false,
      giftSkuVisible: false,
      giftVisible: false,
      asbLoading: false,
      mergeId: this.props.match.params.id,   //拼团项id
      type: this.props.match.params.type,     //0编辑，1查看，2复制
      productStatus:this.props.match.params.productStatus,     //商品状态
      assembleStatus: this.props.match.params.currentTab,  //活动状态
      goodsSkuVisible: false,
      goodsVisible: false,
      couponVisible: false,
      giftSkusLoading: false,
      giftLoading: false,
      limitType: 1,    //限购类型
      checkGoodsSkuList: [],
      selectedCpsList: [],
      checkGiftSkus: [],
      mergeTypeStatus: 0, //拼团类型
      limitUserType: 2, //用户人群
      productId: '',
      productName: '',
      productPic: '',
      startValue:'',
      endValue:'',
      startTime:'',
      endTime:'',
      giftNum: '',
      totalLimitNumber:'',
      mergeLevelRate: '',//批量设置返积分
      mergePrice: '',//批量设置拼团价
      firstPersonPrice: '',
      checkGoodsInfoData:[],
      checkSetSkusRowsKeys: [],
      selectedGoodsSkusRows: [],
      goodsSkusRowKey: [],
      goodsSkuList: [],
      goodsDataList: [],
      selectedCpsRows: [],
      selectedCpsRowKeys: [],
      couponsDataList: [],
      getGiftProductId: '',
      giftSkusRowKeys: [],
      giftSkusRows: [],
      giftSkusDataList: [],
      giftDataList: [],
      isManySku: false,
      spuLimitDateType: '',
      initDataInfo:''
    };
  }
  // 商品分页
  goodsPage = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  };
  // 赠品分页
  giftPage = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  };
  //优惠券分页
  couponsPage = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }
  // 赠品sku分页
  giftSkus = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }
  countDown = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  countDownList = this.countDown.map((item,i) => <Option value={item} key={i}>{item}小时</Option>)
  skuColumns:Array<any> = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      width: 200,
      render: (text:any) => <>
        <div style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '拼团价',
      dataIndex: 'mergePrice',
      width: 100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergePrice(e, index)} disabled={ this.state.type=='1' ? true: false } />
        )
      }
    },
    {
      title: '返积分',
      dataIndex: 'mergeLevelRate',
      width: 100,
      render: (text:any,record:any,index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergeLevelRate(e, index)} disabled={ this.state.type=='1' ? true: false } max={20} />
        )
      }
    },
  ]
  //拼团类型0，限购种类3
  skuLimitColumns:Array<any> = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      render: (text:any) => <>
        <div style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '单个sku限购数量',
      width: 100,
      dataIndex: 'limitNumber',
      render: (text:any, record:any,index:number) => {
        return(
          <Input value={text} onChange={(e) => this.changeLimitNumber(e, index)} disabled={ this.state.type=='1' ? true: false }/>
        )
      }
    },
    {
      title: '限制时间',
      dataIndex: 'limitDateType',
      render: (text:any,record:any, index:number) => {
        return(
          <Radio.Group value={text} onChange={(e) => this.changeLimitDateType(e, index)} disabled={ this.state.type=='1' ? true: false }>
            <Radio value={1}>每天</Radio>
            <Radio value={2}>永久</Radio>
          </Radio.Group>
        )
      }
    },
    {
      title: '拼团价',
      dataIndex: 'mergePrice',
      width: 100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergePrice(e, index)} disabled={ this.state.type=='1' ? true: false } />
        )
      }
    },
    {
      title: '返积分',
      dataIndex: 'mergeLevelRate',
      width: 100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergeLevelRate(e, index)} disabled={ this.state.type=='1' ? true: false} max={20} />
        )
      }
    },
  ]
  //拼团类型1，限购种类1/2
  newSkuColumns:Array<any> = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      render: (text:any) => <>
        <div style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '新人价',
      width: 100,
      dataIndex: 'firstPersonPrice',
      render: (text:any, record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeFirstPersonPrice(e, index)} disabled={ this.state.type=='1' ? true : false } />
        )
      }
    },
    {
      title: '拼团价',
      dataIndex: 'mergePrice',
      width: 100,
      render: (text:any, record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergePrice(e, index)} disabled={ this.state.type=='1' ? true : false } />
        )
      }
    },
    {
      title: '返积分',
      dataIndex: 'mergeLevelRate',
      width: 100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergeLevelRate(e, index)} disabled={ this.state.type=='1' ? true : false } max={20} />
        )
      }
    },
  ]
  //拼团类型1，限购种类3
  newSkuLimitColumns:Array<any> = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      render: (text:any) => <>
        <div style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '新人限购数量',
      dataIndex: 'firstLimitNumber',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeNewUserLimitNum(e, index)} disabled={ this.state.type=='1' ? true : false}/>
        )
      }
    },
    {
      title: '老用户限购数量',
      dataIndex: 'limitNumber',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeLimitNumber(e, index)}  disabled={ this.state.type=='1' ? true : false}/>
        )
      }
    },
    {
      title: '限制时间',
      dataIndex: 'limitDateType',
      render: (text:any, record:any,index:number) => {
        return(
          <Radio.Group value={text} onChange={(e) => this.changeLimitDateType(e, index)} disabled={ this.state.type=='1' ? true : false }>
            <Radio value={1}>每天</Radio>
            <Radio value={2}>永久</Radio>
          </Radio.Group>
        )
      }
    },
    {
      title: '新人价',
      dataIndex: 'firstPersonPrice',
      width:100,
      render: (text:any, record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeFirstPersonPrice(e, index)} disabled={ this.state.type=='1' ? true: false } />
        )
      }
    },
    {
      title: '拼团价',
      dataIndex: 'mergePrice',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergePrice(e, index)} disabled={ this.state.type=='1' ? true: false} />
        )
      }
    },
    {
      title: '返积分',
      dataIndex: 'mergeLevelRate',
      width:100,
      render: (text:any, record:any,index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergeLevelRate(e, index)} disabled={ this.state.type=='1' ? true: false} max={20} />
        )
      }
    },
  ]
  // 拼团类型2，限购种类1/2
  inviteSkuColumns:Array<any> = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      render: (text:any) => <>
        <div style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '邀新价',
      dataIndex: 'firstPersonPrice',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeFirstPersonPrice(e, index)} disabled={ this.state.type=='1' ? true : false} />
        )
      }
    },
    {
      title: '拼团价',
      dataIndex: 'mergePrice',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergePrice(e, index)} disabled={ this.state.type=='1' ? true : false} />
        )
      }
    },
    {
      title: '返积分',
      dataIndex: 'mergeLevelRate',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergeLevelRate(e, index)} disabled={ this.state.type=='1' ? true : false} max={20}  />
        )
      }
    },
  ]
  // 拼团类型2，限购种类3
  newInviteSkuColumns:Array<any> = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      render: (text:any) => <>
        <div style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '限购数量',
      dataIndex: 'limitNumber',
      width:100,
      render: (text:any,record:any, index:number) => {
        return(
          <Input value={text} onChange={(e) => this.changeLimitNumber(e, index)} disabled={ this.state.type=='1' ? true : false } />
        )
      }
    },
    {
      title: '限制时间',
      dataIndex: 'limitDateType',
      render: (text:any,record:any, index:number) => {
        return(
          <Radio.Group value={text} onChange={(e) => this.changeLimitDateType(e, index)} disabled={ this.state.type=='1' ? true : false }>
            <Radio value={1}>每天</Radio>
            <Radio value={2}>永久</Radio>
          </Radio.Group>
        )
      }
    },
    {
      title: '邀新价',
      dataIndex: 'firstPersonPrice',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeFirstPersonPrice(e, index)} disabled={ this.state.type=='1' ? true : false } />
        )
      }
    },
    {
      title: '拼团价',
      dataIndex: 'mergePrice',
      width:100,
      render: (text:any, record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergePrice(e, index)} disabled={ this.state.type=='1' ? true : false }/>
        )
      }
    },
    {
      title: '返积分',
      dataIndex: 'mergeLevelRate',
      width:100,
      render: (text:any,record:any, index:number) => {
        return (
          <Input value={text} onChange={(e) => this.changeMergeLevelRate(e, index)} disabled={ this.state.type=='1' ? true : false} max={20}  />
        )
      }
    },
  ]
  //SKUMODAL  
  goodsSkuColumns:Array<any> = [
    {
      title: '单品-规格',
      dataIndex: 'saleProps',
    },
    {
      title: '单品-标题',
      dataIndex: 'name',
    },
    {
      title: '单品-销售价',
      dataIndex: 'price',
    },
    {
      title: '单品-库存',
      dataIndex: 'stocks',
    },
  ]
  // 商品table-columns
  goodsColumns:Array<any> = [
    {
      title: '商品图片',
      dataIndex: 'productPic',
      render: (text:any) => (
        text ?  <img src={text && handlePicUrl(text)} width='50' height='60' /> : '暂无图片'
      )
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      ellipsis: 'true',
    },
    {
      title: '原价',
      dataIndex: 'originalPrice',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '操作',
      render: ( record:any ) => <>
        <Button type='primary' style={{ marginRight: '10px' }} onClick={() => this.selectGoods(record)}>选择</Button>
      </>
    }
  ]
  // 优惠卷Columns
  couponsColumns:Array<any> = [
    {
      title: '优惠券面额',
      dataIndex: 'offPrice',
    },
    {
      title: '积分券名称',
      dataIndex: 'couponName',
    },
    {
      title: '消费金额',
      dataIndex: 'fullPrice',
    },
    {
      title: '优惠卷类型',
      dataIndex: 'couponType',
      render: (text:any) => text === 'product' ? '商品券' : '通用券'
    },
  ]
  // 赠品
  giftColumns:Array<any> = [
    {
      title: '赠品信息',
      render: (record:any) => <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img style={{ width: '50px', height: '50px' }} src={record.productPic && handlePicUrl(record.productPic)}/>
          <ul style={{ flex: '1', marginLeft: '10px' }}>
            <li>赠品名称: {record.productName}</li>
            <li>赠品ID: {record.productId}</li>
          </ul>
        </div>
      </>
    },
    {
      title: '原价',
      dataIndex: 'skuMaxPrice',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '操作',
      render: ( record:any ) => (
        <Button type='primary' onClick={() => this.getGiftSku(record)}>选择sku</Button>
      )
    },
  ]
  //赠品sku
  giftSkusColumns:Array<any> = [
    {
      title: '规格',
      dataIndex: 'saleProps',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
  ]
  //
  giftTableColumns:Array<any> = [
    {
    title: '赠品图片',
    render: ( record:any ) => {
      if (!record.pic) {
          return <img src={record.productPic && handlePicUrl(record.productPic)} width='50' height='60' />
      } else {
          return <img src={record.pic && handlePicUrl(record.pic)} width='50' height='60' />
      }
    }
  },
  {
    title: '赠品名称',
    render: ( record:any ) => {
      if(!record.name){
        return <span>{record.productName}</span>
      }else{
        return <span>{record.name}</span>
      }
    }
  },
  {
    title: '赠品价格',
    dataIndex: 'price'
  },
  {
    title: '赠品库存',
    render: ( record:any ) => {
      if(!record.stocks){
        return <span>{record.stock ? record.stock : 0}</span>
      }else{
        return <span>{record.stocks ? record.stocks : 0}</span>
      }
    }

  },
  {
    title: '操作',
    render: ( _:any, record:number ) => <>
      <Button type='primary' onClick={() => this.removeGiftSku(record)} disabled={ this.state.type=='1'?true:false }>移除</Button>
    </>
  }
]
  componentDidMount() {
    // 回显    
    this.state.mergeId && this.getDetailInfo();
  }
  showColumn = () => {
    let active = -1;
    let { mergeTypeStatus,limitType } = this.state;
    if (mergeTypeStatus=='0' && (limitType==1||limitType==2)) {
      active = 1;
    } else if (mergeTypeStatus=='0' && limitType==3) {
      active = 2;
    } else if (mergeTypeStatus=='1' && (limitType==1||limitType==2)) {
      active = 3;
    } else if (mergeTypeStatus=='1' && limitType==3 ) {
      active = 4;
    } else if (mergeTypeStatus=='2' && (limitType==1||limitType==2)) {
      active = 5;
    } else {
      active = 6
    }
    return active;
  }
  getDetailInfo = async():Promise<false | void> => {
    let { mergeId, type, productStatus, assembleStatus } = this.state;
    let res = await getAssembleInfo( mergeId );
    if (!res) return false;
    let { data } = res;
    let { 
      mergeName, 
      startTime, 
      endTime, 
      peopleNumber, 
      countDown, 
      productSkuVOS, 
      mergeGiftRelVOS, 
      mergeCouponRelVOS,
      mergeType=0,
      limitUserType,
      limitType,
      isManySku,
      limitNumber,
      limitDateType,
      productId
    } = data;
    
    this.setState({ 
      mergeTypeStatus:mergeType, 
      startValue:startTime, 
      endValue:endTime, 
    })

    if( (type=='0' && productStatus=='1') || (type=='2' && assembleStatus=='-1' && productStatus=='1') || (!productStatus) ){
      this.setState({
        productId,
        productName:productSkuVOS[0].name,
        productPic:handlePicUrl(productSkuVOS[0].pic)
      })
    }
    let endTimeString = moment(endTime).valueOf();
    let currentTimeString = new Date().getTime();
    if((endTimeString < currentTimeString) && productStatus && type=='2'){
      message.error("时间已过期,请重新设置")
    }
    let { giftNum } = mergeGiftRelVOS && mergeGiftRelVOS[0] || '';
    this.setState({ 
      loading: false, 
      startTime, endTime 
    })

    if( (type=='0' && productStatus=='1') || (type=='2' && assembleStatus=='-1' && productStatus=='1') || (!productStatus) ){
      this.setState({
        limitType: +limitType,
        checkGoodsSkuList: productSkuVOS, 
        selectedCpsList: mergeCouponRelVOS || [], 
        checkGiftSkus: mergeGiftRelVOS || [], 
        giftNum ,
        totalLimitNumber:limitNumber,
      })
    }
    this.formRef.current.setFieldsValue({
      mergeName,
      peopleNumber,
      countDown,
      mergeType,
      isManySku,
      limitType,
      limitUserType,
      activityTime: [moment(data.startTime), moment(data.endTime)],
    })
    if( (type=='0' && productStatus=='1') || (type=='2' && assembleStatus=='-1' && productStatus=='1') || (!productStatus) ){
      this.formRef.current.setFieldsValue({
        limitType: +limitType,
        isManySku: isManySku,
        totalLimitNumber: limitNumber,
        limitDateType: limitDateType
      })
    }
  }
  // 修改拼团类型
  changeMergeType = (value:any) => {
    this.setState({
      mergeTypeStatus: value
    })
  }
  //修改用户类型
  onChangeUserType = (value:any) => {
    this.setState({
      limitUserType: value
    })
  }
  //设置单个sku限购数量/老用户限购数量
  changeLimitNumber= (e:any, index:number) => {
    let { checkGoodsSkuList } = this.state;
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    checkGoodsSkuList[index].limitNumber = value;
    this.setState({ checkGoodsSkuList })
  }
  //设置限制时间----radio选择
  changeLimitDateType= (e:any, index:number) => {
    let { checkGoodsSkuList } = this.state;
    checkGoodsSkuList[index].limitDateType = e.target.value;
    this.setState({ checkGoodsSkuList })
  };

  // 设置新人价
  changeFirstPersonPrice = (e:any, index:number) => {
    let { checkGoodsSkuList } = this.state;
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    checkGoodsSkuList[index].firstPersonPrice = value;
    this.setState({ checkGoodsSkuList })
  }
  // 设置新人限购数量
  changeNewUserLimitNum = (e:any, index:number ) => {
    let { checkGoodsSkuList } = this.state;
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    checkGoodsSkuList[index].firstLimitNumber = value;
    this.setState({ checkGoodsSkuList })
  }
  // 设置拼团价
  changeMergePrice = (e:any, index:number) => {
    let { checkGoodsSkuList } = this.state;
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    checkGoodsSkuList[index].mergePrice = value;
    this.setState({ checkGoodsSkuList })
  }
  // 设置返积分
  changeMergeLevelRate = (e:any, index:number) => {
    let { checkGoodsSkuList } = this.state;
    let value = e.target.value;
    if (value > 20) {
      value = 20
    }
    if (value < 0) {
      value = 0
    }
    checkGoodsSkuList[index].mergeLevelRate = value;
    this.setState({ checkGoodsSkuList })
  }
/* ---------------------------------------------------- 选择商品模块 ---------------------------------------------------- */
  // 切换分页
  onGoodsTableChange = ({ current, pageSize }:any) => {
    Object.assign(this.goodsPage, { pageNum: current, pageSize: pageSize })
    this.getGoodsList()
  }
  // onGoodsSkuSelectChange 选择skurow
  onGoodsSkuSelectChange = (selectedRowKeys:any, selectedRows:any) => {
    this.setState({ selectedGoodsSkusRows: selectedRows, goodsSkusRowKey: selectedRowKeys })
  }
  // sku点击确定
  handleCheckGoodSkuOk = () => {
    let { selectedGoodsSkusRows = [],checkGoodsSkuList=[], checkGoodsInfoData  } = this.state;
    let { productId, productName, productPic, }:any = checkGoodsInfoData;
    let checkSetSkusRowsKeys:any = [];
    checkGoodsSkuList = selectedGoodsSkusRows || [];
    checkGoodsSkuList.forEach((item,index) => {
      checkSetSkusRowsKeys.push(item.skuId);
    })
    this.setState({ productId, productName, productPic, checkGoodsSkuList, goodsSkuVisible: false,checkSetSkusRowsKeys,selectedCpsList:[] })
  }
  // 一键操作 批量设置
  easyShuttle = ():any => {
    let { checkGoodsSkuList, checkSetSkusRowsKeys } = this.state;
    let mergePrice = this.state.mergePrice;
    let mergeLevelRate = this.state.mergeLevelRate;
    let firstPersonPrice = this.state.firstPersonPrice;
    if (!checkSetSkusRowsKeys || checkSetSkusRowsKeys.length <= 0) {
      message.error('请选择要批量设置的单品')
    }
    let newcheckGoodsSkuList:Array<any> = [];
    checkGoodsSkuList.forEach((item)=>{
      if(!newcheckGoodsSkuList[item.skuId]){
        newcheckGoodsSkuList[item.skuId] = item
      }
    })
    if (!checkSetSkusRowsKeys || checkSetSkusRowsKeys.length <= 0) return false;
    checkSetSkusRowsKeys && checkSetSkusRowsKeys.length > 0 && checkSetSkusRowsKeys.forEach(items => {
      if(newcheckGoodsSkuList[items]){
        newcheckGoodsSkuList[items].mergePrice = mergePrice;
        newcheckGoodsSkuList[items].mergeLevelRate = mergeLevelRate;
        newcheckGoodsSkuList[items].firstPersonPrice = firstPersonPrice;
      }
    })
    let new2:Array<any> =[];
    newcheckGoodsSkuList.forEach((item,index)=>{
      new2.push(item)
    })
    this.setState({ checkGoodsSkuList })
  }
  // 选择要设置的skutable选项
  setSkuTable = (selectedRowKeys:any, selectedRows:any) => {
    this.setState({ checkSetSkusRowsKeys: selectedRowKeys })
  }
  // 修改拼团价
  onChangeMergePrice = (e:any) => {
    this.setState({
      mergePrice : e.target.value
    })
  }
  // 修改新人价
  onChangeFirstPersonPrice = (e:any) => {
    this.setState({
      firstPersonPrice : e.target.value
    })
  }
  // 修改拼团返积分
  onChangeCoupon = (e:any) => {
    let value = e.target.value;
    if (value > 20) {
      value = 20;
    }
    this.setState({ 
      mergeLevelRate: value,
    })
  }
  // 点击商品选择
  selectGoods = (data:any) => {
    let { goodsSkusRowKey, } = this.state;
    let { productId, productName, productPic } = data;
    let checkGoodsInfoData:any = {
      productId, productName, productPic,
    }
    if(productId != this.state.productId){
      goodsSkusRowKey = [];
    }
    this.setState({ checkGoodsInfoData, goodsVisible: false, goodsSkuVisible: true,goodsSkusRowKey })
    this.getGoodsSku(productId)
  }
  // 获取商品Sku
  getGoodsSku = async (productId:number|string):Promise<any> => {
    this.setState({ skusLoading: true })
    let res = await getGoodsSkuList({prodIds: productId});
    this.setState({ skusLoading: false })
    let { data } = res
    let goodsSkuList = data || [];
    this.setState({ goodsSkuList })
  }
  // 点击选择商品 --- 获取商品数据 
  checkGoods = ():any => {
    if (!this.state.startValue || !this.state.endValue) {
      message.error('请先选择活动开始时间');
      return false
    }
    this.setState({ goodsVisible: true });
    setTimeout(() => {
      this.getGoodsList();
    }, 100);
  }
  // 获取商品list数据
  getGoodsList = async ():Promise<any> => {
    this.setState({ goodsLoading: true })
    let { productName, productId, outerId } = this.goodsModalFormRef.current.getFieldsValue();
    let query: goodsListParams = { 
      page: this.goodsPage.pageNum, 
      size: this.goodsPage.pageSize, 
      productId, 
      productName, 
      outerId 
    };
    let res = await getGoodsList(query);
    this.setState({ goodsLoading: false })
    let { records, total } = res;
    let goodsDataList = records || [];
    this.goodsPage.total = total || 0; 
    this.setState({ goodsDataList })
  }
  /* ---------------------------------------------------- 选择优惠卷模块 ---------------------------------------------------- */
  // 切换优惠卷分页
  onCouponsTableChange = ({ current, pageSize }:any) => {
    Object.assign(this.couponsPage, { pageNum: current, pageSize: pageSize })
    this.getCouponsList()
  }
  // 选择优惠券
  onCpsSelectChange = (selectedRowKeys:any, selectedRows:any) => {
    this.setState({ selectedCpsRows: selectedRows, selectedCpsRowKeys: selectedRowKeys })
  };
  // 获取优惠卷列表
  getCouponsList = async ():Promise<any> => {
    let { productId,startValue, endValue } = this.state
    let { couponName, offPrice } = this.couponModalFormRef.current.getFieldsValue();
    let query: CouponListParams = { 
      page: this.couponsPage.pageNum, 
      size: this.couponsPage.pageSize, 
      offPrice, 
      couponName, 
      productId,
      startTimeStr: startValue, 
      endTimeStr: endValue,
    };
    
    this.setState({ cpsLoading: true })
    let res = await getCouponsList(query);
    this.setState({ cpsLoading: false })
    let { records, total } = res;
    let couponsDataList = records || [];
    this.couponsPage.total = total || 0;
    this.setState({ couponsDataList })
  }
  // 选择优惠卷按钮
  checkCoupon = ():any => {
    let { productId, checkGoodsSkuList } = this.state;
    if (!productId) {
      message.error('请选择商品');
      return false
    }
    if (!checkGoodsSkuList || checkGoodsSkuList.length <= 0) {
      message.error('所选商品需要选择单品');
      return false
    }
    this.setState({ couponVisible: true })
    setTimeout(() => {
      this.getCouponsList()
    }, 100);
    
  }
  // 选择优惠券后点击确认
  handleCpsOk = () => {
    let { selectedCpsRows, selectedCpsRowKeys = [] } = this.state;
    this.setState({ couponVisible: false, selectedCpsList: selectedCpsRows, selectedCpsRowKeys })
  }
  // 移除优惠券
  deleCps = (index:number) => {
    let { selectedCpsList, selectedCpsRowKeys } = this.state;
    selectedCpsList && selectedCpsList.splice(index, 1);
    selectedCpsRowKeys && selectedCpsRowKeys.splice(index, 1);
    this.setState({ selectedCpsList, selectedCpsRowKeys })
  }
  /* ---------------------------------------------------- 选择赠品模块 ---------------------------------------------------- */
  // 切换分页
  onGiftTableChange = ({ current, pageSize }:any) => {
    Object.assign(this.giftPage, { pageNum: current, pageSize: pageSize })
    this.getGiftList()
  }
  // 切换赠品sku分页
  onGiftSkuTableChange = ({ current, pageSize }:any) => {
    Object.assign(this.giftSkus, { pageNum: current, pageSize: pageSize })
    this.getGiftSkuList(this.state.getGiftProductId)
  }
  // 选择sku
  ongSkuSelectChange = (selectedRowKeys:any, selectedRows:any) => {
    this.setState({ giftSkusRowKeys: selectedRowKeys, giftSkusRows: selectedRows });
  };
  // 选择sku
  getGiftSku = (record:any) => {
    let { productId } = record;
    this.giftSkus = {
      pageSize: 5,
      pageNum: 1,
      total: 0,
    }
    this.setState({ 
      getGiftProductId: productId,
      giftSkuVisible: true 
    })
    this.getGiftSkuList(productId)
  }
  // 获取sku列表
  getGiftSkuList = async (productId:number|string):Promise<any> => {
    this.setState({ giftSkusLoading: true })
    let res = await getGiftsSkuList(productId);
    this.setState({ giftSkusLoading: false })
    let { data } = res
    let giftSkusDataList = data && data.map((v,i)=>{
      return {
        key: i,
        ...v
      }
    }) || [];
    this.setState({ giftSkusDataList })
  }
  // 确认赠品sku
  giftOkSave = () => {
    let { giftSkusRows, checkGiftSkus = [] } = this.state;
    let skuIds = checkGiftSkus.map(v=> v.skuId)
    let newGiftSkusRows = giftSkusRows.filter(v => v && !skuIds.includes(v.skuId) )
    let newCheckGiftSkus = checkGiftSkus.concat(newGiftSkusRows)
    this.setState({ checkGiftSkus: newCheckGiftSkus, giftSkuVisible: false, giftVisible: false })
  }
  // ------------------------------------------------------------ sku ↑---------
  // 选择赠品
  checkGift = ():any => {
    let { productId, checkGoodsSkuList } = this.state;
    if (!productId) {
      message.error('请选择商品');
      return false
    }
    if (!checkGoodsSkuList || checkGoodsSkuList.length <= 0) {
      message.error('所选商品需要选择单品');
      return false
    }
    this.setState({ giftVisible: true})
    setTimeout(() => {
      this.getGiftList()
    }, 100);
  }
  // 获取赠品列表
  getGiftList = async ():Promise<any> => {
    let { productId, productName } = this.giftsModalFormRef.current.getFieldsValue()
    let query:giftsListParams = { 
      page: this.giftPage.pageNum, 
      size: this.giftPage.pageSize, 
      productId, 
      productName 
    };
    this.setState({ giftLoading: true });
    let res = await getGiftsList(query);
    this.setState({ giftLoading: false });
    let { records, total } = res
    let giftDataList = records || [];
    this.giftPage.total = total || 0;  
    this.setState({ giftDataList })
  }
  // 移除赠品
  removeGiftSku = (record:any ) => {
    let { checkGiftSkus, giftNum }:any = this.state;
    let newCheckGiftSkus = [...(checkGiftSkus || [])].filter(v=> v.skuId !== record.skuId)
    giftNum = Math.min(newCheckGiftSkus.length, giftNum)
    this.setState({ checkGiftSkus: newCheckGiftSkus, giftNum })
  }
  // ---------------------------------------
  // 取消
  cancleAsb = () => {
    this.props.history.goBack()
  }
  // 确定
  handleSubmit = () => {
    this.formRef.current
      .validateFields()
      .then(( values:any ):any => {
        let { productId, startValue, endValue, selectedCpsList, checkGoodsSkuList, checkGiftSkus,limitType, giftNum} = this.state;
        let startTimestr = startValue ? moment(startValue).valueOf() : 0;
        let endTimestr = endValue ? moment(endValue).valueOf() : 0;
        let curTime = new Date().getTime();
        if( curTime > endTimestr ){
          message.warn("当前时间已过期，请重新选择！");
          return false;
        }
        if( endTimestr >= startTimestr ){
          let longTime = endTimestr-startTimestr;
          if( longTime < 86400000){
            message.warn("活动时间必须大于24小时！");
            return false;
          }
        }
        // 商品
        checkGoodsSkuList =  checkGoodsSkuList.map((item) => {
          return {
            mergeLevelRate: item.mergeLevelRate,
            mergePrice: item.mergePrice,
            firstLimitNumber: item.firstLimitNumber,
            firstPersonPrice: item.firstPersonPrice,
            skuId: item.skuId,
            skuPrice: item.price,
            limitDateType: item.limitDateType,
            limitNumber: item.limitNumber
          }
        })
        let isok = true;
        let { mergeTypeStatus } = this.formRef.current.getFieldsValue();
        checkGoodsSkuList && checkGoodsSkuList.length > 0 && checkGoodsSkuList.forEach(item => {
          if (!item.mergePrice || !item.mergeLevelRate) {
            isok = false
          }
          if(mergeTypeStatus == '0' && limitType == '3'){
            if(!item.limitNumber || !item.limitDateType){
              isok = false
            }
          }
          if((mergeTypeStatus == '1' || mergeTypeStatus == '2') && (limitType == 1 || limitType == 2)){
            if(!item.firstPersonPrice){
              isok = false
            }
          }
          if(mergeTypeStatus == '1' && limitType == 3){
            if(!item.limitNumber || !item.limitDateType || !item.firstLimitNumber || !item.firstPersonPrice){
              isok = false
            }
          }
          if(mergeTypeStatus == '2' && limitType == 3){
            if(!item.limitNumber || !item.limitDateType || !item.firstPersonPrice){
              isok = false
            }
          }
        })
        if (!isok) {
          message.error('请完成商品单品的相关信息的设定');
          return false
        }
        // 优惠券
        selectedCpsList = selectedCpsList.map((item) => {
          return {
            couponId: item.couponId,
            couponName: item.couponName,
            couponType: item.couponType,
            fullPrice: item.fullPrice,
            offPrice: item.offPrice,
            endTime: item.endTime,
            startTime: item.startTime,
          }
        })
        // 赠品
        checkGiftSkus = checkGiftSkus.map((item) => {
          return {
            skuId: item.skuId,
            stock: item.stocks,
            saleProps: item.saleProps,
            productPic: item.pic,
            price: item.price,
            productName: item.name,
            productId: item.productId,
          }
        })
        if (!productId) message.error('请选择商品');
        if (!checkGoodsSkuList || checkGoodsSkuList.length <= 0) message.error('请选择商品需要选择单品')
        if (productId && checkGoodsSkuList && checkGoodsSkuList.length > 0) {
          let query = {
            id:'',                                 
            productId,                             // 商品id
            giftNum,                               // 赠品可选数
            startTime: startValue,                 // 活动开始时间
            endTime: endValue,                     // 活动结束时间F
            countDown: values.countDown,           // 活动结束时间
            mergeName: values.mergeName,           // 拼团活动名称
            peopleNumber: values.peopleNumber,     // 参团人数
            limitUserType: values.limitUserType,    //用户人群
            limitType: values.limitType,            //限购种类
            dtoList: checkGoodsSkuList,            // 商品sku
            isManySku: values.isManySku,           //是否允许购买多sku
            mergeCouponRelBOS: selectedCpsList,    // 优惠券集合
            mergeGiftRelBOS: checkGiftSkus,        // 赠品sku集合
            mergeType:values.mergeType || 0,       // 拼团类型
            limitNumber:values.totalLimitNumber,        // spu总限购数/以上sku总限购数
            limitDateType:values.spuLimitDateType,        // spu限购时间
          }  
          this.setSaveInfo(query);
        }
      }).catch((err: Error) => {});
  }
  //提交
  setSaveInfo = async (query: addAssembleParams) => {
    if (this.state.type =='0') {
      query.id = this.state.mergeId;
      await editAssembleItem(query);
    } else {
      await addAssembleItem(query);
    }
    this.props.history.goBack()
  }
  //时间选择
  disabledDate = (current:any) => {
    return current && current < moment().startOf('day');
  }

  disabledTime = (type:any):any => {
    let date = new Date();
    let hour = date.getHours();
    let Minutes = date.getMinutes();
    let Seconds = date.getSeconds();
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, hour),
        disabledMinutes: () => this.range(0, Minutes),
        disabledSeconds: () => this.range(0, Seconds),
      }
    }
  }
  range = (start:any, end:any) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
  }
  // 活动时间
  checkDate = (date:any,dateString:any) => {
    this.setState({
      startValue: dateString[0],
      endValue: dateString[1],
    })
  }
  // 可选赠品
  handleChange = (value:any) => {
    this.setState({
      giftNum: value //拼团活动选择的赠品数量
    })
  }
  //限购种类----radio选择
  limitTypeChange = ( e:any ) => {
    this.setState({
      limitType: e.target.value
    })
  };
  //限购一种sku类别----radio选择
  skuTypeChange = ( e:any ) => {
    this.setState({
      isManySku: e.target.value
    })
  };
  //spu----限购时间
  spuLimitDateTypeChange = ( e:any )=> {
    this.setState({
      spuLimitDateType: e.target.value
    })
  };
  //此spu下所有sku总限购件数/spu-----总限购数
  totalLimitNumChange = (e:any) => {
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    this.setState({
      totalLimitNumber: value
    })
  };
  render() {
    const { selectedCpsRowKeys, giftSkusRowKeys, goodsSkusRowKey, limitType,mergeId,type,giftSkusLoading,giftSkusDataList, mergeTypeStatus, checkGiftSkus } = this.state;
    // 优惠券table
    const couponsRowSelection = {
      selectedRowKeys: selectedCpsRowKeys,
      onChange: this.onCpsSelectChange,
    }
    // 优惠劵
    const goodsFormItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    }
    // 选择的skutable
    const rowSelection:any = {
      selectedRowKeys:this.state.checkSetSkusRowsKeys,
      onChange: this.setSkuTable
    };
    // skutable 选择配置项
    const giftSkusRow = {
      selectedRowKeys: giftSkusRowKeys,
      onChange: this.ongSkuSelectChange,
    }
    //rowSkuSelection
    const goodsSkuSelection = {
      selectedRowKeys: goodsSkusRowKey,
      onChange: this.onGoodsSkuSelectChange,
    }
    // 商品分页配置
    const goodsPagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.goodsPage.pageNum,
      pageSize: this.goodsPage.pageSize || 10,
      total: this.goodsPage.total,
      showTotal: (t:number) => <div>共{t}条</div>
    };

    // 优惠卷分页配置
    const couponsPagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.couponsPage.pageNum,
      pageSize: this.couponsPage.pageSize || 10,
      total: this.couponsPage.total,
      showTotal: (t:number) => <div>共{t}条</div>
    };
    // 赠品
    const giftPagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.giftPage.pageNum,
      pageSize: this.giftPage.pageSize || 10,
      total: this.giftPage.total,
      showTotal: (t:number) => <div>共{t}条</div>
    };
    // 赠品sku
    const giftPaginationsku = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.giftSkus.pageNum,
      pageSize: this.giftSkus.pageSize || 10,
      total: this.giftSkus.total,
      showTotal: (t:number) => <div>共{t}条</div>
    }
    return(
      <PageHeaderWrapper>
        <Card style={{ margin: '30px auto' }}>
            <Form 
              layout="inline" 
              ref={this.formRef}
              initialValues={{
                mergeType: mergeId ? this.state.mergeTypeStatus : 0,
                limitUserType: mergeId ? this.state.limitUserType : 2,
                activityTime: mergeId ? [moment(this.state.startValue), moment(this.state.endValue)] : '',
                limitType: mergeId ? this.state.limitType : 1,
                isManySku: true,
                totalLimitNumber: mergeId ? this.state.totalLimitNumber : 0,  
                spuLimitDateType: 1,
              }}
            >
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:'20px'}}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="拼团类型: " 
                    name="mergeType" 
                    rules={[
                      {
                        required: true,
                        message: '请选择拼团类型',
                      }
                    ]}
                  >
                    <Select style={{ width: 160 }} onChange={this.changeMergeType} disabled={ type =='1' } >
                      <Option value={0}>普通团</Option>
                      <Option value={1}>新人团</Option>
                      <Option value={2}>邀新团</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:'20px'}}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="活动名称: " 
                    name="mergeName"
                    rules={[
                      {
                        required: true,
                        message: '请输入活动名称',
                      }
                    ]}
                  >
                    <Input disabled={ type =='1' } style={{ width: 400 }}/>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="参团人数: " 
                    name="peopleNumber"
                    rules={[
                      {
                        required: true,
                        pattern: /[2-9]|([1-9]\d+)/,
                        message: '请输入参团人数，不少于2人',
                      }
                    ]}
                  >
                    <InputNumber min={2} max={10} disabled={ type =='1' } style={{ width: 160 }}/>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="用户人群: " 
                    name="limitUserType"
                  >
                    <Select style={{ width: 160 }} onChange={this.onChangeUserType} disabled={ type =='1' }> 
                      <Option value={1}>企业用户</Option>
                      <Option value={2}>所有人</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="成团倒计时: " 
                    name="countDown"
                    rules={[
                      {
                        required: true,
                        message: '请选择成团倒计时长',
                      }
                    ]}
                  >
                    <Select style={{ width: 160 }} placeholder="请选择成团倒计时长" disabled={ type =='1' } >
                      {this.countDownList}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="活动时间：" 
                    name="activityTime"
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
                        disabled={ type =='1'  }
                        style={{ width: 400 }}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                <Col span={20} offset={2}>
                  <FormItem 
                    label= "限购种类:"
                    name= "limitType"
                  >
                    <Radio.Group buttonStyle="solid" onChange={this.limitTypeChange} disabled={ type =='1' }>
                      <Radio.Button value={1}>不限购数量</Radio.Button>
                      <Radio.Button value={2}>spu限购</Radio.Button>
                      <Radio.Button value={3}>sku限购</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                <Col span={20} offset={2} style={{ display: 'flex' }}>
                  <div style={{ fontSize: '14px', marginRight: '20px',color:'#333' }}><span style={{ marginRight: '4px', color: '#f5222d', fontSize: '14px', fontFamily: 'SimSun, sans-serif' }}>*</span>
                    商&nbsp; 品:
                </div> { (type != '1') && <Button type="primary" onClick={this.checkGoods}>选择商品</Button>}
                </Col>
                {/* 选择的商品信息 */}
                {this.state.productId && 
                  <Col span={20} offset={2} >
                    <div style={{ width: '300px', border: '1px solid #ddd', height: '50px', margin: '15px 0', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '50px', overflow: 'hidden', height: '100%' }}>
                        <img src={this.state.productPic && handlePicUrl(this.state.productPic)} style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '18px', width: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{this.state.productName}</div>
                    </div>
                  </Col>
                }
                {this.state.checkGoodsSkuList && this.state.checkGoodsSkuList.length > 0 &&
                  <div style={{width:'100%'}}>
                    { (type != '1') && 
                    <Col span={20} offset={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <ul style={{ display: 'flex' }}>
                      { mergeTypeStatus == 1 && 
                          <li>
                          新人价:&emsp;<Input style={{ width: '200px',marginRight:'30px' }} onChange={(e) => this.onChangeFirstPersonPrice(e)} />
                          </li>
                      }
                      { mergeTypeStatus==2 && 
                          <li>
                          邀新价:&emsp;<Input style={{ width: '200px',marginRight:'30px' }} onChange={(e) => this.onChangeFirstPersonPrice(e)} />
                          </li>
                      }
                        <li>
                          拼团价:&emsp;<Input style={{ width: '200px' }} onChange={(e) => this.onChangeMergePrice(e)} />
                        </li>
                        <li style={{ marginLeft: '30px' }}>
                          返积分:&emsp;<Input value={this.state.mergeLevelRate} style={{ width: '200px' }} onChange={(e) => this.onChangeCoupon(e)} max={20} type='number' />&nbsp;%
                        </li>
                      </ul>
                      <Button type='primary' onClick={this.easyShuttle}>批量设置</Button>
                    </Col>}
                    <Col span={20} offset={2} style={{ marginTop: '20px' }}>
                      <Table
                        rowKey={record => record.skuId}
                        rowSelection={ type != '1' ? rowSelection : null}
                        loading={this.state.skusLoading}
                        bordered={true}
                        pagination={false}
                        columns={this.showColumn() == 1 ? this.skuColumns: this.showColumn() == 2 ? this.skuLimitColumns : this.showColumn() == 3 ? this.newSkuColumns: this.showColumn() == 4 ? this.newSkuLimitColumns : this.showColumn() == 5 ? this.inviteSkuColumns : this.newInviteSkuColumns}
                        dataSource={this.state.checkGoodsSkuList}
                      />
                    </Col>
                  </div>
                }
                {/* sku类别 */}
                { this.state.checkGoodsSkuList && this.state.checkGoodsSkuList.length > 0 && limitType == 3 &&
                <Col span={20} offset={2} style={{ display: 'flex' }}>
                  <FormItem 
                    label="只允许购买以上1种sku类别:" 
                    name="isManySku"
                    style={{ margin: '5px 10px',fontSize: '20px' }}
                  >
                    <Radio.Group buttonStyle="solid" onChange={this.skuTypeChange} disabled={ type == '1'}>
                      <Radio.Button value={true}>是</Radio.Button>
                      <Radio.Button value={false}>否</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Col>
                }
                { this.state.limitType == 3 && this.state.isManySku == false &&
                <Col span={20} offset={2} style={{ display: 'flex' }}>
                  <FormItem 
                    label="以上sku总限购件数：" 
                    name="totalLimitNumber"
                    style={{ margin: '5px 10px',fontSize: '20px' }}
                  >
                    <Input onChange={(e) => this.totalLimitNumChange(e)} disabled={ type == '1' } />
                  </FormItem>
                </Col>
                }
                { this.state.checkGoodsSkuList && this.state.checkGoodsSkuList.length > 0 && limitType == 2 && 
                <Col span={20} offset={2} style={{ display: 'flex' }}>
                  <FormItem 
                    label="总限购数：" 
                    name="totalLimitNumber"
                    style={{ margin: '5px 10px',fontSize: '20px' }}
                  >
                    <Input onChange={(e) => this.totalLimitNumChange(e)} disabled={ type == '1' }/>
                  </FormItem>
                </Col>
                }
                {this.state.checkGoodsSkuList && this.state.checkGoodsSkuList.length > 0 && limitType == 2 && 
                <Col span={20} offset={2} style={{ display: 'flex' }}>
                  <FormItem 
                    label="限购时间:" 
                    name="spuLimitDateType"
                    style={{ margin: '5px 10px',fontSize: '20px' }}
                  >
                    <Radio.Group buttonStyle="solid" onChange={this.spuLimitDateTypeChange} disabled={ type == '1'}>
                      <Radio value={1}>每天</Radio>
                      <Radio value={2}>永久</Radio>
                    </Radio.Group>
                  </FormItem>
                </Col>
                }
              </Row>
              <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%',marginBottom:"20px"}}>
                { !mergeTypeStatus && 
                <Col span={20} offset={2} style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', }}>
                    <div style={{ fontSize: '14px', marginRight: '20px',color:'#333' }}>优惠劵:</div>
                    <div>
                      { type != "1" && <Button type="primary" onClick={this.checkCoupon}>选择优惠劵</Button>}
                      {this.state.selectedCpsList && this.state.selectedCpsList.length > 0 && <div>
                        <ul style={{marginTop:'15px'}}>
                          {
                            this.state.selectedCpsList && this.state.selectedCpsList.length > 0 && this.state.selectedCpsList.map((items, index) => {
                              return <li style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }} key={index}>
                                <CouponList data={items} deleCps={this.deleCps} type={type} idx={index}></CouponList>
                              </li>
                            })
                          }
                        </ul>
                      </div>}
                    </div>
                  </div>
                </Col>
                }
                {/* 赠品 */}
                <Col span={20} offset={2} style={{paddingTop: '20px',}}>
                  <div style={{ display: 'flex', }}>
                    <div style={{ fontSize: '14px', marginRight: '20px',color:'#333' }}>赠&emsp;品:</div>
                    <div>
                      { type!='1' && <Button type="primary" onClick={this.checkGift}>选择赠品</Button>}
                      {checkGiftSkus && checkGiftSkus.length > 0 &&
                        <div>
                          <ul style={{ margin: '15px 0' }}>
                            <li style={{ margin: '5px 0' }}>
                              <Table
                                rowKey={record => record.skuId}
                                columns={ this.giftTableColumns}
                                dataSource={checkGiftSkus}
                                pagination={false}
                                bordered
                              />
                            </li>
                          </ul>
                        </div>
                      }
                      <div>
                        <Select placeholder="选择赠品可选个数" value={this.state.giftNum} onChange={this.handleChange} style={{ width: 130, margin: '10px 0' }} disabled={ type == '1'}>
                          {
                            new Array(checkGiftSkus.length).fill(1).map((_:any, i:number)=> <Option value={i+1} key={`可选赠品${i+1}个`}>可选赠品{i+1}个</Option>)
                          }
                        </Select>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Divider dashed />
              <Row style={{width:'100%'}}>
                { type!='1' && 
                <Col span={24} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                  <Button onClick={() => this.cancleAsb()} type='primary'>取消</Button>
                  <Button onClick={() => this.handleSubmit()} type='primary' style={{ marginLeft: '20px' }} loading={this.state.asbLoading}>确定</Button>
                </Col>}
                { type=='1' &&
                <Col span={24} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                  <Button onClick={() => this.cancleAsb()} type='primary'>返回</Button>
                </Col>}
              </Row>
            </Form>
        </Card>
        {/* 选择商品 */}
        <Modal
          title="选择商品"
          visible={this.state.goodsVisible}
          width={800}
          onCancel={() => this.setState({ goodsVisible: false })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form {...goodsFormItemLayout} ref={this.goodsModalFormRef}>
              <Row>
                <Col span={8}>
                  <FormItem label="商品名称: " name="productName">
                    <Input />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="商品ID: " name="productId" >
                    <Input />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="商品编码: " name="outerId">
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Button type='primary' onClick={this.getGoodsList} style={{ margin: '5px 0' }}>搜索</Button >
          </div>
          <Table
            rowKey={record => record.productId}
            columns={this.goodsColumns}
            dataSource={this.state.goodsDataList}
            onChange={this.onGoodsTableChange}
            pagination={goodsPagination}
            loading={this.state.goodsLoading}
          />
        </Modal>

        {/* 选择商品sku */}
        <Modal
          title="选择商品单品"
          visible={this.state.goodsSkuVisible}
          onOk={this.handleCheckGoodSkuOk}
          width={900}
          onCancel={() => this.setState({ goodsSkuVisible: false })}
        >
          <Table
            rowKey={record => record.skuId}
            rowSelection={goodsSkuSelection}
            columns={this.goodsSkuColumns}
            dataSource={this.state.goodsSkuList}
          />
        </Modal>
        
        {/* 添加优惠券 */}
        <Modal
          title="选择优惠卷"
          visible={this.state.couponVisible}
          onOk={this.handleCpsOk}
          width={800}
          onCancel={() => this.setState({ couponVisible: false })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form {...goodsFormItemLayout} ref={this.couponModalFormRef}>
              <Row>
                <Col span={9}>
                  <FormItem label="优惠券名称： " name="couponName" style={{ margin: '5px 20px' }}>
                    <Input />
                  </FormItem>
                </Col>
                <Col span={10} style={{ marginLeft: '30px' }}>
                  <FormItem label="优惠券面额： " name="offPrice" style={{ margin: '5px 20px' }}>
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Button type='primary' onClick={this.getCouponsList} >搜索</Button>
          </div>
          <Table
            rowKey={record => record.couponId}
            columns={this.couponsColumns}
            dataSource={this.state.couponsDataList}
            pagination={couponsPagination}
            onChange={this.onCouponsTableChange}
            rowSelection={couponsRowSelection}
            loading={this.state.cpsLoading}
          />
        </Modal>

        {/* 添加赠品 */}
        <Modal
          title="选择赠品"
          visible={this.state.giftVisible}
          // onOk={this.handleOk}
          width={900}
          footer={null}
          onCancel={() => this.setState({ giftVisible: false })}
        >
          <div style={{ display: 'flex' }}>
            <Form {...goodsFormItemLayout} ref={this.giftsModalFormRef}>
              <Row>
                <Col span={9}>
                  <FormItem label="赠品名称： " name="productName" style={{ margin: '5px 20px' }}>
                    <Input />
                  </FormItem>
                </Col>
                <Col span={10}>
                  <FormItem label="赠品ID： " name="productId" style={{ margin: '5px 20px' }}>
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Button type='primary' onClick={this.getGiftList}>搜索</Button>
          </div>
          <Table
            loading={this.state.giftLoading}
            rowKey={record => record.productId}
            columns={this.giftColumns}
            dataSource={this.state.giftDataList}
            pagination={giftPagination}
            onChange={this.onGiftTableChange}
          />
        </Modal>

        {/* 选择Sku */}
        <Modal
          title="选择赠品sku"
          visible={this.state.giftSkuVisible}
          onOk={this.giftOkSave}
          width={600}
          onCancel={() => this.setState({ giftSkuVisible: false })}
        >
          <Table
            loading={giftSkusLoading}
            rowKey={record => record.skuId}
            columns={this.giftSkusColumns}
            dataSource={giftSkusDataList}
            pagination={giftPaginationsku}
            rowSelection={giftSkusRow}
            onChange={this.onGiftSkuTableChange}
          />
        </Modal>
      </PageHeaderWrapper>
    )
  }
}