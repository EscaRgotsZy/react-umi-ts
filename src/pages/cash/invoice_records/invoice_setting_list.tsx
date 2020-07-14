import React, { Component,} from 'react';
import { Card, Form, Row, Col, Input, Table, Button, Popconfirm } from 'antd';
import { getPageQuery } from '@/common/utils'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  getInvoiceSettingParams,
  getInvoiceSettingList,
  deleteInvoiceSetting,
} from '@/services/cash/invoice_records'
const FormItem = Form.Item;
interface UserState {
  searchUrl: any,
  loading: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  tableList: Array<any>;
};
interface UserProp {
  history: any;
  location: any;
};
export default class invoiceSetting extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
        super(props)
        this.formRef = React.createRef();
        let searchUrl = getPageQuery();
        this.state = {
          searchUrl,
          loading: false,
          pageSize: searchUrl.pageSize? +searchUrl.pageSize: 10,
          pageNum: searchUrl.pageNum? +searchUrl.pageNum: 1,
          total: 0,
          tableList: []
        }
    }
    columns:Array<any> = [
      {
        title: '发票抬头',
        dataIndex: 'invoiceTitle',
        render:(text:any)=><div style={{width: '300px', wordBreak: 'break-word'}}>
          {text?text:'空'}
        </div>
      },
      {
        title: '纳税人识别号',
        dataIndex: 'taxpayerNo',
        render:(text:any)=><div style={{width: '300px', wordBreak: 'break-word'}}>
          {text?text:'空'}
        </div>
      },
      {
        title: '发票类型',
        dataIndex: 'typeId',
        render:(text:any)=>
          <>{text == 1 ? '增值税专用发票' : "普通发票"}</>
      },
      {
        title: '操作',
        render: (record:any) => <>
          <a href={this.handleGoPage(record)}><Button type='primary' style={{margin:'10px'}}>详情</Button></a>
          <Popconfirm
              title="是否删除该项?"
              onConfirm={() => this.handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button danger style={{margin:'10px'}} >删除</Button>
          </Popconfirm>
        </>
      }
    ]
    componentDidMount() {
      let { invoiceTitle='' } = this.state.searchUrl;
      if (invoiceTitle || status){
        this.formRef.current.setFieldsValue({ invoiceTitle,status });
        this.getDataList();
      }
      else{
        this.getDataList();
      }
    }
    
    //获取数据
    getDataList = async ():Promise<any> => {
      let { pageNum, pageSize } = this.state
      let { invoiceTitle = ''} = this.formRef.current.getFieldsValue();
      // this.props.history.push({search: `pageSize=${pageSize}&pageNum=${pageNum}&invoiceTitle=${invoiceTitle}&status=${status}`})
      let params: getInvoiceSettingParams = {
        invoiceTitle,
        page: pageNum,
        size: pageSize,
        sortBy: '-createTime', 
      }
      this.setState({ loading: true });
      let res = await getInvoiceSettingList(params);  
      this.setState({ loading: false })
      if (!res) return false;
      let { records, total } = res || {};
      let tableList = records.map((v:any, i:number) => {
        return {
          key: i,
          ...v
        }
      })
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
      this.formRef.current.resetFields();
      this.setState({
        pageNum: 1,
        pageSize: 10,
      }, () => {
        this.getDataList()
      })
    };
    // 删除
    handleDelete = async(record:any):Promise<any> => {
      let { id } = record;
      await deleteInvoiceSetting(id);
      this.refresh()
    }
    //新增发票抬头
    linkTo = () => {
      return `#/cash/invoice_records/add_invoice_title`
    }
    //跳转详情
    handleGoPage = (record:any) => {
      let { id } = record
      return `#/cash/invoice_records/invoice_setting_detail/${id}`
    }
    onTableChange = ({ current: pageNum, pageSize }:any) => {
      this.setState({
        pageSize,
        pageNum
      }, this.refresh)
    }
    //头部选择搜索栏
    renderForm = () => {
      return (
        <Form layout="inline" ref={this.formRef}>
          <Row style={{width:'100%'}}>
            <Col md={18} sm={18}>
            <FormItem label="发票抬头：" name='invoiceTitle'>
              <Input placeholder="发票抬头" style={{width:'300px'}}/>
            </FormItem>
            </Col>
            <Col md={6} sm={6} >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={this.query}>搜索</Button>
                <Button type="dashed" onClick={this.reset} style={{margin:'0 10px'}}>重置</Button>
              </div>
            </Col>
          </Row>
        </Form>
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
              <a href={this.linkTo()}><Button type="primary">新增发票抬头</Button></a>
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