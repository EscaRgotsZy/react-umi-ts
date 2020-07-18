import React, { Component, } from 'react';
import { Button, Form, Row, Col, Input, Radio, Modal, Table, message, Card } from 'antd';
import styles from './index.less';
import {
    getInvoiceDataList,
} from '@/services/cash/recharge';
const invoiceTypeList = ['无', '增值税专用发票', '增值税普通发票']
interface UserProp {
    props: any;
    nextSteps: any;
    confirmInfo: any;
}
interface UserState {
    flag: boolean;
    invoiceLoading: boolean;
    total: number | string,
    pageInfo: any;
    invoiceTitleList: Array<any>;
    confirmInfo: any;
    invoiceTitleInfo: any;
}
export default class InvoiceInfo extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    invoiceRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        this.formRef = React.createRef();
        this.invoiceRef = React.createRef();
        this.state = {
            flag: false,
            invoiceLoading: false,
            total: '',
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
            },
            invoiceTitleList: [],
            confirmInfo: this.props.confirmInfo,
            invoiceTitleInfo: this.props.confirmInfo ? this.props.confirmInfo.invoiceTitleInfo : '',
        }
    }
    columns = [
        { title: '发票抬头', dataIndex: 'invoiceName', render: (text: any, record: any, index: number) => <div className={styles.ellipsis}>{text}</div> },
        { title: '纳税人识别号', dataIndex: 'invoiceNumber', render: (text: any, record: any, index: number) => <div className={styles.ellipsis}>{text}</div> },
        { title: '操作', render: (record: any) => <Button type='primary' onClick={() => { this.setState({ invoiceTitleInfo: record }); this.checkInvoice(false) }}>使用</Button> },
    ]
    // 分页
    onTableChange = ({ current, pageSize }: any) => {
        Object.assign(this.state.pageInfo, { pageNum: current, pageSize: pageSize })
        this.getInvoiceList()
    }
    componentDidMount() {
    }
    goback = () => {
        let { confirmInfo } = this.state;
        this.props.nextSteps(confirmInfo, 0)
    }
    next = () => {
        let { invoiceContent, invoiceRemark } = this.formRef.current.getFieldsValue();
        let { invoiceTitleInfo } = this.state;
        if (!invoiceTitleInfo || !invoiceTitleInfo.invoiceId) {
            message.error('请选择发票抬头！');
            return false
        }else{
            this.formRef.current.setFieldsValue({
                invoiceName:invoiceTitleInfo.invoiceName
            })
        }
        this.formRef.current.validateFields().then((values: any): any => {
            let invoiceInfo = {
                invoiceTitleInfo,
                invoiceContent,
                invoiceRemark
            }
            this.props.nextSteps(invoiceInfo, 2)
        })

    }
    checkInvoice = (flag: boolean) => {
        this.setState({ flag },()=>this.getInvoiceList());

    }
    refresh = () => {
        this.invoiceRef.current.resetFields(['invoiceTitle']);
        this.setState({
            pageInfo: {
                pageNum: 1,
                pageSize: 10,
            }
        }, () => {
            this.getInvoiceList();
        })
    }
    getInvoiceQuery = () => {
        let { pageInfo } = this.state;
        let  invoiceTitle  =  this.invoiceRef.current ? this.invoiceRef.current.getFieldsValue().invoiceTitle : '';
        let query = {
            page: pageInfo.pageNum,
            size: pageInfo.pageSize,
            invoiceTitle: invoiceTitle || ''
        }
        return query
    }
    getInvoiceList = async () => {
        this.setState({ invoiceLoading: true });
        let query = this.getInvoiceQuery();
        let res = await getInvoiceDataList(query);
        this.setState({ invoiceLoading: false });
        let { total, records } = res;
        this.setState({ invoiceTitleList: records, total })
    }
    // 新增发票
    toBeNewInvoice:any = () => {
        /*  c == close 新增成功后关闭页面 */
        window.open("/#/cash/invoice_records/add_invoice_title?c=1", '_blank');
    }
    render() {
        const { flag, invoiceTitleList, invoiceTitleInfo, pageInfo, total, invoiceLoading, confirmInfo } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        const pagination:any = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize || 10,
            total: total,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        return (
            <Card className={styles.cardContent}>
                <Form {...formItemLayout}
                    ref={this.formRef}
                    initialValues={{
                        invoiceName: invoiceTitleInfo ? invoiceTitleInfo.invoiceName : '',
                        invoiceContent: confirmInfo ? confirmInfo.invoiceContent : '服务费',
                        invoiceRemark: confirmInfo.invoiceRemark || '',
                    }}
                >
                    <Form.Item label="注意: " >
                        <p>1、您的开票申请通过审批后，发票会在一个月内寄出。</p>
                        <p>2、您可以登录平台在“现金券管理”—“发票管理”—“开票记录”中查看进度。</p>
                    </Form.Item>
                    <Form.Item label="发票金额: " >
                        <span>{confirmInfo.amount}</span>
                    </Form.Item>
                    <Form.Item label="发票抬头: "
                        name='invoiceName'
                        rules={[{ required: true, message: '请选择发票抬头' }]}
                    >
                        <Button type='primary' onClick={() => this.checkInvoice(true)}>选择发票抬头</Button>
                        <p className={styles.remark} style={{ margin: '10px' }}>{invoiceTitleInfo ? invoiceTitleInfo.invoiceName : ''}</p>
                    </Form.Item>
                    <Form.Item
                        label="发票内容: "
                        name='invoiceContent'
                        rules={[{ required: true, message: '请选择发票内容' }]}
                    >
                        <Radio.Group >
                            <Radio.Button value="服务费">服务费</Radio.Button>
                            <Radio.Button value="福利费">福利费</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="发票申请备注: "
                        name='invoiceRemark'
                        rules={[{ max: 200, message: '发票申请备注不能大于200个字' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
                <Row>
                    <Col span={12} offset={6} className={styles.displayBtn}>
                        <Button type='primary' className={styles.gobackBtn} onClick={() => this.goback()}>上一步</Button>
                        <Button type='primary' onClick={() => this.next()}>下一步</Button>
                    </Col>
                </Row>
                <Modal
                    visible={flag}
                    onCancel={() => this.checkInvoice(false)}
                    onOk={() => this.checkInvoice(true)}
                    width={600}
                >
                    <Form layout="inline"
                        ref={this.invoiceRef}
                    >
                        <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{width:'100%'}}>
                            <Col md={12} sm={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                                <Form.Item label="发票抬头: " name='invoiceTitle'>
                                    <Input placeholder='请输入发票抬头' />
                                </Form.Item>
                            </Col>
                            <Col md={10} sm={10} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '20px 0' }}>
                                <Button type='primary' onClick={() => this.getInvoiceList()} style={{ margin: '0 10px' }}>搜索</Button>
                                <Button type='default' onClick={() => this.refresh()}>刷新</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        rowKey={record => record.invoiceId}
                        dataSource={invoiceTitleList}
                        columns={this.columns}
                        onChange={this.onTableChange}
                        pagination={pagination}
                        loading={invoiceLoading}
                    />
                    <Button onClick={() => this.toBeNewInvoice()}><a href='/#/cash/invoice_records/add_invoice_title?c=1'  title="新增发票抬头" target="_blank">新增发票抬头</a></Button>
                </Modal>
            </Card>
        )
    }
}
