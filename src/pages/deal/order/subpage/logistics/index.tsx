import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { getPageQuery, handlePicUrl, formatMoney } from '@/common/utils';
import {
    getExpress,
} from '@/services/deal/order';
interface UserProp {
    history: any;
    match: any;
    location: any;
}
interface UserState {
    orderNo: string | number,
    loading: boolean,
    logisticsData: any,
    orderLogistics: any,
    expressList: Array<any>,
    productExpress: any,
}
export default class OrderDetail extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props);
        this.state = {
            orderNo: getPageQuery().orderNo || '',
            loading: false,
            logisticsData: {},
            orderLogistics: {},
            expressList: [],
            productExpress: {},
        }
    }

    componentDidMount() {
        this.getLogisticsDetail()
    }

    getLogisticsDetail = async () => {
        let { orderNo } = this.state;
        this.setState({ loading: true })
        let res:any = await getExpress(orderNo);
        this.setState({ loading: false })
        if (!res) return false;
        let logisticsData = res.data || [];
        let orderLogistics = logisticsData.orderLogistics;
        let expressList = logisticsData.expressList;
        let productExpress = logisticsData.productExpress;
        this.setState({
            logisticsData,
            orderLogistics,
            expressList,
            productExpress
        })
    }

    render() {
        let { logisticsData, orderLogistics, expressList, productExpress,loading } = this.state;
        return (
            <PageHeaderWrapper title={"物流追踪"} >
                <div style={{ padding: '30px', margin: '0 30px' }} >
                    <Row gutter={24}   >
                        <Col span={18} style={{ borderRight: '1px solid #E8E5E5', }}>
                            <Card
                                title={''}
                                bordered={true}
                                headStyle={{ margin: '0 20px', padding: '0' }}
                                bodyStyle={{ padding: '20px' }}
                                hoverable={true}
                                loading={loading}
                            >
                                <div style={{ width: '100%', height: '100%', border: '1px solid #D9D9D9', padding: '20px' }}>
                                    <div style={{ padding: '20px 0', fontSize: '14px' }}>收货信息:&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                        {orderLogistics && orderLogistics.realname}  &nbsp;&nbsp;
                        {orderLogistics && orderLogistics.phone} &nbsp;&nbsp;
                        {orderLogistics && orderLogistics.provinceName} &nbsp;
                        {orderLogistics && orderLogistics.cityName} &nbsp;
                        {orderLogistics && orderLogistics.areaName} &nbsp;
                        {orderLogistics && orderLogistics.address} &nbsp;&nbsp;
                        </div>
                                    <div>
                                        <p>买家留言&nbsp;:&nbsp;&nbsp;&nbsp;</p>
                                        <p style={{ marginLeft: '75px', marginTop: '-35px' }}>{logisticsData && logisticsData.userRemark ? logisticsData.userRemark : '无'}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card title="物流动态" bordered={true} style={{ marginTop: '20px' }} headStyle={{ margin: '0 20px', padding: '0' }} bodyStyle={{ padding: '20px' }} loading={loading}>
                                <div style={{ width: '100%', height: '100%', border: '1px solid #D9D9D9', padding: '20px' }}>
                                    {expressList && expressList.length > 0 && expressList.reverse().map((item, idx) => (
                                        <p key={idx}>{item.datetime}： {item.remark}</p>
                                    ))
                                    }
                                </div>
                                <div style={{ width: '100%', height: '100%', border: '1px solid #D9D9D9', padding: '20px', marginTop: '20px' }}>
                                    以上部分信息来自于第三方，仅供参考，如需准确信息可联系卖家或物流公司
                    </div>
                            </Card>
                        </Col>
                        <Col span={6} >
                            <Card title="订单信息" bordered={false} headStyle={{ margin: '0 20px', padding: '0' }} loading={loading}>
                                {productExpress && productExpress.length > 0 && productExpress.map((item:any, idx:number) => (
                                    <div key={idx} style={{ width: '100%', height: '100%', borderBottom: '1px solid #D9D9D9', paddingBottom: 10, boxSizing: 'border-box', overflow: 'hidden' }}>
                                        <div style={{ float: 'left', width: '80px' }}>
                                            <img src={handlePicUrl(item.productPic)} style={{ width: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ float: 'right', width: '70%' }}>
                                            <div style={{ width: '100%', height: '30px', boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '15px' }}>{item.productName}</div>
                                            <div style={{ width: '100%', color: '#333', boxSizing: 'border-box' }}>
                                                <span style={{ float: 'left' }}>¥{formatMoney(item.presentPrice, 2)}</span>
                                                <span style={{ float: 'right' }}>x{item.quantity}</span>
                                            </div>
                                        </div>
                                        <div style={{ clear: 'both' }}></div>
                                    </div>
                                ))
                                }
                                <div style={{ paddingTop: '10px' }}>
                                    <ul className={styles.orderInformationList}>
                                        <li>运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费&nbsp;: &nbsp;¥{formatMoney(logisticsData && logisticsData.logisticsFee, 2)}</li>
                                        <li>订单总额&nbsp;: &nbsp;¥{formatMoney(logisticsData && logisticsData.actualAmount, 2)}</li>
                                        <li>订单编号&nbsp;: &nbsp;{logisticsData && logisticsData.orderNo}</li>
                                        <li>物流单号&nbsp;: &nbsp;{orderLogistics && orderLogistics.logisticsNo}
                                            <span style={{ float: 'right' }}>{orderLogistics && orderLogistics.logisticsType}</span>
                                        </li>
                                        <li>商&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;家&nbsp;: &nbsp;{logisticsData && logisticsData.shopName}</li>
                                    </ul>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </PageHeaderWrapper>
        )
    }
}
