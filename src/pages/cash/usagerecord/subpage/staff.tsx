

import React, { Component, } from 'react';
import { Card, Table, Button, Breadcrumb, Form, Row, Col, Select, DatePicker } from 'antd';
import styles from './index.less';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery, downloadFile } from '@/common/utils';
import moment from 'moment';
import { saveUrlParams } from '@/utils/utils';
import {
    getUsageRecordInfo,
} from '@/services/cash/usageRecord';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const applyList = ['下单使用', '购物返现', '取消订单返还', '售后退款', '充值',];
const statusList = ['待入账', '已入账', '已冻结', '已扣除', '支付成功', '已失效',];
interface UserProp {
    history: any;
}
interface UserState {
    searchParams: any;
    employeeId: any;
    loading: boolean;
    pageInfo: any;
    total: any;
    startTime: string,
    endTime: string,
    dataSource: Array<any>;
}
export default class StaffRecord extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        let searchParams = getPageQuery()
        this.formRef = React.createRef();
        this.state = {
            loading: false,
            searchParams,
            employeeId: searchParams.employeeId,
            pageInfo: {
                pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
                pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
            },
            total: '',
            startTime: '',
            endTime: '',
            dataSource: [],
        }
    }
    columns = [
        {
            title: '积分变更时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '产品类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '来源',
            dataIndex: 'source',
            key: 'source',
            render: (text: any, record: any, index: number) => applyList[text]
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: any, record: any, index: number) => <span style={{ color: record.dealType == 1 ? 'green' : 'red' }}>{record.dealType ? '+ ' + text : '- ' + text}</span>
        },
        {
            title: '现金券状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: any) => statusList[text]
        },
    ]
    componentDidMount() {
        let { searchParams: { startTime, endTime, }, source }: any = this.state;
        if (startTime || endTime || source) {
            this.formRef.current.setFieldsValue({
                source
            });
            this.setState({ startTime, endTime }, () => {
                this.getDataList();
            });
        } else {
            this.getDataList();
        }
    }
    getQuery = () => {
        let { pageInfo: { pageNum, pageSize }, startTime, endTime, employeeId }: any = this.state;
        let { source } = this.formRef.current.getFieldsValue();
        source = source == '-1' ? '' : source;
        let query: any = {
            page: pageNum,
            size: pageSize,
            employeeId,
            sortBy: '-createTime'
        }
       
        if (startTime) query.startTime = startTime;
        if (endTime) query.endTime = endTime;
        if (source) query.source = source;
        saveUrlParams({
            startTime: query.startTime,
            endTime: query.endTime,
            employeeId: query.employeeId,
            source: query.source,
            page: query.page,
            size: query.size,
        })
        return query
    }
    getDataList = async () => {
        this.setState({ loading: true });
        let query = this.getQuery();
        let res = await getUsageRecordInfo(query);
        this.setState({ loading: false });
        if (!res) return false;
        let { records, total } = res;
        this.setState({ dataSource: records, total })
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
    export = () => {
        let query = this.getQuery();
        let exportParam = {
            form: {
                employeeId: query.employeeId ? query.employeeId : '',
                endTime: query.endTime ? query.endTime : '',
                source: query.source ? query.source : '',
                startTime: query.startTime ? query.startTime : '',
            },
            pageForm: {
                page: query.page ? query.page : 1,
                size: query.size ? query.size : 10,
                sortBy: '-createTime'
            }
        }
        downloadFile(
            {
                url: '/cash-coupons/export/use-details',
                method: 'POST',
                headers: 'default',
                paramName: '',
                param: exportParam,
                fileName: '员工现金券使用明细.xlsx'
            }
        )
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
            <Form layout="inline"
                ref={this.formRef}
                initialValues={{
                    reChargeTime: (startTime && endTime) ? [moment(startTime), moment(endTime)] : '',
                    source: -1
                }}
            >
                <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
                    <Col md={20} sm={20} style={{ display: 'flex' }}>
                        <FormItem label="积分变更日期: " name='reChargeTime'>
                            <RangePicker
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onChange}
                            />
                        </FormItem>
                        <FormItem label="来源: " name='source'>
                            <Select style={{ width: 120 }} >
                                <Option value={-1}>全部</Option>
                                <Option value={'0'}>下单使用</Option>
                                <Option value={'1'}>购物返现</Option>
                                <Option value={'3'}>售后退款</Option>
                                <Option value={'4'}>充值</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={4} sm={4}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" onClick={this.query}  icon={<SearchOutlined />}> 查询 </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.reset}  icon={<ReloadOutlined />}>重置</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.export}  icon={<DownloadOutlined />}>导出明细</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        )
    }
    // 分页
    onTableChange = ({ current, pageSize }:any) => {
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
            showTotal: (t:number) => <div>共{t}条</div>
        }
        return (
            <PageHeaderWrapper title='员工使用明细'>
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
            </PageHeaderWrapper>
        )
    }
}