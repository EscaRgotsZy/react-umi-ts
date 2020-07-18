import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { handlePicUrl, getPageQuery, saveUrlParams } from '@/utils/utils';
import moment from 'moment';
import { Card, Form, Row, Col, Input, Table, Button, Popconfirm, message, Divider, Select, } from 'antd';
import {
  getGiftsActivityParams,
  getGiftsActivityList,
  onLineGiftsActivity,
  offLineGiftsActivity
} from '@/services/activity/gifts';
interface UserState {
  searchUrl: any,
  loading: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  tableList: Array<any>;
};
const { Option } = Select;
const FormItem = Form.Item;
const statusList = ['未开始', '进行中', '已下线', '待审核', '已结束']
interface UserProp {
  history: any;
  location: any;
};
export default class giftsList extends Component<UserProp, UserState> {
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
      tableList: [],
    };
  }
  columns: Array<any> = [
    {
      title: '活动商品',
      dataIndex: '',
      render: (text:any, record:any, index:number) => <>
        <img width='80' height="80" style={{ float: "left" }} src={record.prodPic ? handlePicUrl(record.prodPic) : ''} />
        <div style={{ float: 'left' }}>
          <p style={{ padding: '5px 10px' }}>{record.productName}</p>
          <p style={{ padding: '5px 10px' }}>ID：{record.productId}</p>
        </div>
      </>
    },
    {
      title: '活动时间',
      dataIndex: '',
      render: (text:any, record:any) => <>
        <p>{moment(record.startTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        <p>{moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
      </>
    },
    {
      title: '赠品数量',
      dataIndex: 'fullValue',
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (text:any) => <>{statusList[text]}</>
    },
    {
      title: '操作',
      render: (text:any, record:any) => <>
        <a href={this.goPage(record)}>查看</a>
        {(record.status == '0') &&
          <>
            <Divider type="vertical" />
            <Popconfirm title="确认上线?" onConfirm={() => this.handleOnline(record)}>
              <a>上线</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm title="确认下线?" onConfirm={() => this.handleOffline(record)}>
              <a>下线</a>
            </Popconfirm>
          </>
        }
        {record.status == '1' &&
          <>
            <Divider type="vertical" />
            <Popconfirm title="确认下线?" onConfirm={() => this.handleOffline(record)}>
              <a>下线</a>
            </Popconfirm>
          </>
        }
      </>
    }
  ]
  //挂载
  componentDidMount() {
    let { productId = '', productName = '', status = '' } = this.state.searchUrl;
    if (productId || productName || status) {
      this.formRef.current.setFieldsValue({ productId, productName, status })
      this.getDataList()
    }
    if (!productId && !status && !productName) {
      this.getDataList();
    };
  }
  //获取列表list
  getDataList = async (): Promise<any> => {
    let { pageNum, pageSize } = this.state;
    let { productId = '', productName = '', status = '' } = this.formRef.current.getFieldsValue();
    let params: getGiftsActivityParams = {
      page: pageNum,
      size: pageSize,
      status: status=='-2' ? '' : status,
      productId,
      productName,
      sortBy: '-createTime'
    };
    saveUrlParams({
      pageNum: params.page,
      pageSize: params.size,
      status: params.status,
      productId: params.productId,
      productName: params.productName,
    })
    this.setState({ loading: true });
    let res = await getGiftsActivityList(params);
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
  //详情页
  goPage = (record:any) => {
    let { id } = record
    return `#/activity/gift/${id}/add_gifts`
  }
  //新建赠品活动
  linkTo = () => {
    this.props.history.push(`/activity/gift/add_gifts`)
  }
  // 下线
  handleOffline = async (record: any) => {
    let { id } = record;
    await offLineGiftsActivity(id);
    this.refresh();
  }
  // 上线
  handleOnline = async (record: any) => {
    let { id } = record;
    await onLineGiftsActivity(id);
    this.refresh();
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
  renderForm = () => {
    return (
      <Row>
        <Col span={20}>
          <Form layout="inline" ref={this.formRef}
            initialValues={{}}
          >
            <FormItem label="商品名称：" name="productName">
              <Input placeholder="商品名称" style={{ width: 160 }}/>
            </FormItem>
            <FormItem label="商品Id：" name="productId">
              <Input placeholder="商品Id" style={{ width: 160 }}/>
            </FormItem>
            <FormItem label="状态：" name="status" >
              <Select style={{ width: 120 }} placeholder="请选择状态">
                <Option value="-2">全部</Option>
                <Option value="0">未开始</Option>
                <Option value="1">进行中</Option>
                <Option value="2">已下线</Option>
                {/* <Option value="3">待审核</Option>    */}
                {/* <Option value="4">审核不通过</Option>  */}
                {/* <Option value="4">已结束</Option> */}
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
    let { loading, tableList } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number) => <div>共{t}条</div>,
    };
    return (
      <PageHeaderWrapper>
        <Card style={{ marginTop: 20 }}>
          <div>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}>
            <Button type="primary" onClick={() => this.linkTo()}>新建赠品活动</Button>
          </div>
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
// export default () => <PageHeaderWrapper></PageHeaderWrapper>;
