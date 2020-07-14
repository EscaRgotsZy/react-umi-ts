import styles from './index.less'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Table, Button, Popconfirm, Tabs, message, Modal } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import {
  getSellingProd,
  sellProdParams,
  editOnLine,
  deleteDustbin,
  batchOnOffLine,
  batchParams,
  commitBatchTag,
  allTagListParams,
  getAllTagList
} from '@/services/goods/warehouse/list';
import { handlePicUrl, getPageQuery } from '@/utils/utils';
import moment from 'moment';
const { TabPane } = Tabs;
const FormItem = Form.Item;
interface UserProp {
  history: any;
}
interface UserState {
  searchParams: any;
  pageNum: number;
  pageSize: number;
  total: number;
  loading: boolean;
  tableList: Array<any>;
  selectedRowKeys: Array<any>;
  status: number | string;
  batchLoading:boolean;
  selectedRows:Array<any>;
  batchTagModal: boolean;
  tagGroupData: Array<any>;
  tagArr: Array<any>;
}

export default class wareHouse extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  currentTab: any;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    let searchParams = getPageQuery();
    this.currentTab = searchParams.key || '0';
    this.state = {
      searchParams,
      pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
      pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
      total: 0,
      loading: false,
      tableList: [],
      selectedRowKeys: [], //
      status: 0,
      batchLoading:false,
      selectedRows:[],
      batchTagModal: false,
      tagGroupData: [],
      tagArr: [],
    };
  }

  columns0: Array<any> = [
    {
      title: '商品图片',
      width: '10%',
      dataIndex: 'productPic',
      render: (text: string) => <img src={text && handlePicUrl(text)} width="50" height="60" />,
    },
    {
      title: '商品信息',
      dataIndex: 'productName',
      ellipsis: 'true',
      render: (text: string, record: any, index: number) => (
        <>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            商品名称:&nbsp;{text}
          </div>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '4px',
            }}
          >
            ID:&nbsp;{record.productId}
          </div>
        </>
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'presentPrice',
      sorter: true,
    },
    {
      title: '商品库存',
      dataIndex: 'actualStocks',
      sorter: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
      sorter: true,
    },
    {
      title: '操作',
      width: '260px',
      render: (text: string, record: any, index: number) => (
        <>
          <Popconfirm
            title={`确认将${record.productName}上线么?`}
            onConfirm={() => this.editOnLine(record)}
          >
            <Button style={{ marginRight: '10px' }} type="primary">
              上线
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => this.editUpdate(record)}>
            <a
              href={`/#/goods/cate/publish?productId=${record.productId}&cateId=${record.categoryId}`}
            >
              修改
            </a>
          </Button>
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <Button style={{ margin: '10px' }} type="primary">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  columns2: Array<any> = [
    {
      title: '商品图片',
      width: '10%',
      dataIndex: 'productPic',
      render: (text: string) => <img src={text && handlePicUrl(text)} width="50" height="60" />,
    },
    {
      title: '商品信息',
      dataIndex: 'productName',
      render: (text: string, record: any, index: number) => (
        <>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            商品名称:&nbsp;{text}
          </div>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '4px',
            }}
          >
            ID:&nbsp;{record.productId}
          </div>
        </>
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'presentPrice',
      sorter: true,
    },
    {
      title: '商品库存',
      dataIndex: 'actualStocks',
      sorter: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
      sorter: true,
    },
    {
      title: '操作',
      width: '260px',
      render: (text: string, record: any) => (
        <>
          <Popconfirm
            title={`确认将${record.goodsName}放入仓库?`}
            onConfirm={() => this.editOnLine(record)}
          >
            <Button style={{ marginRight: '10px' }} type="primary">
              上线
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => this.editUpdate(record)}>
            <a
              href={`/#/goods-manage/upload_goods?productId=${record.productId}&categoryId=${record.categoryId}`}
            >
              修改
            </a>
          </Button>
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <Button style={{ margin: '10px' }} type="primary">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  columns3: Array<any> = [
    {
      title: '商品图片',
      width: '10%',
      dataIndex: 'productPic',
      render: (text: string) => <img src={text && handlePicUrl(text)} width="50" height="60" />,
    },
    {
      title: '商品信息',
      dataIndex: 'productName',
      render: (text: string, record: any, index: number) => (
        <>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            商品名称:&nbsp;{text}
          </div>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '4px',
            }}
          >
            ID:&nbsp;{record.productId}
          </div>
        </>
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'presentPrice',
      sorter: true,
    },
    {
      title: '商品库存',
      dataIndex: 'actualStocks',
      sorter: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
      sorter: true,
    },
    {
      title: '操作',
      width: '260px',
      render: (text: string, record: any) => (
        <>
          <Popconfirm
            title={`确认将${record.goodsName}放入仓库?`}
            onConfirm={() => this.editOnLine(record)}
          >
            <Button style={{ marginRight: '10px' }} type="primary">
              上线
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => this.editUpdate(record)}>
            <a
              href={`/#/goods-manage/upload_goods?productId=${record.productId}&categoryId=${record.categoryId}`}
            >
              修改
            </a>
          </Button>
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <Button style={{ margin: '10px' }} type="primary">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  columns4: Array<any> = [
    {
      title: '商品图片',
      width: '10%',
      dataIndex: 'productPic',
      render: (text: string) => <img src={text && handlePicUrl(text)} width="50" height="60" />,
    },
    {
      title: '商品信息',
      dataIndex: 'productName',
      render: (text: string, record: any, index: number) => (
        <>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            商品名称:&nbsp;{text}
          </div>
          <div
            style={{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '4px',
            }}
          >
            ID:&nbsp;{record.productId}
          </div>
        </>
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'presentPrice',
      sorter: true,
    },
    {
      title: '商品库存',
      dataIndex: 'actualStocks',
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
      align: 'right',
      sorter: true,
      className: 'createTime',
    },
    {
      title: '操作',
      width: '260px',
      render: (text: string, record: any) => (
        <>
          <Popconfirm
            title={`确认将${record.productName}放入仓库?`}
            onConfirm={() => this.editOnLine(record)}
          >
            <Button style={{ marginRight: '10px' }} type="primary">
              上线
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => this.editUpdate(record)}>
            <a
              href={`/#/goods-manage/upload_goods?productId=${record.productId}&categoryId=${record.categoryId}`}
            >
              修改
            </a>
          </Button>
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <Button style={{ margin: '10px' }} type="primary">
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  componentDidMount() {
    let { productName, outerId } = this.state.searchParams;
    if (productName || outerId){
      this.formRef.current.setFieldsValue({ productName });
      this.getDataList();
    }
    else{ this.getDataList();}
  }
  sortBy = '-modifyDate';
  // 分页切换
  onTableChange = ({ current, pageSize }: any, filters: any, sorter: any, extra: any) => {
    if (sorter && sorter.order == 'descend') {
      this.sortBy = '-' + sorter.field;
    }
    if (sorter && sorter.order == 'ascend') {
      this.sortBy = sorter.field;
    }
    Object.assign(this.state, { pageNum: current, pageSize: pageSize });
    this.getDataList();
  };
  // GET数据List
  getDataList = async (): Promise<any> => {
    let { productName = '', outerId = '' } = this.formRef.current.getFieldsValue();
    let { status } = this.state;
    let sortBy = this.sortBy;
    // status商城状态 0:仓库中的商品,1:上线的商品,2:商品违规下线,4:商品审核失败状态 ,3:商品待审核状态,-1:商品删除状态,-2:商家永久删除状态
    let params: sellProdParams = {
      productName: productName && productName.trim(),
      status,
      page: this.state.pageNum,
      size: this.state.pageSize,
      sortBy,
      outerId: outerId && outerId.trim(),
    };
    this.props.history.push({
      search: `key=${this.currentTab}&productName=${productName || ''}&outerId=${
        outerId || ''
        }&status=${status || ''}&pageNum=${this.state.pageNum}&pageSize=${
        this.state.pageSize
        }&sortBy=${sortBy}`,
    });
    this.setState({ loading: true });
    let res = await getSellingProd(params);
    this.setState({ loading: false });
    if (!res) return false;
    let { records = [], total } = res;
    let tableList = records && records.length != 0 ? records : [];
    this.setState({
      tableList,
      total: total || 0,
    });
  };
  // 查询
  query = () => {
    this.setState(
      {
        pageSize: 10,
        pageNum: 1,
      },
      this.getDataList,
    );
  };
  // 重置
  reset = () => {
    this.setState({ pageSize: 10, pageNum: 1 });
    this.currentTab = '0';
    this.formRef.current.resetFields();
  };
  // 刷新
  refresh = () => {
    this.getDataList();
  };
  // 上线
  editOnLine = async (record: any): Promise<any> => {
    let { productId } = record;
    let status = 1;
    let res = await editOnLine({ productId, status });
    this.setState({ loading: false });
    if (!res) return false;
    this.getDataList();
  };
  // handleCheck = (selectedRowKeys: Array<any>, selectedRows: Array<any>) => {
  //   this.setState({ selectedRows })
  // }
  //获取所有标签
  getTagList = async ():Promise<any> => {
    let res = await getAllTagList();
    if (!res) return false;
    let { data=[] } = res;
    let tagGroupData = data && data.map((v: any,i:number) => ({
      key: i,
      ...v
    }))
    this.setState({ tagGroupData })
  }
  //打开标签弹窗
  openBatchModal = () =>{
    this.setState({
      batchTagModal: true
    })
  }
  closeBatchModal = () =>{
    this.setState({
      batchTagModal: false,
      tagArr: [],
    })
  }
  //批量打标
  handleBatch = async() => {
    let { selectedRows } = this.state;
    if (!selectedRows.length) return message.warn('请至少选择一项进行批量打标操作');
    this.getTagList()
    this.openBatchModal();
  }
  //选择标签
  toggleParams = (item:any) => {
    let {tagArr} = this.state;
    let name = item.name;
    let arr = JSON.parse(JSON.stringify(tagArr));
    if(arr.includes(name)){
      arr.splice(arr.indexOf(name), 1)
    }else{
      arr.push(name);
    }
    this.setState({
      tagArr:arr
    })
  }
  //提交批量打标
  handleCommitBatch = async() => {
    let {selectedRows,tagArr} = this.state;
    if(tagArr&&tagArr.length<1) return message.error("请至少选择一个标签")
    let productId = selectedRows && selectedRows.map((item: any) => {
      return parseInt(item.productId)
    })
    let params: batchParams = {
      productId,
      tagNames: tagArr
    }
    let res = await commitBatchTag(params);
    if(res[0]==true){
      message.error("绑定失败")
    }else{
      message.success("绑定成功")
    };
    this.closeBatchModal();
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.getDataList();
  }
  // 批量操作
  handleOnOffLine = async () => {
    let { selectedRows, } = this.state;
    if (!selectedRows.length) return message.warn('请至少选择一个进行上线');
    let productStatusForms = selectedRows.map((item: any) => {
      return {
        productId: item.productId,
        status: 1,
      }
    });
    let query = {
      bizType: 1,
      productStatusForms
    }
    this.setState({ batchLoading: true });
    let res = await batchOnOffLine(query);
    this.setState({ batchLoading: false });
    if (!res) return false;
    message.success('上线成功');
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    this.getDataList();
  }
  // 修改
  editUpdate = (record: any) => {
    let { productId, categoryId } = record;
    this.props.history.push(
      `/goods/cate/publish?productId=${productId}&cateId=${categoryId}`,
    );
  };
  // 删除商品
  handleDelete = (record: any) => {
    let { productId } = record;
    this.setDelePro(productId);
  };
  setDelePro = async (productId: number | string): Promise<any> => {
    let res = await deleteDustbin({ productId });
    if (!res) return false;
    this.refresh();
  };
  // 切换tabs
  checkTableTabs = (key: any) => {
    this.reset();
    this.currentTab = key;
    this.setState({ status: key }, () => {
      this.getDataList();
    });
  };
  // 查询
  renderForm = () => {
    return (
      <Row>
        <Col span={18}>
          <Form layout="inline" ref={this.formRef}>
            <FormItem label="商品名称: " name="productName">
              <Input placeholder="请输入商品名称" />
            </FormItem>
            <FormItem label="产品编码: " style={{ marginRight: '10px' }} name="outerId">
              <Input placeholder="请输入产品编码" />
            </FormItem>
          </Form>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              onClick={this.query}
              icon={<SearchOutlined />}
              style={{ marginRight: 5, marginLeft: 5 }}
            >
              {' '}
              查询{' '}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.reset}>
              重置
            </Button>
            <Button icon={<SyncOutlined />} style={{ marginLeft: 8 }} onClick={this.refresh}>
              刷新
            </Button>
          </div>
        </Col>
      </Row>
    );
  };
  render() {
    let { loading, tableList,batchTagModal,tagGroupData,tagArr,selectedRowKeys} = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number | string) => <div>共{t}条</div>,
    };
    // const rowSelection = {
    //   onChange: this.handleCheck
    // };
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys:any, selectedRows:any) => {
        this.setState({ selectedRowKeys,selectedRows })
      },
    };
    return (
      <>
        <PageHeaderWrapper title={'商品仓库'}>
          <Card bordered={false} style={{ margin: '20px' }}>
            <div>{this.renderForm()}</div>
          </Card>
          <Card style={{ margin: '20px' }}>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'10px'}}>
              <Button type='primary' onClick={this.handleBatch} style={{marginRight: '10px'}}>批量打标</Button>
              <Button type='primary' onClick={this.handleOnOffLine} loading={this.state.batchLoading} >批量上线</Button>
            </div>
            <Tabs onChange={this.checkTableTabs} activeKey={this.currentTab}>
              <TabPane tab="仓库中的商品" key="0">
                <Table
                  rowKey={(record) => record.productId}
                  loading={loading}
                  columns={this.columns0}
                  dataSource={tableList}
                  onChange={this.onTableChange}
                  pagination={pagination}
                  rowSelection={rowSelection}
                />
              </TabPane>
              <TabPane tab="违规的商品" key="2">
                <Table
                  rowKey={(record) => record.productId}
                  loading={loading}
                  columns={this.columns2}
                  dataSource={tableList}
                  onChange={this.onTableChange}
                  pagination={pagination}
                  rowSelection={rowSelection}

                />
              </TabPane>
              <TabPane tab="等待审核的商品" key="3">
                <Table
                  rowKey={(record) => record.productId}
                  loading={loading}
                  columns={this.columns3}
                  dataSource={tableList}
                  onChange={this.onTableChange}
                  pagination={pagination}
                  rowSelection={rowSelection}
                />
              </TabPane>
              <TabPane tab="审核失败的商品" key="4">
                <Table
                  rowKey={(record) => record.productId}
                  loading={loading}
                  columns={this.columns4}
                  dataSource={tableList}
                  onChange={this.onTableChange}
                  pagination={pagination}
                  rowSelection={rowSelection}
                />
              </TabPane>
            </Tabs>
          </Card>
          <Modal
            title='选择标签'
            visible={ batchTagModal }
            onOk={this.handleCommitBatch}
            onCancel={this.closeBatchModal}
            maskClosable={false}
          >
            <div>
              <ul className={styles.modal_Ul}>
                {
                  Array.isArray(tagGroupData) && tagGroupData.map( (item:any,i:number) =>
                    <li key={i} className={`${styles.modal_Li} ${tagArr.includes(item.name) ? styles.active : ''}`} onClick={() => this.toggleParams(item)} >{item.name}</li>
                  )
                }
              </ul>
            </div>
          </Modal>
        </PageHeaderWrapper>
      </>
    );
  }
}
