import styles from './index.less';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Table,
  Button,
  Popconfirm,
  Modal,
  Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  serviceExplainsParams,
  GetServiceExplainsList,
  AddServiceExplainsParams,
  addServiceExplains,
  putServiceExplainsParams,
  putServiceExplains,
  delServiceExplains,
} from '@/services/activity/service_description';

const FormItem = Form.Item;
const { TextArea } = Input;
interface UserState {
  id: number | string;
  loading: boolean;
  pageSize: number;
  pageNum: number;
  total: number;
  serviceModal: boolean;
  tableList: Array<any>;
}
interface UserProp {
  history: any;
}
export default class serviceExplains extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      id: '',
      loading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      serviceModal: false, // 添加/编辑服务说明弹框
      tableList: [],
    };
  }
  columnsOne: Array<any> = [
    {
      title: '服务名称',
      dataIndex: 'title',
    },
    {
      title: '服务明细',
      dataIndex: 'content',
    },
    {
      title: '操作',
      render: (record: any) => (
        <>
          <a onClick={() => this.edit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  //挂载
  componentDidMount() {
    this.getDataList();
  }
  // 重置
  reset = () => {
    this.formRef.current.resetFields();
  };
  //获取数据
  getDataList = async (): Promise<void> => {
    let params: serviceExplainsParams = {
      page: this.state.pageNum,
      size: this.state.pageSize,
    };
    this.setState({ loading: true });
    let res = await GetServiceExplainsList(params);
    this.setState({ loading: false });
    let { records, total } = res;
    let tableList = records.map((v, i) => ({
      key: v.id,
      ...v,
    }));
    this.setState({
      tableList,
      total: total || 0,
    });
  };
  // 编辑
  edit = (record: any) => {
    let { id, title, content } = record;
    this.setState({
      id,
    });
    this.openModal();
    setTimeout(() => {
      this.formRef.current.setFieldsValue({ title, content });
    }, 200);
  };
  //新增
  add = () => {
    this.setState({
      id:''
    })
    this.openModal();
    setTimeout(() => {
      this.formRef.current.resetFields();
    }, 200);
    
  };
  //提交
  save = async () => {
    this.formRef.current
      .validateFields(['title','content'])
      .then(async (values: any) => {
        let { title, content} = values;
        let { id } = this.state;
        if (id) {
          let params: putServiceExplainsParams = {
            id,
            title,
            content
          };
          await putServiceExplains(params);
        }else{
          let params: AddServiceExplainsParams = {
            title: title,
            content: content,
          };
          await addServiceExplains(params);
        }
        this.reset();
        this.setState({
          serviceModal: false,
        });
        this.getDataList()
      })
      .catch((err: Error) => {});
  };
  //弹窗
  openModal = () => {
    this.setState({ serviceModal: true });
  };
  // 删除当前服务
  handleDelete = async (record: any) => {
    let { id } = record;
    await delServiceExplains({ id });
    this.getDataList();
  };
  //分页
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState(
      {
        pageSize,
        pageNum,
      },
      this.getDataList,
    );
  };

  render() {
    let { loading, serviceModal, tableList } = this.state;
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
        <Card>
          <Form layout="inline">
            <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ paddingBottom: '24px',width: '100%' }}>
              <Col md={22} sm={22}></Col>
              <Col md={2} sm={2} style={{textAlign:'right'}}>
                <Button type="primary" onClick={this.add} icon={<PlusOutlined />}>
                  添加服务
                </Button>
              </Col>
            </Row>
          </Form>
          <Table
            loading={loading}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination}
            columns={this.columnsOne}
          />
        </Card>
        {/* 添加服务弹窗 '添加服务说明'*/}
        <Modal
          closable={false}
          title={`${this.state.id ? '编辑' : '添加'}服务`}
          visible={serviceModal}
          onOk={this.save}
          onCancel={() =>
            this.setState({
              serviceModal: false,
            })
          }
          wrapClassName={styles.modal}
        >
          <Form ref={this.formRef}>
            <FormItem
              label="标题："
              name="title"
              rules={[
                {
                  required: true,
                  message: '请填写服务标题',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              label="明细："
              name="content"
              rules={[
                {
                  required: true,
                  message: '请填写服务详细',
                },
              ]}
            >
              <TextArea allowClear />
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
