import styles from './index.less'
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, message, Modal, Form, Input } from 'antd';
import { DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import { 
  findSubByPage, findInvoiceInfo, FindSubByPageParams, findInvoiceListInfo, addInvoiceSubList, AddInvoiceSubListParams,
  EditInvoiceInfoParams, editInvoiceInfo, addInvoice
} from '@/services/receipt/index';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};

const setInvoiceDate = 29;// 规定开票日期为每月15号

interface UserProp {
  location: any;
  history: any;
}
const Receipt: React.FC<UserProp> = (props) => {
  let { key = '-1', pageNum = 1, pageSize = 10 } = props.location.query;
  let [tableList, setTableList] = useState<Array<any>>([]);
  let [tabIndex, setTabIndex] = useState<string>(key);
  let [pageInfo, setPageInfo] = useState<any>({ pageNum: +pageNum, pageSize: +pageSize });
  let [pageTotal, setPageTotal] = useState<number>(0);
  let [loading, setLoading] = useState<boolean>(false);
  let [invoiceTitle, setInvoiceTitle] = useState<string>('');// 发票抬头
  let [taxpayerNo, setTaxpayerNo] = useState<string>('');// 纳税号
  let [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);// 选择的
  let [batchLoading, setBatchLoading] = useState<boolean>(false);// 获取开票金额 loading
  let [subsTotal, setSubsTotal] = useState<number>(0);// 开票金额
  let [batchInvoiceLoading, setBatchInvoiceLoading] = useState<boolean>(false);// 正在开票loading
  let [invoiceModal, setInvoiceModal] = useState<boolean>(false);// 开票确认弹框
  let [headUpModal, setHeadUpModal] = useState<boolean>(false);// 编辑发票抬头信息 弹框
  let [editLoading, setEditLoading] = useState<boolean>(false);// 编辑发票抬头信息 接口loading
  const [form] = Form.useForm();

  useEffect(() => {
    getTitle();
  }, []);
  useEffect(() => {
    getDataInfo();
  }, [tabIndex, pageInfo]);


  function refresh() {
    getDataInfo();
  }
  // 列表
  async function getDataInfo() {
    let params: FindSubByPageParams = {
      page: pageInfo.pageNum,
      size: pageInfo.pageSize,
    };
    if (tabIndex !== '-1') {
      params.hasInvoice = +tabIndex;
    }
    props.history.replace({
      query: {
        key: tabIndex,
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
      },
    });
    setLoading(true);
    let { total, records } = await findSubByPage(params);
    setLoading(false);
    setTableList(records);
    setPageTotal(total);
  }
  // 发票抬头
  async function getTitle(): Promise<void | false> {
    let res = await findInvoiceInfo();
    if (!res) return false;
    let { invoiceTitle, taxpayerNo } = res;
    setInvoiceTitle(invoiceTitle)
    setTaxpayerNo(taxpayerNo)
  }
  // 批量开票 - 查询开票金额
  async function batchInvoice() {
    if (!selectedRowKeys.length) return message.warn('请选择要批量处理数据');
    let params = {
      ids: selectedRowKeys.join(',')
    }
    setBatchLoading(true)
    let res = await findInvoiceListInfo(params)
    setBatchLoading(false)
    if (!res) return false;
    setSubsTotal(res)
    setInvoiceModal(true)
  }
  // 开票 - 接口报错
  async function batchInvoiceOk() {
    let strDate = new Date().getDate();
    if (strDate != setInvoiceDate) {
      message.error('仅支持每月' + setInvoiceDate + '号开发票');
    } else {
      let params: AddInvoiceSubListParams = {
        invoiceTitle: invoiceTitle,
        taxpayerNo: taxpayerNo,
        invoiceAmount: subsTotal,
        subIds: selectedRowKeys
      }
      setBatchInvoiceLoading(true)
      let res = await addInvoiceSubList(params)
      setBatchInvoiceLoading(false)
      if (!res) return false;
      setInvoiceModal(false)
      setSelectedRowKeys([])
      refresh()
    }
  }

  // 修改、新增发票抬头
  async function updateCopanyHeadUp(){
    form.validateFields()
    .then((values) => {
      let { invoiceTitle2, taxpayerNo2 } = values;
      let params: EditInvoiceInfoParams = {
        invoiceTitle: invoiceTitle2, taxpayerNo: taxpayerNo2
      }
      setEditLoading(true)
      let res;
      if(invoiceTitle){
        res = editInvoiceInfo(params)
      }else{
        res = addInvoice(params)
      }
      setEditLoading(false)
      if(res){
        setHeadUpModal(false)
        setInvoiceTitle(invoiceTitle2)
        setTaxpayerNo(taxpayerNo2)
      }
    })
    .catch()
  }
  const columns = [
    { title: '订单编号', dataIndex: 'orderNo' },
    { title: '订单金额', dataIndex: 'actualAmount' },
    {
      title: '发票状态',
      dataIndex: 'hasInvoice',
      render: (text: number) => <div>{text ? '已开票' : '未开票'}</div>,
    },
  ];
  return (
    <PageHeaderWrapper
      tabActiveKey={tabIndex}
      onTabChange={setTabIndex}
      tabList={[
        { key: '-1', tab: '全部' },
        { key: '0', tab: '未开票' },
        { key: '1', tab: '已开票' },
      ]}
    >
      <Card>
        <div className={styles.billInfo}> {invoiceTitle ? `发票抬头：${invoiceTitle}` : '添加发票抬头信息'}
          <Button style={{ marginLeft: '10px' }} size='small' type="primary" onClick={() => setHeadUpModal(true)}>{invoiceTitle ? '编辑' : '增加'}</Button>
        </div>
        <div className={styles.btn_wrap}>
          <div>
            {tabIndex !== '1' && <Button icon={<DownloadOutlined />} type="primary" onClick={batchInvoice} loading={batchLoading}>批量开票</Button>}
          </div>
          <Button icon={<SyncOutlined />} onClick={refresh}>刷新</Button>
        </div>

        <Table
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
            getCheckboxProps: record => ({
              disabled: record.hasInvoice == 1,
            }),
          }}
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
            total: pageTotal,
            showTotal: (t) => <div>共{t}条</div>,
          }}
        />
      </Card>

      <Modal
        title={'确认发票信息'}
        visible={invoiceModal}
        confirmLoading={batchInvoiceLoading}
        onCancel={() => setInvoiceModal(false)}
        onOk={batchInvoiceOk}
        maskClosable={false}
      >
        <FormItem label="开票金额" {...formItemLayout}>
          {subsTotal}
        </FormItem>
        <FormItem label="发票抬头" {...formItemLayout}>
          {invoiceTitle}
        </FormItem>
        <FormItem label="纳税人识别号" {...formItemLayout}>
          {taxpayerNo}
        </FormItem>
        <FormItem label="开票内容" {...formItemLayout}>
          商品分类
          </FormItem>
      </Modal>

      <Modal
        title={invoiceTitle ? '编辑公司抬头信息' : '增加公司抬头信息'}
        visible={headUpModal}
        confirmLoading={editLoading}
        onOk={updateCopanyHeadUp}
        onCancel={() => setHeadUpModal(false)}
        maskClosable={false}
      >
        <Form 
        form={form}
        initialValues={{
          invoiceTitle2: invoiceTitle,
          taxpayerNo2: taxpayerNo
        }}>
          <FormItem label="公司抬头" {...formItemLayout} name="invoiceTitle2" rules={[
            { required: true, message: '请输入公司抬头' },
          ]}>
            <Input />
          </FormItem>
          <FormItem label="纳税人识别号" {...formItemLayout} name="taxpayerNo2" rules={[{ required: true, message: '请输入税人识别号' }]}>
            <Input />
          </FormItem>
          <FormItem label="开票内容" {...formItemLayout}>
            商品分类
          </FormItem>
        </Form>
      </Modal>

    </PageHeaderWrapper>
  );
};

export default Receipt;
