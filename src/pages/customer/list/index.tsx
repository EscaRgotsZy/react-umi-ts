import styles from './index.less';
import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Select, Table, Button, Divider, Modal, message, Tag } from 'antd';
import { SearchOutlined, QrcodeOutlined, DownloadOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import QRCode from 'qrcode.react';
import CopyToClipboard from 'react-copy-to-clipboard';
import config from '@/config';
import { getMembers, MembersParams, getRelativesList, getInviteCode, batchTagsParams, batchTags } from '@/services/customer/list';
import { getAllTagList }from '@/services/customer/tag';
import { saveUrlParams } from '@/utils/utils'
const { Option } = Select;
const FormItem = Form.Item;
interface UserState {
  searchUrl: any;
  loading: boolean;
  qrcodeModal: boolean;
  relationshipModal: boolean;
  pageNum: number;
  pageSize: number;
  total: number;
  tableList: Array<any>;
  inviteCode: string;
  companyId: number;
  relationshipList: Array<string>;
  batchModal: boolean;
  selectedRowKeys: Array<any>;
  tagGroupData: Array<any>;
  tagArr: Array<any>;
}
interface UserProp {
  history: any;
  location: any;
}
export default class CustomerManage extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  qrcodeType: number;
  constructor(props: UserProp) {
    super(props)
    this.formRef = React.createRef();
    this.qrcodeType = NaN;// 1员工 2会员 3管理员
    const { pageSize=10, pageNum=1, ...searchUrl } = props.location.query;
    this.state = {
      searchUrl,
      loading: false,
      qrcodeModal: false,// 二维码弹框
      relationshipModal: false,//亲属关系
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: 0,
      tableList: [],
      inviteCode: '',
      companyId: NaN,
      relationshipList: [],// 亲属关系列表
      batchModal: false,
      selectedRowKeys: [],
      tagGroupData: [],
      tagArr: [],
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
    this.init()
  }
  init(){
    this.resetForm()
    this.getDataList();
  }
  resetForm(){
    let { cellphone, employeeName, memberType, nickName, tagName } = this.state.searchUrl;
    let initValue:any = {};
    cellphone && (initValue.cellphone = cellphone);
    employeeName && (initValue.employeeName = employeeName);
    memberType && (initValue.memberType = +memberType);
    nickName && (initValue.nickName = nickName);
    tagName && (initValue.tagName = tagName);
    this.formRef.current.setFieldsValue(initValue)
  }
  // 客户列表
  getDataList = async () => {
    let { cellphone, employeeName, memberType, nickName, tagName } = this.formRef.current.getFieldsValue();
    let { pageNum, pageSize } = this.state;
    let params: MembersParams = {
      memberType,
      cellphone: cellphone && cellphone.trim(),
      realName: employeeName && employeeName.trim(),
      tagName: tagName && tagName.trim(),
      nickName,
      page: pageNum,
      size: pageSize,
      sortBy: '-createTime',
    }
    saveUrlParams({
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
      cellphone: params.cellphone,
      employeeName: params.realName,
      memberType: params.memberType,
      nickName: params.nickName,
      tagName: params.tagName
    })
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
  // 重置
  reset = () => {
    this.formRef.current.resetFields();
    this.refresh()
  }
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.refresh)
  }
  openQrcodeModal = () => this.setState({ qrcodeModal: true })
  closeQrcodeModal = () => this.setState({ qrcodeModal: false })
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
  // 生成二维码
  handleQrCode = async (): Promise<boolean | void> => {
    let inviteCodeTypes: number = 2;
    let res = await getInviteCode(inviteCodeTypes)
    if (!res) return false;
    let { inviteCode, companyId } = res;
    this.setState({ inviteCode, companyId })
    this.qrcodeType = inviteCodeTypes
    this.openQrcodeModal()
  }
  // 下载二维码图片
  downloadCode = () => {
    var Qr: any = document.getElementById('qrid');
    let image = new Image();
    image.src = Qr.toDataURL("image/png");
    var a_link: any = document.getElementById('aId');
    a_link.href = image.src;
  }
  //标签组
  getTagGroupList = async() => {
    let res = await getAllTagList();
    let { data=[] } = res;
    let tagGroupData = data.map((v: any,i:number) => ({
      key: i,
      ...v
    }))
    this.setState({ tagGroupData })
  }
  //选择标签
  toggleParams = (item:any) => {
    let {tagArr} = this.state;
    let id = item.id;
    let arr = JSON.parse(JSON.stringify(tagArr));
    if(arr.includes(id)){
      arr.splice(arr.indexOf(id), 1)
    }else{
      arr.push(id);
    }
    this.setState({
      tagArr:arr
    })
  }
  //批量打标弹窗
  openBatchModal = (flag:boolean) => {
    this.setState({
      batchModal: flag
    })
  }
  //批量打标
  handleBatchTag = ():any => {
    let { selectedRowKeys } = this.state;
    if(!selectedRowKeys.length) return message.warn('请先至少选择一个用户');
    this.openBatchModal(true);
    this.getTagGroupList();
  }
  //提交批量打标
  handleCommitBatch = async() => {
    let {tagArr, selectedRowKeys} = this.state;
    if(tagArr&&tagArr.length<1) return message.error("请至少选择一个标签");
    let params:batchTagsParams = {
      userIds: selectedRowKeys,
      tagIds: tagArr,
    };
    this.setState({loading:true})
    let res = await batchTags(params);
    this.setState({loading:false})
    if(res[0]==true){
      message.error("批量打标失败")
    }else{
      message.success("批量打标成功")
    }
    this.setState({selectedRowKeys:[]});
    this.openBatchModal(false);
    this.getDataList();
  }
  renderForm = () => {
    return (
      <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
        <Col md={18} sm={18}>
          <Form layout="inline" ref={this.formRef}>
            <FormItem label="类型" name="memberType" style={{marginBottom:'10px'}}>
              <Select style={{ width: 120 }} placeholder="请选择">
                <Option value={0}>会员</Option>
                <Option value={1}>员工</Option>
                <Option value={2}>亲属</Option>
              </Select>
            </FormItem>
            <FormItem label="用户姓名: " name="employeeName" style={{marginBottom:'10px'}}>
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem label="微信昵称: " name="nickName" style={{marginBottom:'10px'}}>
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem label="手机号: " style={{ paddingRight: '4px' }} name="cellphone">
              <Input placeholder="请输入" />
            </FormItem>
            <FormItem label="标签: " style={{ paddingRight: '4px' }} name="tagName">
              <Input placeholder="请输入" />
            </FormItem>
          </Form>
        </Col>
        <Col md={6} sm={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={this.query} icon={<SearchOutlined />}>查询</Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleQrCode} icon={<QrcodeOutlined />}>会员邀请码</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
          </div>
        </Col>
      </Row>
    )
  }
  render() {
    let { pageNum, pageSize, total, loading, tableList, qrcodeModal, inviteCode, companyId, relationshipModal, relationshipList, batchModal,selectedRowKeys,tagGroupData,tagArr } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys:Array<any>, selectedRows:Array<any>) => {
        this.setState({ selectedRowKeys })
      },
    };
    const pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: pageNum,
      pageSize: pageSize || 10,
      total: total,
      showTotal: (t: number) => <div>共{t}条</div>
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
        </Card>
        <Card bordered={false} style={{ marginTop: 20 }}>
          <Row style={{width:'100%',marginBottom:'24px'}}>
            <Col style={{textAlign:'left'}} span={24}>
              <Button type='primary' onClick={this.handleBatchTag}>批量打标</Button>
            </Col>
          </Row>
          <Table
            rowKey={record => record.userId}
            loading={loading}
            columns={this.columns}
            dataSource={tableList}
            rowSelection= {rowSelection}
            onChange={this.onTableChange}
            pagination={pagination} />
        </Card>
        <Modal
          title={`${this.qrcodeType == 1 ? '员工' : '会员'}邀请码`}
          visible={qrcodeModal}
          onOk={this.closeQrcodeModal}
          onCancel={this.closeQrcodeModal}
          wrapClassName={styles.modal}
          maskClosable={false}
        >
          <div className={styles.qrcodeBox}>
            <p className={styles.qrcodeTitle}>{this.qrcodeType == 1 ? '员工' : '会员'}邀请码：{inviteCode}
              <CopyToClipboard text={inviteCode}
                onCopy={() => message.success('复制成功~')}>
                <span className={styles.copy}>复制</span>
              </CopyToClipboard>
            </p>
            <QRCode
              value={`${config.h5Url}?i=${inviteCode}&c=${companyId}`}
              size={200}
              id='qrid'
              fgColor="#000000"
            />
            <a id='aId' download={(this.qrcodeType == 1 ? '员工' : '会员') + "邀请码.png"} onClick={this.downloadCode} style={{ marginTop: 25 }}>
              <Button type="primary" shape="round" icon={<DownloadOutlined />} >点击下载</Button>
            </a>
          </div>
        </Modal>
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

        <Modal
          title='选择标签'
          visible={ batchModal }
          onOk={this.handleCommitBatch}
          onCancel={()=>{this.openBatchModal(false)}}
          maskClosable={false}
        >
          <div>
            <ul className={styles.modal_Ul}>
              {
                Array.isArray(tagGroupData) && tagGroupData.map( (item:any,i:number) =>
                  <li key={i} className={`${styles.modal_Li} ${tagArr.includes(item.id) ? styles.active : ''}`} onClick={() => this.toggleParams(item)} >{item.name}</li>
                )
              }
            </ul>
          </div>
        </Modal>
      </PageHeaderWrapper>
    )
  }
}
