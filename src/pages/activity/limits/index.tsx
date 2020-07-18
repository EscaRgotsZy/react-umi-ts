import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { handlePicUrl, getPageQuery, saveUrlParams } from '@/utils/utils';
import { Card, Form, Row, Col, Input, Table, Select, Button, Popconfirm, } from 'antd';
import {
  limitsParams,
  GetLimitsList,
  UpdateLimitsItem,
} from '@/services/activity/limits';
interface UserState {
  searchUrl: any,
  loading: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  currentTab: any;
  tableList: Array<any>;
};

const tabList = [
  { key: '1', tab: '待发布' },
  { key: '2', tab: '上线中' },
  { key: '3', tab: '已下线' },
  { key: '4', tab: '已删除' },
]


const { Option } = Select;
const FormItem = Form.Item;
interface UserProp {
  history: any;
  location: any;
};
export default class limits extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    let searchUrl = getPageQuery();
    this.state = {
      searchUrl,
      loading: false,
      pageNum: searchUrl.pageNum ? +searchUrl.pageNum : 1,
      pageSize: searchUrl.pageSize ? +searchUrl.pageSize : 10,
      total: 0,
      currentTab: searchUrl.key || '2',
      tableList: [],
    };
  }
  columns: Array<any> = [
    {
      title: '商品id',
      dataIndex: 'productId',
    },
    {
      title: '商品名称',
      width: 300,
      dataIndex: 'productName',
    },
    {
      title: '商品图片',
      render: (record: any) => (
        record.productPic ? <img src={record.productPic && handlePicUrl(record.productPic)} style={{ width: '60px' }} /> : '暂无图片'
      )
    },
    {
      title: '用户类型',
      dataIndex: 'limitUserType',
      render: (text: any) => text == 1 ? '企业用户' : text == 2 ? '所有人' : '/'
    },
    {
      title: '限购种类',
      dataIndex: 'limitType',
      render: (text: any) => text == 1 ? '不限购' : text == 2 ? 'spu限购' : 'sku限购'
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (text: any) => <>
        <span>{text == '1' ? '待发布' : text == '2' ? '上线中' : text == '3' ? '已下线' : '已删除'}</span>
      </>
    },
    {
      title: '操作',
      render: (record: any) => <>
        {record.status == '1' &&
          <div>
            <Button type='primary' style={{ marginRight: '10px', marginBottom: '5px' }}>
              <a href={this.handleEdit(record.id)}>查看</a>
            </Button>
            <Button type='primary' style={{ marginRight: '10px', marginBottom: '5px' }} onClick={() => this.handleOnline(record, 2)} >上线</Button>
            <Popconfirm
              title="是否删除该项?"
              onConfirm={() => this.handleDelete(record, 4)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger style={{ marginRight: '10px', marginBottom: '5px' }} >删除</Button>
            </Popconfirm>
          </div>
        }
        {record.status == '2' &&
          <div>
            <Button type='primary' style={{ marginRight: '10px', marginBottom: '5px' }}>
              <a href={this.handleEdit(record.id)}>查看</a>
            </Button>
            <Button type='primary' style={{ marginRight: '10px', marginBottom: '5px' }} onClick={() => this.handleOffline(record, 3)} >下线</Button>
          </div>
        }
        {record.status == '3' &&
          <div>
            <Button type='primary' style={{ marginRight: '10px', marginBottom: '5px' }}>
              <a href={this.handleEdit(record.id)}>查看</a>
            </Button>
            <Button type='primary' style={{ marginRight: '10px', marginBottom: '5px' }} onClick={() => this.handleOnline(record, 2)} >上线</Button>
            <Popconfirm
              title="是否删除该项?"
              onConfirm={() => this.handleDelete(record, 4)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger style={{ marginRight: '10px', marginBottom: '5px' }} >删除</Button>
            </Popconfirm>
          </div>
        }
        {record.status == '4' &&
          <div>
            活动已删除
        </div>
        }
      </>
    },
  ]
  //挂载
  componentDidMount() {
    let { productId = '', limitType = '', limitUserType = '' } = this.state.searchUrl;
    if (productId || limitType || limitUserType) {
      this.formRef.current.setFieldsValue({ productId, limitType, limitUserType })
      this.getDataList()
    }
    if (!productId && !limitType && !limitUserType) {
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
  //用户类型
  onChangeUserType = (value: any) => {
    this.formRef.current.setFieldsValue({
      limitUserType: value
    })
  }
  //限购种类
  onChangeLimitType = (value: any) => {
    this.formRef.current.setFieldsValue({
      limitType: value
    })
  }
  //获取列表list
  getDataList = async (): Promise<any> => {
    let { pageNum, pageSize, currentTab } = this.state;
    let { productId = '', limitType = '', limitUserType = '' } = this.formRef.current.getFieldsValue();
    let params: limitsParams = {
      page: pageNum,
      size: pageSize,
      status: currentTab,
      productId,
      limitType,
      limitUserType,
      sortBy: '-createTime',
    };
    saveUrlParams({
      key: this.state.currentTab,
      productId: params.productId,
      limitType: params.limitType,
      limitUserType: params.limitUserType,
      pageNum: params.page,
      pageSize: params.size,
    })
    this.setState({ loading: true });
    let res = await GetLimitsList(params);
    this.setState({ loading: false });
    let { records, total } = res;
    let tableList = records.map((v: any) => ({
      key: v.id,
      ...v,
    }));
    this.setState({
      tableList,
      total: total || 0,
    });
  }
  // 刷新
  refresh = () => {
    this.getDataList();
  };
  // 切换tab
  tabChange = (type: string) => {
    this.setState({
      currentTab: type
    }, () => {
      this.resetForm()
      this.getDataList()
    })

  }
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState(
      {
        pageSize,
        pageNum,
      },
      this.refresh,
    );
  };
  // 查看
  handleEdit = (id: number | string) => {
    return `#/activity/limits/${id}/add_limits`
  }
  // 下线
  handleOffline = async (record: any, status: number | string) => {
    let { id } = record;
    await UpdateLimitsItem({ limitsId: id, status });
    this.refresh();
  }
  // 上线
  handleOnline = async (record: any, status: number | string) => {
    let { id } = record;
    await UpdateLimitsItem({ limitsId: id, status });
    this.refresh();
  }
  // 删除
  handleDelete = async (record: any, status: number | string) => {
    let { id } = record;
    await UpdateLimitsItem({ limitsId: id, status });
    this.refresh();
  }
  // 新增按钮
  linkTo() {
    this.props.history.push('/activity/limits/add_limits')
  }
  renderForm = () => {
    return (
      <Row>
        <Col span={20}>
          <Form layout="inline" ref={this.formRef}
            initialValues={
              {
                productId: ''
              }
            }
          >
            <FormItem label="商品ID：" name="productId">
              <Input style={{ width: 160 }} />
            </FormItem>
            <FormItem label="用户类型：" name="limitUserType">
              <Select onChange={this.onChangeUserType} style={{ width: 160 }}>
                <Option value='1'>企业用户</Option>
                <Option value='2'>所有人</Option>
              </Select>
            </FormItem>
            <FormItem label="限购种类：" name="limitType" >
              <Select onChange={this.onChangeLimitType} style={{ width: 160 }}>
                <Option value='1'>不限购</Option>
                <Option value='2'>spu限购</Option>
                <Option value='3'>sku限购</Option>
              </Select>
            </FormItem>
          </Form>
        </Col>
        <Col span={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
  };
  render() {
    let { loading, tableList, currentTab } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number) => <div>共{t}条</div>,
    };
    return (
      <PageHeaderWrapper
        onTabChange={this.tabChange}
        tabActiveKey={currentTab}
        tabList={tabList}
      >

        <Card style={{ marginTop: 20 }}>
          <div>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}><Button type="primary" onClick={() => this.linkTo()}>添加限购商品</Button></div>
          <Table
            rowKey={record => record.id}
            loading={loading}
            columns={this.columns}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}
