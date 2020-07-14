import React, { Component } from 'react';
import { Card,  Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery, handlePicUrl,  } from '@/common/utils';
import {
    getSnapshot,
} from '@/services/deal/order';
interface UserProp {
    history: any;
}
interface UserState {
    itemId: string | number,
    loading: boolean,
    data: any,
    customParam: any,
}
export default class OrderDetail extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props);
        this.state = {
            itemId: getPageQuery().itemId || '',
            loading: false,
            data: {},
            customParam: {},
        }
    }
    componentDidMount() {
        this.getquery()
    }
    getquery = async () => {
        let { itemId } = this.state
        this.setState({ loading: true })
        let res = await getSnapshot({ itemId });
        this.setState({ loading: false })
        if (!res) return false;
        let { data } = res || [];
        let customParam = data.customParam && JSON.parse(data.customParam);
        this.setState({
            data,
            customParam
        })
    }
    render() {
        let { data, customParam } = this.state;
        return (
            <PageHeaderWrapper title={"交易快照"} >
                <Card >
                    <Row gutter={24}>
                        <Col span={2}></Col>
                        <Col span={7}>
                            <div style={{ maxWidth: '460px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #E8E5E5', }}>
                                <img src={data && handlePicUrl(data.productPic)} style={{ width: '100%' }} />
                            </div>
                        </Col>
                        <Col span={13} >
                            <div style={{ borderBottom: '1px solid #D9D9D9', paddingBottom: 30 }}>
                                <h1 style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data && data.productName}</h1>
                                <p>{data && data.content}</p>
                            </div>

                            <div style={{ padding: '30px 0' }}>
                                <p style={{ fontSize: '26px', color: 'red' }}>¥ &nbsp;{data && data.presentPrice}</p>
                                {customParam && customParam.length > 0 && customParam.map((item: any, idx: number) => (
                                    <p key={idx}>{item.key}： {item.value}</p>
                                ))
                                }
                                <p style={{}}>购买数量： {data && data.quantity}件</p>
                            </div>
                            <div >
                                <p >您现在查看的是<span style={{ fontSize: '16px', fontWeight: 500 }}>商品快照</span></p>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={24}   >
                        <Col span={24} >
                            <Card title="商品参数" bordered={true} style={{ marginTop: '20px' }} headStyle={{ margin: '0 20px', padding: '0' }} bodyStyle={{ padding: '20px' }}>

                            </Card>
                        </Col>
                    </Row>
                </Card>
            </PageHeaderWrapper>
        )
    }
}
