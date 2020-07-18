import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Table, Button, Popconfirm, Modal, message, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { getSellingProd, sellProdParams, offlineProd, batchOnOffLine } from '@/services/goods/sell/list';
import { handlePicUrl, getPageQuery, saveUrlParams } from '@/utils/utils';
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
  offlineVisiable: boolean;
  offlineList: Array<any>;
  batchLoading: boolean;
  selectedRows: Array<any>;
  selectedRowKeys: Array<any>;
}

export default class SellGoods extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    let searchParams = getPageQuery();
    this.state = {
      searchParams,
      pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
      pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
      total: 0,
      loading: false,
      tableList: [],
      offlineVisiable: false,
      offlineList: [],
      batchLoading: false,
      selectedRows: [],
      selectedRowKeys:[],
    };
  }

  columns: Array<any> = [
    {
      title: '商品图片',
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
              width: '360px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            商品名称:&nbsp;&nbsp;{text}
          </div>
          <div
            style={{
              width: '360px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '4px',
            }}
          >
            商品ID:&nbsp;{record.productId}
          </div>
        </>
      ),
    },
    {
      title: '商品价格',
      dataIndex: 'presentPrice',
    },
    {
      title: '实际库存',
      dataIndex: 'actualStocks',
    },
    {
      title: '销售库存',
      dataIndex: 'stocks',
    },
    {
      title: '操作',
      width: '170px',
      render: (text: string, record: any) => (
        <>
          <Popconfirm
            title={`确认将${record.productName}放入仓库?`}
            onConfirm={() => this.editOffline(record)}
          >
            <Button style={{ marginRight: '10px' }} type="primary">
              下线
            </Button>
          </Popconfirm>
          {/* <Button type='primary' onClick={() => this.editUpdate(record)}>修改</Button> */}
        </>
      ),
    },
  ];
  componentDidMount() {
    let { productName, outerId } = this.state.searchParams;
    if (productName) {
      this.formRef.current.setFieldsValue({ productName });
    }
    if (outerId) {
      this.formRef.current.setFieldsValue({ outerId });
    }
    this.getDataList();
  }

  // GET数据List
  getDataList = async (): Promise<any> => {
    let { productName = '', outerId = '' } = this.formRef.current.getFieldsValue();
    // status商城状态 0:仓库中的商品,1:上线的商品,2:商品违规下线,4:商品审核失败状态 ,3:商品待审核状态,-1:商品删除状态,-2:商家永久删除状态
    let params: sellProdParams = {
      productName: productName && productName.trim(),
      status: 1,
      page: this.state.pageNum,
      size: this.state.pageSize,
      sortBy: '-modifyDate',
      outerId: outerId && outerId.trim(),
    };
    this.setState({ loading: true, tableList: [] });
    saveUrlParams({
      productName: params.productName,
      outerId: params.outerId,    
      status: params.status, 
      pageNum: params.page, 
      pageSize: params.size,                       
    })
    let res = await getSellingProd(params);
    this.setState({ loading: false });
    if (!res) return false;
    let { records = [], total } = res;
    let tableList = records && records.length != 0 ? records : [];

    this.setState({
      tableList,
      total: total || 0,
      selectedRows: []
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
    this.formRef.current.resetFields();
    this.setState({ pageSize: 10, pageNum: 1 }, () => this.getDataList());

  };
  // 刷新
  refresh = () => {
    this.getDataList();
  };
  // 下线
  editOffline = async (record: any): Promise<any> => {
    let { productId } = record;
    let status = 0;
    let res = await offlineProd({ productId, status });
    this.setState({ loading: false });
    if (!res) return false;
    if (res && res.isShow) {
      this.setState({ offlineVisiable: true, offlineList: res.productMsg || [] });
    }
    this.getDataList();
  };
  // 修改
  editUpdate = () => {
    this.props.history.push('/goods-manage/upload_goods');
  };

  // 分页
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState(
      {
        pageSize,
        pageNum,
      },
      this.refresh,
    );
  };
  handleCheck = (selectedRowKeys: Array<any>, selectedRows: Array<any>) => {
    this.setState({ selectedRows,selectedRowKeys })
  }
  // 批量操作
  handleOnOffLine = async () => {
    let { selectedRows, } = this.state;
    if (!selectedRows.length) return message.warn('请至少选择一个进行下线');
    let productStatusForms = selectedRows.map((item: any) => {
      if(item && item.productId){
        return {
          productId: item ? item.productId : '',
          status: 0,
        }
      }
    });
    let query = {
      bizType: 0,
      productStatusForms
    }
    this.setState({ batchLoading: true });
    let res = await batchOnOffLine(query);
    this.setState({ batchLoading: false });
    if (!res) return false;
    if (res && res.isShow) {
      this.setState({ offlineVisiable: true, offlineList: res.productMsg || [] })
    } else {
      message.success('下线成功')
    }
    this.setState({selectedRowKeys:[]})
    this.getDataList()
  }
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
    let { loading, tableList } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number | string) => <div>共{t}条</div>,
    };
    const rowSelection = {
      selectedRowKeys:this.state.selectedRowKeys,
      onChange: this.handleCheck
    };
    return (
      <>
        <PageHeaderWrapper title={'商品出售'}>
          <Card bordered={false} style={{ margin: '20px' }}>
            <div>{this.renderForm()}</div>
          </Card>
          <Card style={{ margin: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}><Button type='primary' onClick={() => this.handleOnOffLine()} loading={this.state.batchLoading} >批量下线</Button></div>
            <Table
              rowKey={(record) => record.productId}
              loading={loading}
              columns={this.columns}
              dataSource={this.state.tableList}
              onChange={this.onTableChange}
              pagination={pagination}
              rowSelection={rowSelection}
            />
          </Card>
          {/* 下线弹窗 */}
          <Modal
            title="商品关联活动"
            visible={this.state.offlineVisiable}
            onCancel={() => this.setState({ offlineVisiable: false })}
            footer={null}
            width={1000}
          >
            {this.state.offlineList &&
              this.state.offlineList.map((item, index) => (
                <p key={index}>
                  {index + 1}. {item}
                </p>
              ))}
          </Modal>
        </PageHeaderWrapper>
      </>
    );
  }
}
