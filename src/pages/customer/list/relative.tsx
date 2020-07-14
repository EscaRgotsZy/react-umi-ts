import styles from './index.less';
import React, { Component } from 'react';
import { Card, Table, Button, Divider, Modal, message, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getMembers, MembersParams, getRelativesList } from '@/services/customer/list';

interface UserState {
  loading: boolean;
  relationshipModal: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  tableList: Array<any>;
  relationshipList: Array<string>;
  employeeUserId: string;
}
interface UserProp {
  history: any;
  match: any
}
export default class CustomerManage extends Component<UserProp, UserState> {
  constructor(props: UserProp) {
    super(props)
    this.state = {
      loading: false,
      relationshipModal: false,//亲属关系
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableList: [],
      relationshipList: [],// 亲属关系列表
      employeeUserId: props.match.params.id,
    }
  }
  columns = [
    {
      title: '客户id',
      dataIndex: 'userId',
    },
    {
      title: '类型',
      dataIndex: 'memberType',
      render: (text: any) => text ? text == 1 ? '员工' : '亲属' : '会员'
    },
    {
      title: '客户姓名',
      width: '10%',
      dataIndex: 'employeeName',
      render: (text: any) => <div style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
    },
    {
      title: '手机号',
      dataIndex: 'cellphone',
    },
    {
      title: '微信昵称',
      dataIndex: 'nickName',
      width: '10%',
      render: (text: any) => <div style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
    },
    {
      title: '亲属关系',
      render: (text: any, record: any) => record.memberType ? <a onClick={() => this.openRelationshipModal(record)}>查看</a> : ''
    },
    {
      title: '是否关注',
      dataIndex: 'focusOfficialAccount',
      render: (text: any) => text ? "是" : "否"
    },
    {
      title: '标签',
      width: '10%',
      render: (text: any, record: any) => {
        let tags = Array.isArray(record.userTags) ? record.userTags : []
        return tags.length ? tags.map((item: any, i: number) => <Tag key={i} color="magenta" style={{ margin: '2px' }}>{item.name}</Tag>) : '无'
      }
    },
    {
      title: '操作',
      render: (text: any, record: any) => <>
        <Button type='dashed'>
          <a href={`#/customer/list/${record.userId}`}>详情</a>
        </Button>
        <Divider type="vertical" />
        <Button onClick={() => message.success('敬请期待')} type='dashed' style={{ margin: '2px' }}>购买记录</Button>
      </>
    }
  ]
  componentDidMount() {
    this.getDataList();
  }
  // 客户列表
  getDataList = async () => {
    let params: MembersParams = {
      page: this.state.pageNum,
      size: this.state.pageSize,
      sortBy: '-createTime',
      employeeUserId: this.state.employeeUserId,
    }
    this.setState({ loading: true });
    let res = await getMembers(params)
    this.setState({ loading: false })
    let { total, records } = res;
    let tableList = records.map((v: any) => ({
      key: v.id,
      ...v
    }))
    this.setState({
      tableList,
      total
    })
  }
  // 查询
  query = () => {
    this.setState({
      pageSize: 10,
      pageNum: 1
    }, this.getDataList)
  }
  // 刷新
  refresh = () => {
    this.getDataList();
  }
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.refresh)
  }
  //亲属关系弹窗
  openRelationshipModal = (record: any) => {
    this.getRelativesList(record);
    this.setState({
      relationshipModal: true
    })
  }
  closeRelationshipModal = () => this.setState({ relationshipModal: false })
  // 获取亲属列表
  getRelativesList = async (record: any) => {
    let { userId, memberType } = record;
    let res = await getRelativesList({ userId });
    let relationshipList = res.map((v: any) => {
      if (memberType == 1) {
        return `亲属ID${v.relativesUserId},   亲属用户名：${v.relativesUserName || '无'},   关系：${v.relativesTitle || '无'}`
      } else {
        return `父ID${v.employeeUserId},   亲属用户名：${v.relativesUserName || '无'},   关系：${v.relativesTitle || '无'}`
      }
    })
    this.setState({ relationshipList })
  }
  render() {
    let { loading, tableList, relationshipModal, relationshipList } = this.state;
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.state.pageNum,
      pageSize: this.state.pageSize || 10,
      total: this.state.total,
      showTotal: (t: number) => <div>共{t}条</div>
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ marginTop: 20 }}>
          <Table
            rowKey={record => record.userId}
            loading={loading}
            columns={this.columns}
            dataSource={tableList}
            onChange={this.onTableChange}
            pagination={pagination} />
        </Card>
     
        <Modal
          title={`亲属关系`}
          visible={relationshipModal}
          onOk={this.closeRelationshipModal}
          onCancel={this.closeRelationshipModal}
          wrapClassName={styles.modal}
          footer={null}
        >
          <div>
            {
              relationshipList.length ? relationshipList.map((v: string, i: number) => <p key={i}>{v}</p>) : '暂无'
            }
          </div>
        </Modal>
      </PageHeaderWrapper>
    )
  }
}
