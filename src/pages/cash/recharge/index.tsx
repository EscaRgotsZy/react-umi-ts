import React, { Component } from 'react';
import { Card, Row, Col, Tabs, Button } from 'antd';
import styles from './index.less'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery,  } from '@/common/utils';
import ReChargeList from './subpage/list/index';
import {
    getAccountTotal,
} from '@/services/cash/recharge';
const { TabPane } = Tabs;
interface UserProp {
    history: any;
}
interface UserState {
    cashTotal: any,
    current: any,
    searchParams:any,
}
let searchParams:any = getPageQuery()
export default class OrderDetail extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props);
        this.state = {
            searchParams,
            cashTotal: 0,
            current: searchParams ? searchParams.current ? searchParams.current : '1':'1'
        }
    }
    componentDidMount() {
        this.getDataTotal()
    }
    getDataTotal = async () => {
        let res:any = await getAccountTotal();
        if (!res) return false
        this.setState({ cashTotal: res })
    }
    callback = (current: string) => {
        this.setState({ current },()=>{
          this.props.history.push({ search: `current=${current || ''}` })
        });

    }
    render() {
        let { current, cashTotal } = this.state;
        return (
            <PageHeaderWrapper title={current == '1' ? '账户概览' : '充值记录'} >
                <Card className={styles.cardContent}>
                    <Tabs onChange={this.callback} activeKey={current}>
                        <TabPane tab="账户充值" key="1">
                            <h1 className={styles.cashTotal}> 现金券总额 :&emsp; {cashTotal}</h1>
                            <Button type='primary' className={styles.btnRecharge} onClick={() => this.props.history.push(`/cash/recharge/setting?cashTotal=${cashTotal}`)}>充值现金券</Button>
                        </TabPane>
                        <TabPane tab="充值记录" key="2">
                            <ReChargeList history={this.props.history} />
                        </TabPane>
                    </Tabs>
                </Card>
            </PageHeaderWrapper>
        )
    }
}
