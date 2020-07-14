import React, { Component, } from 'react';
import { Button, Form, Row, Col, Input, InputNumber, Select, message, Card } from 'antd';
const { Option } = Select;
import styles from './index.less';
interface UserProp {
    props: any;
    nextSteps: any;
    confirmInfo: any;
}
interface UserState {
    reChargeInfo: any,
    amountflag: boolean,
}
export default class ReChargeInfo extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        this.formRef = React.createRef();
        this.state = {
            reChargeInfo: {},
            amountflag: false,
        }
    }
    next = () => {
        let { reChargeInfo } = this.state;
        this.formRef.current.validateFields().then((values: any): any => {
            if (values.amount > 99999999.99) {
                message.error('充值金额不能大于99999999.99');
                return false
            }
            reChargeInfo = {
                amount: values.amount,
                orderType: values.orderType,
                noticePhone: values.noticePhone,
                orderRemark: values.orderRemark,
            }
            this.props.nextSteps(reChargeInfo, 1);
            this.setState({ reChargeInfo })
        }).catch((err: Error) => { })
    }
    // 渲染
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
        let { confirmInfo } = this.props;
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
            <Card className={styles.cardContent}>
                <Form {...formItemLayout}
                    ref={this.formRef}
                    initialValues={{
                        amount: confirmInfo.amount || '',
                        orderType: confirmInfo.orderType ? confirmInfo.orderType : 1,
                        noticePhone: confirmInfo.noticePhone || '',
                        orderRemark: confirmInfo.orderRemark || '',
                    }}
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="充值金额: "
                                name='amount'
                                rules={[{ required: true, message: '请输入充值金额' }]}
                            >
                                <InputNumber style={{ width: '300px' }} min={0.01} max={99999999.99} />
                            </Form.Item>
                            
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="充值方式: "
                                required={true}
                            >
                                <Form.Item name='orderType' rules={[{ required: true, message: '请选择充值方式' }]} noStyle>
                                    <Select style={{ width: 120 }} >
                                        <Option value={1}>银行转账</Option>
                                        <Option value={2}>支票</Option>
                                        <Option value={3}>现金</Option>
                                    </Select>
                                </Form.Item>
                                <span className={styles.remarks}>建议使用银行转账方式付款</span>
                                {this.renderPayeeInfo()}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="到账短信通知" required={true}>
                                <Form.Item name='noticePhone' noStyle
                                    rules={[{ required: true, message: '请填写到账信息通知' }, { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }]}
                                >
                                    <Input style={{ width: '300px' }} />
                                </Form.Item>
                                <span className={styles.remarks} >充值到账后，会发送短信通知到此手机号中</span>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="充值申请备注: " name='orderRemark' rules={[{ max: 200, message: '充值申请备注不能大于200个字' }]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col span={12} offset={6} className={styles.displayBtn}><Button type='primary' onClick={() => this.next()}>下一步</Button></Col>
                </Row>

            </Card>
        )
    }
}