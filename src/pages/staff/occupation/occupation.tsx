import React, { Component } from 'react';
import { Table, Modal, Input, Form, Card, message, Divider, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  deptPositions,
  DeptPositionsParams,
  addDeptPositions,
  AddDeptPositionsParams,
  delDeptPositions,
} from '@/services/staff/occupation';

const { Search } = Input;
const FormItem = Form.Item;

interface UserState {
  visibleModal: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  loading: boolean;
  tableList: Array<any>;
  id: string;
  addValue: string;
  addLoading: boolean;
}
interface UserProp {
  history: any;
  location: any;
}
export default class occupationManage extends Component<UserProp, UserState> {
  modalFormRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.modalFormRef = React.createRef();
    const { pageSize=10, pageNum=1 } = props.location.query;
    this.state = {
      id: '',
      loading: false,
      tableList: [],
      visibleModal: false, // 编辑弹框
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: 0,
      addValue: '',
      addLoading: false,
    };
  }
  columns = [
    {
      title: '职位ID',
      dataIndex: 'id',
    },
    {
      title: '职位名称',
      dataIndex: 'positionTitle',
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          <a onClick={() => this.edit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  componentDidMount() {
    this.getDataList();
  }
  // 查询
  query = () => {
    this.setState(
      {
        pageSize: 10,
        pageNum: 0,
      },
      this.getDataList,
    );
  };
  // 重置
  reset = () => {};
  //获取职位列表
  getDataList = async (): Promise<false | void> => {
    let { pageNum, pageSize } = this.state
    let params: DeptPositionsParams = {
      page: pageNum,
      size: pageSize,
    };
    this.props.history.replace({
      query: {
        pageNum,
        pageSize,
      }
    })
    let res = await deptPositions(params);
    if (!res) return false;
    let { records, total } = res;
    let tableList = records.map((v, i) => ({
      key: v.id,
      ...v,
    }));
    this.setState({
      tableList,
      total,
    });
  };
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState(
      {
        pageSize,
        pageNum,
      },
      this.getDataList,
    );
  };
  // 新增
  add = async (occupationName: string) => {
    if (!occupationName) return message.warn('新增职位名称不能为空！');
    let params: AddDeptPositionsParams = {
      positionTitle: occupationName,
    };
    this.setState({ addLoading: true });
    await addDeptPositions(params);
    this.setState({ addLoading: false });
    this.getDataList();
  };
  // 删除员工
  handleDelete = async (record: any) => {
    let { id } = record;
    await delDeptPositions({ id });
    this.getDataList();
  };
  // 编辑
  edit = (record: any) => {
    let { id, positionTitle } = record;
    this.setState({
      id,
    });
    this.setState({ visibleModal: true });
    setTimeout(() => {
      this.modalFormRef.current.setFieldsValue({ occupation: positionTitle });
    }, 200);
  };
  // 弹窗
  closeModal = () => {
    this.setState({ visibleModal: false });
  };
  //提交编辑职位
  save = () => {
    this.modalFormRef.current
      .validateFields(['occupation'])
      .then(async (values: any) => {
        let { occupation } = values;
        let { id } = this.state;
        let params: AddDeptPositionsParams = {
          id,
          positionTitle: occupation,
        };
        await addDeptPositions(params);
        this.closeModal();
        this.getDataList();
      })
      .catch((err: Error) => {});
  };

  renderForm = () => {
    let { addValue, addLoading } = this.state;
    return (
      <Search
        placeholder="请添加职位名称"
        enterButton="添加"
        size="large"
        style={{ width: 300, marginBottom: 10 }}
        value={addValue}
        loading={addLoading}
        onChange={(event) => this.setState({ addValue: event.target.value })}
        onSearch={(value: string) => this.add(value)}
      />
    );
  };

  render() {
    let { loading, tableList, visibleModal } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number) => <div>共{t}条</div>,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          {this.renderForm()}
          <Table
            loading={loading}
            bordered
            columns={this.columns}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination}
          />
        </Card>
        <Modal
          title={'编辑职位'}
          visible={visibleModal}
          onOk={this.save}
          onCancel={() => this.closeModal()}
          maskClosable={false}
        >
          <Form layout="inline" ref={this.modalFormRef}>
            <FormItem
              label="职位名称："
              name="occupation"
              rules={[{ required: true, message: '请输入' }]}
            >
              <Input />
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
