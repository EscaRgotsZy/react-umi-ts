

import React, { Component, } from 'react';
import { Card, Input, Table, Button, Breadcrumb, Form, Row, Col, Select } from 'antd';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
const FormItem = Form.Item;
const { Option } = Select;
const proTypeList = ['', '现金券'];
const applyList = ['', '成功', '失败'];
import { getPageQuery } from '@/common/utils';
import { SearchOutlined, ReloadOutlined, } from '@ant-design/icons';
import {
    getGrantRecord,
} from '@/services/cash/issuance';
interface UserProp {
    history: any;
}
interface UserState {
    searchParams: any,
    grantRecordId: number | string,
    pageInfo: any,
    total: number | string,
    loading: boolean,
    dataSource: Array<any>,
}
export default class GrantRecord extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        let searchParams = getPageQuery();
        this.formRef = React.createRef();
        this.state = {
            searchParams,
            grantRecordId: searchParams.grantRecordId,
            pageInfo: {
                pageNum: searchParams.pageNum ? +searchParams.pageNum : 1,
                pageSize: searchParams.pageSize ? +searchParams.pageSize : 30,
            },
            total: '',
            loading: false,
            dataSource: [],
        }
    }
    columns = [
        {
            title: '产品类型',
            dataIndex: 'productType',
            key: 'productType',
            render: (text: number | string) => proTypeList[text]
        },
        {
            title: '手机号',
            dataIndex: 'cellphone',
            key: 'cellphone',
        },
        {
            title: '姓名',
            dataIndex: 'realName',
            key: 'realName',
        },
        {
            title: '单笔金额',
            dataIndex: 'grantAmount',
            key: 'grantAmount',
        },
        {
            title: '充值状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: any, record: any, index: number) => <span style={{ color: text == 1 ? 'green' : 'red' }}>{applyList[text]}</span>
        },
        {
            title: '发放原因',
            dataIndex: 'reason',
            key: 'reason',
            render: (text: any, record: any, index: number) => <div className={styles.ellipsis}>{text}</div>
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            render: (text: any, record: any, index: number) => <div className={styles.ellipsis}>{text}</div>
        },
    ]
    componentDidMount() {
        let { cellphone = '', realName = '', status = '', grantRecordId } = this.state.searchParams;
        if (!grantRecordId) {
            this.props.history.push(`/cashCoupon_manage/issuance?current=2`)
        }
        if (cellphone || realName || status) {
            this.formRef.current.setFieldsValue({
                cellphone, realName, status
            });
            this.getDataList();
        } else {
            this.getDataList();
        }
    }

    query = () => {
        this.setState({
            pageInfo: {
                pageSize: 30,
                pageNum: 1
            }
        }, this.getDataList)
    }
    getQuery = () => {
        let { cellphone = '', realName = '', status = '' } = this.formRef.current.getFieldsValue();
        let { pageInfo, grantRecordId } = this.state;
        status = status == '-1' ? '' : status;
        let query: any = {
            grantRecordId,
            page: pageInfo.pageNum,
            size: pageInfo.pageSize,
        }
        if (cellphone) query.cellphone = cellphone.trim();
        if (realName) query.realName = realName.trim();
        if (status) query.status = status;
        this.props.history.push({ search: `current=2&grantRecordId=${grantRecordId}&cellphone=${query.cellphone || ''}&realName=${query.realName || ''}&status=${status ? status : '-1'}&pageNum=${query.page || 1}&pageSize=${query.size || 30}` })
        return query
    }
    reset = () => {
        this.formRef.current.resetFields();
        this.setState({ pageInfo: { pageSize: 30, pageNum: 1, } }, () => {
            this.getDataList();
        })

    }
    getDataList = async () => {
        let query = this.getQuery();
        let res = await getGrantRecord(query);
        let { total, records } = res;
        this.setState({
            total,
            dataSource: records
        })
    }
    renderSearch = () => {
        return (
            <Form layout="inline"
                ref={this.formRef}
                initialValues={{
                    cellphone: '',
                    realName: '',
                    status: '-1',
                }}
            >
                <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
                    <Col md={20} sm={20}>
                        <Row>
                            <Col>
                                <FormItem label="手机号: " name='cellphone'>
                                    <Input />
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem label="姓名: " name='realName'>
                                    <Input />
                                </FormItem>
                            </Col>
                            <Col>
                                <FormItem label="充值状态: " name='status'>
                                    <Select style={{ width: 200 }} >
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

    // 分页
    onTableChange = ({ current, pageSize }: any) => {
        Object.assign(this.state.pageInfo, { pageNum: current, pageSize: pageSize })
        this.getDataList()
    }
    render() {
        const { dataSource, pageInfo, total, loading } = this.state;
        const pagination: any = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize || 30,
            total: total,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        return (
            <PageHeaderWrapper title='发放记录明细'>
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