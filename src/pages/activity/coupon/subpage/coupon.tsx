import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Select, Table, Button,Divider,Popconfirm } from 'antd';
import {
  couponListParams,
  getCouponList,
  UpdateCouponItem,
}from '@/services/activity/coupon'
const { Option } = Select;
const FormItem = Form.Item;
interface UserState {
  pageSize: number,
  pageNum: number,
  total: number,
  loading: boolean, 
  tableList: Array<any>,
}
interface UserProp  {
  history: any;
}
export default class Coupon extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false, 
      pageSize: 10,
      pageNum: 1,
      total: 0,
      tableList: [], 
    }
  }
  columns:Array<any> = [
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
    },
    {
      title: '消费金额',
      dataIndex: 'fullPrice',
    },
    {
      title: '面额',
      dataIndex: 'offPrice',
    },
    {
      title: '有效期',
      render: (text:any, record:any) => <>
        <p>开始时间：{record.startTime == null ? '': record.startTime}</p>
        <p>结束时间：{record.startTime == null ? '': record.endTime}</p>
      </>
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text:any) => <span style={{color: text === 1 ? '#ff6c00' : ''}}>
        {
          text === 1 ? '上线' : (text === 0 ? '下线' : (text ===2 ? '未开始' : '过期'))
        }
      </span>
      
    },
    {
      title: '操作',
      render: (text:any, record:any) => <>
        <a href={this.handleGoPage(record.couponId)}> 查看</a>
        {(record.status == '1') &&
        <>
          <Divider type="vertical" />
          <Popconfirm title= '确认下线吗？' onConfirm={() => this.handleLine(record.couponId,0)}>
            <a>下线</a>
          </Popconfirm>
        </>
        }
        {(record.status == '2') &&
        <>
        <Divider type="vertical" />
        <Popconfirm title= '确认上线吗？' onConfirm={() => this.handleLine(record.couponId,1)}>
          <a>上线</a>
        </Popconfirm>
        <Divider type="vertical" />
        <Popconfirm title= '确认下线吗？' onConfirm={() => this.handleLine(record.couponId,0)}>
          <a>下线</a>
        </Popconfirm>
        </>
        }
        {/* <Popconfirm title="确认删除此券?" onConfirm={() => this.handleDelete(record.couponId)}>
          <a>删除</a>
        </Popconfirm> */}
      </>
    }
  ]
  componentDidMount() {
      this.getDataList();
  }
  //获取数据
  getDataList = async () => {
    let { couponName, status } = this.formRef.current.getFieldsValue();
    let params: couponListParams = {
      page: this.state.pageNum,
      size: this.state.pageSize,
      couponName,
      status,
      sortBy: '-createTime',
    };
    this.setState({loading:true})
    let res = await getCouponList(params);
    this.setState({loading:false});
    let { records=[], total } = res;
    let tableList = records.map((v:any, i:number) => {
      return {
        key: i,
        ...v
      }
    });
    this.setState({
      tableList,
      total: total || 0,
    });
  }
  // 重置
  resetForm = () => {
    this.formRef.current.resetFields();
  }
  // 刷新
  refresh = () => {
    this.getDataList();
  }
  // 查询
  query = () => {
    this.setState({
      pageSize: 10,
      pageNum: 0
    }, this.getDataList)
  }
  onTableChange = ({ current: pageNum, pageSize }:any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.refresh)
  }
  // 上线/下线
  handleLine = async(couponId:number,status:number) => {
    await UpdateCouponItem({ id:couponId,status });
    this.refresh();
  }
  // 查看优惠券详情
  handleGoPage = ( id: number|string ) => {
    return `#/activity/coupon/couponDetail/${id}` 
  }
  //头部选择搜索栏
  renderForm = () => {
    return (
      <Row>
        <Col span={20}>
          <Form 
            layout="inline" 
            ref={this.formRef}
            initialValues = {{
              status: '',
              couponName:''
            }}
          >
            <FormItem label="状态：" name='status' style={{marginBottom: 10}}>
              <Select style={{ width: 120 }} placeholder="请选择状态">
                <Option value="">全部</Option>
                <Option value="2">未开始</Option>
                <Option value="1">上线</Option>
                <Option value="0">下线</Option>
                <Option value="-1">过期</Option>
              </Select>
            </FormItem>
            <FormItem label="名称：" name="couponName" style={{marginBottom: 10}}>
              <Input style={{ width: 160 }} placeholder="优惠券名称"/>
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
    let { loading, tableList, total, pageNum, pageSize } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum,
      pageSize: pageSize || 10,
      total,
      showTotal: (t:number) => <div>共{t}条</div>
    }
    return (
      <div>
        <Card>
          <div>{this.renderForm()}</div>
          <Table
            loading={loading}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination}
            columns={this.columns}
            style={{ marginTop: 24, textAlign: 'center' }}
          >
          </Table>
        </Card>
      </div>
    )
  }
}

