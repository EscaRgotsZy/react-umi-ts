import React, { Component, } from 'react';
import { Button, Form, Row, Col, Card } from 'antd';
import styles from './index.less';
const payeeTypeList = ['', '银行转账', '支票', '现金'];
const invoiceTypeList = ['', '增值税专用发票', '增值税普通发票']
interface UserProp {
    props: any;
    nextSteps: any;
    confirmInfo: any;
}
interface UserState {
    confirmInfo:any;
    nextLoading:boolean;
}
export default class ConfirmInfo extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props)
        this.state = {
            confirmInfo: this.props.confirmInfo,
            nextLoading: false
        }
    }
    goback = () => {
        let { confirmInfo } = this.state;
        this.props.nextSteps(confirmInfo, 1)
    }
    next = () => {
        let { confirmInfo } = this.state;
        this.setState({ nextLoading: true });
        this.props.nextSteps(confirmInfo, 3);
        this.setState({ nextLoading: false });
    }
    renderPayeeInfo = () => {
        return (
            <div className={styles.infoPayee}>
                <p>收款方信息：请按照下方收款方信息进行转账<span style={{ float: "right", marginRight: '10px' }} onClick={() => window.open('/payeeInfoExcel.xlsx')}>下载收款方信息</span></p>
                <ul>
                    <li>公司：<span>上海醒市信息技术有限公司</span></li>
                    <li>账号: 310065060013000412614</li>
                    <li>电话: 021-63831880</li>
                    <li>开户行: 交通银行股份有限公司上海大场支行</li>
                </ul>
            </div>
        )
    }
    render() {
        const { confirmInfo, nextLoading } = this.state;
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
            <>
                <Card
                    title='充值申请信息'
                    className={styles.cardContent}
                >
                    <Form {...formItemLayout} className={styles.formInfoCss}>
                        <Form.Item label="充值金额: " >
                            <p style={{marginBottom:'0'}}>{confirmInfo.amount}</p>
                        </Form.Item>
                        <Form.Item label="充值方式: " >
                            <p>{payeeTypeList[confirmInfo.orderType]}</p>
                            {this.renderPayeeInfo()}
                        </Form.Item>
                        <Form.Item label="到账短信通知: " >
                            <p>{confirmInfo.noticePhone}</p>
                        </Form.Item>
                        <Form.Item label="充值申请备注: " >
                            <p className={styles.remark}>{confirmInfo.orderRemark}</p>
                        </Form.Item>
                    </Form>
                </Card>
                <Card
                    title='发票申请信息'
                    className={styles.cardContent}
                >
                    <Form {...formItemLayout} className={styles.formInfoCss}>
                        <Form.Item label="发票金额: " >
                            <p>{confirmInfo.amount}</p>
                        </Form.Item>
                        <Form.Item label="发票类型: " >
                            <p>{invoiceTypeList[confirmInfo.invoiceTitleInfo.invoiceType]}</p>
                        </Form.Item>
                        <Form.Item label="发票抬头: " >
                            <p className={styles.remark}>{confirmInfo.invoiceTitleInfo.invoiceName}</p>
                        </Form.Item>
                        <Form.Item label="发票内容: " >
                            <p>{confirmInfo.invoiceContent}</p>
                        </Form.Item>
                        <Form.Item label="发票申请备注: " >
                            <p className={styles.remark}>{confirmInfo.invoiceRemark}</p>
                        </Form.Item>
                    </Form>
                    <div className={styles.btn}>
                        <Button type='primary' className={styles.gobackBtn} onClick={() => this.goback()}>上一步</Button>
                        <Button type='primary' onClick={() => this.next()} loading={nextLoading}>确认并提交</Button>
                    </div>
                </Card>
            </>
        )
    }
}