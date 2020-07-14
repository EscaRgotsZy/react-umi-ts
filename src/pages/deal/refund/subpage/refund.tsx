import React, { Component } from 'react';
import styles from './index.less';
import { Card, Form, Row, Col, Input, Select, Table, Button, Modal, message, } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getPageQuery, handlePicUrl } from '@/common/utils'
import TextArea from 'antd/lib/input/TextArea';
import {
    getRefundList,
    postReceiveGoods,
} from '@/services/deal/list';

const FormItem = Form.Item;
const { Option } = Select;
const dealStatusList = ['待审核', '同意', '平台审核通过', '退款中', '退款完成', '商家待收货', '商家确认收货', '7', '8', '9', '10', '不同意', '退款失败', '卖家弃货', '待退货', '未收到货', '已收到货', '拼团自动退款'];

interface UserState {
    searchParams: any,
    confirmLoading: any,
    pageSize: any,
    pageNum: any,
    total: any,
    loading: boolean,
    columns: Array<any>,
    tableList: Array<any>,
    harvestVisiable: boolean,
    harvestLoading: boolean,
    harvestInfo: any,
    goodsState: any,
};

interface UserProp {
    history: any;
    type: any;
    onRef:any;
};
export default class preSale extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props);
        this.formRef = React.createRef();
        let searchParams = getPageQuery();
        this.props.onRef(this)
        this.state = {
            searchParams,
            confirmLoading: false,// 添加 loading
            pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
            pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
            total: 0,
            loading: false,
            columns: [],
            tableList: [],
            harvestVisiable: false,
            harvestLoading: false,
            harvestInfo: {},
            goodsState: {}
        };
    }
    receiveMessage: any = '';
    //挂载
    componentDidMount() {
        this.init()
    }
    tabChange = () => {

    }
    init = () => {
        let { returnNo = '', orderNo = '', status = '' } = this.state.searchParams;
        if (returnNo || orderNo || status) {
            this.formRef.current.setFieldsValue({ returnNo, orderNo, status });
            this.getDataList()
        } else {
            this.getDataList();
        }

    }
    getType = () => { // 获取当前参数key
        return this.props.type === '1' ? 'details' : 'goods';;
    }
    // 重置
    resetForm = () => {
        this.formRef.current.resetFields();
    };
    // 获取拼团数据
    getDataList = async ():Promise<any> => {
        // 退款记录Columns
        const detailsColumns: Array<any> = [
            {
                title: '订单号',
                dataIndex: 'orderNo',
            },
            {
                title: '退款号',
                dataIndex: 'returnNo',
            },
            {
                title: '退款金额',
                dataIndex: 'refundAmount',
                render: (text: string, record: any) => `¥${text}`
            },
            {
                title: '买家会员名',
                dataIndex: 'userName',
            },
            {
                title: '申请时间',
                dataIndex: 'applyTime',
                render: (text: string) => moment(text).format('YYYY-MM-DD')
            },
            {
                title: '处理状态',
                dataIndex: 'status',
                render: (text: string | number, record: any) => text == -1 ? '已撤销' : dealStatusList[text]
            },
            {
                title: '处理',
                dataIndex: 'status',
                render: (text: string | number, record: any) => <>
                    {(text != 0 && text != 5) && <Button size='small'>
                        <a href={this.changeHandle(record.id, record.status)}>查看</a>
                    </Button>}
                    {text == 0 && <Button size='small' type="primary">
                        <a href={this.changeHandle(record.id, record.status)}>处理</a>
                    </Button>}
                </>
            }
        ]

        // 退货记录
        const goodsColumns: Array<any> = [
            {
                title: '订单号',
                dataIndex: 'orderNo',
            },
            {
                title: '退款号',
                dataIndex: 'returnNo',
            },
            {
                title: '退款金额',
                dataIndex: 'refundAmount',
                render: (text: string, record: any) => `¥ ${text}`
            },
            {
                title: '买家会员名',
                dataIndex: 'userName',
            },
            {
                title: '申请时间',
                dataIndex: 'applyTime',
                render: (text: string) => moment(text).format('YYYY-MM-DD')
            },
            {
                title: '处理状态',
                dataIndex: 'status',
                render: (text: string | number, record: any) => text == -1 ? '已撤销' : dealStatusList[text]
            },
            {
                title: '处理',
                dataIndex: 'status',
                render: (text: string | number, record: any, index: number) => <>
                    {(text != 0 && text != 5) && <Button size='small' type="primary">
                        <a href={this.changeHandle(record.id, record.status)}>查看</a>
                    </Button>}
                    {text == 0 && <Button size='small' type="primary">
                        <a href={this.changeHandle(record.id, record.status)}>处理</a>
                    </Button>}
                    {text == 5 && <Button size='small' type="primary" onClick={() => this.changeHarvest(record)}>收货</Button>}
                </>
            }
        ]


        let columns = this.getType() == 'goods' ? goodsColumns : detailsColumns;
        let { returnNo = '', orderNo = '', status = '' } = this.formRef.current.getFieldsValue();
        this.props.history.push({ search: `key=${this.props.type}&pageSize=${this.state.pageSize}&pageNum=${this.state.pageNum}&returnNo=${returnNo}&orderNo=${orderNo}&status=${status}` })
        status = status == -5 ? '' : status;
        let refundLimit = this.getType() == 'goods' ? 2 : 1;

        let query: any = {
            page: this.state.pageNum,
            size: this.state.pageSize,
            refundLimit,
        }
        if (orderNo) { query.orderNo = orderNo.trim() };
        if (returnNo) { query.returnNo = returnNo.trim() };
        if (status) { query.status = status };
        query.sortBy = '-applyTime'
        this.setState({ loading: true });
        let res = await getRefundList(query);
        this.setState({ loading: false })
        if (!res) return false;
        let tableList = res.data && res.data.records || [];
        this.setState({
            tableList,
            total: res.data && res.data.total || 0,
            columns,
        })
    }
    // 查询
    query = () => {
        this.setState({
            pageSize: 10,
            pageNum: 1
        }, this.getDataList)
    }
    // 重置
    reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            pageNum: 1,
            pageSize: 10,
        }, () => {
            this.getDataList()
        })
    }
    // 刷新
    refresh = () => {
        this.getDataList();
    }
    onTableChange = ({ current: pageNum, pageSize }: any) => {
        this.setState({
            pageSize,
            pageNum
        }, this.refresh )
    }
    // 处理&查看
    changeHandle = (gid: number | string, dealStatus: number | string) => {
        return `#/deal/refund_details?t=${this.getType()}&s=${dealStatus}&&refundId=${gid}`
    }
    // 收货物
    changeHarvest = (record: any) => {
        this.setState({ harvestVisiable: true, harvestInfo: record })
    }
    // handleUpload

    // 修改收货
    checkGoodsState = (value: any) => {
        this.setState({ goodsState: value })
    }
    // 确定收货操作
    okReceiveGoods = () => {
        let { harvestInfo, goodsState } = this.state;
        let refundId = harvestInfo.id;
        let receiveMessage = this.receiveMessage;
        if (!goodsState) {
            message.error('请选择收获状态');
            return false
        }
        if (!receiveMessage) {
            message.error('请填写收获备注');
            return false
        }
        let query = { goodsState, refundId, receiveMessage };
        this.sendReceiveGoods(query);
    }
    // 发送收货
    sendReceiveGoods = async (query: any) => {
        let res = await postReceiveGoods(query);
        if (!res) {
            this.setState({ harvestLoading: false });
            return false;
        }
        message.success('操作成功');
        this.setState({ harvestVisiable: false, harvestLoading: false })
        this.getDataList()
    }

    // 收获备注输入
    setReceiveMessage = (e: any) => {
        this.receiveMessage = e.target.value;
    }

    renderForm = () => {
        return (
            <Row >
                <Col md={20} sm={20}>
                    <Form
                        layout="inline"
                        ref={this.formRef}
                        initialValues={{
                            status: '-5',
                        }}
                    >
                        {this.props.type === '1' && <FormItem label="处理状态" name='status'>
                            <Select style={{ width: 120 }} placeholder="请选择">
                                <Option value='-5'>全部</Option>
                                <Option value='0'>待审核</Option>
                                <Option value='-1'>已撤销</Option>
                                <Option value='4'>同意</Option>
                                <Option value='11'>不同意</Option>
                            </Select>
                        </FormItem>}
                        {this.props.type === '2' && <FormItem label="处理状态" name='status'>
                            <Select style={{ width: 120 }} placeholder="请选择">
                                <Option value='-5'>全部</Option>
                                <Option value='0'>待审核</Option>
                                <Option value='-1'>已撤销</Option>
                                <Option value='14'>待买家退货</Option>
                                <Option value='5'>待收货</Option>
                                <Option value='15'>未收到</Option>
                                <Option value='4'>退款完成</Option>
                                <Option value='13'>弃货</Option>
                                <Option value='11'>不同意</Option>
                            </Select>
                        </FormItem>}
                        <FormItem
                            label="订单编号"
                            name='orderNo'
                            rules={[{ pattern: /^[0-9]*$/, message: '订单编号仅支持数字' }]}
                        >
                            <Input placeholder="请输入订单编号" />
                        </FormItem>
                        <FormItem
                            label="退款(货)编号"
                            name='returnNo'
                            rules={[{ pattern: /^[0-9]*$/, message: '退款(货)编号仅支持数字' }]}
                        >
                            <Input placeholder="请输入退款(货)编号" />
                        </FormItem>
                    </Form>
                </Col>
                <Col md={4} sm={4}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="primary"
                            onClick={this.query}
                            icon={<SearchOutlined />}
                            style={{ marginRight: 5, marginLeft: 5 }}
                        >
                            {' '}查询{' '}
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
                    </div>
                </Col>
            </Row>
        )
    }
    // 新增按钮
    linkTo() {
        this.props.history.push('/activity/assemble/add_assemble')
    }
    render() {
        let { loading, tableList, columns, } = this.state;
        const pagination = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: this.state.pageNum,
            pageSize: this.state.pageSize || 10,
            total: this.state.total,
            showTotal: (t: number | string) => <div>共{t}条</div>
        }
        return (
            <>
                <div className={styles.pageContent}>
                    <Card bordered={false}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                    </Card>
                    <Card bordered={false} style={{ marginTop: 20 }}>
                        <Table
                            rowKey={record => record.id}
                            loading={loading}
                            columns={columns}
                            dataSource={tableList}
                            onChange={this.onTableChange}
                            expandRowByClick={true}
                            expandedRowRender={(record) => <>
                                <Table
                                    rowKey={record => record.id}
                                    columns={[
                                        {
                                            title: '商品图片',
                                            dataIndex: 'productPic',
                                            render: (text: string) => <>
                                                <img src={handlePicUrl(text)} width='50' height='60' />
                                            </>
                                        },
                                        {
                                            title: '商品信息',
                                            dataIndex: 'productName',
                                        },
                                        {
                                            title: '商品规格',
                                            dataIndex: 'productAttr'
                                        },
                                    ]}
                                    dataSource={record.exchangeOrderItems}
                                    pagination={false}
                                    locale={
                                        { emptyText: '暂无数据' }
                                    }
                                />
                            </>
                            }
                            pagination={pagination} />
                    </Card>
                </div>
                {/* 收货 */}
                <Modal
                    title={'物流信息'}
                    visible={this.state.harvestVisiable}
                    onCancel={() => this.setState({ harvestVisiable: false })}
                    onOk={this.okReceiveGoods}
                >
                    <>
                        <ul style={{ padding: '5px' }}>
                            <li style={{ margin: '5px', padding: '5px' }}>
                                <span>物流公司:</span><span style={{ marginLeft: '10px' }}>{this.state.harvestInfo && this.state.harvestInfo.expressName || ''}</span>
                            </li>
                            <li style={{ margin: '5px', padding: '5px' }}>
                                <span>物流单号:</span><span style={{ marginLeft: '10px' }}>{this.state.harvestInfo && this.state.harvestInfo.expressNo || ''}</span>
                            </li>
                            <li style={{ margin: '5px', padding: '5px' }}>
                                <span>收获状态:</span>
                                <Select style={{ width: '200px', marginLeft: '10px' }} placeholder="请选择" onChange={this.checkGoodsState} >
                                    <Option value={15}>未收到货</Option>
                                    <Option value={16}>已收到货</Option>
                                </Select>
                            </li>
                            <li style={{ margin: '5px', padding: '5px', display: 'flex' }}>
                                <span>收获备注:</span>
                                <TextArea style={{ width: '300px', marginLeft: '10px' }} onChange={(e) => this.setReceiveMessage(e)}></TextArea>
                            </li>
                        </ul>
                    </>
                </Modal>
            </>
        )
    }
}
