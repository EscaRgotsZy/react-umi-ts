import styles from './index.less';
import React, { Component } from 'react';
import moment from 'moment';
import { Card, Form, Row, Col, DatePicker, Button, Divider, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { moneyNum, teamFeeIncome, TeamFeeIncomeParams } from '@/services/home';
import { saveUrlParams } from '@/utils/utils'

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

interface UserState {
  searchUrl: any;
  loading: boolean;
  tourFee: number;
  personnel: number;
  tableList: Array<any>;
}
interface UserProp {
  history: any;
  location: any;
}
export default class Home extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  p: any;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
    const { pageSize=10, pageNum=1, ...searchUrl } = props.location.query;
    this.state = {
      searchUrl,// url上面的参数
      loading: false,
      tourFee: 0,
      personnel: 0,
      tableList: [],
    };
    this.p = {
      pageSize: +pageSize,
      pageNum: +pageNum,
      total: 0,
    };
  }
  columns = [
    {
      title: '时间',
      dataIndex: 'date',
    },
    {
      title: '消费单数',
      dataIndex: 'consumeNo',
    },
    {
      title: '消费金额',
      dataIndex: 'consumeMoney',
    },
    {
      title: '佣金收益',
      dataIndex: 'income',
    },
    {
      title: '累计佣金',
      dataIndex: 'incomeCount',
    },
  ];
  componentDidMount() {
    this.init()
  }
  init(){
    this.resetForm();
    this.getDataList();
    this.getTourFee();
  }
  resetForm(){
    let { startDate, endDate } = this.state.searchUrl;
    if( startDate && endDate ){
      this.formRef.current.setFieldsValue({timeRang: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]})
    }
  }
  // 获取团建费 获取员工人数
  getTourFee = async (): Promise<false | void> => {
    let res = await moneyNum();
    if (!res) return false;
    let { employeeNums = 0, totalMoney = 0 } = res;
    this.setState({ tourFee: totalMoney, personnel: employeeNums });
  };

  getDataList = async (): Promise<false | void> => {
    let { timeRang } = this.formRef.current.getFieldsValue();
    let params: TeamFeeIncomeParams = { page: this.p.pageNum, size: this.p.pageSize };
    if (Array.isArray(timeRang) && timeRang.length) {
      params.startDate = moment(timeRang[0]).format('YYYY-MM-DD');
      params.endDate = moment(timeRang[1]).format('YYYY-MM-DD');
    }
    saveUrlParams({
      pageNum: this.p.pageNum,
      pageSize: this.p.pageSize,
      startDate: params.startDate,
      endDate: params.endDate,
    })
    this.setState({ loading: true });
    let res = await teamFeeIncome(params);
    this.setState({ loading: false });
    if (!res) return false;
    let { records, total } = res;
    this.p.total = total || 0;
    let tableList = records.map((v: any, i: number) => {
      let { indexDate, commissionIncome, commissionTotal, consumeMoney, consumeNum } = v;
      return {
        key: i,
        date: indexDate,
        consumeNo: consumeNum,
        consumeMoney: consumeMoney,
        income: commissionIncome,
        incomeCount: commissionTotal,
      };
    });
    this.setState({ tableList });
  };
  // 查询
  query = () => {
    this.p.pageSize = 10;
    this.p.pageNum = 0;
    this.getDataList();
  };
  // 重置
  reset = () => {
    this.formRef.current.resetFields();
    this.query();
  };
  // 刷新
  refresh = () => {
    this.getDataList();
  };
  onTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.p, { pageNum: current - 1, pageSize: pageSize });
    this.getDataList();
  };

  renderForm = () => {
    return (
      <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
        <Col md={19} sm={19}>
          <Form layout="inline" ref={this.formRef}>
            <FormItem label="起止时间" name="timeRang">
              <RangePicker />
            </FormItem>
          </Form>
        </Col>
        <Col md={5} sm={5}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={this.query}>
              查询
              </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.reset}>
              重置
              </Button>
          </div>
        </Col>
      </Row>
    );
  };
  onStaffManage = () => {
    this.props.history.push('/staff/list');
  };
  onTeamfundManage = () => {
    this.props.history.push('/rebate/detail');
  };
  render() {
    const { loading, tableList, tourFee, personnel } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.p.pageNum,
      pageSize: this.p.pageSize || 10,
      total: this.p.total,
      showTotal: (t: number) => <div>共{t}条</div>,
    };
    return (
      <PageHeaderWrapper
        title=" "
        content={
          <div style={{ display: 'flex', alignItems: 'center', minHeight: 75, background: '#fff' }}>
            <div
              style={{
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => this.onStaffManage()}
            >
              <div style={{ fontSize: 18, height: 35 }}>员工人数</div>
              <div style={{ fontSize: 16 }}>{personnel}</div>
            </div>
            <Divider type="vertical" style={{ height: 50 }} />
            <div
              style={{
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => this.onTeamfundManage()}
            >
              <div style={{ fontSize: 18, height: 35 }}>团建费</div>
              <div style={{ fontSize: 16 }}>{tourFee}</div>
            </div>
          </div>
        }
      >
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <Table
            loading={loading}
            columns={this.columns}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
