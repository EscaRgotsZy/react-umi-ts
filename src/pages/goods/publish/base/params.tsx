import { Table, Input, Button, Popconfirm, Form, message, Row, Col, Modal, } from 'antd';
import React, { Component, } from 'react';
import styles from './index.less';
import {
  postSaveUserParam,
  getUserParamOverlay,
  deleteUserParam
} from '@/services/goods/upload/base'
interface UserProp {
  props: any;
  editInfoData: any;
}
interface UserState {
  newParState: boolean;
  customDataList: Array<any>;
  dataSource: Array<any>;
  customDyList: Array<any>;
  count: number;
  tosaveModalState: boolean;
  selectModalState: boolean;
  parmeLoading: boolean;
  loading: boolean;
  parameList: Array<any>;
  customParam: any;
}
export default class parmsLayer extends Component<UserProp, UserState> {
  parmsRef: React.RefObject<any>;
  paramsTpRef: React.RefObject<any>;
  formRef:React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.parmsRef = React.createRef();
    this.paramsTpRef = React.createRef();
    this.formRef = React.createRef();
    this.state = {
      newParState: true,
      dataSource: [
        { key: '0', label: '', value: '', },
        { key: '1', label: '', value: '', },
        { key: '2', label: '', value: '', },
        { key: '3', label: '', value: '', },
        { key: '4', label: '', value: '', },
      ],
      count: 2,
      customDyList: [],
      customDataList: [],
      tosaveModalState: false,
      selectModalState: false,
      parmeLoading: false,
      loading: false,
      parameList: [],
      customParam: [
        { key: '', value: '' },
        { key: '', value: '' },
        { key: '', value: '' },
        { key: '', value: '' },
        { key: '', value: '' },
      ],
    };
  }
  columns: Array<any> = [
    {
      title: '商品参数名',
      dataIndex: 'label',
      editable: true,
    },
    {
      title: '商品参数值',
      dataIndex: 'value',
      editable: true,
    },
  ];
  // 参数模板
  page = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }
  // 分页
  onTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.page, { pageNum: current, pageSize: pageSize })
    this.getParamOverlay()
  }
  componentDidMount() {
    let nextProps = this.props;
    if (nextProps.editInfoData) {
      let { customParam = '' } = nextProps.editInfoData;
      customParam = customParam ? JSON.parse(customParam) : [];
      this.setState({ customParam }, () => {
        this.setFormRef(customParam)
      })
    }

  }
  setFormRef = (dataLsit:any) => {
    this.formRef.current.setFieldsValue({
      prop0: dataLsit[0] && dataLsit[0].key,
      prop1: dataLsit[1] && dataLsit[1].key,
      prop2: dataLsit[2] && dataLsit[2].key,
      prop3: dataLsit[3] && dataLsit[3].key,
      prop4: dataLsit[4] && dataLsit[4].key,
      propValue0: dataLsit[0] && dataLsit[0].value,
      propValue1: dataLsit[1] && dataLsit[1].value,
      propValue2: dataLsit[2] && dataLsit[2].value,
      propValue3: dataLsit[3] && dataLsit[3].value,
      propValue4: dataLsit[4] && dataLsit[4].value,
    })
  }
  // 选择
  SelectLabel = (data: any) => {
    let { customDyList = [] } = this.state;
    let { item, index } = data;
    customDyList && customDyList.length > 0 && customDyList.splice(index, 1);
    let obj: any = {
      key: item.attrKeyVO.attrName,
    }
    item.attrValueVOS.forEach((element: any) => {
      if (element.valueId == data.e) {
        obj.value = element.name
      }
    });
    customDyList.push(obj);
    this.setState({ customDyList })
  }

  // 删除模板
  handleDeleteModal = async (record: any) => {
    let { id } = record;
    let res = await deleteUserParam(id);
    if (!res) return false
    message.success('成功删除参数模板')
    this.getParamOverlay()
  }
  // 取消&增加自定义参数
  addNewParameter = (flag: boolean) => {
    this.setState({ newParState: !flag })
  }
  // 存为模板
  saveModal = () => {
    let { prop0, propValue0, prop1, propValue1, prop2, propValue2, prop3, propValue3, prop4, propValue4
    } = this.formRef.current.getFieldsValue(['prop0', 'propValue0', 'prop1', 'propValue1', 'prop2', 'propValue2', 'prop3', 'propValue3', 'prop4', 'propValue4']);

    if (!prop0 && !propValue0 && !prop1 && !propValue1 && !prop2 && !propValue2 && !prop3 && !propValue3 && !prop4 && !propValue4) {
      message.error('参数模板数据不能为空')
    } else {
      this.setState({ tosaveModalState: true })
    }
  }
  // 选择参数模板按钮
  selectModal = async () => {
    this.page = {
      pageNum: 1,
      pageSize: 5,
      total: 0
    }
    this.setState({ selectModalState: true, parmeLoading: true })
    this.getParamOverlay()
  }
  getParamOverlay = async () => {
    this.setState({ parmeLoading: false });
    let size = this.page.pageSize;
    let page = this.page.pageNum;
    let query = {
      page,
      size
    }
    let res = await getUserParamOverlay({ ...query });
    this.setState({ loading: false })

    if (!res) return false;
    let parameList = res.data && res.data.records || [];
    this.page.total = res.data && res.data.total || 0;  // 总数据条数
    this.setState({
      parmeLoading: false,
      parameList
    })
  }
  // 使用模板
  useModel = (record: any) => {
    let dataLsit = JSON.parse(record && record.content);
    this.formRef.current.setFieldsValue({
      prop0: dataLsit[0] && dataLsit[0].key,
      prop1: dataLsit[1] && dataLsit[1].key,
      prop2: dataLsit[2] && dataLsit[2].key,
      prop3: dataLsit[3] && dataLsit[3].key,
      prop4: dataLsit[4] && dataLsit[4].key,
      propValue0: dataLsit[0] && dataLsit[0].value,
      propValue1: dataLsit[1] && dataLsit[1].value,
      propValue2: dataLsit[2] && dataLsit[2].value,
      propValue3: dataLsit[3] && dataLsit[3].value,
      propValue4: dataLsit[4] && dataLsit[4].value,
    })
    this.setState({ newParState: true, selectModalState: false })

  }
  // 使用模板取消按钮
  handleCancel = () => {
    this.setState({
      selectModalState: false
    })
  }
  // 保存模板
  saveModalData = () => {
    this.formRef.current.validateFields().then((values: any): any => {
      let {modalName} = this.paramsTpRef.current.getFieldsValue();
      let {  prop0, propValue0, prop1, propValue1, prop2, propValue2, prop3, propValue3, prop4, propValue4 } = values;
      let content:any = []
      if (prop0 && propValue0) { content.push({ key: prop0, value: propValue0 }); }
      if (prop1 && propValue1) { content.push({ key: prop1, value: propValue1 }); }
      if (prop2 && propValue2) { content.push({ key: prop2, value: propValue2 }); }
      if (prop3 && propValue3) { content.push({ key: prop3, value: propValue3 }); }
      if (prop4 && propValue4) { content.push({ key: prop4, value: propValue4 }); }
      content = content && content.length > 0 && JSON.stringify(content);
      let userAttributeParam = {
        content,
        name: modalName
      }
      this.saveUserParam(userAttributeParam)
      this.setState({
        customParam: userAttributeParam.content,
        tosaveModalState: false
      })
    }).catch((err: Error) => { })
  }
  // 新增参数模板
  saveUserParam = async (userAttributeParam: any) => {

    let res = await postSaveUserParam({ ...userAttributeParam });
    this.setState({ loading: false });
    if (!res) return false
    this.setState({
      customParam: userAttributeParam.content,
      tosaveModalState: false,
      parmeLoading: false,
    })
  }
  // 父组件调用子组件方法获取数据
  childMethod = () => {

    let {  newParState, customDyList = [] } = this.state;
    let { prop0, prop1, prop2, prop3, prop4, propValue0, propValue1, propValue2, propValue3, propValue4, } = this.formRef.current.getFieldsValue([
      'prop0', 'prop1', 'prop2', 'prop3', 'prop4', 'propValue0', 'propValue1', 'propValue2', 'propValue3', 'propValue4',
    ])
    let customParam:any = [];
    if (prop0 && propValue0) {
      customParam.push({ key: prop0, value: propValue0 });
    }
    if (prop1 && propValue1) {
      customParam.push({ key: prop1, value: propValue1 });
    }
    if (prop2 && propValue2) {
      customParam.push({ key: prop2, value: propValue2 });
    }
    if (prop3 && propValue3) {
      customParam.push({ key: prop3, value: propValue3 });
    }
    if (prop4 && propValue4) {
      customParam.push({ key: prop4, value: propValue4 });
    }
    customDyList = customDyList.concat(customParam);
    customParam = (customDyList && customDyList.length > 0 && JSON.stringify(customDyList)) || '';
    return {
      newParState,
      customParam,
    }
  }
  render() {
    // 分页器
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.page.pageNum,
      pageSize: this.page.pageSize || 10,
      total: this.page.total,
      showTotal: (t:any) => <div>共{t}条</div>
    }
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
    const formLayout = {
      labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 },
      },
    };
    return (
      <>
        <div className={styles.rightContent}>
          <Row >
            <Col><h1>基础参数：</h1></Col>
            <Col span={22} offset={1}>
              <div className={styles.baseparms}>
                <div><span>最多可添加5组自定义参数（非必填），如：镜头：15cm</span></div>
                <div className={styles.parmsbtn}>
                  <Button type='primary' style={{ margin: '0 10px' }} onClick={this.saveModal}>存为模板</Button>
                  <Button type='primary' onClick={this.selectModal}>选择模板</Button>
                </div>
              </div>
            </Col>
            <Col span={22} offset={1}>
              <Form {...formLayout}  style={{ border: '1px dashed #DDDDDD', borderRadius: '4px', padding: '20px' }} ref={this.formRef}>
                <Row>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数名: ' name='prop0'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数值: ' name='propValue0'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数名: ' name='prop1'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数值: ' name='propValue1'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数名: ' name='prop2'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数值: ' name='propValue2'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数名: ' name='prop3'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数值: ' name='propValue3'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数名: ' name='prop4'>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item style={{ marginBottom: '5px' }} label='参数值: ' name='propValue4'>
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
        {/* 选择参数模板 */}
        <Modal
          visible={this.state.selectModalState}
          title={'参数模板'}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Table
            rowKey={(record: any) => record.id}
            columns={
              [
                {
                  title: '参数模板名',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  width: '200px',
                  render: (text, record) =>
                    <>
                      <Popconfirm title="是否使用该参数模板?" onConfirm={() => this.useModel(record)}>
                        <Button type='primary'>使用</Button>
                      </Popconfirm>
                      <Popconfirm title="是否确定删除?" onConfirm={() => this.handleDeleteModal(record)}>
                        <Button type='primary' style={{ marginLeft: '10px' }}>删除</Button>
                      </Popconfirm>
                    </>
                },
              ]
            }
            loading={this.state.parmeLoading}
            dataSource={this.state.parameList}
            pagination={pagination}
            onChange={this.onTableChange}
          />
        </Modal>
        <Modal
          title={'保存参数模板'}
          visible={this.state.tosaveModalState}
          onCancel={() => this.setState({ tosaveModalState: false })}
          bodyStyle={{ paddingRight: '0' }}
          onOk={this.saveModalData}
        >
          <Row>
            <Col span={24}>
              <Form {...modalInputLayout}
                ref={this.paramsTpRef}
              >
                <Form.Item label="模板名字: " style={{ marginBottom: '5px' }} name='modalName' rules={[{ required: true, message: '模板名称不能超过10位', max: 10, }]}>
                  <Input style={{ width: '250px' }} />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}
