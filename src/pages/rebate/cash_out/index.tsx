import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card } from 'antd';
import moment from 'moment';
import { getWithdraw, GetWithdrawParams } from '@/services/rabate/cash_out';

const statusMap = {
  '0': '待入帐',
  '1': '已入账',
  '2': '退款订单',
};
interface UserProp {
  history: any;
  location: any;
}
const RebateRecord: React.FC<UserProp> = (props) => {
  let { key = '-1', pageNum = 1, pageSize = 10 } = props.location.query;
  let [tableList, setTableList] = useState<Array<any>>([]);
  let [tabIndex, setTabIndex] = useState<string>(key);
  let [pageInfo, setPageInfo] = useState<any>({ pageNum: +pageNum, pageSize: +pageSize });
  let [pageTotal, setPageTotal] = useState<number>(0);
  let [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getDataInfo();
  }, [tabIndex, pageInfo]);

  async function getDataInfo() {
    setLoading(true);
    let params: GetWithdrawParams = {
      page: pageInfo.pageNum,
      size: pageInfo.pageSize,
    };
    if (tabIndex !== '-1') {
      params.status = tabIndex;
    }
    props.history.replace({
      query: {
        key: tabIndex,
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
      },
    });
    let { total, records } = await getWithdraw(params);
    setLoading(false);
    setTableList(records);
    setPageTotal(total);
  }

  const columns = [
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    { title: '订单编号', dataIndex: 'orderNo' },
    { title: '订单金额', dataIndex: 'orderAmt' },
    { title: '团建费', dataIndex: 'teamBuildFee' },
    { title: '团建费状态', dataIndex: 'status', render: (text: string) => statusMap[text] },
    {
      title: '变更时间',
      dataIndex: 'recordedTime',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
  ];

  return (
    <PageHeaderWrapper
      tabActiveKey={tabIndex}
      onTabChange={setTabIndex}
      tabList={[
        { key: '-1', tab: '全部' },
        { key: '0', tab: '待审核' },
        { key: '1', tab: '审核通过' },
        { key: '3', tab: '审核拒绝' },
        { key: '2', tab: '已打款' },
      ]}
    >
      <Card bordered={false}>
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
    </PageHeaderWrapper>
  );
};

export default RebateRecord;
