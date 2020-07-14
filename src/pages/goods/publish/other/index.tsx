import React, { Component, useImperativeHandle } from 'react';
import { Table, Input, Button, Popconfirm, Form, Card, message, Row, Col, Select, Radio, DatePicker, Modal, Tabs, InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import styles from './index.less';
const { TabPane } = Tabs;
const { Option } = Select;
const safeGuard = ['免费', '收费'];
import {
  findFreightTemplateList,
  getFreTemCompanies,
  getAfterSaleOverlay,
  getFindAllProdTags,
  postSaveAfterSale,
  deleteAfterSale,
  getServiceExplains,
  getGuaranteeGroup,
  getFindTemplateInfo,

} from '@/services/goods/upload/other';
export default class goodsOtherInfo extends Component<any, any> {
  formRef: React.RefObject<any>
  constructor(props: any) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      isCharge: 1,
      checkSafeGuardList: [],   // 选择的服务保障
      commissionState: true,
    }
    this.getFreTemCompanies();
    // this.props.onRef(this);       //  点击下一步--父子传值
  }
  componentWillReceiveProps(nextProps: any) {


  }
  // 0202
  componentDidMount() {
    this.findFreightTemplateLists();
    let nextProps:any = this.props;
    if (nextProps.editOtherData) {
      let { firstLevelRate, isDist, serviceExplainList, afterSaleVO, secondLevelRate, guaranteeGroupVOS, templateId = '', deliveryWeight, afterSaleId } = nextProps.editOtherData;
      this.formRef.current.setFieldsValue({

        isDist: isDist ? true : false,
        deliveryWeight: deliveryWeight || ''
      })

      let checkSafeGuardList: any = [];
      let gteeSelectedRowKeys = []
      guaranteeGroupVOS && guaranteeGroupVOS.length > 0 && guaranteeGroupVOS.forEach((element: any) => {
        element.guaranteeItems.forEach((item: any) => {
          let obj = {
            ...item,
            guaranteeName: element.name,
            isCharge: element.isCharge
          }
          checkSafeGuardList.push(obj)
        })
      });
      if (templateId) {
        this.formRef.current.setFieldsValue({
          templateId
        })
        this.findTemplateInfo(templateId)
      }
      if (afterSaleId) {
        this.findAfterSaleInfo(afterSaleId)
      }
      gteeSelectedRowKeys = checkSafeGuardList.map((item: any) => item.id);
      let svcSelectedRowKeys = serviceExplainList.map((item: any) => item.id);
      this.setState({
        templateId,
        checkSvcDataList: serviceExplainList,                    // 服务说明
        svcSelectedRowKeys,
        // checkSvcDataList:afterSaleVO,                           // 售后保障
        checkSafeGuardList,                   // 保障服务
        gteeSelectedRowKeys,
        commissionState: isDist ? true : false,
        serviceModal: afterSaleVO,
        afterSaleId: (afterSaleVO && afterSaleVO.id) || '',
        firstLevelRate,
        secondLevelRate,
      })
    }
  }
  // 获取运费模板
  findFreightTemplateLists = async () => {

    let res = await findFreightTemplateList();
    let { data } = res;
    if (!res) return false;
    let freTemplateList: any = data && data.length > 0 && data.map((item: any) => <Option value={item.id} key={item.id}>{item.name}</Option>)
    this.setState({ freTemplateList })
  }

  deliveryCompanyList: any = '';
  // 获取物流公司
  getFreTemCompanies = async () => {
    let companies = await getFreTemCompanies();
    if (!companies) return false;
    let { data } = companies;
    let deliveryCompanyList: any = [];
    data && data.length > 0 && data.forEach((item: any) => {
      deliveryCompanyList[item.id] = item.name
    })
    this.deliveryCompanyList = deliveryCompanyList
    this.setState({ deliveryCompanyList })
  }
  // 父组件调用子组件方法获取数据
  childMethod = () => {

    let { afterSaleId, checkSafeGuardList, checkSvcDataList = [], chargeMode, } = this.state;   // afterSaleId 售后说明模板id
    let checkSvcDataListIds: any = []; // 服务说明id数组
    checkSvcDataList.forEach((item: any) => {
      checkSvcDataListIds.push(item.id)
    });
    let serviceIds = (checkSvcDataListIds && checkSvcDataListIds.length > 0 && checkSvcDataListIds.join(',')) || '';
    checkSafeGuardList = checkSafeGuardList && checkSafeGuardList.length > 0 && checkSafeGuardList.map((element: any) => {
      return {
        itemId: element.id,
        guaranteeId: element.guaranteeId
      }
    });
    let securityIds = (checkSafeGuardList && checkSafeGuardList.length > 0 && JSON.stringify(checkSafeGuardList)) || '';
    // let securityIds = '';
    let { setUpTime, isDist, publishStatus, deliveryWeight, templateId } = this.formRef.current.getFieldsValue();
    let { firstLevelRate, secondLevelRate, } = this.state;
    templateId = templateId ? templateId : this.state.templateId ? this.state.templateId : '';
    return {
      afterSaleId,                // afterSaleId 售后说明模板id
      // goods_label,                // 商品标签
      publishStatus,              // 设定商品发布后状态 1：上线，2：设定：有记录开始时间，0：放入仓库
      setUpTime,                  // 开始时间
      isDist,                     // 是否开启佣金管理
      firstLevelRate,             // 员工返还比例
      secondLevelRate,            // 企业返还比例
      serviceIds,                 // 服务说明id
      securityIds,                // 保障服务ID（用逗号分隔）
      templateId,
      deliveryWeight,
      chargeMode
    }
  }
  /* -------------------------------------------------- 标签模块tags ------------------------------------------------------ */
  // 标签分页
  tagsPage = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }
  // 标签分页器
  tagsPagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: this.tagsPage.pageNum,
    pageSize: this.tagsPage.pageSize || 10,
    total: this.tagsPage.total,
    showTotal: (t: number) => <div>共{t}条</div>
  }

  // 选择框
  onTagsSelectChange: any = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };
  // 标签rows
  tagsRowSelection = {
    onChange: this.onTagsSelectChange,
  };
  tagsColumns = [
    {
      title: '类型',
      dataIndex: 'tagsType',
      render: (text: any) => text
    },
    {
      title: '标签',
      dataIndex: 'tagsName',
    },
  ]

  // 点击标签分页
  onTagsTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.tagsPage, { pageNum: current, pageSize: pageSize })
    this.getTagsList()
  }
  // 获取标签列表
  getTagsList = async () => {
    let size = this.tagsPage.pageSize;
    let page = this.tagsPage.pageNum;
    let query = { page, size };
    let res = await getFindAllProdTags({ ...query });
    this.setState({ loading: false })

    if (!res) return false;
    let tagsDataList = res.data && res.data.records || [];
    this.tagsPage.total = res.data && res.data.total || 0;  // 总数据条数
    this.setState({ tagsDataList })
  }
  // 对话框
  showTagsModal = () => {
    this.setState({
      addTagVisible: true,
    });
    this.getTagsList()
  };
  /* -------------------------------------------------- 售后说明模块aftersales ------------------------------------------------------ */
  // 售后说明分页
  asoPage = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }
  // 售后说明columns
  asoColumns = [
    {
      title: '说明标题',
      dataIndex: 'name'
    },
    {
      title: '内容',
      width: '280px',
      dataIndex: 'content',
      render: (text: any, record: any) =>
        <>
          <div style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.items[0] && record.items[0].content}</div>
        </>
    },
    {
      title: '操作',
      render: (text: any, record: any) =>
        <>
          <Button type='primary' style={{ marginLeft: '10px' }} onClick={() => this.useService(record)}>使用</Button>
        </>
    }
  ]
  // 售后说明分页
  onAsoTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.asoPage, { pageNum: current, pageSize: pageSize })
    this.getSaleOverlayList()
  }
  // 获取售后说明列表
  getSaleOverlayList = async () => {
    let size = this.asoPage.pageSize;
    let page = this.asoPage.pageNum;
    let query = { page, size, };
    this.setState({ asoLoading: true })
    let res = await getAfterSaleOverlay({ ...query });
    this.setState({ asoLoading: false })
    if (!res) return false;
    let asoDataList = res.data && res.data.records || [];
    this.asoPage.total = res.data && res.data.total || 0;  // 总数据条数
    this.setState({ asoDataList })
  }
  // 售后说明
  findAfterSaleInfo = async (afterSaleId: any) => {
    let { asoModalInfo, } = this.state;
    let query = { id: afterSaleId }
    let res = await getAfterSaleOverlay({ ...query });
    let { data } = res;
    if (!res) return false;
    let { records } = data;
    asoModalInfo = records && records[0];
    this.setState({ asoModalInfo, afterSaleId })
  }
  // 售后对话框
  showAsoModal = () => {
    this.setState({
      asoVisible: true,
    });
    this.getSaleOverlayList()
  };
  // 使用售后说明模板
  useService = (record: any) => {
    let afterSaleId = record.id;
    this.setState({ afterSaleId, asoVisible: false, asoModalInfo: record })
  }
  serviceRender = () => {
    let { asoModalInfo } = this.state;
    return (<>
      <Card
        title={'模板名称: ' + (asoModalInfo.name ? asoModalInfo.name : '空')}
        bodyStyle={{ paddingTop: '5px', paddingBottom: '4px' }}
        hoverable={true}
        size={"small"}
      >
        <ul>
          {
            asoModalInfo.items && asoModalInfo.items.length != 0 && asoModalInfo.items.map((item: any, index: any) =>
              <li key={index}>
                <h1>{item.title}</h1>
                <p>{item.content}</p>
              </li>
            )
          }
        </ul>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popconfirm
            title="是否删除该条售后说明?"
            onConfirm={() => this.setState({ asoModalInfo: null, afterSaleId: '' })}
            okText="确定"
            cancelText="取消"
          >
            <Button type='primary' >删除</Button>
          </Popconfirm>
        </div>
      </Card>
    </>)

  }
  addModalAso = () => {
    this.setState({
      addServiceState: true,
      asoVisible: false,
      asoType: 'add',
      asoId: '',
      asoContent: '',
      asoTitle: '',
    })
  }
  // 新建售后说明
  addAso = async () => {
    let { asoTitle, asoContent, asoType, asoId } = this.state;
    let query: any = {
      content: asoContent,
      title: asoTitle
    }
    if (asoType === 'editor') {
      query.id = asoId;
      let res = await postSaveAfterSale({ ...query });
      if (!res) return false;
      this.getSaleOverlayList()
    }
    if (asoType === 'add') {
      let res = await postSaveAfterSale({ ...query });
      if (!res) return message.error('添加失败')
    }
    this.setState({ addServiceState: false })
  }
  // 输入售后标题
  changeInput = (e: any) => {
    const { value } = e.target;
    this.setState({ asoTitle: value })

  }
  // 输入售后标题
  changeTextArea = (e: any) => {
    const { value } = e.target;
    this.setState({ asoContent: value })
  }

  // 删除售后说明模板
  deleteService = async (record: any) => {
    let { id } = record;
    let res = await deleteAfterSale({ id });
    if (!res) return false;
    this.getSaleOverlayList()
  }
  // 修改售后说明模板
  editorService = (record: any) => {
    this.setState({
      asoId: record.id,
      addServiceState: true,
      asoContent: record.content,
      asoTitle: record.title,
      asoType: 'editor'
    })
  }
  /* -------------------------------------------------- 服务说明模块service ------------------------------------------------------ */
  // 服务说明分页
  svcPage = {
    pageSize: 100,
    pageNum: 1,
    total: 0,
  }

  // 服务说明
  onSvcSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({ svcSelectedRowKeys: selectedRowKeys, svcSelectedRows: selectedRows })
  }
  // 点击服务说明确定按钮
  saveSvc = () => {
    let { svcSelectedRowKeys, svcSelectedRows, checkSvcDataList = [] } = this.state;
    let add = svcSelectedRows.filter((item: any) => !checkSvcDataList.some((ele: any) => ele.id === item.id))
    checkSvcDataList.push(...add);
    svcSelectedRowKeys = checkSvcDataList.map((item: any) => item.id)
    this.setState({ serviceVisible: false, checkSvcDataList }, () => {
    })
  }
  // 移除服务说明 checkSvcDataList: svcSelectedRows,  splice(index,1);
  deleCheckService = (record: any, index: any) => {
    let { checkSvcDataList, svcSelectedRowKeys, svcSelectedRows } = this.state;
    checkSvcDataList.splice(index, 1);
    svcSelectedRowKeys = checkSvcDataList.map((item: any) => item.id)
    // svcSelectedRowKeys.splice(index, 1);
    this.setState({ checkSvcDataList, svcSelectedRowKeys })

  }

  // 服务说明columns
  svcColumns = [
    {
      title: '说明标题',
      dataIndex: 'title'
    },
    {
      title: '内容',
      width: '280px',
      dataIndex: 'content',
      render: (text: any, record: any) =>
        <>
          <div style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
        </>
    },
  ]
  // 服务说明分页
  onSvcTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.svcPage, { pageNum: current, pageSize: pageSize })
    this.getServiceList()
  }
  // 获取服务说明列表
  getServiceList = async () => {
    let size = this.svcPage.pageSize;
    let page = this.svcPage.pageNum;
    let query = {};
    this.setState({ svcLoading: true })
    let res = await getServiceExplains({ ...query });
    this.setState({ svcLoading: false })

    if (!res) return false;
    let svcDataList = res.data && res.data.records || [];
    this.svcPage.total = res.data && res.data.total || 0;  // 总数据条数
    this.setState({ svcDataList })
  }
  // 服务说明BTN
  getService = () => {
    this.setState({ serviceVisible: true })
    this.getServiceList()
  }

  /* -------------------------------------------------- 保障服务模块SafeGuard ------------------------------------------------------ */
  // 保障服务分页
  sgdPage = {
    pageSize: 5,
    pageNum: 1,
    total: 0,
  }

  sgdColumns = [
    {
      title: '服务名称',
      dataIndex: 'name'
    },
    {
      title: '类型',
      dataIndex: 'isCharge',
      render: (text: any, record: any) => safeGuard[text]
    },
    {
      title: '操作',
      width: 150,
      render: (text: any, record: any) => <Button type='primary' onClick={() => this.getSgdSku(record)}>选择保障项目</Button>
    },
  ]
  // 获取保障服务
  getSgdSku = (record: any) => {
    let { guaranteeItems } = record;
    this.setState({ proInfosVisiable: true, guaranteeItems }, () => {
    })
  }

  // 保障服务分页
  onSgdTableChange = ({ current, pageSize }: any) => {
    Object.assign(this.sgdPage, { pageNum: current, pageSize: pageSize })
    this.getSafeGuardList()
  }

  // 获取保障服务列表
  getSafeGuardList = async () => {
    let size = this.sgdPage.pageSize;
    let page = this.sgdPage.pageNum;
    let { isCharge } = this.state;
    let query = { page, size, isCharge };
    this.setState({ sgdLoading: true })
    let res = await getGuaranteeGroup({ ...query });
    this.setState({ sgdLoading: false })

    if (!res) return false;
    let sgdDataList = (res && res.data && res.data.records) || [];
    this.sgdPage.total = res.data && res.data.total || 0;  // 总数据条数
    this.setState({ sgdDataList })
  }
  // 点击服务保障按钮
  getSafeguard = () => {
    // message.success('该模块正在努力维护中...')
    this.setState({ sgdVisible: true });
    this.getSafeGuardList()
  }
  // 选择保障服务是否收费
  onCheckSgdType = (isCharge: any) => {
    this.sgdPage.pageSize = 5;
    this.sgdPage.pageNum = 1;
    this.sgdPage.total = 0;
    this.setState({ isCharge, sgdDataList: [] }, () => {
      this.getSafeGuardList();
    })
  }
  // 保障选择按钮
  onGteeSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    this.setState({ gteeSelectedRows: selectedRows, gteeSelectedRowKeys: selectedRowKeys })
  }
  // 保障项目弹窗确定按钮
  saveSgdList = () => {
    let { gteeSelectedRows, checkSafeGuardList, gteeSelectedRowKeys } = this.state;
    let add = gteeSelectedRows.filter((item: any) => !checkSafeGuardList.some((ele: any) => ele.id === item.id))
    checkSafeGuardList.push(...add);
    gteeSelectedRowKeys = checkSafeGuardList.map((item: any) => item.id);
    this.setState({ proInfosVisiable: false, checkSafeGuardList, sgdVisible: false, gteeSelectedRowKeys })
  }
  // 移除保障服务
  delCheckSgd = (record: any, index: any) => {
    let { id } = record;
    let { checkSafeGuardList, gteeSelectedRowKeys } = this.state;
    checkSafeGuardList.splice(index, 1)
    // checkSafeGuardList = checkSafeGuardList.filter(item => item.id != id);
    gteeSelectedRowKeys = checkSafeGuardList.map((item: any) => item.id);
    this.setState({ checkSafeGuardList, gteeSelectedRowKeys })
  }
  /* --------------------------------------------------------------------------------------------------------------------------- */


  // 选择开始时间
  onBeginTime = (e: any) => {
    this.setState({ beginTimeState: e.target.value })
  }

  // 佣金开启关闭
  onCommission = (e: any) => {
    this.setState({ commissionState: e.target.value })
  }
  // 选择运费模板
  handleLogisticsType = (value: any) => {
    let templateId = value;
    this.setState({ templateId })
    this.findTemplateInfo(value);
  }
  // 查询模板详情
  findTemplateInfo = async (id: any) => {
    let { deliveryCompanyList=[] } = this.state;
    if (!deliveryCompanyList || deliveryCompanyList.length == 0) {
      this.getFreTemCompanies();
    }
    let res = await getFindTemplateInfo(id);
    let { data } = res;
    if (!data) return false;
    let { chargeMode = '', defaultDeliveryWay, areaDeliveryWay, notDeliveryWay, selfTaking } = data;
    // isConditionPinkage  isDeliveryCompany 1是 0否   fullMinusUnit 满减单位：1:件 2:元
    selfTaking = selfTaking && selfTaking.type == 3 ? true : false;

    let defaultDeliveryWays = [];
    defaultDeliveryWays = defaultDeliveryWay && defaultDeliveryWay.deliveryWays && defaultDeliveryWay.deliveryWays.length != 0 && defaultDeliveryWay.deliveryWays.map((item: any) => {
      let { firstPiece, firstPieceFee, addPiece, addPieceFee, deliveryCompanyId, fullMinusCount, fullMinusUnit, isConditionPinkage, } = item;
      let defaultFreText = `${(((deliveryCompanyId && deliveryCompanyList[deliveryCompanyId]) ?  deliveryCompanyList[deliveryCompanyId] + ',':' ')) || ''}${firstPiece || 0}${chargeMode == '1' ? '千克' : '件'}${firstPieceFee || 0}元，每增加${addPiece || 0}件,增加运费${addPieceFee || 0}元`;
      let defFullText = ` 满${fullMinusCount || 0}${fullMinusUnit == 1 ? '件' : '元'}${isConditionPinkage ? '包邮' : "不包邮"}`; // 满减

      let obj = { defaultFreText, defFullText, }
      return obj
    })
    let areaDeliveryWays = [];
    areaDeliveryWays = areaDeliveryWay && areaDeliveryWay.deliveryWays && areaDeliveryWay.deliveryWays.length != 0 && areaDeliveryWay.deliveryWays.map((item: any) => {

      let { firstPiece, firstPieceFee, addPiece, addPieceFee, deliveryCompanyId, fullMinusCount, fullMinusUnit, isConditionPinkage, districtInfo } = item;
      let specialFreText = `${(((deliveryCompanyId && deliveryCompanyList[deliveryCompanyId]) ?  deliveryCompanyList[deliveryCompanyId] + ',':' ')) || ''}${firstPiece || 0}${chargeMode == '1' ? '千克' : '件'}${firstPieceFee || 0}元，每增加${addPiece || 0}${chargeMode == '1' ? '千克' : '件'},增加运费${addPieceFee || 0}元`;
      let specialFullText = ` 满${fullMinusCount || 0}${fullMinusUnit == 1 ? '件' : '元'}${isConditionPinkage ? '包邮' : "不包邮"}`; // 满减

      // 指定区域 --- 区域
      districtInfo = districtInfo && JSON.parse(districtInfo) || []
      let specialCheckRegion = districtInfo && districtInfo.length > 0 && districtInfo.map((v: any) => v.title) || [];
      specialCheckRegion = (specialCheckRegion && specialCheckRegion.join(',')) || '';

      let obj = { specialFreText, specialFullText, specialCheckRegion }
      return obj
    })

    let notDeliveryWays = [];
    notDeliveryWays = notDeliveryWay && notDeliveryWay.deliveryWays && notDeliveryWay.deliveryWays.length != 0 && notDeliveryWay.deliveryWays.map((item: any) => {

      let { notDeliveryReason, districtInfo } = item;
      let noDistributionFreText = `不配送原因：${notDeliveryReason || '无'}`;

      // 不配送区域 --- 区域
      districtInfo = districtInfo && JSON.parse(districtInfo) || []
      let noDisCheckRegion = districtInfo && districtInfo.length > 0 && districtInfo.map((item: any) => item.title) || [];
      noDisCheckRegion = (noDisCheckRegion && noDisCheckRegion.join(',')) || '';

      let obj = { noDistributionFreText, noDisCheckRegion }
      return obj
    })
    this.setState({ chargeMode, defaultDeliveryWays, areaDeliveryWays, notDeliveryWays, selfTaking })
  }
  addNewFreTem = () => {
    // this.props.histry.push(`/logistics_manage/freight_template`);
  }
  render() {
    const { tagsDataList, asoDataList, svcDataList, sgdDataList = [], checkSvcDataList, defaultDeliveryWays = [], areaDeliveryWays = [], notDeliveryWays = [], checkSafeGuardList = [] } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 5 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 18 },
      },
    };

    // 服务说明rows
    const svcRowSelection = {
      selectedRowKeys: this.state.svcSelectedRowKeys,
      onChange: this.onSvcSelectChange,
    };


    // 售后说明分页器
    const asoPagination: any = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.asoPage.pageNum,
      pageSize: this.asoPage.pageSize || 10,
      total: this.asoPage.total,
      showTotal: (t: any) => <div>共{t}条</div>
    }
    // 保障服务 --- 收费
    const sgdPagination: any = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.sgdPage.pageNum,
      pageSize: this.sgdPage.pageSize || 10,
      total: this.sgdPage.total,
      showTotal: (t: any) => <div>共{t}条</div>
    }
    const gteeRowSelection = {
      selectedRowKeys: this.state.gteeSelectedRowKeys,
      onChange: this.onGteeSelectChange,
    };
    //
    // 服务说明选择
    const svcPagination: any = {
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.svcPage.pageNum,
      pageSize: this.svcPage.pageSize || 10,
      total: this.svcPage.total,
      showTotal: (t: any) => <div>共{t}条</div>
    }
    return (
      <Card
        className={styles.content}
        bordered
        hoverable
        title={'四、其他信息'}
        loading={this.props.loading}
      >
        <Form {...formItemLayout}
          ref={this.formRef}
          initialValues={{
            templateId: (this.props.editOtherData && this.props.editOtherData.templateId) || '',
            ckjs: 1,
            publishTime: 1,
            isDist: (this.props.editOtherData && this.props.editOtherData.isDist) || true,

          }}
        >
          <Row>
            <Col span={12}>
              <Form.Item label="运费模板：" style={{ marginBottom: '5px' }} required={true}>
                <Form.Item
                  name='templateId'
                  rules={[{ required: true, message: '请选择运费模板!' }]}
                >
                  <Select
                    style={{ width: 300 }}
                    onChange={(e) => this.handleLogisticsType(e)}
                  >
                    {this.state.freTemplateList}
                  </Select>
                </Form.Item>


                {
                  this.formRef && this.formRef.current && this.formRef.current.getFieldValue('templateId') &&
                  <ul style={{ minWidth: '350px', border: '1px solid #ccc', }}>
                    {
                      defaultDeliveryWays && defaultDeliveryWays.length != 0 && defaultDeliveryWays.map((item: any, index: any) => {
                        return (
                          <li style={{ display: 'flex', borderBottom: '1px solid #ccc' }} key={index}>
                            <div style={{
                              borderRight: '1px solid #ccc', width: '20%', fontSize: '12px', lineHeight: 'normal',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>默认方式</div>
                            <div style={{ width: '90%' }}>
                              <div style={{ borderBottom: '1px solid #ccc', height: '36px' }}> &nbsp;{item.defaultFreText}</div>
                              <div style={{ height: '36px' }}>  &nbsp;{item.defFullText}</div>
                            </div>
                          </li>
                        )
                      })
                    }
                    {
                      areaDeliveryWays && areaDeliveryWays.length != 0 && areaDeliveryWays.map((item: any, index: any) => {
                        return (
                          <li style={{ display: 'flex', borderBottom: '1px solid #ccc' }} key={index}>
                            <div style={{
                              borderRight: '1px solid #ccc',
                              width: '20%',
                              fontSize: '12px',
                              lineHeight: 'normal',
                              textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              {item.specialCheckRegion ? item.specialCheckRegion : '指定特殊区域'}
                            </div>
                            <div style={{ width: '90%' }}>
                              <div style={{ borderBottom: '1px solid #ccc', height: '36px' }}>&nbsp;{item.specialFreText}</div>
                              <div style={{ height: '36px' }}> &nbsp;{item.specialFullText}</div>
                            </div>
                          </li>
                        )
                      })
                    }
                    {
                      notDeliveryWays && notDeliveryWays.length != 0 && notDeliveryWays.map((item: any, index: any) => {
                        return (
                          <li style={{ display: 'flex' }} key={index}>
                            <div style={{
                              borderRight: '1px solid #ccc', width: '20%', fontSize: '12px', lineHeight: 'normal', textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              {item.noDisCheckRegion ? item.noDisCheckRegion : '不配送区域'}
                            </div>
                            <div style={{ height: '36px', width: '90%' }}>&nbsp;{item.noDistributionFreText}</div>
                          </li>
                        )
                      })
                    }
                    <li style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
                      <div style={{
                        borderRight: '1px solid #ccc', width: '20%', fontSize: '12px', lineHeight: 'normal', textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                        自提方式
                                            </div>
                      <div style={{ height: '36px', width: '90%' }}>&nbsp;{this.state.selfTaking ? '支持自提' : '不支持自提'}</div>
                    </li>
                  </ul>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="售后保障信息： " style={{ marginBottom: '5px', }}>
                <Button type="primary" onClick={this.showAsoModal} style={{ marginRight: '10px' }}>添加说明</Button>
                                &emsp;<span style={{ color: '#b9b9b9', fontSize: '12px' }}>填写售后说明，让买家更清楚售后保障，减少纠纷。</span>
                {this.state.asoModalInfo && this.state.asoModalInfo.id && this.serviceRender()}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="库存计数: " style={{ marginBottom: '5px' }} name='ckjs'>
                <Radio.Group onChange={this.onBeginTime} value={this.state.value} style={{ float: 'left' }}>
                  <Radio value={1}>拍下减库存</Radio>
                  <Radio value={2} style={{ marginLeft: '20px' }}>付款减库存</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="开始时间: " style={{ marginBottom: '5px' }} name='publishTime'>
                <Radio.Group onChange={this.onBeginTime} style={{ float: 'left' }}>
                  <Radio value={1}>立刻</Radio>
                  <Radio value={0} style={{ marginLeft: '20px' }}>放入仓库</Radio>
                  <Radio value={2} style={{ marginLeft: '20px' }}>设定</Radio>
                </Radio.Group>
                <Form.Item name='setUpTime'>
                  <DatePicker placeholder='请选择设定时间' style={{ float: 'left' }} disabled={this.state.beginTimeState == 2 ? false : true} />
                </Form.Item>

              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="佣金管理：" style={{ marginBottom: '5px' }} >
                <Form.Item name='isDist'>
                  <Radio.Group onChange={this.onCommission} >
                    <Radio value={true}>开启</Radio>
                    <Radio value={false} style={{ marginLeft: '10px' }}>关闭</Radio>
                  </Radio.Group>
                </Form.Item>
                {this.state.commissionState && <div style={{ width: '220px', float: 'left' }}>
                  {
                    <div>员工返还:&nbsp;<InputNumber
                      min={0} style={{ width: '100px' }}
                      value={this.state.firstLevelRate || 0}
                      onChange={(e) => this.setState({ firstLevelRate: e })}
                    /> %</div>
                  }
                  {
                    <div>企业返还:&nbsp;<InputNumber min={0} style={{ width: '100px' }}
                      value={this.state.secondLevelRate || 0}
                      onChange={(e) => this.setState({ secondLevelRate: e })}
                    /> %</div>
                  }
                  <div style={{ color: '#AAAAAA' }}>总计分佣比例不能超过100%</div>
                </div>}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="服务说明: " style={{ marginBottom: '5px' }}>
                <ul>
                  <li><Button type='primary' onClick={this.getService}>选择服务说明</Button></li>
                  {
                    checkSvcDataList && checkSvcDataList.length > 0 &&
                    <li>
                      <Table
                        rowKey={(record: any) => record.id}
                        bordered={true}
                        pagination={false}
                        columns={[
                          {
                            title: '服务标题',
                            dataIndex: 'title',
                            align: 'center',
                            key: 'title',
                            width: '120px'
                          },
                          {
                            title: '服务内容',
                            dataIndex: 'content',
                            align: 'center',
                            key: 'content'
                          },
                          {
                            title: '操作',
                            align: 'center',
                            render: (text, record, index) => (
                              <>
                                <Button type='danger' onClick={() => this.deleCheckService(record, index)}>删除</Button>
                              </>
                            )
                          },
                        ]}
                        dataSource={checkSvcDataList}
                      />
                    </li>
                  }
                </ul>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="保障服务: " style={{ marginBottom: '5px' }}>
                <ul>
                  <li><Button type='primary' onClick={this.getSafeguard}>选择保障服务</Button></li>
                  {
                    checkSafeGuardList && checkSafeGuardList.length > 0 &&
                    <li>
                      <Table
                        rowKey={record => record.id}
                        bordered={true}
                        columns={[
                          {
                            title: '服务名称',
                            dataIndex: 'guaranteeName',
                            align: 'center',
                            width: '120px'
                          },
                          {
                            title: '保障项目',
                            dataIndex: 'name',
                            align: 'center',
                          },
                          {
                            title: '价格',
                            dataIndex: 'price',
                            align: 'center',
                          },
                          {
                            title: '类型',
                            dataIndex: 'isCharge',
                            align: 'center',
                            render: (text) => safeGuard[text]
                          },
                          {
                            title: '操作',
                            align: 'center',
                            render: (text, record, index) => (
                              <>
                                <Button type='danger' onClick={() => this.delCheckSgd(record, index)}>移除</Button>
                              </>
                            )
                          },
                        ]}
                        pagination={false}
                        dataSource={checkSafeGuardList}
                      />
                    </li>
                  }

                </ul>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {/* 使用标签 */}
        <Modal
          title='增加标签'
          closable={false}
          visible={this.state.addTagVisible}
          onCancel={() => this.setState({ addTagVisible: false })}
          onOk={() => this.setState({ addTagVisible: false })}
        >

          <div style={{ marginBottom: '20px' }}>
            <div style={{ float: 'left', lineHeight: '34px' }}>标签:&emsp; </div>
            <Input style={{ width: '200px' }} />
            <Button type="primary" style={{ float: 'right' }}>查询</Button>
          </div>
          <Table
            rowKey={(record: any) => record.id}
            rowSelection={this.tagsRowSelection}
            dataSource={tagsDataList}
            columns={this.tagsColumns}
            onChange={this.onTagsTableChange}
            pagination={this.tagsPagination}
          />
        </Modal>
        {/* 售后说明 */}
        <Modal
          title='售后说明页面'
          width={800}
          visible={this.state.asoVisible}
          onCancel={() => this.setState({ asoVisible: false })}
          footer={null}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}></div>
          <Table
            rowKey={record => record.id}
            columns={this.asoColumns}
            dataSource={asoDataList}
            onChange={this.onAsoTableChange}
            pagination={asoPagination}
          />
        </Modal>
        {/* 新增售后说明 */}
        <Modal
          title={`${this.state.asoType === 'add' ? '新增' : '编辑'}售后说明页面`}
          width={800}
          closable={false}
          visible={this.state.addServiceState}
          onCancel={() => this.setState({ addServiceState: false })}
          onOk={() => this.addAso()}
        >
          <ul>
            <li>
              <ul>
                <li style={{ width: '200px', marginBottom: '20px' }}>
                  <Input onChange={(e) => this.changeInput(e)} value={this.state.asoTitle} style={{ width: '150px' }} /> : </li>
                <li><TextArea onChange={(e) => this.changeTextArea(e)} value={this.state.asoContent}></TextArea></li>
              </ul>
            </li>
          </ul>
        </Modal>
        {/* 选择服务说明 */}
        <Modal
          title='服务说明'
          width={800}
          closable={false}
          visible={this.state.serviceVisible}
          onCancel={() => this.setState({ serviceVisible: false })}
          onOk={this.saveSvc}
        >
          <Table
            rowKey={record => record.id}
            rowSelection={svcRowSelection}
            columns={this.svcColumns}
            dataSource={svcDataList}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </Modal>
        {/* 选择保障服务 */}
        <Modal
          title='保障服务'
          closable={false}
          visible={this.state.sgdVisible}
          onCancel={() => this.setState({ sgdVisible: false })}
          onOk={() => this.setState({ sgdVisible: false })}
        >
          <Tabs defaultActiveKey="1" onChange={this.onCheckSgdType}>
            <TabPane tab="收费服务" key="1">
              <Table
                rowKey={record => record.id}
                columns={this.sgdColumns}
                dataSource={sgdDataList}
                onChange={this.onSgdTableChange}
                pagination={sgdPagination}
              />
            </TabPane>
            <TabPane tab="免费服务" key="0">
              <Table
                rowKey={record => record.id}
                columns={this.sgdColumns}
                dataSource={sgdDataList}
                onChange={this.onSgdTableChange}
                pagination={sgdPagination}
              />
            </TabPane>
          </Tabs>
        </Modal>
        <Modal
          visible={this.state.proInfosVisiable}
          title={'选择保障项目'}
          onCancel={() => this.setState({ proInfosVisiable: false, guaranteeItems: [] })}
          onOk={this.saveSgdList}
        >
          <Table
            rowKey={record => record.id}
            rowSelection={gteeRowSelection}
            columns={[
              {
                title: '保障名称',
                dataIndex: 'name'
              },
              {
                title: '价格',
                dataIndex: 'price'
              },
            ]}
            dataSource={this.state.guaranteeItems}
          />
        </Modal>
      </Card>
    )
  }
}
