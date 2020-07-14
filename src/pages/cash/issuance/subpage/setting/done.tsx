import React, { Component, } from 'react';
import {  Row, Col,  Button } from 'antd';
import styles from './index.less';
import { CheckOutlined, } from '@ant-design/icons';
interface UserProp {
    props:any;
    nextSteps:any;
    history:any;
    doneDataInfo:any;
    issuType:any;
}
interface UserState {
    issuType: number | string;
    doneDataInfo: any;
}
export default class IssuanDone extends Component<UserProp, UserState> {
    constructor(props:UserProp) {
        super(props)
        this.state = {
            doneDataInfo: this.props.doneDataInfo,
            issuType: this.props.issuType
        }
    }
    goIssuanRecord = () => {
        this.props.history.push('/cash/issuance?current=2')
    }
    render() {
        let { doneDataInfo, issuType } = this.state;
        return (
            <>
                <Row className={styles.doneInfo}>
                    <Col span={12} offset={6} className={styles.doneInfoCol}>
                        <div className={styles.doneInfoContent}>
                            <p><CheckOutlined className={styles.doneIcon} /></p>
                            <p className={styles.bilStatus}>操作成功</p>
                            <ul>
                                <li>发放成功人数&nbsp;: &nbsp;<span className={styles.success}>{doneDataInfo && doneDataInfo.success}</span>&nbsp;人</li>
                                <li>发放失败人数&nbsp;:&nbsp; <span className={styles.failed}>{doneDataInfo && doneDataInfo.failure}</span>&nbsp;人</li>
                                {issuType == 1 && <li>单笔发放金额&nbsp;：&nbsp;{doneDataInfo && doneDataInfo.grantAmount}</li>}
                                <li>发放成功金额&nbsp;：&nbsp;{doneDataInfo && doneDataInfo.successAmount}</li>
                                <li>发放时效&nbsp;：立即发放</li>
                            </ul>
                            <Button type='primary' onClick={() => this.goIssuanRecord()}><a>发放记录</a></Button>
                        </div>
                    </Col>
                </Row>

            </>
        )
    }
}