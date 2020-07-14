import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Table, Button, Popconfirm, Modal, Divider, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  guaranteeNameParams,
  GetGuaranteeNameList,
  AddGuaranteeNameParams,
  addGuaranteeName,
  putGuaranteeName,
  delGuaranteeName,
}from '@/services/activity/guaranteeName'
const FormItem = Form.Item;
interface UserState {
  loading: boolean, 
  pageSize: number,
  pageNum: number,
  total: number,
  serviceModal: boolean,
  guaranteeNameList: Array<any>,
  id: number | string,
  isCharge: string | number,
}
interface UserProp  {
  history: any;
}
export default class GuaranteeCharge extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      serviceModal: false,// 添加/编辑服弹框
      guaranteeNameList: [],
      id: '',
      isCharge: ''
    }
  }
  columns = [     
    {
      title: '保障名称',
      dataIndex: 'name',
      width: '80%'
    },
    {
      title: '操作',
      render: (text:any, record:any) => <>   
      <a onClick={() => this.edit(record)}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <a style={{color:'red'}}>删除</a>
        </Popconfirm>  
      </>
    }
  ]
  componentDidMount () {
    this.getDataList()
  }
  // 刷新
  refresh = () => {
    this.getDataList();
  }
   // 重置
  resetForm = () => {
    this.formRef.current.resetFields();
  }
  // 获取数据
  getDataList = async ():Promise<any> => {
    let params: guaranteeNameParams = {
      page: this.state.pageNum,
      size: this.state.pageSize
    }
    this.setState({ loading: true });
    let res = await GetGuaranteeNameList(params);
    this.setState({ loading: false })
    if (!res) return false;
    let { records=[],total} = res;
    let guaranteeNameList = records && records.length != 0 ? records.map((v:any,i:number) => {
      return {
        key: i,
        ...v,
      }
    }) : []
    this.setState({ 
      guaranteeNameList,
      total: total || 0

    })
  }
  //  新增
  add = () => {
    this.setState({
      id:''
    })
    this.openModal(true);
    setTimeout( ()=> {
      this.formRef.current.resetFields()
    },100)
  }
  //  编辑回显
  edit = (record:any) => {
    let { id,name, isCharge} = record;
    this.setState({
      id
    });
    this.openModal(true);
    setTimeout( ()=> {
      this.formRef.current.setFieldsValue({ 
        name, 
        isCharge 
      })
    },100)
  }
  //添加/编辑弹窗
  openModal = (flag:boolean) => {
    this.setState({ serviceModal: flag })
  }
  // 删除
  handleDelete = async (record:any) => {
    let { id } = record;
    await delGuaranteeName(id)
    this.getDataList();
  }
  //分页
  onTableChange = ({current: pageNum, pageSize}:any) => {
    this.setState({
      pageSize,
      pageNum
    },this.getDataList)
  }
  //收费类型
  isChargeChange = (e:any) => {
    this.setState({
      isCharge: e.target.value
    })
  };
  // 校验/保存
  save = () => {
    this.formRef.current.validateFields().then( (values:any):any => {
      let { name, isCharge,} = values;
      let params:AddGuaranteeNameParams = {
        id:'', 
        name: name,
        isCharge: isCharge,
      }
      this.handleCommit(params)
    }).catch((err: Error) => {})
  }
  //提交
  handleCommit = async ( params: AddGuaranteeNameParams ) => {
    let {id} = this.state;
    if (id) {
     params.id = id;
     await putGuaranteeName(params);
    }else{
      await addGuaranteeName(params);
    };
    this.openModal(false)
    this.refresh()
  } 
  render() {
    let { loading, serviceModal, guaranteeNameList,} = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t:number) => <div>共{t}条</div>
    };
    return (
      <>
        <PageHeaderWrapper title={ "保障名称管理"}/>
        <Card style={{marginTop:'30px'}}>
          <Row style={{paddingBottom:"24px" }}>
            <Col md={24} sm={24} style={{textAlign:"right"}}>
                <Button type="primary" onClick={()=>this.add()}>添加保障名称</Button>
            </Col>
          </Row>
          <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
            <Col md={24} sm={24}>
              <Table         
              size="small"  
              loading={loading}
              dataSource={guaranteeNameList}
              onChange={this.onTableChange}
              pagination={pagination}
              columns={ this.columns }
              >
              </Table>
            </Col>
          </Row>
        </Card>      
        {/* 添加服务弹窗 '添加服务说明'*/}
        <Modal
        width="600px"
        title={`${this.state.id ?'添加':'编辑'}保障名称`}
        visible={serviceModal}
        onOk={this.save}
        onCancel={() => this.setState({
            serviceModal:false,
        })}
        >
          <Form ref={this.formRef}>
            <FormItem 
              label="保障名称："
              name='name'
              rules={[
                {
                  required: true,
                  message: '请填写保障名称',
                }
              ]}
            >
              <Input placeholder="请填写名称"/>
            </FormItem> 
            <FormItem 
              label="" 
              name='isCharge'
              rules={[
                {
                  required: true,
                  message: '请选择收费类型',
                }
              ]}
            >
              <Radio.Group onChange={this.isChargeChange}>
                <Radio value={1}>收费</Radio>
                <Radio value={0}>免费</Radio>
              </Radio.Group>
            </FormItem> 
          </Form>
        </Modal>
      </>
    )
  }
}