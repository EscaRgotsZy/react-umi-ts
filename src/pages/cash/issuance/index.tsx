import React, { Component, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Tabs, Button, } from 'antd';
const { TabPane } = Tabs;
import styles from './index.less';
import IssuanceList from './subpage/list';
import { getPageQuery } from '@/common/utils';
import {
    getAccountTotal,
} from '@/services/cash/issuance';

interface UserProp {
    history: any;
}
interface UserState {
    cashTotal: any,
    current: any,
}
export default class Issuance extends Component<UserProp, UserState> {
    constructor(props:UserProp) {
        super(props)
        let searchParams = getPageQuery()
        this.state = {
            cashTotal: 0,
            current: searchParams.current || '1'
        }
    }
    componentDidMount() {
        this.getDataTotal()
    }
    
    getDataTotal = async () => {
        let res = await getAccountTotal();
        this.setState({ cashTotal: res })
    }
    callback = (current:number | string) => {
        this.setState({ current });
        this.props.history.push({ search: `current=${current || ''}` })
    }
    render() {
        let { cashTotal, current }:any = this.state;
        return (
            <PageHeaderWrapper title={current == '1' ? '账户概览' : '发放记录'}>
                <Card className={styles.cardContent}>
                    <Tabs onChange={this.callback} activeKey={current}>
                        <TabPane tab="账户概览" key="1">
                            <h1 className={styles.cashTotal}> 可发放现金券 :&emsp; {cashTotal}</h1>
                            <Button type='primary' className={styles.btnRecharge} onClick={() => this.props.history.push(`/cash/issuance/setting?cashTotal=${cashTotal}`)}>发放现金券</Button>
                        </TabPane>
                        <TabPane tab="发放记录" key="2">
                            <IssuanceList history={this.props.history} />
                        </TabPane>
                    </Tabs>
                </Card>
            </PageHeaderWrapper>

        )
    }
}
