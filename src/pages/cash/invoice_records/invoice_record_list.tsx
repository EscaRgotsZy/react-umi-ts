import React, { Component,} from 'react';
import { Card, Form, Row, Col, Input, Select, Table, Button, Popconfirm,DatePicker } from 'antd';
import moment from 'moment';
import { getPageQuery } from '@/common/utils'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { 
  getInvoiceRecordsParams,
  getInvoiceRecordsList,
  cancleCheck
} from '@/services/cash/invoice_records';
import { saveUrlParams } from '@/utils/utils'
interface UserState {
  searchUrl: any,
  loading: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  startTime: string;
  endTime: string;
  currentTab: any;
  tableList: Array<any>;
};
interface UserProp {
  history: any;
  location: any;
};
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

export default class limits extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    let searchUrl = getPageQuery();
    this.state = {
      searchUrl,
      loading: false,
      pageNum: searchUrl.page ? +searchUrl.page : 1,
      pageSize: searchUrl.size ? +searchUrl.size : 10,
      total: 0,
      currentTab: searchUrl.key || '2',
      startTime: '',
      endTime: '',
      tableList: [],
    };
  }
    columns:Array<any> = [
      {
        title: '申请时间',
        dataIndex: 'createTime',
        render:(text:any) => <>
        {text ? text : "无"}
        </>
      },
      {
        title: '发票抬头',
        dataIndex: 'invoiceName',
        render:(text:any) => 
          <div style={{width:'200px',wordBreak:'break-word'}}>
            {text?text:'空'}
          </div>
      },
      {
        title: '发票类型',
        dataIndex: 'typeId',
        render:(text:any) => <>
          {text=='1'?"增值税专用发票":"普通发票"}
        </>
      },
      {
        title: '发票金额',
        dataIndex: 'amount',
      },
      {
        title: '发票内容',
        dataIndex: 'invoiceContent',
        render:(text:any) => <div style={{ width: '100px',  wordBreak:'break-word' }}> 
          {text?text:'空'}
          </div>
      },
      {
        title: '备注',
        dataIndex: 'invoiceRemark',
        render:(text:any)=><div style={{ width: '200px', wordBreak:'break-word'}}>{text?text:"空"}</div>
      },
      {
        title: '开票状态',
        dataIndex: 'statusText',
      },
      {
        title: '操作',
        render: (text:any, record:any) => <>
          <a href={this.handleGoPage(record)}><Button type='primary' style={{margin: '10px'}}>详情</Button></a>
          {record.invoiceStatus == '1' &&
            <Popconfirm
              title="是否确定操作?"
              onConfirm={() => this.handleCancle(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger style={{margin: '10px'}}>取消</Button>
            </Popconfirm>
          }
        </>
      }
    ]
    componentDidMount() {
      let { startTime='', endTime='',invoiceStatus='',invoiceName='',invoiceContent=''  } = this.state.searchUrl;
      if ( startTime || endTime || invoiceStatus || invoiceName || invoiceContent){
        this.formRef.current.setFieldsValue({ 
          applicationTime: [moment(startTime), moment(endTime)],
          invoiceStatus, 
          invoiceName, 
          invoiceContent
        });
        this.setState({ startTime, endTime }, () => {
          this.getDataList();
        })
      } else {
        this.getDataList();
      }
    }
    //跳转开票设置
    handleGoSettingPage = () => {
      return `#/cash/invoice_records/invoice_setting_list`
    }
    //跳转详情
    handleGoPage = (record:any) => {
      let { orderNo } = record
      return `#/cash/invoice_records/invoice_record_detail/${orderNo}`
    }
    //获取数据
    getDataList = async ():Promise<any> => {
      let { pageSize, pageNum, startTime, endTime } = this.state
      let { invoiceStatus='',invoiceName='',invoiceContent='' } = this.formRef.current.getFieldsValue();
      let params:getInvoiceRecordsParams = {
        productId:'',
        invoiceName,    
        invoiceContent,
        startTime,
        endTime,
        invoiceStatus,                        
        page: pageNum,
        size: pageSize,
        sortBy: '-createTime',                         
      }
      saveUrlParams({
        productId: params.productId,
        invoiceName: params.invoiceName,    
        invoiceContent: params.invoiceContent, 
        startTime: params.startTime, 
        endTime: params.endTime, 
        invoiceStatus: params.invoiceStatus,                       
        page: params.page, 
        size: params.size, 
      })
      this.setState({ loading: true });
      let res = await getInvoiceRecordsList(params);  
      this.setState({ loading: false })
      if (!res) return false;
      let { records, total } = res || {};
      let tableList = records.map((v:any, i:number) => {
        let { invoiceStatus } = v;
        let statusText;
        switch (invoiceStatus) {
          case 1: statusText = '待审核'; break;
          case 2: statusText = '审核通过'; break;
          case 3: statusText = '开票成功'; break;
          case 4: statusText = '已发货'; break;
          case 5: statusText = '已取消'; break;
          case 6: statusText = '未通过'; break;
        }
        return {
          key: i,
          statusText,
          ...v
        }
      }
      )
      this.setState({
        tableList,
        total
      })
    }
    // 刷新
    refresh = () => {
      this.getDataList();
    }
    // 查询
    query = () => {
      this.setState({
        pageSize: 10,
        pageNum: 1
      }, this.getDataList)
    }
    // 重置
    reset = () => {
      this.setState({
        pageNum: 1,
        pageSize: 10,
        endTime: '', 
        startTime: ''
      }, () => {
        this.getDataList()
      })
      this.formRef.current.resetFields();
    };
    // 取消
    handleCancle = async(record:any):Promise<any> => {
      let { orderNo } = record;
      await cancleCheck(orderNo);
      this.refresh()
    }
    onTableChange = ({ current: pageNum, pageSize }:any) => {
      this.setState({
        pageSize,
        pageNum
      }, this.refresh)
    }
    // 付款时间
    checkDate = (date:any, dateString:any) => {
      this.setState({
        startTime: dateString[0],
        endTime: dateString[1],
      })
    }
    //头部选择搜索栏
    renderForm = () => {
      return (
        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Col md={20} sm={20}>
            <Form layout="inline" ref={this.formRef}>
              <Form.Item label="申请日期：" name='applicationTime' style={{marginBottom:'10px'}}>
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    onChange={this.checkDate}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: 380 }}
                  />
              </Form.Item>
              <FormItem label="状态：" name='invoiceStatus' style={{marginBottom:'10px'}}>
                  <Select style={{ width: 120 }} placeholder="请选择状态">
                    <Option value="1">待审核</Option>
                    <Option value="2">审核通过</Option>
                    <Option value="3">开票成功</Option>
                    <Option value="4">已发货</Option>
                    <Option value="5">已取消</Option>
                  </Select>
              </FormItem>
              <FormItem label="开票抬头：" name='invoiceName'>
                  <Input placeholder="开票抬头" style={{ width: 160 }}/>
              </FormItem>
              <FormItem label="发票内容：" name='invoiceContent'>
                  <Input placeholder="发票内容" style={{ width: 160 }}/>
              </FormItem>
            </Form>
          </Col>
          <Col md={4} sm={4}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" onClick={this.query} style={{marginRight:'10px'}}>搜索</Button>
              <Button type="dashed" onClick={this.reset} >重置</Button>
            </div>
          </Col>
        </Row>
        
      )
    }
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
          <PageHeaderWrapper>
            <div style={{textAlign:'right',margin:'20px 30px',background:'#f2f2f2'}}>
                <a href={this.handleGoSettingPage()}><Button type="primary">开票设置</Button></a>
            </div>
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
          </PageHeaderWrapper>
        )
    }
}