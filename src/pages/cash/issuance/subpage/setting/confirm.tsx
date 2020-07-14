import React, { Component, } from 'react';
import { Button, Form, Row, Col, Popconfirm } from 'antd';
import styles from './index.less';
interface UserProp {
    history: any;
    nextSteps:any;
    props:any
    IssuanDataInfo:any,
    issuType:any,
    beBackSteps:any,
}
interface UserState {
    confirmInfo: any;
    issuType:number | string;
}
export default class IssuanConfirm extends Component<UserProp, UserState> {
    constructor(props:UserProp) {
        super(props)
        this.state = {
            confirmInfo: this.props.IssuanDataInfo,
            issuType: this.props.issuType,
        }
    }
    componentDidMount() {
    }
    goback = () => {
        this.props.nextSteps(this.state.confirmInfo, 0)
    }
    next = () => {
        let { confirmInfo } = this.state;
        this.props.nextSteps(confirmInfo, 2);
    }

    render() {
        const { confirmInfo,  issuType } = this.state;
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
        return (
            <>
                <ul className={styles.confirmInfo}>
                    <li>
                        <Row>
                            <Col offset={1} span={4} className={styles.title}>
                                <span  >确认发放信息</span>
                            </Col>
                        </Row>
                        <Form {...formItemLayout} className={styles.formItem} >
                            <Form.Item label="发放人数: " className={styles.formItem} >
                                <span>{issuType == 1 ? (confirmInfo && confirmInfo.checkStaffList && confirmInfo.checkStaffList.length) : (confirmInfo && confirmInfo.total)} 人</span>
                            </Form.Item>
                            {
                                issuType == 1 ?
                                    <div>
                                        <Form.Item label="单笔发放金额: " className={styles.formItem} >
                                            <span>{confirmInfo && confirmInfo.issuedAmount}</span>
                                        </Form.Item>
                                        <Form.Item label="发放原因: " className={styles.formItem} >
                                            <span>{confirmInfo && confirmInfo.issuedReason}</span>
                                        </Form.Item>
                                    </div> :
                                    <div>
                                        <Form.Item label="发放文件: " className={styles.formItem} >
                                            <a>{confirmInfo && confirmInfo.fileName}</a>
                                        </Form.Item>
                                    </div>

                            }
                            <Form.Item label="发放时效: " className={styles.formItem} >
                                <span>立即发放</span>
                            </Form.Item>

                            <Form.Item label="审核人: " className={styles.formItem} >
                                <span>无需审核</span>
                            </Form.Item>
                            <Form.Item label="备注: " className={styles.formItem} >
                                <p className={styles.remark}>{confirmInfo && confirmInfo.issuedRemark}</p>
                            </Form.Item>
                        </Form>
                    </li>
                </ul>
                <Row>
                    <Col span={12} offset={6} className={styles.displayBtn}>
                        <Button type='primary' className={styles.gobackBtn} onClick={() => this.goback()} style={{ margin: '0 10px' }}>上一步</Button>
                        <Popconfirm
                            title="是否确认发放?"
                            onConfirm={() => this.next()}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type='primary'>确认发放</Button>
                        </Popconfirm>
                    </Col>
                </Row>

            </>
        )
    }
}
