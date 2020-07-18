import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Table, Select, Button, Popconfirm} from 'antd';
import {
  assembleListParams,
  GetAssembleList,
  onLineAssemble,
  offOrDelAssemble,
} from '@/services/activity/assemble';
import { handlePicUrl, getPageQuery, saveUrlParams } from '@/utils/utils';
interface UserState {
  searchUrl: any,
  loading: boolean,
  onlineLoading: boolean,
  pageNum: number,
  pageSize: number,
  total: number,
  currentTab: any,
  mergeType: string | number,
  dataSource: Array<any>,
};
const FormItem = Form.Item;
const { Option } = Select;
const moreStatus =['无','有']
const tabList = [
  { key: '1', tab: '上线中' },
  { key: '2', tab: '待发布' },
  { key: '-1', tab: '已下线' },
  { key: '-3', tab: '已过期' },
  { key: '3', tab: '已删除' },
]
interface UserProp {
  history: any;
  location: any;
};
export default class preSale extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    let searchUrl = getPageQuery();
    this.state = {
      searchUrl,
      loading: false,
      onlineLoading: false,
      pageNum: searchUrl.pageNum ? +searchUrl.pageNum : 1,
      pageSize: searchUrl.pageSize ? +searchUrl.pageSize : 10,
      total: 0,
      currentTab: searchUrl.key || '1',
      mergeType: '',
      dataSource: []
    };
  }
  columns:Array<any> = [
    {
      title: '活动名称',
      dataIndex: 'mergeName',
    },
    {
      title: '商品信息',
      render: (record:any) => <>
      <div style={{display:'flex',alignItems:'center'}}>
        {record.productPic ? <img src={record.productPic && handlePicUrl(record.productPic)} width='50' height='60' /> : "暂无图片"}
        <ul style={{flex:'1',marginLeft:'10px'}}>
          <li >{record.productName}</li>
          <li>{record.prodId}</li>
        </ul>
      </div>
      </>
    },
    {
      title: '拼团类型',
      width:100,
      dataIndex: 'mergeType',
      render:(text:any) => text == 1 ? '新人团' : text == 2 ? '邀新团' : '普通团'
    },
    {
      title: '原价',
      width:100,
      dataIndex: 'presentPrice',
    },
    
    {
      title: '团购价',
      width:100,
      dataIndex: 'minPrice',
    },
    {
      title: '用户类型',
      width:100,
      dataIndex: 'limitUserType',
      render:(text:any) => text == 1 ? '企业用户' : text == 2 ? '所有人' : '/'
    },
    {
      title: '限购种类',
      width:100,
      dataIndex: 'limitType',
      render:(text:any) => text == 1 ? '不限购' : text == 2 ? 'spu限购' : text == 3 ? 'sku限购' : '/'
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '附加优惠',
      width:100,
      render:(record:any)=><>
      <p>{moreStatus[record.integerStatus]}积分</p>
      <p>{moreStatus[record.giftStatus]}赠品</p>
      <p>{moreStatus[record.couponStatus]}优惠券</p>
      </>
    },
    {
      title: '活动时间',
      width:110,
      render:(record:any)=> <>
        <div>{record.startTime}</div>
        <div>{record.endTime}</div>
      </>
    },
    {
      title: '活动状态',
      dataIndex: 'statusText',
      width:100,
    },
    {
      title: '操作',
      width: 100,
      render: (record:any) => <>
        {/* 未开始2 */}
        {
          record.status == '2'  && <div>
            <Popconfirm
              title="是否对该活动进行上线操作?"
              onConfirm={() => this.handleOnline(record,1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}  loading={this.state.onlineLoading}>上线</Button>
            </Popconfirm>
            <a href={this.handleEdit(record.id,0,record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>编辑</Button></a>
            <a href={this.handleCopy(record.id,2,record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>复制模版</Button></a>
            <Popconfirm
              title="是否删除该活动?"
              onConfirm={() => this.handleOffOrDel(record,3)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='danger' style={{ marginRight: '10px',marginBottom:'5px' }} >删除</Button>
            </Popconfirm>
          </div>
        }
        {/* 上线1 */}
        {
          record.status == "1"   && <div>
            <a href={this.handleGoPage(record.id,1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
            <Popconfirm
              title="是否对该活动进行下线操作?"
              onConfirm={() => this.handleOffOrDel(record,-1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }} >下线</Button>
            </Popconfirm>
          </div>
        }
        {/* 过期-3 */}
        {
          record.status == "-3"   && <div>
            <a href={this.handleGoPage(record.id,1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
          </div>
        }
        {/* 下线-1 */}
        {
          record.status == "-1"   && <div>
            <a href={this.handleGoPage(record.id,1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
            <a href={this.handleCopy(record.id,2,record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>复制模版</Button></a>
          </div>
        }
        {
          record.status == "3"   && <div>
            活动已删除
          </div>
        }
      </>
    }
  ]
  newColumns:Array<any> = [
    {
      title: '活动名称',
      dataIndex: 'mergeName',
    },
    {
      title: '商品信息',
      render: (record:any) => <>
      <div style={{display:'flex',alignItems:'center'}}>
        {record.productPic ? <img src={record.productPic && handlePicUrl(record.productPic)} width='50' height='60' /> : "暂无图片"}
        <ul style={{flex:'1',marginLeft:'10px'}}>
          <li >{record.productName}</li>
          <li>{record.prodId}</li>
        </ul>
      </div>
      </>
    },
    {
      title: '拼团类型',
      width:100,
      dataIndex: 'mergeType',
      render:(text:any) => text == 1 ? '新人团' : text == 2 ? '邀新团' : '普通团'
    },
    {
      title: '原价',
      width:100,
      dataIndex: 'presentPrice',
    },
    
    {
      title: '团购价',
      width:100,
      dataIndex: 'minPrice',
    },
    {
      title: '新人价',
      width:100,
      dataIndex: 'minPersonPrice',
    },
    {
      title: '用户类型',
      width:100,
      dataIndex: 'limitUserType',
      render:(text:any) => text == 1 ? '企业用户' : text == 2 ? '所有人' : '/'
    },
    {
      title: '限购种类',
      width:100,
      dataIndex: 'limitType',
      render:(text:any) => text == 1 ? '不限购' : text == 2 ? 'spu限购' : text == 3 ? 'sku限购' : '/'
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '附加优惠',
      width:100,
      render:(record:any)=><>
      <p>{moreStatus[record.integerStatus]}积分</p>
      <p>{moreStatus[record.giftStatus]}赠品</p>
      <p>{moreStatus[record.couponStatus]}优惠券</p>
      </>
    },
    {
      title: '活动时间',
      width:110,
      render:(record:any)=> <>
        <div>{record.startTime}</div>
        <div>{record.endTime}</div>
      </>
    },
    {
      title: '活动状态',
      dataIndex: 'statusText',
      width:100,
    },
    {
      title: '操作',
      width: 100,
      render: (record:any) => <>
        {
          record.status == '2'  && <div>
            <Popconfirm
              title="是否对该活动进行上线操作?"
              onConfirm={() => this.handleOnline(record,1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}  loading={this.state.onlineLoading}>上线</Button>
            </Popconfirm>
            <a href={this.handleEdit(record.id,0,record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>编辑</Button></a>
            <a href={this.handleCopy(record.id,2,record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>复制模版</Button></a>
            <Popconfirm
              title="是否删除该活动?"
              onConfirm={() => this.handleOffOrDel(record,3)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='danger' style={{ marginRight: '10px',marginBottom:'5px' }} >删除</Button>
            </Popconfirm>
          </div>
        }
        {
          record.status == "1"   && <div>
            <a href={this.handleGoPage(record.id,1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
            <Popconfirm
              title="是否对该活动进行下线操作?"
              onConfirm={() => this.handleOffOrDel(record,-1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }} >下线</Button>
            </Popconfirm>
          </div>
        }
        {
          record.status == "-3"   && <div>
            <a href={this.handleGoPage(record.id,1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
          </div>
        }
        {
          record.status == "-1"   && <div>
            <a href={this.handleGoPage(record.id,1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
            <a href={this.handleCopy(record.id,2,record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>复制模版</Button></a>
          </div>
        }
        {
          record.status == "3"   && <div>
            活动已删除
          </div>
        }
      </>
    }
  ]
  inviteColumns:Array<any> = [
    {
      title: '活动名称',
      dataIndex: 'mergeName',
    },
    {
      title: '商品信息',
      render: (record:any) => <>
      <div style={{display:'flex',alignItems:'center'}}>
        {record.productPic ? <img src={record.productPic && handlePicUrl(record.productPic)} width='50' height='60' /> : "暂无图片"}
        <ul style={{flex:'1',marginLeft:'10px'}}>
          <li >{record.productName}</li>
          <li>{record.prodId}</li>
        </ul>
      </div>
      </>
    },
    {
      title: '拼团类型',
      width:100,
      dataIndex: 'mergeType',
      render:(text:any) => text == 1 ? '新人团' : text == 2 ? '邀新团' : '普通团'
    },
    {
      title: '原价',
      width:100,
      dataIndex: 'presentPrice',
    },
    
    {
      title: '团购价',
      width:100,
      dataIndex: 'minPrice',
    },
    {
      title: '邀新团价',
      width:100,
      dataIndex: 'minPersonPrice',
    },
    {
      title: '用户类型',
      width:100,
      dataIndex: 'limitUserType',
      render:(text:any) => text == 1 ? '企业用户' : text == 2 ? '所有人' : '/'
    },
    {
      title: '限购种类',
      width:100,
      dataIndex: 'limitType',
      render:(text:any) => text == 1 ? '不限购' : text == 2 ? 'spu限购' : text == 3 ? 'sku限购' : '/'
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '附加优惠',
      width:100,
      render:(record:any)=><>
      <p>{moreStatus[record.integerStatus]}积分</p>
      <p>{moreStatus[record.giftStatus]}赠品</p>
      <p>{moreStatus[record.couponStatus]}优惠券</p>
      </>
    },
    {
      title: '活动时间',
      width:110,
      render:(record:any)=> <>
        <div>{record.startTime}</div>
        <div>{record.endTime}</div>
      </>
    },
    {
      title: '活动状态',
      dataIndex: 'statusText',
      width:100,
    },
    {
      title: '操作',
      width: 100,
      render: (record:any) => <>
        {
          record.status == '2'  && <div>
            <Popconfirm
              title="是否对该活动进行上线操作?"
              onConfirm={() => this.handleOnline(record,1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}  loading={this.state.onlineLoading}>上线</Button>
            </Popconfirm>
            <a href={this.handleEdit(record.id, 0, record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>编辑</Button></a>
            <a href={this.handleCopy(record.id, 2, record.productStatus)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>复制模版</Button></a>
            <Popconfirm
              title="是否删除该活动?"
              onConfirm={() => this.handleOffOrDel(record,3)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger style={{ marginRight: '10px',marginBottom:'5px' }} >删除</Button>
            </Popconfirm>
          </div>
        }
        {
          record.status == "1"   && <div>
            <a href={this.handleGoPage( record.id, 1)}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
            <Popconfirm
              title="是否对该活动进行下线操作?"
              onConfirm={() => this.handleOffOrDel(record,-1)}
              okText="确定"
              cancelText="取消"
            >
              <Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }} >下线</Button>
            </Popconfirm>
          </div>
        }
        {
          record.status == "-3"   && <div>
            <a href={this.handleGoPage( record.id, 1 )}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
          </div>
        }
        {
          record.status == "-1"   && <div>
            <a href={this.handleGoPage( record.id, 1 )}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>查看</Button></a>
            <a href={this.handleCopy( record.id, 2, record.productStatus )}><Button type='primary' style={{ marginRight: '10px',marginBottom:'5px' }}>复制模版</Button></a>
          </div>
        }
        {
          record.status == "3"   && <div>
            活动已删除
          </div>
        }
      </>
    }
  ]
  //挂载
  componentDidMount() {
    let { mergeName='', productId='', mergeType, limitType, limitUserType } = this.state.searchUrl;
    if (productId || mergeName || mergeType || limitType || limitUserType) {
      this.formRef.current.setFieldsValue({ productId, mergeName, mergeType, limitType, limitUserType })
      this.getDataList()
    }
    if (!productId && !mergeName && !mergeType && !limitType && !limitUserType) {
      this.getDataList();
    };
  }
  // 重置
  resetForm = () => {
    this.formRef.current.resetFields();
    this.setState({
      pageNum: 1,
      pageSize: 10,
    }, () => {
      this.getDataList()
    })
  };
  // 获取拼团数据
  getDataList = async(): Promise<any> => {
    let { mergeName, productId, mergeType, limitType, limitUserType } = this.formRef.current.getFieldsValue()
    let params: assembleListParams = {
      page: this.state.pageNum,
      size: this.state.pageSize,
      sortBy: '-createTime',
      status: this.state.currentTab,
      productId,
      mergeName,
      mergeType,
      limitType,
      limitUserType,
    };
    saveUrlParams({
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      key: this.state.currentTab,
      productId: params.productId,
      mergeName: params.mergeName,
      mergeType: params.mergeType,
      limitType: params.limitType,
      limitUserType: params.limitUserType,
    })
    this.setState({ loading: true });
    let res = await GetAssembleList(params);
    this.setState({ loading: false });
    let { records, total } = res;
    let dataSource = records.map((v, i) => {
      let { status } = v;
      let statusText;
      switch (status) {
        case -3: statusText = '已过期'; break;
        case -2: statusText = '审核不通过'; break;
        case -1: statusText = '已下线'; break;
        case 0: statusText = '待审核'; break;
        case 1: statusText = '上线中'; break;
        case 2: statusText = '未开始'; break;
        case 3: statusText = '已删除'; break;
      }
      return {
        key: i,
        statusText,
        ...v
      }
    })
    this.setState({
      dataSource,
      total: total || 0,
    });
  }
  // 刷新
  refresh = () => {
    this.getDataList();
  };
  //table切换
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState(
      {
        pageSize,
        pageNum,
      },
      this.refresh,
    );
  };
  // 切换tab
  tabChange = ( type:string ) => {
    this.setState({
      currentTab: type,
      pageNum: 1    //防止出现有数据但页面为空，数据不够导致
    },()=>{
      this.resetForm()
      this.getDataList()
    })
  }
  // 编辑
  handleEdit = ( id:number|string, type:0, productStatus:number|string ) => {
    return `/#/activity/assemble/${id}/${productStatus}/add_assemble/${type}`
  }
  // 查看
  handleGoPage = ( id:number|string, type:1 ) => {
    return `/#/activity/assemble/${id}/add_assemble/${type}` 
  }
  //复制模版
  handleCopy = ( id:number|string, type:2, productStatus:number|string ) => {
    let { currentTab } = this.state
    return `/#/activity/assemble/${id}/${productStatus}/${currentTab}/add_assemble/${type}`
  }
  // 上线
  handleOnline = async(record:any,status:number|string) => {
    let { id } = record;
    await onLineAssemble({ id,status });
    this.refresh();
  }
  // 删除/下线
  handleOffOrDel = async(record:any,status:number|string) => {
    let { id } = record;
    await offOrDelAssemble({ id,status });
    this.refresh();
  }
  renderForm = () => {
    return (
      <Row >
        <Col md={20} sm={20}>
          <Form 
            layout="inline" 
            ref={this.formRef}
            initialValues={{
              mergeType: '0',
            }}
          >
            <FormItem label="活动名称" name="mergeName" style={{margin:'10px 12px 10px 0'}}>
                <Input style={{width: 200 }}/>
            </FormItem>
            <FormItem label="商品ID" name="productId" style={{margin:'10px 12px 10px 0'}}>
                <Input  style={{ width: 135 }} />
            </FormItem>
            <FormItem label="拼团类型" name="mergeType" style={{margin:'10px 12px 10px 0'}}>
                <Select style={{ width: 120 }}>
                  <Option value='0'>普通团</Option>
                  <Option value='1'>新人团</Option>
                  <Option value='2'>邀新团</Option>
                </Select>
            </FormItem>
            <FormItem label="用户类型" name="limitUserType" style={{margin:'10px 12px 10px 0'}} >
                <Select style={{ width: 120 }} >
                  <Option value='1'>企业用户</Option>
                  <Option value='2'>所有人</Option>
                </Select>
            </FormItem>
            <FormItem label="限购种类" name="limitType" style={{margin:'10px 12px 10px 0'}} >
                <Select style={{ width: 120 }} >
                  <Option value='1'>不限购</Option>
                  <Option value='2'>spu</Option>
                  <Option value='3'>sku</Option>·
                </Select>
            </FormItem>
          </Form>
        </Col>
        <Col md={4} sm={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end',margin:'10px 0' }}>
            <Button type="primary" onClick={this.getDataList}>
              查询
              </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.resetForm}>
              重置
              </Button>
          </div>
        </Col>
      </Row>
    )
  }
  // 新增按钮
  linkTo() {
    this.props.history.push('/activity/assemble/add_assemble')
  }
  render() {
    let { loading,currentTab,dataSource} = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number) => <div>共{t}条</div>,
    };
    return(
      <>
        <PageHeaderWrapper
          onTabChange={this.tabChange}
          tabActiveKey={ currentTab }
          tabList={tabList}
          >
        </PageHeaderWrapper>
        <div style={{marginTop: '30px'}}>
          <Card>
            <div>{this.renderForm()}</div>
          </Card>
          <Card bordered={false} style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}><Button type="primary" onClick={() => this.linkTo()}>创建拼团活动</Button></div>
            <Table
              rowKey={record => record.id}
              loading={loading}
              columns={ this.state.mergeType == 1 ? this.newColumns : this.state.mergeType == 2 ? this.inviteColumns : this.columns }
              dataSource={dataSource}
              onChange={this.onTableChange}
              pagination={pagination} />
          </Card>
        </div>
      </>
    )}
}
