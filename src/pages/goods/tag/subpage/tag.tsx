import styles from './index.less'
import React, { Component } from 'react';
import { message, Card, Form, Row, Col, Input, Select, Table, Button,Popconfirm, Modal,Tree} from 'antd';
import {
  getAllTagGroupList,
  tagListParams,
  getTagList,
  deleteTagItem,
  addTagItemParams,
  addTagItem,
  editTagItemParams,
  editTagItem,
  getFirstCategory,
  getNextCategory,
  batchTagGroupParams,
  batchTagGroup,
  getTagItemInfo
}from '@/services/goods/tag';
import { saveUrlParams } from '@/utils/utils';
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
  tagId: string,
  id: string,
  treeData: Array<any>,
  newClassifyNav: any,
  newCateArray: Array<any>,
  classifyNavVisiable: boolean,
  expandedKeys: number | string,
  selectedRowKeys: Array<any>,
  tagInfoData: any,
}
interface UserProp  {
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
      tagId: '',
      id: '',
      treeData: [],
      newClassifyNav: {},
      newCateArray: [],
      classifyNavVisiable: false,
      expandedKeys: '',
      selectedRowKeys: [],
      tagInfoData: {} //标签详情数据
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
        <Button onClick={ () => {this.handleEdit(record)}} type='primary' style={{marginRight:'10px',marginBottom: '10px'}}> 编辑</Button>
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
  //标签组
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
    saveUrlParams({
      key: 1,
      groupId: params.groupId,
      name: params.name,    
      pageNum: params.page, 
      pageSize: params.size,                       
    })
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
    this.setState({ id:'',newCateArray:[] })
    this.openEditModal(true);
    setTimeout( ()=> {
      this.editFormRef.current.resetFields()
    },10)
  }

  //编辑
  handleEdit = async(record:any) => {
    this.setState({loading:true});
    let res = await getTagItemInfo(record.id) || {};//获取标签项详情
    this.setState({loading:false});
    let { data } =  res || {};
    let {id, name,groupId, categories=[], searchKeyword } = data;

    let idsArr = categories ? categories.map((v:any)=>{
      return {
        id: v.categoryId,
        title: v.categoryName
      }
    }) : []
    this.setState({ 
      id,
      newCateArray: idsArr      //回显分类
    });
    this.openEditModal(true);
    setTimeout( ()=> {
      this.editFormRef.current.setFieldsValue({ name,groupId, searchKeyword })
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
    this.setState({selectedRowKeys:[]})
    this.groupFormRef.current.resetFields();
    this.openGroupModal(false);
    this.getDataList();
  }
  //获取一级品类
  getFirstCateList = async (): Promise<void> => {
    let { treeData } = this.state;
    treeData = [];
    this.setState({ loading: true });
    let res = await getFirstCategory();
    this.setState({ loading: false });
    treeData.push(...(res || []));
    this.setState({ treeData });
  };
  // 异步加载 下级
  onLoadData = async (treeNode?: any) => {
    let { key } = treeNode;
    let children: Array<any> = [];
    if (key == '-1') {
      children = await getFirstCategory();
    } else {
      children = await getNextCategory( {categoryId:key} );
    }
    this.setState({
      treeData: this.updateTreeData(this.state.treeData, key, children),
    });
  };
  // 更新数据
  updateTreeData = (list: Array<any>, key: string, children: any): any => {
    return list.map((node: any) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: this.updateTreeData(node.children, key, children) };
      }
      return node;
    });
  };
  // 删除不关联品类
  deleNewCateArray = (data: any, index: number) => {
    let { newCateArray } = this.state;
    newCateArray && newCateArray.length > 0 && newCateArray.splice(index, 1);
    this.setState({ newCateArray });
  };
  // 新增选择品类
  onSelectClassify = (selectedKeys: Array<any>, info: any) => {
    let { classifyNavVisiable, newCateArray } = this.state;
    let data = info.node.props.dataRef || info.node.props;
    let { status, seq, title, id } = data;
    if (!classifyNavVisiable) {
      if (!id) return false;
      this.formRef.current.setFieldsValue({
        title1: title,
        status1: status,
        sortIndex1: seq,
      });
    } else {
      if (!id) {
        let obj = { title: '顶级品类', id: 0 };
        let isOn = false;
        newCateArray&&newCateArray.forEach((item) => {
          if (item.id == obj.id) {
            isOn = true;
          }
        });
        if (!isOn) {
          newCateArray.push(obj);
          this.setState({ newCateArray, classifyNavVisiable: false });
        } else {
          message.error('顶级品类已选择');
        }
      } else {
        let isOn = false;
        newCateArray&&newCateArray.forEach((item) => {
          if (item.id == data.id) {
            isOn = true;
          }
        });
        if (!isOn) {
          let isParent = false;
          newCateArray&&newCateArray.forEach((item) => {
            if (item.id == data.parentId) {
              isParent = true;
            }
          });
          if (!isParent) {
            newCateArray.push(data);
            this.setState({ newCateArray, classifyNavVisiable: false });
          } else {
            message.error('已选择该品类父类');
          }
        } else {
          message.error(data.title + '品类已选择');
        }
      }
    }
    return true;
  };
  //验证处理
  handleCommit = () => {
    this.editFormRef.current.validateFields()
      .then(( values:any ):any => {
      let { name='', groupId='', searchKeyword='' } = values;
      let { id, newCateArray=[] } = this.state;
      newCateArray = newCateArray && newCateArray.map((item) => {
        return item.id
      });
      if(id){
        let params: editTagItemParams = {
          id, // 标签id (编辑时有)
          name, // 标签名
          groupId,  // 标签组
          categoryIds: newCateArray || [], // 关联品类
          searchKeyword,  //关键字
        }
        this.saveCommit(params)
      }else{
        let params: addTagItemParams = {
          name, // 标签名
          groupId,  // 标签组
          categoryIds: newCateArray || [], // 关联品类
          searchKeyword,  //关键字
        }
        this.saveCommit(params)
      }
      }).catch((err:Error)=>{})
  }
  //提交
  saveCommit = async(params:any) => {
    let {id} = this.state;
    if(id){
      await editTagItem(params)
    }else{
      await addTagItem(params);
    };
    this.editFormRef.current.resetFields();
    this.setState({newCateArray:[],treeData:[]})
    this.openEditModal(false);
    this.getDataList();
  }

  render(){
    let { loading,pageNum, pageSize,total,tagGroupData, editModal,groupModal,id,tableList,selectedRowKeys,treeData, newCateArray } = this.state;
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
            <Input maxLength={8} disabled={ id ? true : false}/>
          </FormItem>
          <FormItem name='groupId' label='标签组：' rules={[{required: true, message: '请选择标签组（若为空，请先新建标签组）'}]}>
            <Select>
              {
                Array.isArray(tagGroupData) && tagGroupData.map( (item:any,i:number) => 
                  <Option value={item.id} key={i}>{item.name}</Option>
                )
              }
            </Select>
          </FormItem>
          <Form.Item label="关联品类：" style={{ marginBottom: '24px' }}>
            <Button 
              onClick={() => {
                if (treeData && treeData.length <= 0) {
                  this.getFirstCateList();
                }
                this.setState({ classifyNavVisiable: true });
              }}           
            >   
              选择
            </Button>
            <div style={{paddingTop:"10px"}}>
              {
                newCateArray && newCateArray.length > 0 && newCateArray.map((item, index) => 
                <div className={styles.tagDivStyle} key={index}>
                  <div className={styles.closeStyle} onClick={() => this.deleNewCateArray(item, index)} >x</div>
                  {item.title || item.name}
                </div>
                )
              }
            </div>
          </Form.Item>
          <FormItem label='检索关键字'> 
            <FormItem name='searchKeyword' style={{marginBottom: 0}}>
              <Input placeholder='' maxLength={10}/>
            </FormItem>
            <span className={styles.spanColor}>输入检索关键字可进行精准检索</span>
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
          <FormItem name='batchGroupId' label='标签组：' rules={[{required: true, message: '请选择标签组（若为空，请先新建标签组）'}]}>
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
      {/* 编辑选择品类 */}
      <Modal
        width={600}
        title="选择品类"
        visible={this.state.classifyNavVisiable}
        onCancel={() => this.setState({ classifyNavVisiable: false })}
      >
        {
          treeData && treeData.length != 0 && 
          <Tree
          showLine={true}
          treeData={treeData}
          onSelect={this.onSelectClassify}
          loadData={this.onLoadData}
        />
        }
      </Modal>
    </>
    )
  }
}