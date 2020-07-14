import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Table, Button,Popconfirm,Modal } from 'antd';
import {
  tagGroupListParams,
  getTagGroupList,
  deleteTagGroupItem,
  addTagGroupItemParams,
  addTagGroupItem,
  editTagGroupItemParams,
  editTagGroupItem
}from '@/services/customer/tag';
const FormItem = Form.Item;
interface UserState {
  pageSize: number,
  pageNum: number,
  total: number,
  loading: boolean, 
  editModal: boolean,
  tableList: Array<any>,
  id: string,
}
interface UserProp  {
  history: any;
}
const { Search } = Input;
export default class TagGroup extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  formModalRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.formModalRef = React.createRef();
    this.state = {
      loading: false, 
      pageSize: 10,
      pageNum: 1,
      total: 0,
      editModal: false,
      tableList: [], 
      id: '',
    }
  }
  columns:Array<any> = [
    {
      title: '标签组名称',
      dataIndex: 'name',
      width:'80%'
    },
    {
      title: '操作',
      render: (text:any, record:any) => <>
        <Button onClick={ () => {this.handleEdit(record)}} type='primary' style={{marginRight:'10px'}}> 编辑</Button>
        <Popconfirm title= '确认删除吗？' onConfirm={() => this.handleDelete(record)}>
          <Button danger>删除</Button>
        </Popconfirm>
      </>
    }
  ]
  componentDidMount() {
      this.getDataList();
  }
  //获取数据
  getDataList = async() => {
    let { name } = this.formRef.current.getFieldsValue();
    let { pageNum, pageSize } = this.state;
    let params: tagGroupListParams = {
      name: name && name.trim(),
      page: pageNum,
      size: pageSize,
      sortBy: '-createTime',
    }
    // this.props.history.replace({
    //   query: {
    //     pageNum,
    //     pageSize,
    //     name
    //   }
    // })
    this.setState({ loading: true });
    let res = await getTagGroupList(params)
    this.setState({ loading: false })
    let { total, records=[] } = res;
    let tableList = records.map((v: any,i:number) => ({
      key: i,
      ...v
    }))
    this.setState({
      tableList,
      total
    })
  }
  //删除
  handleDelete = async(record:any) => {
    let { id } = record;
    await deleteTagGroupItem(id);
    this.getDataList();
  }
  //新建
  handleAdd = () => {
    this.setState({
      id:''
    })
    this.openEditModal(true);
    setTimeout( ()=> {
      this.formModalRef.current.resetFields()
    },10)
  }
  //编辑
  handleEdit = (record:any) => {
    let {id, name } = record;
    this.setState({
      id
    });
    this.openEditModal(true);
    setTimeout( ()=> {
      this.formModalRef.current.setFieldsValue({ 
        name, 
      })
    },10)
  }
  //编辑弹窗
  openEditModal = (flag:boolean) => {
    this.setState({
      editModal: flag,
    })
  }
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.getDataList)
  }
  //验证处理
  handleCommit = () => {
    this.formModalRef.current.validateFields()
      .then(( values:any ):any => {
      let { name = '' } = values;
      let { id } = this.state;
      if( id ) {
        let params:editTagGroupItemParams = {
          id,
          name, 
        }
        this.saveCommit(params)
      }else{
        let params:addTagGroupItemParams = {
          name, 
        }
        this.saveCommit(params)
      }
      }).catch((err:Error)=>{})
  }
  //新增
  saveCommit = async(params:any) => {
    let {id} = this.state
    if(id){
      await editTagGroupItem(params);
    }else{
      await addTagGroupItem(params);
    }
    this.formRef.current.resetFields();
    this.openEditModal(false)
    this.getDataList();
  }
  render(){
    let { loading,pageNum, pageSize,total, editModal,id, tableList } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum,
      pageSize: pageSize || 10,
      total: total,
      showTotal: (t: number) => <div>共{t}条</div>
    }
    return(
      <Card>
        <Row style={{width:'100%',display:'flex'}} gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Col md={18} sm={18} style={{justifyContent:'flex-start'}}>
            <Button onClick={this.handleAdd } type='primary'>新建标签组</Button>
          </Col>
          <Col md={6} sm={6} style={{textAlign:'right',justifyContent:'flex-end'}}>
            <Form ref={this.formRef} >
              <FormItem name='name'>
                <Search
                  enterButton="搜索"
                  style={{ width: 300 }}
                  placeholder='请输入标签组名称'
                  onSearch={this.getDataList}
                />
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row style={{width:'100%'}}>
          <Table
            rowKey={record => record.id}
            loading={loading}
            columns={this.columns}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination} 
            style={{width:'100%',marginTop:'30px'}}
          />
        </Row>
        <Modal 
        title={`${ id ? '编辑标签组':'新建标签组'}`}
        visible={editModal}
        onOk={this.handleCommit}
        onCancel={()=>{this.openEditModal(false)}}
        maskClosable={false}
        >
          <Form ref={this.formModalRef}>
            <FormItem name='name' label='名称：' rules={[{required: true, message: '请填写标签组名称'}]}>
              <Input maxLength={8}/>
            </FormItem>
          </Form>
        </Modal>
      </Card>
    )
  }
}