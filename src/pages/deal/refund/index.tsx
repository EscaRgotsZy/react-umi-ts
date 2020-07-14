import styles from './index.less';
import React, { Component, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery } from '@/common/utils'
import Refund from './subpage/refund';
const tabList = [
    {
        key: '1',
        tab: '退款记录',
    },
    {
        key: '2',
        tab: '退货记录',
    },
];
interface UserProp {
    history: any;
    match: any;
    location: any;
}
interface UserState {
    currentTab: any,
}
export default class OrderManage extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props);
        this.state = {
            currentTab: getPageQuery().key || '1'
        }
    }
    // 切换tab
    tabChange = (type: any) => {
        this.setState({ currentTab: type }, () => {
            this.child.reset()
            this.child.query()
        })
    }
    child:any = ''
    render() {
        const { currentTab } = this.state;
        return (
            <>
                <PageHeaderWrapper
                    title={"退货/退款"}
                    onTabChange={this.tabChange}
                    tabList={tabList}
                    tabActiveKey={currentTab}
                />
                <div className={styles.pageContent}>
                    <Refund type={currentTab} history={this.props.history} onRef={(ref: any) => this.child = ref} />
                </div>
            </>
        )
    }
}
