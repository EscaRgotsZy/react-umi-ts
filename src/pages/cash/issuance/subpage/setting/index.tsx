import React, { Component, } from 'react';
import { Card, Steps, Radio, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery } from '@/common/utils';
const { Step } = Steps;
import styles from './index.less';
import Batch from './batch';//批量发放
import Part from './part';// 部分发放
import IssuanDone from './done';
import IssuanConfirm from './confirm';
import { subMitIssuPart, subMitIssuBatch } from '@/services/cash/issuance';;

interface UserProp {
    history: any;
    props:any;
}
interface UserState {
    cashTotal: any;
    IssuanDataInfo:any;
    stepsCurrent:any;
    issuType:number | string;
    doneDataInfo:any;
}
export default class IssuanceInfo extends Component<UserProp, UserState> {
    constructor(props:UserProp) {
        super(props)
        let searchParms:any = getPageQuery()
        this.state = {
            cashTotal: searchParms.cashTotal,
            IssuanDataInfo: '',
            stepsCurrent: 0,
            issuType: 1,
            doneDataInfo: ''
        }
    }
    beBackSteps = (stepData:any, current:number) => {
    }
    nextSteps = (stepData:any, current:number) => {
        let { issuType } = this.state;
        switch (current) {
            case 0:
                this.setState({ IssuanDataInfo: stepData, stepsCurrent: current, });
                break;
            case 1:
                this.setState({ IssuanDataInfo: stepData, stepsCurrent: current, });
                break;
            case 2:
                this.subMit(stepData); this.setState({ IssuanDataInfo: stepData })
                break;
            default:
                return
        }
    }
    // 提交申请
    subMit = async (query:any) => {
        let { issuType } = this.state;
        let res;
        if (issuType == 1) {
            if (!query.checkStaffList || query.checkStaffList.length == 0) {
                message.error('请选择发放员工!');
                return false
            }
            let newCheckStaffList = query.checkStaffList.map((v:any) => +v.userId)
            let newQuery = {
                grantAmount: query.issuedAmount,
                grantType: 1,
                productType: 1,
                reason: query.issuedReason,
                remark: query.issuedRemark,
                userList: newCheckStaffList
            }
            res = await subMitIssuPart(newQuery);
        } else {
            query = {
                remark: query.issuedRemark,
                productType: 1,
                resultKey: query.resultKey
            }
            res = await subMitIssuBatch(query);
        }
        if (!res) return false
        this.setState({ doneDataInfo: res, stepsCurrent: 2 })
    }
    // 渲染content
    renderStepsContent = () => {
        let { stepsCurrent, IssuanDataInfo, issuType } = this.state;
        let renderHtml;
        switch (stepsCurrent) {
            case 1:
                renderHtml = <IssuanConfirm props={this.props} history={this.props.history} nextSteps={this.nextSteps} IssuanDataInfo={IssuanDataInfo} issuType={issuType} beBackSteps={this.beBackSteps} />
                break;
            case 2:
                renderHtml = <IssuanDone props={this.props} nextSteps={this.nextSteps} history={this.props.history} doneDataInfo={this.state.doneDataInfo} issuType={issuType} />
                break;
            default:
                return
        }
        return renderHtml
    }

    render() {
        const { stepsCurrent, issuType, cashTotal } = this.state;
        return (
            <PageHeaderWrapper title='现金券发放'>
                <Card className={styles.cardContent} >
                    <Steps size="small" current={stepsCurrent}>
                        <Step title="填写发放信息" />
                        <Step title="确认信息" />
                        <Step title="完成" />
                    </Steps>
                </Card>
                <Card className={styles.cardContent} style={{ paddingTop: '20px' }} >
                    {
                        stepsCurrent == 0 ? <>
                            <Radio.Group value={issuType} onChange={(e) => this.setState({ issuType: e.target.value, IssuanDataInfo: {} })}>
                                <Radio.Button value={1}>部分发放</Radio.Button>
                                <Radio.Button value={2}>批量发放</Radio.Button>
                            </Radio.Group>
                            {
                                issuType == 1 ? <Part nextSteps={this.nextSteps} cashTotal={cashTotal} IssuanDataInfo={this.state.IssuanDataInfo} /> : <Batch nextSteps={this.nextSteps} cashTotal={cashTotal} IssuanDataInfo={this.state.IssuanDataInfo} />
                            }
                        </> : this.renderStepsContent()
                    }
                </Card>


            </PageHeaderWrapper>
        )
    }
}
