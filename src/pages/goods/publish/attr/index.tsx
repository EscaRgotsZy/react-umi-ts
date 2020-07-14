import React, { Component, useImperativeHandle } from 'react';
import { Input, Form, Checkbox, Modal, Button, Row, Col, message, Popconfirm, Table, Upload, Card } from 'antd';
import { MinusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  postSaveAttributeOverlay,
  getUseAttributeOverlay,
  deleteAttributeOverlay,
} from '@/services/goods/upload/attr';
interface UserProp {
  props: any;
  editAttributes: any;
  history: any;
  location: any;
  match: any;
  loading: boolean;
}
interface UserState {
  editingKey: string;
  attributeList: Array<any>;
  attrValueIndexFirst: any;
  attrValueIndexSencond: any;
  isoks: boolean;
  modalState: boolean;
  useAbtState: boolean;
  getAbtListLoading: boolean;
  AbtList: any;
  paramKey: any;
}
export default class AttrLayer extends Component<any, any> {
  newAttrFormRef: React.RefObject<any>;
  modalNameRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.newAttrFormRef = React.createRef();
    this.modalNameRef = React.createRef();
    this.state = {
      editingKey: '',
      attributeList: [],
      attrValueIndexFirst: '',
      attrValueIndexSencond: '',
      isoks: false,
      modalState: false,
      useAbtState: false,
      getAbtListLoading: false,
      AbtList: [],
      paramKey: '',
    };
  }
  page: any = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }
  // 分页
  onTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.page, { pageNum: current, pageSize: pageSize })
    this.getAbtList()
  }
  compone(nextProps: any) {



  }
  componentDidMount() {
    let { attributeList } = this.state;
    let nextProps = this.props;
    if (nextProps.editAttributes) {
      let { attrResultVOS } = nextProps.editAttributes;
      attributeList = attrResultVOS && attrResultVOS.length > 0 && attrResultVOS.map((item: any) => {
        let valueList: any = []
        item.attrValueVOS.forEach((element: any) => {
          valueList.push(element.name)
        });
        return {
          key: item.attrKeyVO.attrName,
          value: valueList
        }
      })
    }

    this.setState({ attributeList, })
  }
  // 父组件调用子组件方法获取数据
  childMethod = () => {
    let { attributeList = [] } = this.state;
    attributeList = attributeList || [];
    let isok = true;
    attributeList.forEach((item:any) => {
      if (item.value && item.value.length == 0) {
        isok = false
      } else {
        item.value.forEach((v: any) => {
          if (!v) {
            isok = false
          }
        })
      }
    })
    if (isok) {
      return { attributeList }
    } else {
      // message.error('商品属性值不能存在空值');
      return false
    }
  }
  // 点击属性
  onChange = (checkedValues: any, type: any) => {
    this.setState({ attrValueIndexFirst: type.index, attrValueIndexSencond: type.i }) // 点击属性值根据两重下标确定当前的属性值是那个一个;
    /*
      确定动态属性 displayType   (1:图片 ---- 0：文本)

    */
     let { loadDynamicAttribute, attributeList } = this.state;
    attributeList.forEach((item:any, index:any) => {  // 点击当前属性值 让其他属性值不勾选 并 disable
      item.value.forEach((v: any, i: number) => {
        // this.state[] = '';
        this.setState({
          [`keyState_${index}_${i}`] : ''
        })
      })
    })
    this.setState({
      [`keyState_${type.index}_${ type.i }`]:!this.state[`keyState_${type.index}_${ type.i }`]
    })
    }
    // 修改属性值
    changeAttrValue = (e: any, type: any, changeType: any) => {
      let attrValueIndexFirst = type.index;
      let attrValueIndexSencond = type.i;
      let { attributeList = [] } = this.state;
      if (changeType == 1) {
        attributeList[attrValueIndexFirst].value[attrValueIndexSencond] = e.target.value;
        this.setState({ attributeList })
      } else {
        if (e.target.value) {
          attributeList[attrValueIndexFirst].value[attrValueIndexSencond] = e.target.value;
          this.setState({ attributeList })
        } else {
          attributeList[attrValueIndexFirst].value[attrValueIndexSencond] = ''
          message.error('属性值不能为空');
          this.setState({ attributeList })
        }
      }


    }
    // 删除属性值
    delAbtValue = (indexData: any) => {
      let { index, i } = indexData;
      let { attributeList, } = this.state;

      attributeList && attributeList.length != 0 && attributeList[index] && attributeList[index].value.length != 0 && attributeList[index].value.splice(i, 1);
      this.setState({ attributeList, })
    }

    // 新建商品属性取消
    handleCancel = () => {
      this.newAttrFormRef.current.resetFields()
      this.setState({ isoks: false });
    }
    // 新建商品属性确定
    handleOk = () => {
      let attributeList = this.state.attributeList || [];
      let { paramKey } = this.state;
      this.newAttrFormRef.current.validateFields().then((values: any): any => {
        let lastObj: any = {};
        let ccArray = [];
        lastObj.key = paramKey
        for (let i = 0; i < 10; i++) {
          if (values[`paramValue${i}`]) {
            ccArray.push(values[`paramValue${i}`])
          }
        }
        lastObj.value = ccArray;
        if (!lastObj.key || lastObj.value.length <= 0) {
          this.setState({ isoks: false }, () => {
            message.error('新建属性不符合基础属性格式');
          })
        } else {
          attributeList.push(lastObj)
          this.setState({ isoks: false, attributeList }, () => {
            message.success('添加成功')
          })
        }
      }).catch((err: Error) => { })
    }
    // 点击新增
    addNewInfo = () => {
      let paramValueList: any = [];
      for (let i = 0; i < 12; i++) {
        paramValueList.push(`paramValue${i}`)
      }
      this.setState({ isoks: true, paramKey: '' }, () => {
        if (this.newAttrFormRef.current) {
          this.newAttrFormRef.current.resetFields(paramValueList);
        }
      })
    }
    // 确定保存模板
    saveModalData = async () => {
      let { modalName } = this.modalNameRef.current.getFieldsValue(['modalName']);
      let { attributeList } = this.state;
      let content: any = attributeList.map((item:any) => {
        return {
          key: item.key,
          value: JSON.stringify(item.value)
        }
      })
      content = JSON.stringify(content)
      let userAttributeParam = {
        content,
        name: modalName
      }
      let res = await postSaveAttributeOverlay({ ...userAttributeParam });
      if (!res) {
        message.error('添加失败');
        this.setState({ modalState: false });
      } else {
        message.success('添加成功');
        this.setState({ modalState: false });
      }
    }

    // 删除属性
    deleteAbt = (index: any) => {
      let { attributeList, } = this.state;
      attributeList.splice(index, 1);
      this.setState({ attributeList })
    }
    // 使用模板弹窗
    useAbtModal = () => {
      this.getAbtList()
      this.setState({ useAbtState: true })
    }
    // 获取属性模板List
    getAbtList = async () => {
      this.setState({ getAbtListLoading: true });
      let size = this.page.pageSize;
      let page = this.page.pageNum;
      let query = {
        page,
        size
      }
      let res = await getUseAttributeOverlay({ ...query });
      this.setState({ getAbtListLoading: false });
      if (!res) return false
      let AbtList = []
      AbtList = res.data.records;
      this.page.total = res.data && res.data.total || 0;  // 总数据条数
      this.setState({ AbtList })
    }
    // 使用属性模板
    useAbt = (record: any) => {
      let { attributeList } = this.state;
      let dataList = JSON.parse(record.content)
      attributeList = dataList;
      dataList.forEach((item: any) => {
        item.value = JSON.parse(item.value)
      })
      this.setState({ attributeList, useAbtState: false });
    }
    // 删除属性模板列表
    deleteAbtModal = async (record: any) => {
      let { id } = record;
      let res = await deleteAttributeOverlay(id);
      if (!res) return false;
      this.getAbtList()
    }
    // 保存模板弹框
    saveAttrModal = () => {
      if (this.state.attributeList.length > 0) {
        this.setState({ modalState: true })
      } else {
        message.error('新建商品属性不能为空')
      }
    }
    // 增加属性
    addNewAttr = (value: any, index: any) => {
      let { attributeList } = this.state;
      attributeList.forEach((item:any, i:any) => {
        // this.state[`isAdd_${i}`] = false;
        this.setState({
          [`isAdd_${i}`]:false
        })
        if (value && index == i) {
          if (item.value.indexOf(value) < 0) {
            item.value.push(value);
          }
        }
      })
      this.setState({
        [`isAdd_${index}`] : false
      })
      // this.state[`isAdd_${index}`] = false;
      this.setState({})
    }
    // 自动获取焦点input闪烁
    getFocus(index: any) {
      this[`myRef_${index}`].current.focus();
    }
    render() {
      const { attributeList = [], paramKey } = this.state;
      const that = this;
      const modalInputLayout = {
        labelCol: {
          xs: { span: 5 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 18 },
          sm: { span: 18 },
        },
      }
      // 分页器
      const pagination = {
        showQuickJumper: true,
        showSizeChanger: true,
        current: this.page.pageNum,
        pageSize: this.page.pageSize || 10,
        total: this.page.total,
        showTotal: (t: number) => <div>共{t}条</div>
      }
      // 上传图片
      return (
        <Card title='二、商品属性' hoverable loading={this.props.loading}>
          <ul>
            <li>
              {
                attributeList && attributeList.length > 0 && attributeList.map((item:any, index:any) => {
                  this[`myRef_${index}`] = React.createRef();
                  return (
                    <Row style={{ paddingBottom: '20px' }} key={index}>
                      <Col span={24}>
                        <div style={{ width: '100%', marginBottom: '20px', fontSize: '15px', display: 'flex', justifyContent: 'space-between' }}>{item.key} :
                      <div><Popconfirm
                            title={`是否删除${item.key}属性?`}
                            onConfirm={() => this.deleteAbt(index)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <CloseCircleOutlined />
                          </Popconfirm></div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                          {item.value.map((v: any, i: any) => (
                            <Checkbox checked={this.state[`keyState_${index}_${i}`]} className={v} onChange={(e) => this.onChange(e, { index, i })} style={{ margin: '8px' }} key={i}>
                              <Input defaultValue={v}
                                disabled={!this.state[`keyState_${index}_${i}`]} style={{ width: '100px' }}
                                onChange={(e) => this.changeAttrValue(e, { index, i }, 1)}
                                onBlur={(e) => this.changeAttrValue(e, { index, i }, 2)}
                                value={v} />
                              {
                                this.state[`keyState_${index}_${i}`] &&
                                <Popconfirm
                                  title={`是否删除属性值：${v}?`}
                                  onConfirm={() => this.delAbtValue({ index, i })}
                                  okText="确定"
                                  cancelText="取消"
                                >
                                  <span style={{ marginLeft: '3px' }} ><MinusOutlined /></span>
                                </Popconfirm>
                              }
                            </Checkbox>
                          ))}
                          {/* {
                                this.state[`isAdd_${index}`] ? <Input ref={this[`myRef_${index}`]} style={{ width: '100px', marginLeft: '26px' }}
                                    onPressEnter={(e) => this.addNewAttr(e.target.value, index)}
                                    onBlur={(e) => this.addNewAttr(e.target.value, index)}
                                /> :
                                    <div onClick={() => {
                                    this.state[`isAdd_${index}`] = true;
                                    this.setState({}, () => {
                                        this.getFocus(index);
                                    });
                                    }}>
                                    <span style={{ padding: '6px', border: '1px dashed #ddd', borderRadius: '5px', marginLeft: '26px', justifyContent: 'center', alignItems: 'center', fontSize: '10px', height: '30px' }}>
                                        <Icon type="plus" style={{ margin: '0 3px' }} />增加属性值</span>
                                    </div>
                                } */}
                        </div>
                      </Col>
                    </Row>
                  )
                })
              }
            </li>
            <li style={{ marginTop: '20px' }}>
              <Button style={{ marginRight: '15px' }} type="primary" onClick={this.addNewInfo}>新建商品属性</Button>
              <Button style={{ marginRight: '15px' }} type="primary" onClick={this.saveAttrModal}>保存模板</Button>
              <Button style={{ marginRight: '15px' }} type="primary" onClick={this.useAbtModal}>使用属性模板</Button>
            </li>
          </ul>



          {/* 新增属性模板 */}
          <Modal
            width={800}
            zIndex={100000}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            visible={this.state.isoks}
            closable={false}
          >
            {/* 键: paramKey  值: paramValue* */}
            <div id='paramKey'>
              <Input style={{ width: '117px', margin: '4px' }} value={paramKey} onChange={(e) => this.setState({ paramKey: e.target.value })} />
            </div>
            <div>
              <Form
                ref={this.newAttrFormRef}
              >
                <Form.Item className={styles.addModalAttributesInput} name='paramValue0'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue1'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue2'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue3'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue4'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue5'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue6'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue7'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue8'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue9'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue10'>
                  <Input />
                </Form.Item>
                <Form.Item className={styles.addModalAttributesInput} name='paramValue11'>
                  <Input />
                </Form.Item>
                <div style={{ clear: 'both' }}></div>
              </Form>
            </div>
          </Modal>

          {/* 保存销售属性模板 */}
          <Modal
            title={'保存销售属性模板'}
            visible={this.state.modalState}
            onCancel={() => this.setState({ modalState: false })}
            bodyStyle={{ paddingRight: '0' }}
            onOk={this.saveModalData}
          >
            <Row>
              <Col span={24}>
                <Form {...modalInputLayout} ref={this.modalNameRef}>
                  <Form.Item label="模板名字: " style={{ marginBottom: '5px' }} name='modalName' rules={[{ required: true, message: '模板名称不能超过10位', max: 10 }]}>
                    <Input style={{ width: '250px' }} />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Modal>
          {/* 使用销售属性模板 */}
          <Modal
            title={'销售属性模板'}
            visible={this.state.useAbtState}
            onCancel={() => this.setState({ useAbtState: false })}
            bodyStyle={{ paddingRight: '0' }}
            onOk={() => this.setState({ useAbtState: false })}
          >
            <Table
              rowKey={record => record.id}
              columns={[
                {
                  title: '模板名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  key: '1',
                  title: '操作',
                  width: 230,
                  render: (text, record) =>
                    <>
                      <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => this.useAbt(record)}>使用</Button>
                      <Popconfirm title="是否确定删除?" onConfirm={() => this.deleteAbtModal(record)}>
                        <Button type='primary' style={{ marginLeft: '10px' }}>删除</Button>
                      </Popconfirm>
                    </>
                }
              ]}
              dataSource={this.state.AbtList}
              pagination={pagination}
              onChange={this.onTableChange}
            />
          </Modal>
        </Card>
      );
    }
  }
