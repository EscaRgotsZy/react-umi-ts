import React, { Component, } from 'react';
import { Form, Row, Col,  Button } from 'antd';
import { CheckOutlined, } from '@ant-design/icons';
import styles from './index.less';
interface UserProp {
    props:any;
    id:number | string,
    history:any,
}
interface UserState {
}
export default class ApplyDone extends Component<UserProp, UserState> {
    constructor(props:UserProp) {
        super(props)
    }
    componentDidMount() {
    }
    render() {
        let { id } = this.props
        return (
            <>
                <Row className={styles.doneInfo}>
                    <Col span={12} offset={6} className={styles.doneInfoCol}>
                        <div className={styles.doneInfoContent}>
                            <p><CheckOutlined className={styles.doneIcon} /></p>
                            <p className={styles.bilStatus}>充值开票申请已提交</p>
                            <p className={styles.bilTips}>30天后款未到将自动取消充值开票申请</p>
                            <Button type='primary' onClick={() => this.props.history.push(`/cash/recharge/info?reChargeId=${id}`)}><a href={`/#/cash/recharge/info?reChargeId=${id}`} >查看充值详情</a></Button>
                        </div>
                    </Col>
                </Row>

            </>
        )
    }
}