import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Table, Button, Modal, Divider, Popconfirm, Select} from 'antd';
import {
  guaranteeItemParams,
  GetGuaranteeItemList,
  getGuaranteeGroup,
  AddGuaranteeItemParams,
  addGuaranteeItem,
  editGuaranteeItem,
  delGuaranteeItem
}from '@/services/activity/guaranteeItem'
const { Option } = Select;
const FormItem = Form.Item;
interface UserState {
  loading: boolean, 
  pageSize: number,
  pageNum: number,
  total: number,
  openModal: boolean,
  isCharge: number,
  guaranteeList: Array<any>,
  guaranteeGroupList: Array<any>,
  id: number | string,
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
      openModal: false,
      isCharge: 1,     //收费类型
      guaranteeList: [], //数据集
      guaranteeGroupList: [],
      id:'',
    }
  }
  columns:Array<any> = [
    {
      title: '保障名称',
      dataIndex: 'guaranteeName',
    },
    {
        title: '服务项目',
        dataIndex: 'name',
      },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '类型',
      dataIndex: 'isCharge',
      render: (text:any) => <>
        {text == 1 ? '收费' : '免费'}
        </>
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
  ];
  componentDidMount () {  
    this.getDataList();    
    this.getGuaranteeGroup();          
  }
  //获取数据
  getDataList = async ():Promise<any> => {
    let params:guaranteeItemParams = {
      isCharge: 1,
      page: this.state.pageNum,
      size: this.state.pageSize
    }
    this.setState({ loading: true });
    let res = await GetGuaranteeItemList(params);
    this.setState({ loading: false })
    if (!res) return false;
    let { records, total } = res || [];
    let guaranteeList = records && records.length != 0 ? records.map((v:any,i:number) => {
      return {
        key: i,
        ...v,
      }
    }) : []
    this.setState({
      guaranteeList,
      total: total || 0
    })
  }
  //查询保障名称列表
  getGuaranteeGroup = async():Promise<any> => {
    this.setState({ loading: true })
    let res = await getGuaranteeGroup()
    this.setState({ loading: false })
    if (!res) return false;
    let { data } = res || [];
    let guaranteeGroupList = data && data.length != 0 ? data.map((v:any,i:number) => {
      return {
        key: i,
        ...v,
      }
    }) : []
    this.setState({
      guaranteeGroupList,
    })
  }
  // 刷新
  refresh = () => {
    this.getDataList();
  }
  // 重置
  resetForm = () => {
    this.formRef.current.resetFields();
  }
  // 查询
  query = () => {
    this.setState({
      pageSize: 10,
      pageNum: 0
    }, this.getDataList)
  }
  //
  goPage = () => {
    return `/#/activity/guarantee_name` 
  }
  //弹窗
  openModal = (flag=false) => {
    this.setState({openModal: flag})
  }
  //分页器切换
  onTableChange = ({ current: pageNum, pageSize }:any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.refresh)
  }
  //select
  onChange = (field:any) => {
    let { guaranteeGroupList } = this.state;
    guaranteeGroupList.forEach(element => {
      if(element.id == field){
        if(element.isCharge==1){
          this.setState({
              isCharge: 1
          });
        }else{
          this.setState({
              isCharge: 0
          });
        }
      }
    });
  }
  // 删除当前保障项目
  handleDelete = async (record:any) => {
    let { id } = record;
    await delGuaranteeItem(id)
    this.refresh();
  }
  // 新增
  add = () => {
    this.setState({
      id:''
    })
    this.openModal(true);
    setTimeout( ()=> {
      this.formRef.current.resetFields()
    },30)
  }
  // 编辑
  edit = (record:any) => {
    let { id,name, price, guaranteeId } = record;
    this.setState({
      id
    });
    this.openModal(true);
    setTimeout( ()=> {
      this.formRef.current.setFieldsValue({ 
        name, 
        price,
        guaranteeId 
      })
    },30)
  }
  // 校验/保存
  handleSave = () => {
    this.formRef.current.validateFields().then( (values:any):any => {
      let { isCharge } = this.state
      let { guaranteeId, price, name} = values;
      let params:AddGuaranteeItemParams = {
        id:'', //保障项目id
        guaranteeId, //关联保障名称id
        isCharge: isCharge, //是否收费
        price, //价格
        name, //保障项目名称
      }
      this.commitSave(params)
    }).catch((err: Error) => {})
  }
  //提交
  commitSave = async ( params: AddGuaranteeItemParams ) => {
    let {id} = this.state;
    if (id) {
     params.id = id;
     await editGuaranteeItem(params);
    }else{
      await addGuaranteeItem(params);
    };
    this.openModal(false)
    this.refresh()
  } 
  render(){
    let { loading, openModal ,guaranteeList, guaranteeGroupList, isCharge} = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t:number) => <div>共{t}条</div>
    }
    return(
      <>
        <Card style={{margin:'20px auto'}}>
          <Row style={{width:'100%',paddingBottom: '20px'}}>
            <Col span={24} style={{width:'100%',textAlign: "right",padding:"10px 0"}}>
              <Button type="primary" onClick={this.add}>添加服务</Button>
              <a href={this.goPage()}><Button type="primary" style={{marginLeft:"20px"}}> 保障名称管理</Button></a>
            </Col>
          </Row>
          <Form layout="inline">
            <Row style={{width:'100%'}}>
              <Col md={24} sm={24}>
                <Table   
                  rowKey={ record => record.id}       
                  loading={loading}
                  dataSource={guaranteeList}
                  onChange={this.onTableChange}
                  pagination={pagination}
                  columns={this.columns}
                >
                </Table>
              </Col>
            </Row>
          </Form>
        </Card>
        <Modal
          title={`${this.state.id ? '编辑' : '添加'}保障项目`}
          visible={openModal}
          onOk={this.handleSave}
          onCancel={()=>this.openModal(false)}
          maskClosable={false}
          centered={true}
        >
          <Form ref={this.formRef} >  
            <FormItem 
              label="保障名称："
              name='guaranteeId'
              rules={[
                {
                  required: true,
                  message: '请选择保障名称',
                }
              ]}
            >
              <Select
              showSearch
              style={{ width: 200 }}
              placeholder="选择一个保障名称"
              optionFilterProp="children"
              onChange={this.onChange}
              >
                {
                  Array.isArray(guaranteeGroupList) && guaranteeGroupList.map((v, i)=> <Option value={v.id} key={i}>{v.name}</Option>)
                }
              </Select>
            </FormItem> 
            <FormItem 
              label="保障项目："
              name="name"
              rules={[
                {
                  required: true,
                  message: '请填写保障项目',
                }
              ]}
            >
              <Input placeholder="请填写保障项目"/>
            </FormItem>
            { isCharge == 1 &&
            <FormItem 
              label="价格："
              name="price"
              rules={[
                {
                  required: true,
                  message: '请填写保障服务价格',
                }
              ]}
            >
               <Input />
            </FormItem>  
            }
          </Form>
        </Modal>
      </>
    )
  }
}
