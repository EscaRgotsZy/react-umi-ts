import React, { Component } from 'react';
import { Card,  Steps, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import ReChargeInfo from './recharge';
import InvoiceInfo from './invoice';
import ConfirmInfo from './confirm';
import ApplyDone from './done';
import {
    subMitreChargeApply,
} from '@/services/cash/recharge';
interface UserProp {
    history: any;
}
interface UserState {
    stepsCurrent:number,
    reChargeInfo:any,
    invoiceInfo:any,
    confirmInfo:any,
    infoId:number | string,
}
const { Step } = Steps;
export default class OrderDetail extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props);
        this.state = {
            stepsCurrent: 0,
            reChargeInfo: '',
            invoiceInfo: '',
            confirmInfo: '',
            infoId:'',
        }
    }
    nextSteps:any = (stepData: any, current: number) => {
        switch (current) {
            case 0:
                this.setState({ reChargeInfo: stepData, stepsCurrent: current, });
                break;
            case 1:
                this.setState({ reChargeInfo: stepData, stepsCurrent: current, invoiceInfo: '' });
                break;
            case 2:
                this.setState({ invoiceInfo: stepData, stepsCurrent: current, });
                break;
            case 3:
                this.subMit(stepData);
                break;
            default:
                return
        }
    }
    // 提交申请
    subMit = async (query:any) => {
        query = {
            amount: query.amount,
            collectionAccount: '310065060013000412614',
            collectionAddress: '',
            collectionBank: '交通银行股份有限公司上海大场支行',
            collectionCompany: '上海醒市信息技术有限公司',
            collectionPhone: '021-63831880',
            collectionTaxpayer: query.invoiceTitleInfo.taxpayerNo,
            invoiceContent: query.invoiceContent,
            invoiceId: query.invoiceTitleInfo.id,
            invoiceName: query.invoiceTitleInfo.invoiceTitle,
            invoiceRemark: query.invoiceRemark,
            noticePhone: query.noticePhone,
            orderRemark: query.orderRemark,
            orderType: 1,
            payType: query.orderType
        }
        let res = await subMitreChargeApply(query);
        if (!res) {
            message.error('充值申请失败')
            return false
        }
        let infoId = res.id;
        this.setState({ stepsCurrent: 3, infoId })
    }
    // 渲染content
    renderStepsContent = () => {
        let { stepsCurrent, reChargeInfo, invoiceInfo, infoId, } = this.state;
        let confirmInfo = {
            ...reChargeInfo,
            ...invoiceInfo,
        }
        let renderHtml;
        switch (stepsCurrent) {
            case 0:
                renderHtml = <ReChargeInfo props={this.props} nextSteps={this.nextSteps} confirmInfo={confirmInfo} />
                break;
            case 1:
                renderHtml = <InvoiceInfo props={this.props} nextSteps={this.nextSteps} confirmInfo={confirmInfo} />
                break;
            case 2:
                renderHtml = <ConfirmInfo props={this.props} nextSteps={this.nextSteps} confirmInfo={confirmInfo} />
                break;
            case 3:
                renderHtml = <ApplyDone props={this.props} id={infoId} history={this.props.history} />
                break;
            default:
                return
        }
        return renderHtml
    }
    render() {
        const { stepsCurrent } = this.state;
        return (
            <PageHeaderWrapper title='现金券充值' >
                <Card className={styles.cardContent} >
                    <Steps size="small" current={stepsCurrent}>
                        <Step title="填写充值信息" />
                        <Step title="填写发票信息" />
                        <Step title="确认并提交" />
                        <Step title="完成" />
                    </Steps>
                </Card>
                {this.renderStepsContent()}
            </PageHeaderWrapper>
        )
    }
}