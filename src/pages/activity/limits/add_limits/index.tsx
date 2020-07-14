import React, { Component } from 'react';
import { Table, Input, Button, Form, Card, message, Row, Col, Modal,  Divider, Radio, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  watchLimitsItemDetail,
  goodsListParams,
  getGoodsList,
  getGoodsSkuList,
  addLimitsItemParams,
  addLimitsItem,
} from '@/services/activity/limits';
import { handlePicUrl } from '@/utils/utils';
const FormItem = Form.Item;
interface UserState {
  loading: boolean,
  skusLoading: boolean,
  goodsLoading: boolean,
  asbLoading: boolean,// 提交loading
  goodsVisible: boolean,
  goodsSkuVisible: boolean,
  productId: string,
  productName: string,
  productPic: string,
  originalPrice: string | number,
  stocks: string | number,
  limitsId: string;
  limitType: number | string,//限购类型
  limitUserType: number | string,
  isManySku: number | string,
  totalLimitNumber:number | string,
  couponDatasource: Array<any>,
  goodsPage: {
    pageSize: number,
    pageNum: number,
    total: number,
  },
  selectedGoodsSkusRows: Array<any>,
  goodsSkusRowKey: Array<any>,
  noLimitGoodsList: Array<any>,//不限购List 
  spuLimitGoodsList: Array<any>, //spu限购List 
  skuLimitGoodsList: Array<any>, //sku限购List 
  goodsSkuList: Array<any>,
  goodsDataList: Array<any>,
  
}
interface UserProp {
  history: any;
  match: any;
}
export default class addLimits extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  goodsFormRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.goodsFormRef = React.createRef();
    this.state = {
      loading: false,
      skusLoading: false,
      goodsLoading: false,
      asbLoading: false,// 提交loading
      goodsVisible: false,
      goodsSkuVisible: false,
      limitsId: this.props.match.params.id,
      goodsPage: {
        pageSize: 5,
        pageNum: 0,
        total: 0,
      },
      productId:'',
      productName: '',
      productPic: '',
      originalPrice: 0,
      stocks: 0,
      limitType:'1',//限购类型
      isManySku: 1,
      limitUserType: '2',
      totalLimitNumber:0,
      couponDatasource: [],
      selectedGoodsSkusRows: [],
      goodsSkusRowKey: [],
      noLimitGoodsList: [],//不限购List
      spuLimitGoodsList: [], //spu限购List
      skuLimitGoodsList: [],  //sku限购list
      goodsSkuList: [],
      goodsDataList: [],
      
    };
  }
  componentDidMount() {
    // 回显    
    this.state.limitsId && this.getDetailInfo();
  }
  // 获取详情页数据
  getDetailInfo = async (): Promise<false | void> => {
    let { limitsId: id } = this.state;
    let res = await watchLimitsItemDetail( id );
    if (!res) return false;
    let { marketingProductVOS,limitUserType,limitType,isManySku,limitNumber,productId } = res.data;
    this.setState({ 
      loading: false, 
      productId, 
      limitType: limitType=='1'?'1':limitType=='2'?"2":"3",
      limitUserType: limitUserType=='1'?'1':"2",
    })
    this.formRef.current.setFieldsValue({
      limitUserType: limitUserType=='1'?'1':"2",
      limitType: limitType=='1'?'1':limitType=='2'?"2":"3",
    })
    if(limitType=='1'){
      this.setState({
        noLimitGoodsList: marketingProductVOS.map((v:any,i:number)=>{
          return{
            ...v,
            key:i,
            pic: v.productPic,
            name: v.productName,
          }
        }),
      })
    }
    if(limitType=='2'){
      this.setState({
        spuLimitGoodsList: marketingProductVOS.map((v:any,i:number)=>{
          return{
            ...v,
            key: i,
            pic: v.productPic,
            name: v.productName,
            stocks: v.stock
          }
        }),
      })
    }
    if(limitType=='3'){
      this.setState({
        isManySku: isManySku == true ? 1 : 0,
        totalLimitNumber:limitNumber,
      })
      this.formRef.current.setFieldsValue({
        totalLimitNumber:limitNumber,
      })
      this.setState({
        skuLimitGoodsList: marketingProductVOS.map((v:any,i:number)=>({
          ...v,
          key: i,
          pic: v.productPic,
          name: v.productName,
          stocks: v.stock,
        }))
      })
    }
  };
  /* ---------------------------------------------------- sku模块 ---------------------------------------------------- */
  // 不限购noLimitColumns
  noLimitColumns = [
    {
      title: '商品图片',
      dataIndex: 'pic',
      render: (text:string) => (

        text ? <img src={text && handlePicUrl(text)} style={{ width: '60px' }} /> : '暂无图片'
      )
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200,
      render: (text:string) => <>
        <div style={{ width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
      width: 100,
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
  ]
  //spu限购spuLimitColumns
  spuLimitColumns = [
    {
      title: '商品图片',
      dataIndex: 'pic',
      render: (text:string) => (
        text ? <img src={text && handlePicUrl(text)} style={{ width: '60px' }} /> : '暂无图片'
      )
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      render: (text:string) => <>
        <div style={{ width: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }}>{text}</div>
      </>
    },
    {
      title: '销售价',
      dataIndex: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '限购数量',
      width: 100,
      dataIndex: 'limitNumber',
      render: (text:string, record:any, index:number) => {
        return(
          <Input value={text} type="number" onChange={(e) => this.changeLimitNumber(e, index, record)} disabled={this.state.limitsId?true:false} />
        )
      }
    },
    {
      title: '限制时间',
      dataIndex: 'limitDateType',
      render: (text:string, record:any, index:number) => {
        return(
          <Radio.Group value={text} onChange={(e) => this.changeLimitDateType(e, index, record)} disabled={this.state.limitsId?true:false}>
            <Radio value={1}>每天</Radio>
            <Radio value={2}>永久</Radio>
          </Radio.Group>
        )
      }
    },
  ]
  //sku限购skuLimitColumns
  skuLimitColumns = [
    {
      title: '单品图片',
      dataIndex: 'pic',
      render: (text:string) => (
        text ? <img src={text && handlePicUrl(text)} style={{ width: '60px' }} /> : '暂无图片'
      )
    },
    {
      title: '单品ID',
      dataIndex: 'skuId',
    },
    {
      title: '单品名称',
      dataIndex: 'name',
      render: (text:string) => <>
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
      title: '单个限购数量',
      width: 100,
      dataIndex: 'limitNumber',
      render: (text:string, record:any, index:number) => {
        return(
          <Input value={text} type="number" onChange={(e) => this.changeLimitNumber(e, index, record)} disabled={this.state.limitsId?true:false} />
        )
      }
    },
    {
      title: '限制时间',
      dataIndex: 'limitDateType',
      render: (text:string, record:any, index:number) => {
        return(
          <Radio.Group value={text} onChange={(e) => this.changeLimitDateType(e, index, record)} disabled={this.state.limitsId?true:false}>
            <Radio value={1}>每天</Radio>
            <Radio value={2}>永久</Radio>
          </Radio.Group>
        )
      }
    },
  ]
  //设置限购数量
  changeLimitNumber= (e:any, index:number, record:any) => {
    let {spuLimitGoodsList, skuLimitGoodsList } = this.state;
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    if(this.state.limitType==2){
      spuLimitGoodsList[index].limitNumber = value;
    }
    if(this.state.limitType==3){
      skuLimitGoodsList[index].limitNumber = value;
    }
    this.setState({ spuLimitGoodsList,skuLimitGoodsList })
  }
  //设置限制时间----radio选择
  changeLimitDateType= (e:any, index:number, record:any) => {
    let value = e.target.value;
    let {spuLimitGoodsList, skuLimitGoodsList } = this.state;
    if(this.state.limitType==2){
      spuLimitGoodsList[index].limitDateType = value;
    }
    if(this.state.limitType==3){
      skuLimitGoodsList[index].limitDateType = value;
    }
    this.setState({spuLimitGoodsList, skuLimitGoodsList })
  };
  /* ---------------------------------------------------- 选择商品模块 ---------------------------------------------------- */
  // 切换分页
  onGoodsTableChange = ({ current, pageSize }:any) => {
    Object.assign(this.state.goodsPage, { pageNum: current, pageSize: pageSize })
    this.getGoodsList()
  }
  // ---------------------------------------- sku
  // SKUMODAL 配置
  goodsSkuColumns = [
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
  // onGoodsSkuSelectChange 选择skurow
  onGoodsSkuSelectChange = (selectedRowKeys:Array<any>, selectedRows:Array<any>) => {
    this.setState({ selectedGoodsSkusRows: selectedRows, goodsSkusRowKey: selectedRowKeys })
  }
  // sku点击确定
  handleCheckGoodSkuOk = () => {
    let { selectedGoodsSkusRows = [] } = this.state;
    let skuLimitGoodsList = selectedGoodsSkusRows || [];
    let newSkuLimitGoodsList = skuLimitGoodsList.map(item => {
      return {
        ...item,
        limitNumber: 0,
        limitDateType: 1,
      }
    })
    this.setState({ skuLimitGoodsList: newSkuLimitGoodsList, goodsSkuVisible: false })
  }
  // 商品table-columns
  goodsColumns: Array<any> = [
    {
      title: '商品图片',
      dataIndex: 'productPic',
      render: (text:number) => (
        text ? <img src={text && handlePicUrl(text)} style={{ width: '60px' }} /> : '暂无图片'
      )
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      ellipsis: 'true',
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
    },
    {
      title: '销售价',
      dataIndex: 'originalPrice',
    },
    {
      title: '库存',
      dataIndex: 'stocks',
    },
    {
      title: '操作',
      render: (record:any) => <>
        <Button type='primary' style={{ marginRight: '10px' }} onClick={() => this.selectGoods(record)}>选择</Button>
      </>
    }
  ]
  // 点击商品选择
  selectGoods = (data:any) => {
    let { productId, productName, productPic, originalPrice, stocks } = data;
    //不限购
    if(this.state.limitType == 1){
      let noLimitGoodsList = [{
        key: 1,
        'pic':productPic,
        'productId':productId,
        'name':productName,
        'price':originalPrice,
        'stock':stocks,
      }]
      this.setState({noLimitGoodsList,productId, productName, productPic,originalPrice, stocks })
    }
    //spu限购
    if(this.state.limitType == 2){
      let spuLimitGoodsList = [{
        key: 1,
        'pic':productPic,
        'productId':productId,
        'name':productName,
        'price':originalPrice,
        'stock':stocks,
        'limitNumber':"",
        'limitDateType': 1,
      }]
      this.setState({spuLimitGoodsList,productId, productName, productPic,originalPrice, stocks })
    }
    //sku限购
    if(this.state.limitType == 3){
      this.getGoodsSku(productId)
      this.setState({ productId, productName, productPic,originalPrice, stocks, goodsSkuVisible: true })
    }
    this.setState({ goodsVisible: false})
  }
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
      goodsSkuList,
    });
  }
  // 点击‘选择商品’ --- 获取商品数据 
  checkGoods = () => {
    this.setState({ goodsVisible: true },()=>{
      setTimeout(() => {
        this.getGoodsList();
      }, 200);
    });
  }
  // 获取商品list数据
  getGoodsList = async(): Promise<any> => {
    this.setState({ goodsLoading: true })
    let { productName='', productId='', outerId='' } = this.goodsFormRef.current.getFieldsValue();
    let query: goodsListParams = {
      page: this.state.goodsPage.pageNum,
      size: this.state.goodsPage.pageSize,
      status: 1,
      productId,
      productName,
      outerId,
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
  //修改用户类型
  onChangeUserType = (e:any) => {
    this.formRef.current.setFieldsValue({
      limitUserType: e.target.value
    })
  };
  //限购种类----radio选择
  limitTypeChange = (e:any) => {
    this.setState({
      limitType: e.target.value
    })
  };
  //限购一种sku类别----radio选择
  skuTypeChange = (e:any) => {
    this.setState({
      isManySku: e.target.value
    })
  };
  //此spu下所有sku总限购件数
  totalLimitNumChange = (e:any) => {
    let value = e.target.value;
    if (value < 0) {
      value = 0
    }
    this.setState({
      totalLimitNumber: value
    })
  };
  // 取消
  cancleAsb = () => {
    this.props.history.goBack()
  }
  // 确定
  handleSubmit = () => {
    this.formRef.current
      .validateFields()
      .then(( values:any ):any => {
        let { limitUserType, limitType, isManySku, totalLimitNumber } = values;
        let { productId, productName, productPic,originalPrice, stocks,noLimitGoodsList,spuLimitGoodsList,skuLimitGoodsList } = this.state;
        productPic = productPic && productPic.split(',')[0];
        if(limitType == '1'){
          if(!noLimitGoodsList.length)return message.warn('请选择商品');
        }
        if(limitType == '2'){
          if(!spuLimitGoodsList.length)return message.warn('请选择商品');
          if(spuLimitGoodsList.filter(v=> +v.limitNumber<=0).length)return message.warn('请输入限购个数')
        }
        if(limitType == '3'){
          if(!skuLimitGoodsList.length)return message.warn('请选择商品');
          if( isManySku == 0 && +totalLimitNumber<=0)return message.warn('请输入限制总数');
          if(skuLimitGoodsList.filter(v=> +v.limitNumber<=0).length)return message.warn('请输入限购个数')
        }
        //公共请求参数
        let query: addLimitsItemParams = {
          productId,                        // 商品id
          limitUserType: limitUserType,    //用户人群
          limitType: limitType,            //限购种类
          marketingProductForms: [],
          isManySku: '',         //多sku
          limitNumber: '',       //多sku
        };
        if(limitType == '1'){
          query.marketingProductForms = noLimitGoodsList.map((v: any)=>({
            productId,
            productName,
            productPic,
            stock:stocks,
            price:originalPrice
          }))
        }
        if(limitType == '2'){
          let limitNumber2
          query.marketingProductForms = spuLimitGoodsList.map((v: any)=>{
            limitNumber2 = v.limitNumber || ''
            return {
              productId,
              productName,
              productPic,
              stock:stocks,
              price:originalPrice,
              limitNumber: v.limitNumber,//限购数量
              limitDateType: v.limitDateType,//限购时间
            }
          })
        }
        if(limitType == '3'){
          query.isManySku = isManySku          //是否允许购买多sku
          query.limitNumber = parseInt(totalLimitNumber) //限购总数
          query.marketingProductForms = skuLimitGoodsList.map((v: any)=>{
            return {
              productId,
              productName,
              productPic:productPic.split(',')[0],
              skuId: v.skuId,
              price: v.price,
              stock: v.stock,
              limitDateType: v.limitDateType,//限购时间
              limitNumber: parseInt(v.limitNumber)//限购数量
            }
          })
        }
        this.saveCommitAssemble(query)
      })
      .catch((err: Error) => {});
  }
  // 上传接口
  saveCommitAssemble = async (query: addLimitsItemParams) => {
    await addLimitsItem(query);
    this.props.history.push('/activity/limits')
  }
  
  render() {
    const { goodsPage, goodsLoading, goodsDataList, goodsSkusRowKey,goodsVisible, goodsSkuVisible, noLimitGoodsList, skuLimitGoodsList, spuLimitGoodsList, limitType, limitsId, isManySku, skusLoading, asbLoading} = this.state;
    // 商品 
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
    const goodsSkuSelection = {
      selectedRowKeys: goodsSkusRowKey,
      onChange: this.onGoodsSkuSelectChange,
    }
    // 商品分页配置
    const goodsPagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: goodsPage.pageNum,
      pageSize: goodsPage.pageSize || 10,
      total: goodsPage.total,
      showTotal: (t: number) => <div>共{t}条</div>
    };

    return (
      <PageHeaderWrapper>
        <Card>
          <Form 
          ref={this.formRef}
          initialValues={{
            limitUserType: '2',
            limitType: '1',
            isManySku:1,
            totalLimitNumber: '0'
          }}
          >
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col md={2} sm={2}></Col>
              <Col md={20} sm={20}>
                <FormItem
                  label="用户人群："
                  name="limitUserType"
                >
                  <Radio.Group buttonStyle="solid" onChange={this.onChangeUserType} disabled={limitsId?true:false} >
                    <Radio.Button value='1'>企业用户</Radio.Button>
                    <Radio.Button value='2'>所有人</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col md={2} sm={2}></Col>
              <Col md={20} sm={20}>
                <FormItem label="限购种类：" name="limitType">
                  <Radio.Group buttonStyle="solid" onChange={this.limitTypeChange} disabled={limitsId?true:false}>
                    <Radio.Button value='1'>不限购数量</Radio.Button>
                    <Radio.Button value='2'>spu限购</Radio.Button>
                    <Radio.Button value='3'>sku限购</Radio.Button>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col span={20} offset={2} style={{  paddingTop: '20px', display: 'flex' }}>
              <div style={{ fontSize: '14px', marginRight: '20px',color:'#333' }}><span style={{ marginRight: '4px', color: '#f5222d', fontSize: '14px', fontFamily: 'SimSun, sans-serif' }}>*</span>
                商&nbsp; 品:
              </div> {!limitsId && <Button type="primary" onClick={this.checkGoods}>选择商品</Button>}
              </Col>
            </Row>
              <Row>
                <Col span={20} offset={2} style={{ marginTop: '20px' }}>
                  <Table
                    loading={skusLoading}
                    bordered={true}
                    pagination={false}
                    columns={limitType == '1'? this.noLimitColumns : limitType == '2'? this.spuLimitColumns : this.skuLimitColumns}
                    dataSource={limitType == '1'? noLimitGoodsList : limitType == '2'? spuLimitGoodsList :skuLimitGoodsList }
                  />
                </Col>
              </Row>
              {/* sku类别 */}
              { skuLimitGoodsList && skuLimitGoodsList.length > 0 && limitType == '3' &&
              <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="只允许购买以上1种sku类别："
                    name="isManySku"
                    style={{ margin: '20px 0',fontSize: '20px' }}
                  >
                    <Radio.Group buttonStyle="solid" onChange={this.skuTypeChange} disabled={limitsId?true:false}>
                      <Radio.Button value={1}>是</Radio.Button>
                      <Radio.Button value={0}>否</Radio.Button>
                    </Radio.Group>
                  </FormItem>
                </Col>
              </Row>
              }
              { limitType == '3' && isManySku == '0' &&
              <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
                <Col span={20} offset={2}>
                  <FormItem
                    label="以上sku总限购件数："
                    name="totalLimitNumber"
                    style={{ margin: '20px 0',fontSize: '20px' }}
                  >
                      <Input type="number" onChange={(e) => this.totalLimitNumChange(e)} disabled={limitsId?true:false} style={{width:'100px'}} />
                  </FormItem>
                </Col>
              </Row>
              }
            <Divider dashed />
            <Row>
              {!limitsId && <Col span={24} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                <Button onClick={() => this.cancleAsb()} type='primary'>取消</Button>
                <Button onClick={() => this.handleSubmit()} type='primary' style={{ marginLeft: '20px' }} loading={asbLoading}>确定</Button>
              </Col>}
              {limitsId && <Col span={24} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                <Button onClick={() => this.cancleAsb()} type='primary'>返回</Button>
              </Col>}
            </Row>
          </Form>
        </Card>
        {/* 选择商品 */}
        <Modal
          title="选择商品"
          visible={ goodsVisible }
          width={800}
          onCancel={() => this.setState({ goodsVisible: false })}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form {...goodsFormItemLayout} ref={this.goodsFormRef}>
              <Row>
                <Col span={8}>
                  <FormItem label="商品名称：" name="productName">
                    <Input />
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="商品ID：" name="productId">
                    <Input />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="商品编码：" name="outerId">
                    <Input />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Button type='primary' onClick={this.getGoodsList} style={{ margin: '5px 0' }}>搜索</Button>
          </div>
          <Table
            rowKey={record => record.productId}
            columns={this.goodsColumns}
            dataSource={ goodsDataList }
            onChange={this.onGoodsTableChange}
            pagination={goodsPagination}
            loading={ goodsLoading }
          />
        </Modal>

        <Modal
          title="选择商品单品"
          visible={ goodsSkuVisible }
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
      </PageHeaderWrapper>
    );
  }
}
