import React, { Component, } from 'react';
import { Card, Table, Button, Form, Row, Col, DatePicker, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, ReloadOutlined,  } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import { getPageQuery } from '@/common/utils';
import {
    getReChargeRecordList, revokeApply,
} from '@/services/cash/recharge';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const productTypeList = ['未知', '现金券',];
const couponTypeList = ['未知', '银行转账', '支票', '现金'];
const applyList = ['未知', '处理中', '等待充值', '充值成功', '已取消', '退款完成'];

interface UserProp {
    history: any;
}
interface UserState {
    searchParams: any,
    loading: boolean,
    pageInfo: any,
    total: any,
    startTime: string,
    endTime: string,
    orderStatus: any,
    dataSource: Array<any>,
}
export default class ReChargeList extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        let searchParams = getPageQuery();
        this.formRef = React.createRef();
        this.state = {
            searchParams,
            loading: false,
            pageInfo: {
                pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
                pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
            },
            total: '',
            startTime: '',
            endTime: '',
            orderStatus: '',
            dataSource: [],
        }
    }
    columns = [
        {
            title: '申请时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '',
        },
        {
            title: '申请人员',
            dataIndex: 'applyName',
            key: 'applyName',
        },
        {
            title: '产品类型',
            dataIndex: 'orderType',
            key: 'orderType',
            render: (text: any, record: any, index: number) => productTypeList[text]
        },
        {
            title: '充值金额',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '充值方式',
            dataIndex: 'payType',
            key: 'payType',
            render: (text: any, record: any, index: number) => couponTypeList[text]
        },
        {
            title: '处理状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (text: any, record: any, index: number) => applyList[text]
        },
        {
            title: '操作',
            render: (text: any, record: any, index: number) => <>
                <Button type='primary' style={{ marginRight: '10px' }} onClick={() => this.toRecordInfo(record)}>
                    <a href={`/#/cash/recharge/info?reChargeId=${record.id}`}>详情</a>
                </Button>
                {
                    record.orderStatus == 1 ? <Popconfirm
                        title="是否取消充值申请?"
                        onConfirm={() => this.revoke(record,)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type='dashed' >撤销</Button>
                    </Popconfirm> : null
                }
            </>
        },
    ]
    toRecordInfo = (record: any) => {
        let { id } = record;
        this.props.history.push(`/cash/charge/info?reChargeId=${id}`);
    }
    revoke = async (record: any) => {
        let { id } = record;
        let res = await revokeApply(id);
        if (!res) return false
        this.getDataList();
    }
    componentDidMount() {
        let { searchParams: { startTime, endTime, }, orderStatus } = this.state;
        if (startTime || endTime || orderStatus) {
            this.formRef.current.setFieldsValue({
                orderStatus
            });
            this.setState({ startTime, endTime }, () => {
                this.init();
            });
        } else {
            this.init();
        }
    }
    getQuery = () => {
        let { pageInfo: { pageNum, pageSize }, startTime, endTime } = this.state;
        let { orderStatus } = this.formRef.current.getFieldsValue();
        orderStatus = orderStatus == '-1' ? '' : orderStatus;
        let query: any = {
            page: pageNum,
            size: pageSize,
            orderStatus,
            sortBy: '-createTime'
        }
        if (startTime) query.startTime = startTime;
        if (endTime) query.endTime = endTime;
        if (orderStatus) query.orderStatus = orderStatus;
        this.props.history.push({ search: `current=2&startTime=${query.startTime || ''}&endTime=${query.endTime || ''}&orderStatus=${query.orderStatus}&pageNum=${query.page || 1}&pageSize=${query.size || 10}` })
        return query
    }
    getDataList = async () => {
        this.setState({ loading: true });
        let query = this.getQuery();
        let res = await getReChargeRecordList(query);
        this.setState({ loading: false });
        if (!res) return false;
        let { records, total } = res;
        this.setState({ dataSource: records, total })
    }
    init = () => {
        this.query()
    }
    query = () => {
        this.setState({
            pageInfo: {
                pageSize: 10,
                pageNum: 1
            }
        }, this.getDataList)
    }
    reset = () => {
        this.formRef.current.resetFields();
        this.setState({ pageInfo: { pageSize: 10, pageNum: 1 }, startTime: '', endTime: '' }, () => {
            this.getDataList();
        })
    }
    refresh = () => {
        this.getDataList();
    }
    onChange: any = (value: any, dateString: string) => {
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1],
        })
    }
    renderSearch = () => {
        const { startTime, endTime } = this.state;
        return (
            <Form
                layout="inline"
                ref={this.formRef}
                initialValues={{
                    reChargeTime: (startTime && endTime) ? [moment(startTime), moment(endTime)] : '',
                    orderStatus: -1
                }}
            >
                <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ width: '100%' }}>
                    <Col md={20} sm={20}>
                        <Row>
                            <Col>
                                <FormItem label="申请日期: " name='reChargeTime'>
                                    <RangePicker
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.onChange}
                                    />
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem label="处理状态: " name='orderStatus'>
                                    <Select style={{ width: 120 }} >
                                        <Option value={-1}>全部</Option>
                                        <Option value={1}>处理中</Option>
                                        <Option value={2}>等待充值</Option>
                                        <Option value={3}>充值成功</Option>
                                        <Option value={4}>已取消</Option>
                                        <Option value={5}>退款完成</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>


                    </Col>
                    <Col md={4} sm={4}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" onClick={this.query} icon={<SearchOutlined />} > 查询 </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.reset} icon={<ReloadOutlined />}>重置</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        )
    }

    // 分页
    onTableChange = ({ current, pageSize }: any) => {
        Object.assign(this.state.pageInfo, { pageNum: current, pageSize: pageSize })
        this.getDataList()
    }

    render() {
        const { dataSource, loading, pageInfo, total } = this.state;
        const pagination = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize || 10,
            total: total,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        return (
            <>
                <Card className={styles.cardContent} >
                    <div className={styles.tableListForm}>{this.renderSearch()}</div>
                </Card>
                <Card className={styles.cardContent} >
                    <Table
                        rowKey={record => record.id}
                        dataSource={dataSource}
                        columns={this.columns}
                        onChange={this.onTableChange}
                        pagination={pagination}
                        loading={loading}
                    />
                </Card>
            </>
        )
    }
}
