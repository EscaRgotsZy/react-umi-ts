import React, { Component } from 'react';
import { message, Card, Form, Row, Col, Input, Select, Table, Button,Popconfirm, Modal } from 'antd';
import {
  getAllTagGroupList,
  tagListParams,
  getTagList,
  deleteTagItem,
  addTagItemParams,
  addTagItem,
  editTagItemParams,
  editTagItem,
  batchTagGroupParams,
  batchTagGroup,
}from '@/services/customer/tag';
const { Option } = Select;
const FormItem = Form.Item;
interface UserState {
  loading: boolean, 
  pageSize: number,
  pageNum: number,
  total: number,
  groupModal: boolean,
  editModal: boolean,
  tableList: Array<any>,
  tagGroupData: Array<any>,
  id: string,
  selectedRowKeys: Array<any>,
}
interface UserProp  {
  history: any;
}
export default class Tag extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  editFormRef: React.RefObject<any>;
  groupFormRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.editFormRef = React.createRef();
    this.groupFormRef = React.createRef();
    this.state = {
      loading: false, 
      pageSize: 10,
      pageNum: 1,
      total: 0,
      groupModal: false,
      editModal: false,
      tableList: [], 
      tagGroupData: [],
      id: '',
      selectedRowKeys: [],
    }
  }
  columns:Array<any> = [
    {
      title: '标签名称',
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
    this.getTagGroupList();
  }
  //获取所有标签组
  getTagGroupList = async() => {
    let res = await getAllTagGroupList();
    let { data=[] } = res;
    let tagGroupData = data.map((v: any,i:number) => ({
      key: i,
      ...v
    }))
    this.setState({ tagGroupData })
  }
  //获取数据
  getDataList = async() => {
    let { groupId, name } = this.formRef.current.getFieldsValue();
    let { pageNum, pageSize } = this.state;
    let params: tagListParams = {
      groupId,
      name: name && name.trim(),
      page: pageNum,
      size: pageSize,
      sortBy: '-createTime',
    }
    // this.props.history.replace({
    //   query: {
    //     pageNum,
    //     pageSize,
    //     groupId,
    //     name
    //   }
    // })
    this.setState({ loading: true });
    let res = await getTagList(params)
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
    await deleteTagItem(id);
    this.getDataList();
  }
  //新增
  handleAdd = () => {
    this.setState({ id:'' })
    this.openEditModal(true);
    setTimeout( ()=> {
      this.editFormRef.current.resetFields()
    },10)
  }
  //编辑
  handleEdit = (record:any) => {
    let { id, name, groupId } = record;
    this.setState({ id });
    this.openEditModal(true);
    setTimeout( ()=> {
      this.editFormRef.current.setFieldsValue({ name, groupId })
    },10)
  }
  //编辑弹窗
  openEditModal = (flag:boolean) => {
    this.setState({ editModal: flag })
  }
  //分组弹窗
  openGroupModal = (flag:boolean) => {
    this.setState({ groupModal: flag })
  }
  //table切换
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.getDataList)
  }
  // 校验批量分组
  handleSelect = ():any => {
    let { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) return message.warn('请先至少选择一个标签项')
    this.openGroupModal(true);
  }
  //提交批量分组
  handleCommitBatch = async() => {
    let { batchGroupId } = this.groupFormRef.current.getFieldsValue();
    let { selectedRowKeys } = this.state;
    if( !batchGroupId ) return message.error('请选择标签组')
    let params: batchTagGroupParams = {
      groupId: batchGroupId,
      tagIds: selectedRowKeys,
    };
    this.setState({ loading: true });
    let res = await batchTagGroup(params);
    this.setState({ loading: false });
    if(res[0]==true){
      message.error("分组失败")
    }else{
      message.success("分组成功")
    }
    this.setState({selectedRowKeys:[]});
    this.groupFormRef.current.resetFields();
    this.openGroupModal(false);
    this.getDataList();
  }
  //验证处理
  handleCommit = () => {
    this.editFormRef.current.validateFields()
      .then(( values:any ):any => {
      let { name='', groupId='' } = values;
      let { id } = this.state; 
      if( id ){
        let params: editTagItemParams = {
          id, // 标签id (编辑时有)
          name, // 标签名
          groupId,  // 标签组
        }
        this.saveCommit(params)
      }else{
        let params: addTagItemParams = {
          name, // 标签名
          groupId,  // 标签组
        }
        this.saveCommit(params)
      }
      }).catch((err:Error)=>{})
  }
  //提交
  saveCommit = async(params:any) => {
    let { id } = this.state;
    if(id){
      await editTagItem(params)
    }else{
      await addTagItem(params);
    };
    this.editFormRef.current.resetFields();
    this.openEditModal(false);
    this.getDataList();
  }

  render(){
    let { loading,pageNum, pageSize,total,tagGroupData, editModal,groupModal,id,tableList,selectedRowKeys} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    // 标签列表选择
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys:any, selectedRows:any) => {
        this.setState({ selectedRowKeys })
      },
    };
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum,
      pageSize: pageSize || 10,
      total: total,
      showTotal: (t: number) => <div>共{t}条</div>
    }
    return(
    <>
      <Card>
        <Row style={{width:'100%'}} gutter={{ md: 0, lg: 0, xl: 0 }}>
          <Col md={6} sm={6}>
            <Button onClick={ this.handleAdd } style={{marginRight:'10px'}} type='primary'>新增标签</Button>
            <Button onClick={ this.handleSelect } type='dashed'>批量分组</Button>
          </Col>
          <Col md={16} sm={16} style={{display:'flex',justifyContent:'flex-end'}}>
            <Form ref={this.formRef} layout={"inline"} >
              <FormItem name='groupId' label='标签组：'>
                <Select style={{width:'160px'}}>
                  {
                    Array.isArray(tagGroupData) && tagGroupData.map( (item:any,i:number) => 
                      <Option value={item.id} key={i}>{item.name}</Option>
                    )
                  }
                </Select>
              </FormItem>
              <FormItem name='name' label='标签名称：' >
                <Input style={{width:'160px'}}/>
              </FormItem>
            </Form>
          </Col>
          <Col md={2} sm={2} style={{textAlign:'right'}}>
            <Button onClick={ this.getDataList } type='primary'>查询</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row style={{width:'100%'}}>
          <Table
            rowKey={record => record.id}
            loading={loading}
            columns={this.columns}
            dataSource={tableList}
            rowSelection={rowSelection}
            onChange={this.onTableChange}
            pagination={pagination} 
            style={{width:'100%'}}
          />
        </Row>
      </Card>
      <Modal 
        title={`${ id ? '编辑标签':'新建标签'}`}
        visible={editModal}
        onOk={this.handleCommit}
        onCancel={()=>{this.openEditModal(false)}}
        maskClosable={false}
      >
        <Form ref={this.editFormRef} {...formItemLayout}>
          <FormItem name='name' label='名称：' rules={[{required: true, message: '请填写标签名称'}]}>
            <Input maxLength={8}/>
          </FormItem>
          <FormItem name='groupId' label='标签组：' rules={[{required: true, message: '请选择标签组(若为空，请先新建标签组)'}]}>
            <Select>
              {
                Array.isArray(tagGroupData) && tagGroupData.map( (item:any,i:number) => 
                  <Option value={item.id} key={i}>{item.name}</Option>
                )
              }
            </Select>
          </FormItem>
        </Form>
      </Modal>
      <Modal 
        title='批量分组'
        visible={groupModal}
        onOk={this.handleCommitBatch}
        onCancel={()=>{this.openGroupModal(false)}}
        maskClosable={false}
      >
        <Form ref={this.groupFormRef} {...formItemLayout}>
          <FormItem name='batchGroupId' label='标签组：' rules={[{required: true, message: '请选择标签组'}]}>
            <Select style={{width:'85%'}}>
              {
                Array.isArray(tagGroupData) && tagGroupData.map( (item,i) => 
                  <Option value={item.id} key={i}>{item.name}</Option>
                )
              }
            </Select>
          </FormItem>
        </Form>
      </Modal>
    </>
    )
  }
}