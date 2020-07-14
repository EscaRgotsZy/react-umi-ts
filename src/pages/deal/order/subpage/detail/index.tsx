import React, { Component, } from 'react';
import styles from './index.less';
import { Card, Row, Col, Button, Steps, Divider, Drawer } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery, handlePicUrl, formatMoney } from '@/common/utils';
import {
    getOrderDetailInfo,
    getSubOrdersList,
} from '@/services/deal/order';
const { Step } = Steps;
interface UserProp {
    history: any;
    match: any;
    location: any;
}
interface UserState {
    orderNo: string | number,
    orderDetailInfos: any,
    prodData: any,
    subOrderList: Array<any>,
    moreVisialbe: boolean,
    loading: boolean,
    prodList: Array<any>,
}
const orderStatusList = ['', '待付款', '待发货', '已发货', '已完成', '已取消', '已退货', '申请售后', '支付中', '支付失败']
export default class OrderDetail extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props);
        this.state = {
            orderNo: getPageQuery().orderNo || '',
            orderDetailInfos: {},
            prodData: {},
            subOrderList: [],
            moreVisialbe: false,
            loading: false,
            prodList: [],
        }
    }
    componentDidMount() {
        this.getOrderDetail()
    }
    getOrderDetail = async () => {
        let res: any = await getOrderDetailInfo(this.state.orderNo);
        this.setState({ loading: false })
        if (!res) return false;
        let orderDetailInfos = res.data;
        let prodList = orderDetailInfos.orderItems;
        let prodData = prodList.map((v: any, i: number) => {
            let { orderStatus } = orderDetailInfos
            return {
                ...v,
                orderStatus
            }
        })
        if (orderDetailInfos.bizType == 4 && orderDetailInfos.isHead == true && orderDetailInfos.groupOrderNo != 'null') {
            this.getSubOrders(orderDetailInfos.groupOrderNo)
        }
        this.setState({ orderDetailInfos, prodList, prodData })
    }
    //获取子订单
    getSubOrders = async (groupOrderNo: number | string) => {
        let res: any = await getSubOrdersList(groupOrderNo);
        if (!res) return false;
        let { data } = res || [];
        let subOrderList = data.length > 0 && data.filter((item: any) => item.isHead == false);
        this.setState({
            subOrderList
        })
    }
    // 物流跟踪
    showLogistics = () => {
        let { orderNo } = this.state;
        this.props.history.push('/deal/order/logistics?orderNo=' + orderNo)
    }
    render() {
        let { orderDetailInfos, prodData,  subOrderList } = this.state;
        return (
            <PageHeaderWrapper title='订单详情'>
                <Row style={{ margin: 30, background: '#fff', padding: '40px 0' }}>
                    <Col span={1}></Col>
                    <Col style={{ display: 'flex', justifyContent: 'center' }} span={22}>
                        <Steps current={(orderDetailInfos && orderDetailInfos.receiveTime) ? 5 : (orderDetailInfos && orderDetailInfos.deliveryTime) ? 3 : (orderDetailInfos && orderDetailInfos.paidTime) ? 2 : (orderDetailInfos && orderDetailInfos.createTime) ? 1 : 0}>
                            <Step title="生成订单" description={orderDetailInfos && orderDetailInfos.createTime} />
                            <Step title="完成付款" description={orderDetailInfos && orderDetailInfos.paidTime} />
                            <Step title="商家发货" description={orderDetailInfos && orderDetailInfos.deliveryTime} />
                            <Step title="确认收货" description={orderDetailInfos && orderDetailInfos.receiveTime} />
                            <Step title="完成" description={orderDetailInfos && orderDetailInfos.receiveTime} />
                        </Steps>
                    </Col>
                </Row>
                <Card style={{ margin: '30px' }}>
                    <Row style={{ margin: '40px' }}>
                        <Col span={7} style={{ borderRight: '1px solid #dddddd', marginRight: '30px', paddingRight: '30px' }}>
                            <Card title={'订单信息'}>
                                <ul className={styles.orderDeUl}>
                                    <li>收货人：<span>{(orderDetailInfos && orderDetailInfos.realname) ? orderDetailInfos.realname : ''}</span></li>
                                    <li>收货地址： <span>{orderDetailInfos && orderDetailInfos.address}</span></li>
                                    <li>联系电话： <span>{orderDetailInfos && orderDetailInfos.phone}</span></li>
                                    <li>发&emsp;&emsp;票： <span>{`${orderDetailInfos && orderDetailInfos.invoiceStatus ? '已开发票' : '未开发票'}`}</span></li>
                                    <li>买家留言： <span>{(orderDetailInfos && orderDetailInfos.userRemark) ? orderDetailInfos.userRemark : '无'}</span></li>
                                    {orderDetailInfos && orderDetailInfos.bizType == 4 &&
                                        <li>虚拟订单编号： <span>{`${orderDetailInfos && orderDetailInfos.groupOrderNo != 'null' ? orderDetailInfos.groupOrderNo : '暂未生成'}`}</span></li>
                                    }
                                    <li>订单编号： <span>{orderDetailInfos && orderDetailInfos.orderNo}</span></li>
                                    <span onClick={() => this.setState({ moreVisialbe: true })} style={{ cursor: 'pointer' }}>{'更多>>'}</span>
                                </ul>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card >
                                <h1>订单状态：<span style={{ color: 'red' }}>{orderStatusList[orderDetailInfos && orderDetailInfos.orderStatus]}</span></h1>
                                <Divider dashed />
                                {orderDetailInfos && orderDetailInfos.orderStatus == 1 &&
                                    <p>1. 等待卖家购买此订单的商品</p>
                                }
                                {orderDetailInfos && orderDetailInfos.orderStatus == 2 &&
                                    <p>1. 订单已提交商家进行备货发货准备,可对订单进行“商品发货”操作</p>
                                }
                                {orderDetailInfos && orderDetailInfos.orderStatus == 3 &&
                                    <p>1. 商品已发出； 物流公司：{orderDetailInfos.logisticsType}；</p>
                                }
                                {orderDetailInfos && orderDetailInfos.orderStatus == 4 &&
                                    <div>
                                        <p>1. 交易已完成，买家可以对购买的商品及服务进行评价。</p>
                                        <p>2. 评价后的情况会在商品详细页面中显示，以供其它会员在购买时参考。</p>
                                    </div>
                                }
                                {orderDetailInfos && orderDetailInfos.orderStatus == 5 &&
                                    <p>{orderDetailInfos.userName} 取消了订单 ( 改买其他商品 )</p>
                                }
                            </Card>
                        </Col>
                    </Row>
                </Card>
                {/* //订单状态 1：待付款、2：待发货、3：待收货、4：已完成、5：已取消、6：已退货、7：申请售后、8：支付中、9：支付失败', */}
                <Card style={{ margin: '30px' }}>
                    <div style={{ width: '100%', border: '1px solid #f1f1f1', boxSizing: 'border-box' }}>
                        <div style={{ width: '100%', }}>
                            <ul style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px', margin: 0, color: '#333', fontWeight: 500, fontSize: '16px', background: '#fafafa', }}>
                                <li style={{ width: '400px' }}>商品信息</li>
                                <li style={{ textAlign: 'left' }}>单价（元）</li>
                                <li style={{ textAlign: 'left' }}>数量</li>
                                <li style={{ textAlign: 'left' }}>交易状态</li>
                            </ul>
                        </div>
                        <div>
                            {orderDetailInfos && orderDetailInfos.orderStatus != (1 || 8 || 9) &&
                                <div style={{ lineHeight: '50px' }}>
                                    <span style={{ padding: '0 20px 0 30px' }}>支付方式：{orderDetailInfos.payChannel}</span>
                                    {orderDetailInfos && orderDetailInfos.deliveryTime && <>
                                        <span style={{ paddingRight: '20px' }}>物流公司：<i style={{ fontStyle: 'normal' }}>{orderDetailInfos.logisticsType}</i></span>
                                        <span style={{ paddingRight: '20px' }}>物流单号：{orderDetailInfos.logisticsNo}</span>
                                        <Button type={"danger"} onClick={this.showLogistics}>物流跟踪</Button>
                                    </>
                                    }
                                </div>
                            }
                            <div style={{ borderTop: '1px solid #f1f1f1', boxSizing: 'border-box' }}>
                                {prodData && prodData.length > 0 && prodData.map((item: any, idx: any) => (
                                    <ul key={idx} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px', fontSize: '16px', borderBottom: '1px solid #f1f1f1' }}>
                                        <li style={{ width: '400px', height: '100px', display: 'flex', alignItems: 'center' }}>
                                            <div style={{ float: 'left', width: '60', marginRight: '10px' }}>
                                                <img src={handlePicUrl(item.productPic)} width='60' height='60' />
                                            </div>
                                            <div style={{ float: 'left', maxWidth: '330px', height: '100px' }}>
                                                <p style={{ height: '30px', margin: '25px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{item.productName}</p>
                                                <p style={{ height: '30px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{item.productAttr}</p>
                                            </div>
                                        </li>
                                        <li style={{ display: 'flex', alignItems: 'center', }}>{formatMoney(item.presentPrice, 2)}</li>
                                        <li style={{ display: 'flex', alignItems: 'center', }}>{item.quantity}</li>
                                        <li style={{ display: 'flex', alignItems: 'center', }}>
                                            {orderStatusList[orderDetailInfos && orderDetailInfos.orderStatus]}
                                        </li>
                                    </ul>
                                ))
                                }
                            </div>
                        </div>
                        <div style={{ margin: '0 30px', background: '#fff' }}>
                            <ul style={{ textAlign: 'right', padding: '40px 32px', fontSize: '14px', color: '#999', lineHeight: '30px' }}>
                                <li>商品总金额：¥ {formatMoney(orderDetailInfos && orderDetailInfos.totalAmount, 2)}</li>
                                {orderDetailInfos && orderDetailInfos.deductedAmount &&
                                    <li>-优惠扣除金额（积分+优惠券）：¥ {formatMoney(orderDetailInfos.deductedAmount, 2)}</li>
                                }
                                {orderDetailInfos && orderDetailInfos.logisticsFee != 0 &&
                                    <li>运费：{formatMoney(orderDetailInfos.logisticsFee, 2)}</li>
                                }
                                {orderDetailInfos && orderDetailInfos.logisticsFee == 0 &&
                                    <li>免运费</li>
                                }
                                <li style={{ fontSize: '16px', color: '#333', fontWeight: 500 }}>订单应付金额：<span style={{ fontSize: '20px', color: 'red' }}>{formatMoney(orderDetailInfos && orderDetailInfos.actualAmount, 2)}</span></li>
                            </ul>
                        </div>
                    </div>
                </Card>
                {orderDetailInfos && orderDetailInfos.bizType == 4 && orderDetailInfos.isHead == true &&
                    <Card style={{ margin: '30px' }}>
                        <div style={{ width: '100%', border: '1px solid #f1f1f1', boxSizing: 'border-box' }}>
                            <div style={{ width: '100%', }}>
                                <ul style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px', margin: 0, color: '#333', fontWeight: 500, fontSize: '16px', background: '#fafafa', }}>
                                    <li style={{ width: '100%' }}>团员购物清单</li>
                                </ul>
                            </div>
                            <div>
                                <div style={{ borderTop: '1px solid #f1f1f1', boxSizing: 'border-box' }}>
                                    {subOrderList && subOrderList.length > 0 && subOrderList.map((item, idx) => (
                                        <div key={idx} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                            <div style={{ lineHeight: '50px' }}>
                                                <span style={{ padding: '0 20px 0 30px' }}>员工姓名：{item.userName}</span>
                                                <span style={{ paddingRight: '20px' }}>收货人姓名：<i style={{ fontStyle: 'normal' }}>{item.realname}</i></span>
                                                <span style={{ paddingRight: '20px' }}>手机号：<i style={{ fontStyle: 'normal' }}>{item.phone}</i></span>
                                            </div>
                                            <ul style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '16px', fontSize: '16px', }}>
                                                <li style={{ width: '400px', height: '100px', display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ float: 'left', width: '60', marginRight: '10px' }}>
                                                        <img src={handlePicUrl(item.prodVOS[0].productPic)} width='60' height='60' />
                                                    </div>
                                                    <div style={{ float: 'left', maxWidth: '330px', height: '100px' }}>
                                                        <p style={{ height: '30px', margin: '25px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{item.prodVOS[0].productName}</p>
                                                        <p style={{ height: '30px', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', }}>{item.prodVOS[0].saleProps}</p>
                                                    </div>
                                                </li>
                                                <li style={{ display: 'flex', alignItems: 'center', }}>{formatMoney(item.prodVOS[0].presentPrice, 2)}</li>
                                                <li style={{ display: 'flex', alignItems: 'center', }}>{item.prodVOS[0].prodCount}</li>
                                                <li style={{ display: 'flex', alignItems: 'center', }}>
                                                    {orderStatusList[item.orderStatus]}
                                                </li>
                                            </ul>
                                        </div>
                                    ))
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>}
                <Drawer
                    title="订单更多信息"
                    width={560}
                    placement="right"
                    closable={false}
                    onClose={() => this.setState({ moreVisialbe: false })}
                    visible={this.state.moreVisialbe}
                >
                    <p>{orderDetailInfos && orderDetailInfos.userName}于{orderDetailInfos && orderDetailInfos.createTime} 提交订单 </p>
                    {orderDetailInfos && orderDetailInfos.paidTime &&
                        <p>{orderDetailInfos.userName}于{orderDetailInfos.paidTime} 完成订单支付 </p>
                    }
                    {orderDetailInfos && orderDetailInfos.deliveryTime &&
                        <p>商家于{orderDetailInfos.deliveryTime} 完成发货操作 </p>
                    }
                    {orderDetailInfos && orderDetailInfos.receiveTime &&
                        <p>{orderDetailInfos.userName}已于{orderDetailInfos.receiveTime} 收到货物 </p>
                    }
                    {orderDetailInfos && orderDetailInfos.exchangeStatus &&
                        <div>
                            {orderDetailInfos.applyTime &&
                                <p>{orderDetailInfos.userName}于{orderDetailInfos.applyTime} 发起了售后申请 </p>
                            }
                            {orderDetailInfos.processTime && orderDetailInfos.exchangeStatus == 11 &&
                                <p>商家于{orderDetailInfos.processTime} 拒绝了您的售后申请</p>
                            }
                            {orderDetailInfos.processTime && orderDetailInfos.exchangeStatus != 11 &&
                                <p>商家于{orderDetailInfos.processTime} 同意了您的售后申请</p>
                            }
                        </div>
                    }
                    {orderDetailInfos && orderDetailInfos.shopReceiveTime &&
                        <p>商家已于{orderDetailInfos.shopReceiveTime} 收到货物 </p>
                    }
                </Drawer>
            </PageHeaderWrapper>
        )
    }
}
