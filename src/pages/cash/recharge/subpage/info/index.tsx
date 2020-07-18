import React, { Component, } from 'react';
import { Card, Input, Table, Button, Breadcrumb, Form, Row, Col, DatePicker, Select } from 'antd';
import styles from './index.less';
import { getPageQuery } from '@/common/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    getReChargeRecordInfo,
} from '@/services/cash/recharge';
const typeIdList = ['未知', '增值税专用发票', '普通发票']
const payTypeList = ['未知', '银行转账', '支票', '现金'];
const invoiceList = ['未知', '待审核', '审核通过', '开票成功', '已发货', '已取消']
const applyList = ['未知', '处理中', '等待充值', '充值成功', '已取消', '退款完成'];
interface UserProp {
    props: any;
    id: number | string,
    history: any,
}
interface UserState {
    reChargeId:any;
    dataInfo:any;
}
export default class ReChargeInfo extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props)
        let searchParams = getPageQuery()
        this.state = {
            reChargeId: searchParams.reChargeId,
            dataInfo: {},
        }
    }
    componentDidMount() {
        this.getDataInfo()
    }
    getDataInfo = async () => {
        let { reChargeId } = this.state;
        let res = await getReChargeRecordInfo(reChargeId);
        let { data } = res;
        this.setState({ dataInfo: data })
    }
    renderPayeeInfo = () => {
        let { dataInfo } = this.state;
        return (
            <div className={styles.infoPayee}>
                <p>收款方信息：请按照下方收款方信息进行转账<span style={{ float: "right", marginRight: '10px' }} onClick={() => window.open('/payeeInfoExcel.xlsx')}>下载收款方信息</span></p>
                <ul>
                    <li>公司：<span>{dataInfo && dataInfo.collectionCompany}</span></li>
                    <li>账号: {dataInfo && dataInfo.collectionAccount}</li>
                    <li>电话: {dataInfo && dataInfo.collectionPhone}</li>
                    <li>开户行: {dataInfo && dataInfo.collectionBank}</li>
                </ul>
            </div>
        )
    }
    render() {
        const { dataInfo } = this.state;
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
        return (
            <PageHeaderWrapper title='充值申请详情'>
                <Card
                    title={<>
                        <span>充值申请信息</span><span className={styles.status}>{dataInfo && applyList[dataInfo.orderStatus]}</span></>
                    }
                    className={styles.cardContent}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="充值金额: " >
                            <span>{(dataInfo && dataInfo.amount) || '0'}</span>
                        </Form.Item>
                        <Form.Item label="充值方式: " >
                            <span>{dataInfo && payTypeList[dataInfo.payType] || '无'}</span>
                            {this.renderPayeeInfo()}
                        </Form.Item>
                        <Form.Item label="到账短信通知: " >
                            <span>{dataInfo && dataInfo.noticePhone || '无'}</span>
                        </Form.Item>
                        <Form.Item label="充值申请备注: " >
                            <p className={styles.remark}>{dataInfo && dataInfo.orderRemark || '无'}</p>
                        </Form.Item>
                    </Form>
                </Card>
                <Card
                    title={<>
                        <span>发票申请信息</span><span className={styles.status}>{dataInfo && invoiceList[dataInfo.invoiceStatus]}</span></>
                    }
                    className={styles.cardContent}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="发票金额: " >
                            <p>{dataInfo && dataInfo.amount || '0'}</p>
                        </Form.Item>
                        <Form.Item label="发票类型: " >
                            <p>{dataInfo && typeIdList[dataInfo.typeId]}</p>
                        </Form.Item>
                        <Form.Item label="发票抬头: " >
                            <p className={styles.remark}>{(dataInfo && dataInfo.invoiceName) || '无'}</p>
                        </Form.Item>
                        <Form.Item label="发票内容: " >
                            <p>{(dataInfo && dataInfo.invoiceContent) || '无'}</p>
                        </Form.Item>
                        <Form.Item label="发票申请备注: " >
                            <p className={styles.remark}>{(dataInfo && dataInfo.invoiceRemark) || '无'}</p >
                        </Form.Item>
                    </Form>
                </Card>
                <Row>
                    <Col span={12} offset={6} className={styles.displayBtn}>
                        <Button type='primary' onClick={() => this.props.history.goBack()}>返回</Button>
                    </Col>
                </Row>
            </PageHeaderWrapper>
        )
    }
}
