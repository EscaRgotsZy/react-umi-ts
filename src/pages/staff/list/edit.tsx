import React, { Component } from 'react';
import { Input, Button, Form, Card, Row, Col, Select, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery } from '@/utils/utils';
import {
  getEmployeeDetail,
  deptPositions,
  addEmployees,
  putEmployees,
  EmployeesParams,
} from '@/services/staff/staff';
import { getRoleLists } from '@/services/system/role';
const FormItem = Form.Item;
const { Option } = Select;

interface UserState {
  staffId: string;
  bizType: any;
  jobList: Array<any>;
  roleList: Array<any>;
}
interface UserProp {
  history: any;
  match: any;
}
export default class addStaff extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      staffId: this.props.match.params.id,
      bizType: getPageQuery().bizType,
      jobList: [], // 职位列表
      roleList: [], // 角色列表
    };
  }
  componentDidMount() {
    if (this.state.staffId) {
      this.getStaffInfo();
    }
    this.getJobList();
    this.getRoleList();
  }
  //获取员工详情
  getStaffInfo = async (): Promise<false | void> => {
    let { staffId: id } = this.state;
    let res = await getEmployeeDetail({ id });
    if (!res) return false;
    this.formRef.current.setFieldsValue({
      ...res,
    });
  };
  //获取职位列表
  getJobList = async (): Promise<false | void> => {
    let res = await deptPositions();
    if (!res) return false;
    let { records } = res;
    let jobList = records.map((v: any) => ({
      key: v.id,
      ...v,
    }));
    this.setState({
      jobList,
    });
  };
  //获角色列表
  getRoleList = async (): Promise<false | void> => {
    let res = await getRoleLists();
    if (!res) return false;
    let { records } = res;
    let roleList: Array<any> = records.map((v: any) => <Option value={v.roleId} key={v.roleId}>{v.roleName}</Option>);
    this.setState({
      roleList,
    });
  };
  // 取消
  cancleAdd = () => {
    this.props.history.goBack()
  };
  // 确定
  handleSubmit = () => {
    this.formRef.current
      .validateFields()
      .then((values: any) => {
        let { realName, cellphone, deptPositionId, employeeStatus, roleIds } = values;
        let query: EmployeesParams = {
          realName, // 员工姓名
          cellphone, //手机号
          deptPositionId, //员工职位
          employeeStatus, //员工状态
          roleIds, // 员工角色
        };

        if (this.state.staffId) {
          query.id = this.state.staffId; //编辑状态，添加员工id
        }
        this.saveCommit(query);
      })
      .catch((err: Error) => { });
  };
  // 提交
  saveCommit = async (query: EmployeesParams): Promise<false | void> => {
    let res;
    if (this.state.staffId) {
      res = await putEmployees(query);
    } else {
      res = await addEmployees(query);
    }
    let [err] = res;
    if (err) return false;
    this.props.history.goBack()
  };
  render() {
    const { jobList, roleList, bizType, staffId } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 6 },
      },
    };

    return (
      <PageHeaderWrapper>
        <Card style={{ paddingTop: '30px' }}>
          <Form
            {...formItemLayout}
            ref={this.formRef}
            initialValues={{
              employeeStatus: 1
            }}
          >
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col md={2} sm={2}></Col>
              <Col md={20} sm={20}>
                <FormItem
                  label="员工姓名："
                  name="realName"
                  rules={[{ required: true, message: '请填写员工姓名' }]}
                >
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col md={2} sm={2}></Col>
              <Col md={20} sm={20}>
                <FormItem
                  label="手机号："
                  name="cellphone"
                  rules={[
                    { required: true, pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
                  ]}
                >
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col md={2} sm={2}></Col>
              <Col md={20} sm={20}>
                <FormItem label="职位：" name="deptPositionId">
                  <Select style={{ width: 165 }}>
                    {jobList &&
                      jobList.length != 0 &&
                      jobList.map((item, i) => (
                        <Option value={item.id} key={i}>
                          {item.positionTitle}
                        </Option>
                      ))}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col md={2} sm={2}></Col>
              <Col md={20} sm={20}>
                <FormItem label="状态：" name="employeeStatus">
                  <Select style={{ width: 165 }}>
                    <Option value={1}>在职</Option>
                    <Option value={2}>离职</Option>
                    <Option value={3}>休假</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            {
              bizType == 3 &&  staffId &&
              <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
                <Col md={2} sm={2}></Col>
                <Col md={20} sm={20}>
                  <FormItem label="角色：" name="roleIds">
                    <Select style={{ width: 165 }} mode="multiple">
                      {
                        roleList
                      }
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            }

            <Divider dashed />
            <Row>
              <Col
                span={24}
                style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}
              >
                <Button onClick={this.handleSubmit} type="primary" style={{ marginRight: '10px' }}>
                  保存
                </Button>
                <Button onClick={this.cancleAdd} type="primary">
                  取消
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
