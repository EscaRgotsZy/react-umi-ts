import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import { Card, Form, Row, Col, Input, Table, Button, Popconfirm,} from 'antd';
import {
  preSaleListParams,
  GetPreSaleList,
  onLinePresellActivity,
  offLinePresellActivity,
  delPresellActivity
} from '@/services/activity/pre_sale';
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
  { key: '', tab: '所有活动' },
  { key: '2', tab: '未开始' },
  { key: '1', tab: '已上线' },
  { key: '-1', tab: '已下线' },
  { key: '-3', tab: '已过期' },
  { key: '3', tab: '已删除' },
]
const FormItem = Form.Item;
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
      pageNum: searchUrl.pageNum ? +searchUrl.pageNum : 1,
      pageSize: searchUrl.pageSize ? +searchUrl.pageSize : 10,
      total: 0,
      currentTab: searchUrl.key || '1',
      tableList: [],
    };
  }
  columns: Array<any> = [
    {
        title: '活动名称',
        width: '12%',
        dataIndex: 'presellName',
    },
    {
        title: '商品名称',
        width: '13%',
        dataIndex: 'productName',
    },
    {
        title: '预售类型',
        width: '13%',
        dataIndex: 'payType',
        render: (text:any) => text == 1 ? '定金' : '全额'
    },
    {
        title: '原价',
        width: '10%',
        dataIndex: 'presentPrice',
    },
    {
        title: '预售价',
        width: '12%',
        dataIndex: 'preSalePrice',
    },
    {
        title: '用户类型',
        width: '12%',
        dataIndex: 'limitUserType',
        render: (text:any) => text == 1 ? '企业用户' : '所有用户'
    },
    {
        title: '促销时间',
        width: '12%',
        render: ( record:any) => <>
            <p>{record.startTime ? moment(record.startTime).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
            <p>{record.endTime ? moment(record.endTime).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
        </>
    },
    {
        title: '库存',
        width: '8%',
        dataIndex: 'actualStocks',
    },
    {
        title: '状态',
        width: '15%',
        dataIndex: 'statusText',
    },
    {
        title: '操作',
        width: '20%',
        render: (record:any) => <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {
                    record.status == 2 &&
                    <>
                        <Button type='dashed' style={{ marginBottom: '5px', width: '80px' }} onClick={() => this.editorStatus(record, 1)} >上线</Button>
                        <Button type='primary' style={{ marginBottom: '5px', width: '80px' }}>
                            <a href={this.handleEdit(record.id,0)}>编辑</a>
                        </Button>
                        <Popconfirm
                            title="是否删除预售活动?"
                            onConfirm={() => this.handleDelete(record,3)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button danger style={{ width: '80px' }}>删除</Button>
                        </Popconfirm>
                    </>
                }
                {
                    record.status == 1 &&
                    <>
                        <Button type='dashed' style={{ marginBottom: '5px', width: '80px' }} onClick={() => this.editorStatus(record, -1)}>下线</Button>
                        <Button type='primary' style={{ width: '80px' }}>
                          <a href={this.handleWatch(record.id,1)}>查看</a>
                        </Button>
                    </>
                }
                {
                    (record.status == -3 || record.status == -1) &&
                    <>
                        <Button type='primary' style={{ width: '80px' }}>
                          <a href={this.handleWatch(record.id,1)}>查看</a>
                        </Button>
                    </>
                }
                {
                    record.status == 3 &&<>/</>
                }
            </div>
        </>
    },

]
  //挂载
  componentDidMount() {
    let { presellName = '', productId = '' } = this.state.searchUrl;
    if (productId || presellName ) {
      this.formRef.current.setFieldsValue({ productId, presellName })
      this.getDataList()
    }
    if (!productId && !presellName ) {
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
  //获取列表list
  getDataList = async (): Promise<any> => {
    let { productId='', presellName='' } = this.formRef.current.getFieldsValue();
    let params: preSaleListParams = {
      page: this.state.pageNum,
      size: this.state.pageSize,
      sortBy: '-createTime',
      status: this.state.currentTab,
      presellName,
      productId,
    };
    this.props.history.replace({
      query: {
        pageNum: this.state.pageNum,
        pageSize: this.state.pageSize,
        key: this.state.currentTab,
        presellName,
        productId,
      }
    })
    this.setState({ loading: true });
    let res = await GetPreSaleList(params);
    this.setState({ loading: false });
    let { records, total } = res;
    let tableList = records.map((v, i) => {
      let { status } = v;
      let statusText;
      switch (status) {
        case -3: statusText = '已过期'; break;
        case -1: statusText = '已下线'; break;
        case 1: statusText = '已上线'; break;
        case 2: statusText = '未开始'; break;
        case 3: statusText = '已删除'; break;
      }
      return {
        key: i,
        statusText,
        ...v
      }
    });
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
  tabChange = ( type:string ) => {
    this.setState({
      currentTab: type,
      pageNum: 1    //防止出现有数据但页面为空，数据不够导致
    },()=>{
      this.resetForm()
      this.getDataList()
    })
  }
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
  // 查看
  handleWatch = ( id: number|string, type:1 ) => {
    return `/#/activity/pre_sale/${id}/preSale_add/${type}`
  }
  //编辑
  handleEdit = ( id: number|string, type:0 ) => {
    return `/#/activity/pre_sale/${id}/preSale_add/${type}`
  }
  //更改上下线状态
  editorStatus = async (record: any, status: number|string) => {
    let { id } = record;
    if (status == 1) {
      await onLinePresellActivity({ id, status });
    }
    if (status == -1) {
      await offLinePresellActivity({ id, status });
    }
    this.refresh();
  }
  // 删除
  handleDelete = async (record: any, status: number|string) => {
    let { id } = record;
    await delPresellActivity({ id, status });
    this.refresh();
  }
  // 新增按钮
  linkTo() {
    this.props.history.push('/activity/pre_sale/preSale_add')
  }
  renderForm = () => {
    return (
      <Row>
        <Col span={20}>
          <Form layout="inline" ref={this.formRef}>
            <FormItem label="商品ID：" name="productId">
              <Input style={{ width: 160 }} />
            </FormItem>
            <FormItem label="活动名称：" name="presellName">
              <Input style={{ width: 160 }} />
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
    let { loading,tableList,currentTab} = this.state;
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
          <Card style={{ marginTop: 20 }}>
            <div>{this.renderForm()}</div>
          </Card>
          <Card bordered={false} style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}><Button type="primary" onClick={() => this.linkTo()}>新建预售活动</Button></div>
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={tableList}
              onChange={this.onTableChange}
              pagination={pagination}
            />
          </Card>


      </>
    )
  }
}
