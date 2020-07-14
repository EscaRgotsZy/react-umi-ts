

import React, { Component, } from 'react';
import { Card, Input, Table, Button, Form, Row, Col, DatePicker, Select } from 'antd';
import styles from './index.less';
import { SearchOutlined, ReloadOutlined, } from '@ant-design/icons';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const productTypeList = ['', '现金券',];
const couponTypeList = ['', '部分发放', '批量发放',];
const applyList = ['', '发放成功', '发放失败',];
import { getPageQuery } from '@/common/utils';
import {
    getGrantList,
} from '@/services/cash/issuance';
interface UserProp {
    history: any;
}
interface UserState {
    searchParams: any,
    pageInfo: any,
    total: number | string,
    loading: boolean,
    dataSource: Array<any>,
    beginTime: string,
    endTime: string,
}
export default class IssuanceList extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        let searchParams = getPageQuery()
        this.formRef = React.createRef();
        this.state = {
            searchParams,
            pageInfo: {
                pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
                pageSize: searchParams.pageSize ? +searchParams.pageSize : 10,
            },
            total: '',
            loading: false,
            dataSource: [],
            beginTime: '',
            endTime: '',
        }
    }
    columns = [
        {
            title: '发放时间',
            dataIndex: 'grantTime',
            key: 'grantTime',
            render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '发放人员',
            dataIndex: 'applyName',
            key: 'applyName',
        },
        {
            title: '产品类型',
            dataIndex: 'productType',
            key: 'productType',
            render: (text: any, record: any, index: number) => productTypeList[text]
        },
        {
            title: '发放总金额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: '发放类型',
            dataIndex: 'grantType',
            key: 'grantType',
            render: (text: any, record: any, index: number) => couponTypeList[text]
        },
        {
            title: '总人次',
            dataIndex: 'grantPeople',
            key: 'grantPeople',
        },
        {
            title: '成功人数',
            dataIndex: 'grantSuccess',
            key: 'grantSuccess',
        },
        {
            title: '失败人数',
            dataIndex: 'grantFail',
            key: 'grantFail',
        },
        {
            title: '处理状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: any, record: any, index: number) => applyList[text]
        },
        {
            title: '操作',
            render: (text: any, record: any, index: number) => <>
                <Button type='primary' style={{ marginRight: '10px' }} onClick={() => this.props.history.push(`/cash/issuance/info?grantRecordId=${record.id}`)}><a href={`/#/cash/issuance/info?grantRecordId=${record.id}`}>详情</a></Button>
            </>
        },
    ]
    componentDidMount() {
        let { beginTime, endTime, status } = this.state.searchParams;
        if (beginTime || endTime || status) {
            this.formRef.current.setFieldsValue({ status })
            this.setState({ beginTime, endTime }, () => {
                this.getDataList();
            })
        } else {
            this.getDataList();
        }
    }
    getQuery = () => {
        let { beginTime, endTime, pageInfo } = this.state;
        let { status = '' } = this.formRef.current.getFieldsValue();
        status = status == '-1' ? '' : status;
        let query: any = {
            page: pageInfo.pageNum,
            size: pageInfo.pageSize,
            sortBy: '-createTime',
        }
        if (beginTime) query.beginTime = beginTime;
        if (endTime) query.endTime = endTime;
        if (status) query.status = status;
        this.props.history.push({ search: `current=2&beginTime=${query.beginTime || ''}&endTime=${query.endTime || ''}&status=${query.status ? query.status : '-1'}&pageNum=${query.page || 1}&pageSize=${query.size || 10}` })
        return query
    }
    getDataList = async () => {
        let query = this.getQuery();
        let res = await getGrantList(query);
        let { total, records } = res;
        this.setState({ total, dataSource: records })
    }
    query = () => {
        this.setState({
            pageInfo: {
                pageSize: 10,
                pageNum: 1
            }
        }, () => this.getDataList())
    }
    reset = () => {
        this.formRef.current.resetFields();
        this.setState({ pageInfo: { pageSize: 10, pageNum: 1, }, endTime: '', beginTime: '' }, () => {
            this.getDataList()
        })
    }
    refresh = () => {
        this.getDataList();
    }
    onChange: any = (value: any, dateString: string) => {
        this.setState({
            beginTime: dateString[0],
            endTime: dateString[1],
        })
    }
    // 分页
    onTableChange = ({ current, pageSize }: any) => {
        Object.assign(this.state.pageInfo, { pageNum: current, pageSize: pageSize })
        this.getDataList()
    }
    renderSearch = () => {
        const { beginTime, endTime } = this.state;
        return (
            <Form layout="inline"
                ref={this.formRef}
                initialValues={{
                    issuaTime: (beginTime && endTime) ? [moment(beginTime), moment(endTime)] : '',
                    status: '-1'
                }}
            >
                <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ width: '100%' }}>
                    <Col md={20} sm={20}>
                        <Row>
                            <Col>
                                <FormItem label="发放日期: " name='issuaTime'>
                                    <RangePicker
                                        showTime={{ format: 'HH:mm:ss' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.onChange}
                                    />
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem label="处理状态: " name='status'>
                                    <Select style={{ width: 120 }} >
                                        <Option value={'-1'}>全部</Option>
                                        <Option value={'1'}>发放成功</Option>
                                        <Option value={'2'}>发放失败</Option>
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
    render() {
        const { dataSource, pageInfo, total, loading } = this.state;
        const pagination: any = {
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