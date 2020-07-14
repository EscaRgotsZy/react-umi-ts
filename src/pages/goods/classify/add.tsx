import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Button,
  Breadcrumb,
  Tabs,
  Upload,
  Modal,
  message,
  Tree,
} from 'antd';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TreeNode } = Tree;
import { pictureImport } from '@/services/common';
import {
  getFirstCateList,
  getNextCateList,
  getParentCategories,
  getNextCategories,
  saveClassifyNav,
  clearCache,
} from '@/services/goods/classify/index';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { handlePicUrl, handleUploadProps } from '@/utils/utils';
import { tokenManage } from '@/constants/storageKey';

interface UserProp {
  history: any;
}
interface UserState {
  treeData: Array<any>;
  treeData_2: Array<any>;
  newParentCateVisiable: boolean;
  newParentCate: any;
  imageUrl: string;
  newCateArray: any;
  loading: boolean;
  btnLoading: boolean;
  newClassifyNav: Array<any>;
  classifyNavVisiable: boolean;
  expandedKeys: Array<any>;
  grade: number | string;
}
export default class ClassifyInfo extends Component<any, any> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      treeData: [],
      treeData_2: [{ title: '商品品类', children: [{}], key: '-1', grade: 0 }],
      newCateArray: [],
      newParentCateVisiable: false,
      newParentCate: '',
      imageUrl: '',
      loading: false,
      newClassifyNav: [],
      classifyNavVisiable: false,
      expandedKeys: [],
      grade: '',
      btnLoading: false,
      newTreeData: [
        {
          title: '商品品类',
          children: [{},],
          grade: 0,
          key: 0
        }
      ],

    };
  }
  componentDidMount() { }

  callback = (key: number | string) => { };

  // 新增分类
  handleAddCate = () => {
    let seq = this.formRef.current.getFieldValue('sortIndex');
    let title = this.formRef.current.getFieldValue('title');
    let keyword = this.formRef.current.getFieldValue('keyword');
    if (!title) {
      message.error('请输入分类名称');
      return false;
    }
    if (!seq) {
      message.error('请输入分类排序');
      return false;
    }
    let { imageUrl, newParentCate, newCateArray } = this.state;
    newCateArray =
      newCateArray &&
      newCateArray.map((item: any) => {
        return {
          categoryId: item.id,
          status: item.status,
          name: item.title,
          seq: item.seq,
        };
      });
    if (!newParentCate) {
      message.error('请选择父类');
      return false;
    }
    let categoryRelVOS = newCateArray || [];
    let query = {
      categoryRelVOS,
      parentId: newParentCate.id,
      pic: imageUrl,
      seq,
      status: newParentCate.status,
      name: title,
      keyword
    };
    return this.saveNewClassifyNav(query);
  };
  // 新增分类发送请求
  saveNewClassifyNav = async (query: any) => {
    this.setState({ btnLoading: true });
    let res = await saveClassifyNav(query);
    this.setState({ btnLoading: false });
    if (res) return false;
    message.success('新增成功');
    this.setState({ imageUrl: '', newParentCate: {}, newClassifyNav: [], newCateArray: [] });
    return this.formRef.current.resetFields(['title', 'sortIndex', 'keyword']);
  };
  // 新增分类图片上传
  handleChange = (info: any) => {
    let fileSize = info.size / 1025;
    if (fileSize > 500) {
      message.error('上传图片大小不能超过500K');
    } else {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        if (info.file.response.code == 200) {
          let imageUrl = info.file.response.data.picUrl;
          let that = this;
          setTimeout(function () {
            that.setState({ loading: false, imageUrl });
          }, 400);
        }
      }
    }
  };
  // 新增选择品类
  onSelectClassify = (selectedKeys: Array<any>, info: any) => {
    let { classifyNavVisiable, newCateArray } = this.state;
    let data = info.node.data || info.node;
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
        newCateArray.forEach((item: any) => {
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
        newCateArray.forEach((item: any) => {
          if (item.id == data.id) {
            isOn = true;
          }
        });
        if (!isOn) {
          let isParent = false;
          newCateArray.forEach((item: any) => {
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
  // -------------------------------------------------------------------------------------------------------------------------------------------- 编辑分类

  // 绘制分类树
  renderTreeNodes = (data: any) => {
    return (data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} data={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    }))
  }
  // 分类树--展开--打开关闭
  onExpand = (expandedKeys: any, info: any) => {
    let categoryId = info.node.props.data.data.id || info.node.props.data.id;
    if (!categoryId) {
      this.getFirstCateList()
    } else {
      this.getNextCateList(categoryId)
    }
    this.setState({
      expandedKeys,
    });
  };
  // 删除不关联品类
  deleNewCateArray = (data: any, index: any) => {
    let { newCateArray } = this.state;
    newCateArray && newCateArray.length > 0 && newCateArray.splice(index, 1)
    this.setState(newCateArray)
  }

  // 获取一级品类类

  getFirstCateList = async () => {
    let { treeData } = this.state;
    treeData = [];
    this.setState({ loading: true });
    let res: any = await getFirstCateList();
    this.setState({ loading: false })
    if (!res) return false;
    let data = res;
    let newData = data && data.length != 0 && data.map((v: any, i: any) => {
      v.children = [{}]
      return {
        key: v.id,
        isLeaf: v.grade >= 3,
        title: v.name,
        categoryId:v.id,
        ...v,
      }
    })
    treeData.push(...newData || []);
    this.setState({ treeData, })
  }
  // 获取下一级品类类
  getNextCateList = async (categoryId: any) => {
    let { treeData } = this.state;
    // this.setState({ loading: true });
    let res: any = await getNextCateList({ categoryId });
    // this.setState({ loading: false })
    if (!res) return false;
    let  categories =  res;
    categories = categories && categories.length != 0 && categories.map((v: any, i: any) => {
      if (v.grade < 3) {
        v.children = [{}]
      }
      return {
        key: v.id,
        isLeaf: v.grade >= 3,
        title: v.name,
        categoryId:v.id,
        ...v,
      }
    })
    treeData.forEach((item: any) => {
      if (item.id === categoryId) {
        item.children = categories
      } else {
        item.children.forEach((v: any) => {
          if (v.id == categoryId) {
            v.children = categories
          }
        })
      }
    })

    this.setState({ treeData: [...treeData] })
  }

  // -------------------------------------------------------------------------------------------------------------------------
  onNewExpand = (expandedNewKeys: any, info: any) => {
    let categoryId = info.node.props.data.id || info.node.props.data.data.id;
    let grade = info.node.props.data.grade || info.node.props.data.data.grade;
    if (!categoryId) {
      this.getNewFirstCateList()
    } else {
      if (grade < 2) {
        this.getNewNextCateList(categoryId)
      }
    }
  }
  // 获取一级分类
  getNewFirstCateList = async () => {
    let { newTreeData } = this.state;
    newTreeData[0].children = [];
    this.setState({ loading: true });
    let res: any = await getParentCategories();
    this.setState({ loading: false })
    if (!res) return false;
    let data = res;
    let newData = data && data.length != 0 && data.map((v: any, i: any) => {
      v.children = [{}]
      return {
        title: v.name,
        ...v,
        id: v.key
      }
    })
    newTreeData[0].children.push(...newData || []);
    this.setState({ newTreeData, })
  }
  // 获取前端分类下一级
  getNewNextCateList = async (categoryId: any) => {
    let { newTreeData } = this.state;
    this.setState({ loading: true });
    let res: any = await getNextCategories({ id: categoryId });
    this.setState({ loading: false })
    let data = res;
    if (!data) {
      newTreeData && newTreeData[0].children.forEach((item: any) => {
        if (item.id === categoryId) {
          item.children = null
        } else {
          item.children.forEach((v: any) => {
            if (v.id == categoryId) {
              v.children = null
            }
          })
        }
      })
      this.setState({ newTreeData })
    };
    let categories = data && data.length != 0 && data.map((v: any, i: any) => {
      v.title = v.name;
      if (v.grade == 1) {
        v.children = [{}]
      }
      return {
        ...v
      }
    })
    newTreeData && newTreeData[0].children.forEach((item: any) => {
      if (item.id === categoryId) {
        item.children = categories
      } else {
        item.children && item.children.length > 0 && item.children.forEach((v: any) => {
          if (v.id == categoryId) {
            v.children = categories
          }
        })
      }
    })
    this.setState({ newTreeData })
  }
  // 选择父类
  onNewSelect = (selectedKeys: any, info: any) => {
    let data = info.node.id ? info.node : info.node.data;
    let { id } = data;
    let grade = data && data.grade;
    if (!id) {
      let obj = { title: '顶级分类', id: 0 }
      this.setState({ newParentCate: obj, newParentCateVisiable: false })
    } else {
      if (data && data.grade == 3) {
        message.error('三级分类不能作为父类');
        return false
      } {
        this.setState({ newParentCate: data, newParentCateVisiable: false, grade })
      }
    }
  }

  // 绘制分类树
  renderTreeNodes2 = (data: any) => {
    return (
      data.map((item: any) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} data={item} >
              {this.renderTreeNodes2(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} />;
      })
    )
  }


  // 清除缓存
  doClearCache = async () => {
    let [err] = await clearCache();
    if (err) return false;
    message.success('成功清理缓存')
  }
  render() {
    const { imageUrl, treeData, treeData_2, btnLoading } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };

    const uploadButton = (
      <div>
        {this.state.loading ? <SyncOutlined spin /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );
    const props = {
      ...handleUploadProps(pictureImport, "file", 'default', false),
      onChange: this.handleChange,
    };
    return (
      <>
        <PageHeaderWrapper title={'前台分类'}>
          <Card>
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>商品管理</Breadcrumb.Item>
              <Breadcrumb.Item>前端分类</Breadcrumb.Item>
            </Breadcrumb>
          </Card>
          <Card
            style={{ margin: '20px' }}
            extra={
              <>
                <Button
                  type="primary"
                  onClick={() => this.props.history.push(`/goods/classify/edit`)}
                >
                  编辑分类
                </Button>
                <Button
                  style={{ marginLeft: '20px' }}
                  type="primary"
                  onClick={() => {
                    this.doClearCache();
                  }}
                >
                  清除缓存
                </Button>
              </>
            }
          >
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="创建分类" key="1">
                <Row>
                  <Col span={12} offset={6}>
                    <h1>创建分类：</h1>
                    <Form {...formItemLayout} ref={this.formRef}>
                      <FormItem
                        label="名称: "
                        style={{ marginBottom: '5px' }}
                        name="title"
                        rules={[{ required: true, message: '请输入单品标题!' }]}
                      >
                        <Input style={{ width: '200px' }} />
                      </FormItem>
                      <FormItem label="父类：" style={{ marginBottom: '5px' }}
                        name="parentCate"
                        rules={[{ required: true, message: '请选择父类!' }]}>
                        <Button onClick={() => this.setState({ newParentCateVisiable: true })}>
                          选择
                        </Button>
                        <span style={{ marginLeft: '15px' }}>
                          {this.state.newParentCate && this.state.newParentCate.title}
                        </span>
                      </FormItem>
                      <FormItem label="排序：" style={{ marginBottom: '5px' }} name="sortIndex">
                        <InputNumber min={1} max={10} style={{ width: 200 }} />
                      </FormItem>
                      <FormItem label="分类图片：" style={{ marginBottom: '5px' }} name="imageUrl">
                        <Upload
                          listType="picture-card"
                          className="avatar-uploader"
                          style={{ width: '98px', height: '116px' }}
                          {...props}
                          multiple={true}
                        >
                          {imageUrl ? (
                            <img
                              src={handlePicUrl(imageUrl)}
                              alt="avatar"
                              style={{ width: '100%' }}
                            />
                          ) : (
                              uploadButton
                            )}
                        </Upload>
                      </FormItem>
                      {(this.state.grade >= 2 ? true : false) && (
                        <>
                          <FormItem label="关联品类：" style={{ marginBottom: '5px' }} rules={[{ required: true, message: '请选择关联品类!' }]}>
                            <Button
                              onClick={() => {
                                if (this.state.treeData && this.state.treeData.length <= 0) {
                                  this.getFirstCateList();
                                }
                                this.setState({ classifyNavVisiable: true });
                              }}
                            >
                              选择
                          </Button>
                            <div style={{margin:'10px 0'}}>
                              {this.state.newCateArray &&
                                this.state.newCateArray.length > 0 &&
                                this.state.newCateArray.map((item: any, index: any) => (
                                  <div
                                    style={{
                                      position: 'relative',
                                      float: 'left',
                                      height: '32px',
                                      lineHeight: '32px',
                                      marginBottom: '5px',
                                      marginRight: '5px',
                                      padding: '0 15px',
                                      background: '#ddd',
                                      borderRadius: '3px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '16px',
                                        cursor: 'pointer',
                                        height: '16px',
                                        background: 'white',
                                        position: 'absolute',
                                        right: '-6px',
                                        top: '-7px',
                                        fontSize: '12px',
                                        lineHeight: '15px',
                                        textAlign: 'center',
                                        borderRadius: '50%',
                                      }}
                                      onClick={() => this.deleNewCateArray(item, index)}
                                    >
                                      x
                                  </div>
                                    {item.title || item.name}
                                  </div>
                                ))}
                            </div>
                          </FormItem>
                          <Form.Item label="检索关键字:" style={{ marginBottom: '5px' }}
                            rules={[{ max: 50, message: '检索关键字不能超过50是个字符' }]}
                            name='keyword'>
                            <Input style={{ width: 200 }} />
                            <p style={{ color: 'rgb(165, 165, 165)' }}>输入检索关键字可进行精准检索</p>
                          </Form.Item>
                        </>
                      )}
                    </Form>
                    <Button
                      onClick={this.handleAddCate}
                      type="primary"
                      style={{ margin: '0 auto', display: 'flex' }}
                      loading={btnLoading}
                    >
                      新增
                    </Button>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </PageHeaderWrapper>

        {/* 新建选择父类 */}
        <Modal
          title="新建选择父类"
          visible={this.state.newParentCateVisiable}
          onCancel={() => this.setState({ newParentCateVisiable: false })}
        >
          <Tree
            showLine
            checkable={false}
            onExpand={this.onNewExpand}
            // switcherIcon={<PlusOutlined />}
            onSelect={this.onNewSelect}
            autoExpandParent={false}
          >
            {this.renderTreeNodes2(this.state.newTreeData)}
          </Tree>
        </Modal>
        {/* 新建选择品类 */}
        <Modal
          title="选择品类"
          visible={this.state.classifyNavVisiable}
          onCancel={() => this.setState({ classifyNavVisiable: false })}
        >
          <Tree
            showLine
            checkable={false}
            onExpand={this.onExpand}
            // switcherIcon={<PlusOutlined />}
            onSelect={this.onSelectClassify}
            autoExpandParent={false}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </Tree>
        </Modal>

      </>
    )
  }
}
