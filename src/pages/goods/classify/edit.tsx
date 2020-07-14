import React, { Component } from 'react';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { handleUploadProps, } from '@/common/utils';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Tabs,
  Upload,
  Popconfirm,
  Modal,
  message,
  Tree,
} from 'antd';
import { tokenManage } from '@/constants/storageKey';
const { TreeNode } = Tree;
import { handlePicUrl } from '@/utils/utils';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { pictureImport } from '@/services/common';
import {
  getFirstCateList,
  getNextCateList,
  getParentCategories,
  getNextCategories,
  getCategoriesInfo,
  editaddClassifyNav,
  deleClassifyNav,
  clearCache,
} from '@/services/goods/classify/index';
const { TabPane } = Tabs;
const FormItem = Form.Item;
interface UserProp {
  history: any;
}
interface UserState {
  treeData: Array<any>;
  treeData_2: Array<any>;
  editorCateArray: Array<any>;
  imageUrl1: any;
  classifyNavEditor: boolean;
  loading: boolean;
  delBtnLoading: boolean;
  editBtnLoading: boolean;
  newParentCate: any;
  parentCateVisiable: boolean;
  cateId: number | string;
  parentCate1: string;
  classifyNavVisiable: boolean;
  grade: number | string;
  newClassifyNav: any;
  editorInfo: any;
}
export default class Classify extends Component<UserProp, UserState> {
  classInfo: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.classInfo = React.createRef();
    this.state = {
      treeData: [],
      treeData_2: [],
      editorCateArray: [],
      imageUrl1: '',
      classifyNavEditor: false,
      loading: false,
      newParentCate: {},
      parentCateVisiable: false,
      cateId: '',
      parentCate1: '',
      editorInfo: {},
      newClassifyNav: {},
      classifyNavVisiable: false,
      grade: '',
      delBtnLoading: false,
      editBtnLoading: false,
    };
  }
  componentDidMount() {
    this.getParentCategories();
  }

  callback = (key: number | string) => { };

  // -------------------------------------------------------------------------------------------------------------------------------------------- 编辑分类

  // 获取一级品类
  getFirstCateList = async (): Promise<void> => {
    let { treeData_2 } = this.state;
    treeData_2 = [];
    this.setState({ loading: true });
    let res = await getFirstCateList();
    this.setState({ loading: false });
    treeData_2.push(...(res || []));
    this.setState({ treeData_2 });
  };
  // 获取一级分类
  getParentCategories = async (): Promise<void> => {
    let { treeData } = this.state;
    treeData = [];
    this.setState({ loading: true });
    let res = await getParentCategories();
    this.setState({ loading: false });
    treeData.push(...(res || []));
    this.setState({ treeData });
  };

  // -------------------------------------------------------------------------------------------------------------------------
  // 选择父类
  onSelect2 = (selectedKeys: Array<any>, info: any) => {
    let data = info.node.props.dataRef || info.node.props;
    let { id } = data;
    if (!id) {
      let obj: any = { title: '顶级分类', id: 0 };
      this.setState({ newParentCate: obj, parentCateVisiable: false });
    } else {
      this.setState({ newParentCate: data, parentCateVisiable: false });
    }
  };

  // 编辑选择品类
  onEditorSelectClassify = (selectedKeys: Array<any>, info: any) => {
    let { editorCateArray } = this.state;
    editorCateArray = editorCateArray || [];
    let data = info.node.id ? info.node : info.node.data;;
    let { categoryId } = data;
    if (!categoryId) {
      let obj = { title: '顶级品类', categoryId: 0, id: 0 };
      let isOn = false;
      editorCateArray &&
        editorCateArray.length > 0 &&
        editorCateArray.forEach((item) => {
          if (item.categoryId == obj.categoryId) {
            isOn = true;
          }
        });
      if (!isOn) {
        editorCateArray.push(obj);
        this.setState({ editorCateArray, classifyNavEditor: false });
      } else {
        message.error('顶级品类已选择');
      }
    } else {
      let isOn = false;
      editorCateArray.forEach((item) => {
        if (item.categoryId == data.categoryId) {
          isOn = true;
        }
      });
      if (!isOn) {
        let isParent = false;
        editorCateArray.forEach((item) => {
          if (item.categoryId == data.parentId) {
            isParent = true;
          }
        });
        if (!isParent) {
          editorCateArray.push(data);
          this.setState({ editorCateArray, classifyNavEditor: false });
        } else {
          message.error('已选择该品类父类');
        }
      } else {
        message.error(data.title + '品类已选择');
      }
    }
  };
  // 删除关联分类
  deleEditorCateArray = (data: any, index: number) => {
    let { editorCateArray } = this.state;
    editorCateArray && editorCateArray.length > 0 && editorCateArray.splice(index, 1);
    this.setState({ editorCateArray });
  };
  // 编辑分类树--选择节点
  onEditorSelect = (selectedKeys: Array<any>, info: any) => {
    let { classifyNavVisiable } = this.state;
    let data = info.node.props.dataRef || info.node.props;
    let grade = data && data.grade;
    this.setState({ grade });
    let { id } = data;
    if (!classifyNavVisiable) {
      if (!id) return false;
      this.getInfo(id);
    } else {
      if (!id) {
        let obj = { title: '顶级分类', id: 0 };
        this.setState({ newParentCate: obj, classifyNavVisiable: false });
      } else {
        this.setState({ newParentCate: data, classifyNavVisiable: false });
      }
    }
  };
  // 获取前端分类详情
  getInfo = async (id: number) => {
    this.setState({ cateId: id }, () => {
      this.getCateInfoData(id)
    })

  };
  getCateInfoData = async (id: number) => {
    let res = await getCategoriesInfo({ id });
    if (!res) return false;
    let { data } = res;
    this.classInfo.current.setFieldsValue({
      title1: data && data.name,
      status1: data && data.status,
      sortIndex1: data && data.seq,
      keyword: data && data.keyword,
    });
    let { editorCateArray } = this.state;
    editorCateArray = (data && data.categoryRelVOS) || [];
    this.setState({
      parentCate1: data.parentCategoryName ? data.parentCategoryName : '顶级父类',
      editorInfo: data,
      cateId: data.id,
      imageUrl1: data.pic,
      editorCateArray,
    });
  }
  // 修改分类整理数据
  editCate = () => {
    let { cateId, imageUrl1, editorCateArray = [], editorInfo } = this.state;
    if (!cateId) {
      message.error('请选择要修改的分类');
      return false;
    }
    editorCateArray =
      editorCateArray &&
      editorCateArray.map((item) => {
        return {
          categoryId: item.id,
          status: item.status,
          // categoryId: item.categoryId,
          customerCategoryId: item.customerCategoryId,
          seq: item.seq,
          name: item.name || item.title,
        };
      });
    let { title1, sortIndex1, keyword } = this.classInfo.current.getFieldsValue();
    let query = {
      id: cateId,
      parentId: editorInfo.parentId,
      name: title1,
      seq: sortIndex1,
      pic: imageUrl1,
      categoryRelVOS: editorCateArray || [],
      keyword
    };
    this.sendEitorCate(query);
  };
  // 修改分类修改请求
  sendEitorCate = async (query: any) => {
    let res = await editaddClassifyNav(query);
    if (res) return false;
    let cateId = query.id;
    let { treeData } = this.state;
    treeData &&
      treeData.forEach((item) => {
        if (item.id === cateId) {
          item.title = query.name;
          item.seq = query.seq;
          item.parentId = query.parentId;
          item.pic = query.pic;
          item.categoryRelVOS = query.editorCateArray;
          item.keyword = query.keyword;
        } else {
          item.children &&
            item.children.length > 0 &&
            item.children.forEach((v: any) => {
              if (v.id === cateId) {
                v.title = query.name;
                v.seq = query.seq;
                v.parentId = query.parentId;
                v.pic = query.pic;
                v.categoryRelVOS = query.editorCateArray;
                v.keyword = query.keyword;
              } else {
                v.children &&
                  v.children.length > 0 &&
                  v.children.forEach((value: any) => {
                    if (value.id === cateId) {
                      value.title = query.name;
                      value.seq = query.seq;
                      value.parentId = query.parentId;
                      value.pic = query.pic;
                      value.categoryRelVOS = query.editorCateArray;
                      value.keyword = query.keyword;
                    }
                  });
              }
            });
        }
      });
    message.success('修改成功');
    this.setState({ treeData });
  };

  // 删除分类
  deleCate = async () => {
    let { cateId, treeData } = this.state;
    if (!cateId) {
      message.error('请选择要删除的分类');
      return false;
    }
    this.setState({ delBtnLoading: true });
    let children: Array<any> = [];
    treeData &&
      treeData.forEach((item, index) => {
        if (item.id == cateId) {
          children = treeData.splice(index, 1);
          return { ...item };
        } else {
          item.children &&
            item.children.length > 0 &&
            item.children.map((v: any, i: number) => {
              if (v.id == cateId) {
                children = item.children.splice(i, 1);
              } else {
                v.children &&
                  v.children.length > 0 &&
                  v.children.map((value: any, vindex: number) => {
                    if (value.id == cateId) {
                      children = v.children.splice(vindex, 1);
                    }
                  });
              }
            });
        }
      });
    let res = await deleClassifyNav({ cateId });
    this.setState({ delBtnLoading: false });
    if (res) return false;
    this.setState({
      treeData: this.updateTreeData(this.state.treeData, cateId, children),
      cateId: '',
      editorCateArray: [],
      imageUrl1: '',
      parentCate1: '',
    }, () => {
      if (this.classInfo && this.classInfo.current) {
        this.classInfo.current.resetFields(['title1', 'sortIndex1', 'keyword'])
      }
    });
  };

  // 编辑分类上传图片
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
          let imageUrl1 = info.file.response.data.picUrl;
          let that = this;
          setTimeout(function () {
            that.setState({ loading: false, imageUrl1 });
          }, 400);
        }
      }
    }
  };
  // 清除缓存
  doClearCache = async (): Promise<void> => {
    let res = await clearCache();
    message.success('成功清理缓存');
  };
  // 更新数据
  updateTreeData = (list: Array<any>, key: string | number, children: any): any => {
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
  // 异步加载 下级
  onLoadData = async (treeNode?: any) => {
    let { key } = treeNode;
    let children: Array<any> = [];
    if (!key) {
      children = await getParentCategories();
    } else {
      children = await getNextCategories({ id: key });
    }
    this.setState({
      treeData: this.updateTreeData(this.state.treeData, key, children),
    });
  };
  onLoadData_2 = async (treeNode: any) => {
    let { key } = treeNode;
    let children: Array<any> = [];
    if (!key) {
      children = await getFirstCateList();
    } else {
      children = await getNextCateList({ categoryId: key });
    }
    this.setState({
      treeData_2: this.updateTreeData_2(this.state.treeData_2, key, children),
    });
  };
  // 更新数据
  updateTreeData_2 = (list: Array<any>, key: string, children: any): any => {
    return list.map((node: any) => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return { ...node, children: this.updateTreeData_2(node.children, key, children) };
      }
      return node;
    });
  };











  // 分类树--展开--打开关闭
  onExpand = (expandedKeys: any, info: any) => {
    let categoryId = info.node.data.id;
    if (!categoryId) {
      this.getFirstCateLists()
    } else {
      this.getNextCateLists(categoryId)
    }

  };
  getFirstCateLists = async () => {
    let { treeData_2 } = this.state;
    treeData_2 = [];
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
        categoryId: v.id,
        ...v,
      }
    })
    treeData_2.push(...newData || []);
    this.setState({ treeData_2, })
  }
  getNextCateLists = async (categoryId: any) => {
    let { treeData_2 } = this.state;
    let res = await getNextCateList({ categoryId });
    if (!res) return false;
    let data = res;
    if (!data) return false;
    let  categories = data;
    categories = data && categories && categories.length != 0 ? categories.map((v: any, i: any) => {
      if (v.grade < 3) {
        v.children = [{}]
      }
      return {
        key: v.id,
        isLeaf: v.grade >= 3,
        title: v.name,
        categoryId: v.id,
        ...v,
      }
    }) : [];
    treeData_2 && treeData_2.forEach(item => {
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
    this.setState({ treeData_2 })
  }
  // 绘制分类树
  renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} data={item} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  render() {
    const { imageUrl1, treeData, treeData_2, editorCateArray, editBtnLoading } = this.state;
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
      onChange: this.handleChange,
      ...handleUploadProps(pictureImport, 'file', 'default', false),
    };
    return (
      <>
        <PageHeaderWrapper title={'前台分类'} className={styles.editorCateStyle}>
          <Card
            style={{ margin: '20px' }}
            extra={
              <>
                <Button
                  type="primary"
                  onClick={() => this.props.history.push(`/goods/classify/add`)}
                >
                  新增分类
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
              <TabPane tab="编辑分类" key="2">
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div>
                    <h1>[选择分类]</h1>
                    <Tree
                      showLine={true}
                      treeData={treeData}
                      onSelect={this.onEditorSelect}
                      loadData={this.onLoadData}
                    />
                  </div>
                  <div style={{ width: '45%' }}>
                    {
                      this.state.cateId && <>
                        <h1>分类详情</h1>
                        <Form
                          {...formItemLayout}
                          ref={this.classInfo}
                          initialValues={{
                            title1: this.state.editorInfo && this.state.editorInfo.name,
                            sortIndex1: this.state.editorInfo && this.state.editorInfo.partyCode,
                            keyword: this.state.editorInfo && this.state.editorInfo.keyword,
                          }}
                        >
                          <FormItem
                            label="名称: "
                            name="title1"
                            rules={[{ required: true, message: '请输入单品标题!' }]}
                            style={{ marginBottom: '5px' }}
                          >
                            <Input style={{ width: '200px' }} />
                          </FormItem>
                          <FormItem label="父类：" style={{ marginBottom: '5px' }} name="parentCate1">
                            <span>{this.state.parentCate1}</span>
                          </FormItem>
                          <FormItem label="排序：" name="sortIndex1" style={{ marginBottom: '5px' }}>
                            <InputNumber min={1} style={{ width: 200 }} />
                          </FormItem>
                          <FormItem label="分类图片：" style={{ marginBottom: '5px' }}>
                            <Upload
                              listType="picture-card"
                              className="avatar-uploader"
                              style={{ width: '98px', height: '116px' }}
                              {...props}
                              multiple={true}
                            >
                              {imageUrl1 ? (
                                <img
                                  src={handlePicUrl(imageUrl1)}
                                  alt="avatar"
                                  style={{ width: '100%' }}
                                />
                              ) : (
                                  uploadButton
                                )}
                            </Upload>
                          </FormItem>
                          {(this.state.grade >= 3 ? true : false) && (<>
                            <FormItem label="关联品类：" style={{ marginBottom: '5px' }}>
                              <Button
                                onClick={() => {
                                  this.setState({ classifyNavEditor: true,  }, () => {
                                    if(!this.state.treeData_2 || this.state.treeData_2.length == 0){
                                      this.getFirstCateLists();
                                    }
                                  });
                                }}
                                style={{ marginBottom: '4px' }}
                              >
                                选择
                          </Button>
                              <span style={{ marginLeft: '15px' }}>
                                {this.state.newClassifyNav && this.state.newClassifyNav.title}
                              </span>
                              <div>
                                {editorCateArray &&
                                  editorCateArray.map((item: any, index: number) => (
                                    <div
                                      className={styles.editorCateRelVOS}
                                      key={index}
                                    >
                                      <div
                                        className={styles.editorCateClose}
                                        onClick={() => this.deleEditorCateArray(item, index)}
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
                            >
                              <Form.Item name='keyword'>
                                <Input style={{ width: 200 }} />
                              </Form.Item>
                              <p style={{ color: 'rgb(165, 165, 165)' }}>输入检索关键字可进行精准检索</p>
                            </Form.Item>
                          </>
                          )}
                          <FormItem label="" style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Button type="primary" onClick={this.editCate} loading={editBtnLoading}>
                                修改
                          </Button>
                              <Popconfirm
                                title={`确定删除分类吗？`}
                                onConfirm={this.deleCate}
                                okText="确定"
                                cancelText="取消"
                              >
                                <Button type="danger" style={{ marginLeft: '30px' }}>
                                  删除
                            </Button>
                              </Popconfirm>
                            </div>
                          </FormItem>
                        </Form>
                      </>
                    }
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </PageHeaderWrapper>
        {/* 编辑选择品类 */}
        <Modal
          title="编辑选择品类"
          visible={this.state.classifyNavEditor}
          onCancel={() => this.setState({ classifyNavEditor: false,  })}
        >
          <Tree
            showLine
            checkable={false}
            onExpand={this.onExpand}
            // switcherIcon={<PlusOutlined />}
            onSelect={this.onEditorSelectClassify}
            autoExpandParent={false}
          >
            {this.renderTreeNodes(this.state.treeData_2)}
          </Tree>
        </Modal>
      </>
    );
  }
}
