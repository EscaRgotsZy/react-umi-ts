import styles from './index.less';
import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { DownloadOutlined } from '@ant-design/icons';
import { Card, Table, Button } from 'antd';
import moment from 'moment';
import CashOut from './components/cash_out';
import {
  getDetail,
  GetDetailParams,
  getWaitWithdrawAmount,
  getTotalAmount,
} from '@/services/rabate/detail';

interface UserProp {
  history: any;
  location: any;
}
const RebateDetail: React.FC<UserProp> = (props) => {
  let { pageNum = 1, pageSize = 10 } = props.location.query;
  let [tableList, setTableList] = useState<Array<any>>([]);
  let [pageInfo, setPageInfo] = useState<any>({ pageNum: +pageNum, pageSize: +pageSize });
  let [pageTotal, setPageTotal] = useState<number>(0);
  let [loading, setLoading] = useState<boolean>(false);
  let [cashVisible, setCashVisible] = useState<boolean>(false);
  let [totalAmount, setTotalAmount] = useState<number>(0);
  let [waitWithdrawAmount, setWaitWithdrawAmount] = useState<number>(0);

  useEffect(() => {
    getDataInfo();
    getWaitWithdraw();
    getTotal();
  }, []);
  // 待入帐金额
  async function getWaitWithdraw() {
    let res = await getWaitWithdrawAmount();
    setWaitWithdrawAmount(res);
  }
  // 获取可提现总金额
  async function getTotal() {
    let res = await getTotalAmount();
    setTotalAmount(res);
  }
  async function getDataInfo() {
    setLoading(true);
    let params: GetDetailParams = {
      page: pageInfo.pageNum,
      size: pageInfo.pageSize,
    };
    props.history.replace({
      query: {
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
      },
    });
    let { total, records } = await getDetail(params);
    setLoading(false);
    setTableList(records);
    setPageTotal(total);
  }

  const columns = [
    { title: '流水号', dataIndex: 'serialNo' },
    { title: '收入', dataIndex: 'incomeAmt' },
    { title: '支出', dataIndex: 'expenseAmt' },
    { title: '备注', dataIndex: 'remark' },
    { title: '账户余额', dataIndex: 'accountBalance' },
    {
      title: '变更时间',
      dataIndex: 'recordedTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
  ];
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div className={styles.teamFund}>
          <span className={styles.title}>团建费：</span> <label className={styles.money}>0</label>
          <Button
            type="primary"
            shape="round"
            icon={<DownloadOutlined />}
            onClick={() => setCashVisible(true)}
            style={{ marginLeft: 20 }}
          >
            提现
          </Button>
          <a href={'#/rebate/record'}>团建费记录</a>
          <a href={'#/rebate/cash_out'}>提现记录</a>
        </div>
      </Card>
      <Card bordered={false} style={{ marginTop: 15 }}>
        <Table
          rowKey={'key'}
          loading={loading}
          columns={columns}
          dataSource={tableList}
          onChange={({ current: pageNum, pageSize }) => {
            setPageInfo({ pageNum, pageSize });
          }}
          pagination={{
            showQuickJumper: pageTotal > 10,
            showSizeChanger: pageTotal > 10,
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
            showTotal: (t) => <div>共{t}条</div>,
          }}
        />
      </Card>
      {cashVisible && (
        <CashOut
          drawerCancel={() => setCashVisible(false)}
          totalAmount={totalAmount}
          waitWithdrawAmount={waitWithdrawAmount}
        />
      )}
    </PageHeaderWrapper>
  );
};

export default RebateDetail;
