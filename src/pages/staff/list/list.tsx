import styles from './index.less';
import React, { Component } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Table,
  Menu,
  Button,
  Dropdown,
  Divider,
  Upload,
  Popconfirm,
  Modal,
  message,
} from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { tokenManage } from '@/constants/storageKey';
import {
  deptPositions,
  getEmployee,
  employeeParams,
  setBizType,
  setPassword,
  delBizType,
  deleteEmployees,
  batchDeleteEmployees,
} from '@/services/staff/staff';
import { BatchImport } from '@/services/common'


const { Option } = Select;
const FormItem = Form.Item;
const itemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};

interface UserState {
  searchUrl: any;
  loading: boolean;
  visibleModal: boolean;
  pwdModal: boolean;
  selectedRowKeys: Array<any>;
  jobList: Array<any>;
  tableList: Array<any>;
  pageNum: number;
  pageSize: number;
  total: number;
  bizType: number;
  userId: number;
  pwdLoading: boolean;
}

interface UserProp {
  history: any;
  location: any;
}
export default class StaffManage extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  modelFormRef: React.RefObject<any>;
  qrid: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.modelFormRef = React.createRef();
    this.qrid = React.createRef();
    let { pageNum, pageSize, ...searchUrl } = props.location.query;
    pageNum = pageNum || 1;
    pageSize = pageSize || 10;
    this.state = {
      searchUrl,
      loading: false,
      visibleModal: false, // 添加编辑 员工的弹框
      pwdModal: false, //修改密码弹窗
      selectedRowKeys: [], //
      jobList: [], // 职位列表
      tableList: [], // 员工列表
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: 0,
      bizType: 0,
      userId: 0,
      pwdLoading: false,// 修改密码loading
    };
  }
  columns = [
    {
      title: '员工姓名',
      dataIndex: 'realName',
    },
    {
      title: '手机号',
      dataIndex: 'cellphone',
    },
    {
      title: '职位',
      dataIndex: 'positionTitle',
    },
    {
      title: '状态',
      dataIndex: 'employeeStatus',
      render: (text: any, record: any) => (
        <>{text == 1 ? '在职' : text == 2 ? '离职' : text == 3 ? '休假' : '/'}</>
      ),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          {/* h5普通会员1 */}
          {record.bizType == 1 && (
            <>
              <a onClick={() => this.openBizType(record)}>启用子账号</a>
              <Divider type="vertical" />
            </>
          )}
          {/* sass企业运营3  */}
          {record.bizType == 3 && (
            <>
              <a onClick={() => this.openBizType(record)}>修改密码</a>
              <Divider type="vertical" />
              <Popconfirm title="确认停用子账号?" onConfirm={() => this.closeSonAccount(record)}>
                <a>停用子账号</a>
              </Popconfirm>
              <Divider type="vertical" />
            </>
          )}
          <a href={`#/staff/list/${record.id}/edit?bizType=${record.bizType}`}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title={`确认删除“${record.realName}”的员工信息吗`}
            onConfirm={() => this.handleDelete(record)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  componentDidMount() {
    this.init()
  }
  init() {
    this.resetForm();
    this.getJobList();
    this.getDataList();
  }
  resetForm() {
    let { bizType, realName, deptPositionId, employeeStatus } = this.state.searchUrl;
    let initValue: any = {};
    bizType && (initValue.bizType = +bizType);
    realName && (initValue.realName = realName);
    deptPositionId && (initValue.deptPositionId = +deptPositionId);
    employeeStatus && (initValue.employeeStatus = +employeeStatus);
    this.formRef.current.setFieldsValue(initValue);
  }
  //获取职位列表
  getJobList = async (): Promise<any> => {
    let res = await deptPositions();
    if (!res) return false;
    let { records } = res;
    let jobList = records.map((v: any) => ({
      key: v.id,
      ...v,
    }));
    this.setState({ jobList });
  };
  //获取员工列表
  getDataList = async (): Promise<void> => {
    let {
      bizType,
      realName,
      deptPositionId,
      employeeStatus,
    } = this.formRef.current.getFieldsValue();
    let params: employeeParams = {
      bizType: bizType,
      realName: realName && realName.trim(),
      deptPositionId: deptPositionId,
      employeeStatus: employeeStatus,
      page: this.state.pageNum,
      size: this.state.pageSize,
      sortBy: '-createTime',
    };

    this.props.history.replace({
      query: {
        pageNum: this.state.pageNum,
        pageSize: this.state.pageSize,
        bizType,
        realName,
        deptPositionId,
        employeeStatus
      }
    })
    this.setState({ loading: true });
    let res = await getEmployee(params);
    this.setState({ loading: false });
    let { records, total } = res;
    let tableList = records.map((v: any) => ({
      key: v.id,
      ...v,
    }));
    this.setState({
      tableList,
      total: total || 0,
    });
  };
  // 查询
  query = () => {
    this.setState(
      {
        pageSize: 10,
        pageNum: 1,
      },
      this.getDataList,
    );
  };
  // 重置
  reset = () => {
    this.formRef.current.resetFields();
    this.query()
  };
  // 刷新
  refresh = () => {
    this.getDataList();
  };
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState(
      {
        pageSize,
        pageNum,
      },
      this.refresh,
    );
  };
  // 添加员工跳转
  add = () => {
    this.props.history.push(`/staff/list/add`);
  };
  openBizType = (record: any) => {
    let { userId, bizType } = record;
    this.setState({
      userId,
      bizType,
      visibleModal: true,
    });
  };
  //启用子账号/修改密码
  openSonAccount = () => {
    let { validateFields } = this.modelFormRef.current;
    let { userId, bizType } = this.state;
    validateFields(['password', 'repeatPwd']).then(async (value: any) => {
      let { password, repeatPwd } = value;
      if (repeatPwd !== password) return message.warn('两次设置的密码不一样，请重新设置');
      this.setState({ pwdLoading: true })
      if (bizType == 1) {
        await setBizType({ userId, password });
      }
      if (bizType == 3) {
        await setPassword({ userId, password });
      }
      this.setState({ pwdLoading: false, visibleModal: false })
      this.formRef.current.resetFields();
      this.refresh();
    })
  };
  //停用子账号
  closeSonAccount = async (record: any): Promise<any> => {
    let { userId } = record;
    await delBizType({ userId });
    this.refresh();
  };
  // 删除员工
  handleDelete = async (record: any): Promise<any> => {
    let { id } = record;
    await deleteEmployees({ id });
    this.refresh();
  };
  // 批量删除
  handleDeleteAll = async () => {
    let { selectedRowKeys } = this.state;
    if (!selectedRowKeys.length) return message.warn('请至少选择一个进行删除');
    let ids = selectedRowKeys.join(',');
    await batchDeleteEmployees({ ids });
    this.refresh();
  };
  openModal = (flag = false) => {
    this.setState({ visibleModal: flag });
  };
  closeModel = () => {
    this.setState({ visibleModal: false });
    this.formRef.current.resetFields();
  };
  // 下载员工批量导入模板
  batchImport = ({ key }: any) => {
    if (key == 2) {
      window.open('/staffExcelTemplate.xlsx');
    }
  };
  renderForm = () => {
    let { jobList } = this.state;
    return (
      <Row>
        <Col span={18}>
          <Form layout="inline" ref={this.formRef}>
            <FormItem label="账号类型：" name="bizType">
              <Select style={{ width: 120 }} placeholder="请选择">
                <Option value={1}>普通员工</Option>
                <Option value={3}>企业运营(管理)</Option>
              </Select>
            </FormItem>
            <FormItem label="用户姓名: " name="realName">
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem label="职位: " style={{ paddingRight: '4px' }} name="deptPositionId">
              <Select style={{ width: 120 }} placeholder="请选择">
                {jobList &&
                  jobList.length != 0 &&
                  jobList.map((item, i) => (
                    <Option value={item.id} key={i}>
                      {item.positionTitle}
                    </Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem label="状态: " style={{ paddingRight: '4px' }} name="employeeStatus">
              <Select style={{ width: 120 }} placeholder="请选择">
                <Option value={1}>在职</Option>
                <Option value={2}>离职</Option>
                <Option value={3}>休假</Option>
              </Select>
            </FormItem>
          </Form>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              onClick={this.query}
              icon={<SearchOutlined />}
              style={{ marginRight: 5, marginLeft: 5 }}
            >
              {' '}
              查询{' '}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.reset}>
              重置
            </Button>
            <Button icon={<SyncOutlined />} style={{ marginLeft: 8 }} onClick={this.refresh}>
              刷新
            </Button>
          </div>
        </Col>
      </Row>
    );
  };
  handleChange = (info: any) => {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      let res = info.file.response || {};
      if (res.code === 200) {
        if (res.data == true) {
          message.success(`${res.message}`);
          this.refresh();
        } else {
          message.warn(`${res.message}`);
          this.refresh();
        }
      } else {
        message.error(res.message || '导入失败');
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败`);
      this.refresh();
    }
  };
  render() {
    let { loading, tableList, visibleModal, bizType, pwdLoading } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number) => <div>共{t}条</div>,
    };

    const rowSelection = {
      onChange: (selectedRowKeys: any) => {
        this.setState({ selectedRowKeys });
      },
    };
    const props = {
      action: BatchImport,
      name: 'file',
      headers: {
        Authorization: tokenManage.get(),
        platform: 'corp',
      },
      onChange: this.handleChange,
      showUploadList: false,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>{this.renderForm()}</Card>
        <Card bordered={false} style={{ marginTop: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex' }}>
              <Popconfirm title="确认删除?" onConfirm={() => this.handleDeleteAll()}>
                <Button type="danger" style={{ marginRight: 5 }}>
                  批量删除
                </Button>
              </Popconfirm>
              <Dropdown
                overlay={
                  <Menu onClick={this.batchImport}>
                    <Menu.Item key="1">
                      <Upload {...props}>
                        <UploadOutlined /> &nbsp;批量导入
                      </Upload>
                    </Menu.Item>
                    <Menu.Item key="2">
                      <DownloadOutlined />
                      模板下载
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <UploadOutlined /> 批量导入 <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <Button
              type="primary"
              style={{ marginLeft: 8 }}
              onClick={this.add}
              icon={<PlusOutlined />}
            >
              添加员工
            </Button>
          </div>
          <Table
            loading={loading}
            rowSelection={rowSelection}
            columns={this.columns}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination}
          />
        </Card>
        <Modal
          title={bizType == 1 ? '设置密码后，即可开启子帐号' : '修改密码'}
          visible={visibleModal}
          confirmLoading={pwdLoading}
          onOk={this.openSonAccount}
          onCancel={this.closeModel}
          wrapClassName={styles.modal}
          maskClosable={false}
        >
          <Form ref={this.modelFormRef}>
            <FormItem
              label="密码："
              {...itemLayout}
              name="password"
              rules={[
                {
                  required: true,
                  pattern: /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}/,
                  message: '输入6-20位长度密码(包含字母与数字)',
                },
              ]}
            >
              <Input.Password
                maxLength={20}
                placeholder="字母和数字组成的6-20位长度密码"
                autoComplete="off"
              />
            </FormItem>
            <FormItem
              label="确认密码："
              {...itemLayout}
              name="repeatPwd"
              rules={[
                {
                  required: true,
                  pattern: /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}/,
                  message: '请再次输入密码',
                },
              ]}
            >
              <Input.Password maxLength={20} placeholder="请再次输入密码" autoComplete="off" />
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
