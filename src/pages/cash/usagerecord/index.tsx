
import React, { Component, } from 'react';
import { Card, Input, Table, Button,  Form, Row, Col, Select } from 'antd';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPageQuery } from '@/common/utils';
import { saveUrlParams } from '@/utils/utils';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import {
    getCashCouponsList,
} from '@/services/cash/usageRecord';
const FormItem = Form.Item;
const { Option } = Select;
const typeList = ['未知', '现金券',];
const employeeStatusList = ['未知', '在职', '离职',];
interface UserProp {
    history: any;
}
interface UserState {
    searchParams: any,
    loading: boolean,
    pageInfo: any,
    total: any,
    dataSource: Array<any>,
}

export default class UsageRecord extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        let searchParams = getPageQuery()
        this.formRef = React.createRef();
        this.state = {
            searchParams,
            pageInfo: {
                pageNum: searchParams.page ? +searchParams.page : 1,
                pageSize: searchParams.size ? +searchParams.size : 30,
            },
            total: '',
            loading: false,
            dataSource: [],
        }
    }
    columns = [
        {
            title: '产品类型',
            dataIndex: 'type',
            key: 'type',
            render: (text: any) => typeList[text] || '现金券'
        },
        {
            title: '姓名',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: '手机号',
            dataIndex: 'cellphone',
            key: 'cellphone',
        },
        {
            title: '现金券总额',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: '状态',
            dataIndex: 'employeeStatus',
            key: 'employeeStatus',
            render: (text: any) => <span style={{ color: text == 1 ? 'green' : text == 2 ? 'red' : 'orange' }}>{employeeStatusList[text] || '未知'}</span>
        },
        {
            title: '操作',
            render: (text: any, record: any, index: number) => <Button type='primary' onClick={() => this.props.history.push(`/cash/usagerecord/staff?employeeId=${record.id}`)}><a href={`/#/cash/usagerecord/staff?employeeId=${record.id}`}>明细</a></Button>
        },
    ]
    componentDidMount() {
        let { realName, cellphone, employeeStatus } = this.state.searchParams;
        if (realName || cellphone || employeeStatus) {
            this.formRef.current.setFieldsValue({ realName, cellphone, employeeStatus });
            this.getDataList()
        } else {
            this.getDataList()
        }
    }
    getSearchQuery = () => {
        let { realName, cellphone, employeeStatus }: any = this.formRef.current.getFieldsValue();
        let { pageInfo: { pageNum, pageSize } } = this.state;
        employeeStatus = employeeStatus == '-1' ? '' : employeeStatus;
        let query: any = {
            page: pageNum,
            size: pageSize,
            sortBy: '-createTime'
        }
        if (realName) query.realName = realName.trim();
        if (cellphone) query.cellphone = cellphone.trim();
        if (employeeStatus) query.employeeStatus = employeeStatus;
        saveUrlParams({
            realName: query.realName,
            cellphone: query.cellphone,
            employeeStatus: query.employeeStatus,
            page: query.page,
            size: query.size,
        })
        return query
    }
    getDataList = async () => {
        this.setState({ loading: true });
        let query = this.getSearchQuery()
        let res = await getCashCouponsList(query);
        this.setState({ loading: false });
        if (!res) return false
        let { total, records } = res;
        this.setState({
            total,
            dataSource: records,
        })
    }
    query = () => {
        this.setState({
            pageInfo: {
                pageSize: 30,
                pageNum: 1
            }
        }, this.getDataList)
    }
    reset = () => {
        this.formRef.current.resetFields();
        this.setState({ pageInfo: { pageSize: 30, pageNum: 1, } }, () => {
            this.getDataList();
        })
    }
    refresh = () => {
        this.getDataList();
    }
    renderSearch = () => {
        return (
            <Form layout="inline"
                ref={this.formRef}
                initialValues={{
                    employeeStatus: '-1'
                }}
            >
                <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ width: '100%' }}>
                    <Col md={20} sm={20} style={{display: 'flex'}}>
                        <FormItem label="姓名: " name='realName'>
                            <Input style={{width:'200px'}}/>
                        </FormItem>
                        <FormItem label="手机号: " name='cellphone'>
                            <Input style={{width:'200px'}}/>
                        </FormItem>
                        <FormItem label="状态: " name='employeeStatus'>
                            <Select style={{ width: 120 }} >
                                <Option value={'-1'}>全部</Option>
                                <Option value={'1'}>在职</Option>
                                <Option value={'2'}>离职</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={4} sm={4}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="primary" onClick={this.query} icon={<SearchOutlined />}> 查询 </Button>
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
            pageSize: pageInfo.pageSize || 30,
            total: total,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        return (
            <PageHeaderWrapper title='现金券使用记录'>
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