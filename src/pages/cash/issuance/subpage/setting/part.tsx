import React, { Component, } from 'react';
import { Button, Form, Input, Modal, Table, Row, Col, message, InputNumber } from 'antd';
import styles from './index.less';
import { getStaffDataList, } from '@/services/cash/issuance';;


interface UserProp {
    nextSteps: any;
    cashTotal: any;
    IssuanDataInfo: any;

}
interface UserState {
    nextLoading: boolean;
    stepsCurrent: number;
    visible: boolean;
    staffLoading: boolean;
    pageInfo: any;
    total: number | string;
    checkRowList: Array<any>;
    staffDataList: Array<any>;
    checkStaffList: Array<any>;
    noCheckStaff: boolean;
    selectedRowKeys: Array<any>;
    IssuanDataInfo: any;
    issuedAmount: any;
}
export default class Part extends Component<UserProp, UserState> {
    staffRef: React.RefObject<any>;
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        this.staffRef = React.createRef();
        this.formRef = React.createRef();
        this.state = {
            nextLoading: false,
            stepsCurrent: 0,
            visible: false,
            staffLoading: false,
            pageInfo: {
                pageNum: 1,
                pageSize: 10
            },
            total: '',
            checkRowList: [],       //  选择员工预备数组
            staffDataList: [],      //  选择员工数组
            checkStaffList: [],     //  选择的员工
            noCheckStaff: false,    //  未选员工提示信息
            selectedRowKeys: [],    //  madol 选择的key
            IssuanDataInfo: this.props.IssuanDataInfo,
            issuedAmount: '',
        }
    }
    columns = [
        { title: '用户ID', dataIndex: 'userId' },
        { title: '姓名', dataIndex: 'realName' },
        { title: '手机号', dataIndex: 'cellphone' },
    ]
    componentDidMount() {

        let { IssuanDataInfo } = this.state;
        let selectedRowKeys = IssuanDataInfo && IssuanDataInfo.checkStaffList && IssuanDataInfo.checkStaffList.length != 0 ? IssuanDataInfo.checkStaffList.map((v: any) => v.userId + '') : [];
        let checkStaffList = IssuanDataInfo && IssuanDataInfo.checkStaffList && IssuanDataInfo.checkStaffList.length != 0 ? IssuanDataInfo.checkStaffList : [];
        let issuedAmount = IssuanDataInfo && IssuanDataInfo.issuedAmount;
        this.formRef.current.setFieldsValue({
            issuedReason: IssuanDataInfo ? IssuanDataInfo.issuedReason : '',
            issuedRemark: IssuanDataInfo ? IssuanDataInfo.issuedRemark : '',
            issuedAmount: IssuanDataInfo ? IssuanDataInfo.issuedAmount : '',
        })
        this.setState({ selectedRowKeys, checkStaffList, issuedAmount })
    }
    // 删除已选员工
    delecheckStaffItem = (data: any, index: number) => {
        let { checkStaffList } = this.state;
        checkStaffList && checkStaffList.length > 0 && checkStaffList.splice(index, 1);
        this.setState({ checkStaffList })
    }
    renderCheckStaff = () => {
        let { checkStaffList } = this.state;
        return (
            checkStaffList && checkStaffList.length != 0 ?
                <Row>
                    <Col span={18}>
                        <Form.Item className={styles.formItem} >
                            <div style={{ marginTop: '20px' }}>
                                {
                                    checkStaffList.map((item, index) => <div className={styles.staffName} key={item.userId}>
                                        <div
                                            className={styles.close}
                                            onClick={() => this.delecheckStaffItem(item, index)}
                                        >x</div>
                                        {item.realName}
                                    </div>
                                    )
                                }
                            </div>

                        </Form.Item>
                    </Col>
                </Row>
                : null

        )
    }
    query = () => {
        this.setState({
            pageInfo: {
                pageNum: 1,
                pageSize: 10
            }
        }, () => {
            this.getStaffList()
        })
    }
    changeFlag = (flag: boolean) => {
        this.setState({ visible: flag }, () => {
            this.getStaffList();
        });

    }
    reset = () => {
        this.staffRef.current.resetFields();
        this.setState({ pageInfo: { pageSize: 10, pageNum: 1, } }, () => this.getStaffList())

    }
    addCheckStaff = () => {
        let { checkRowList, checkStaffList, noCheckStaff } = this.state;
        if (checkRowList && checkRowList.length != 0) {
            noCheckStaff = false;
        }
        this.setState({ visible: false, checkStaffList: checkRowList, noCheckStaff });
    }
    getStaffQuery = () => {
        let { pageInfo: { pageSize, pageNum } } = this.state;
        let { realName, cellphone } = this.staffRef.current ? this.staffRef.current.getFieldsValue() : '';
        let query = {
            size: pageSize,
            page: pageNum,
            realName: realName ? realName.trim() : '',
            cellphone,
        }
        return query
    }
    getStaffList = async () => {
        this.setState({ staffLoading: true, staffDataList: [] });
        let query = this.getStaffQuery();
        let res = await getStaffDataList(query);
        this.setState({ staffLoading: false });
        if (!res) return false
        let { records, total } = res;
        this.setState({ staffDataList: records, total })
    }
    // 分页
    onTableChange = ({ current, pageSize }: any) => {
        Object.assign(this.state.pageInfo, { pageNum: current, pageSize: pageSize })
        this.getStaffList();
    }
    // next
    next = () => {
        let { checkStaffList, } = this.state;
        this.formRef.current.validateFields().then((values: any): any => {
            if (!checkStaffList || checkStaffList.length == 0) {
                this.setState({ noCheckStaff: true });
                return false
            } else {
                this.setState({ noCheckStaff: false });
            }
            let partDataInfo = {
                issuedAmount: values.issuedAmount,
                issuedReason: values.issuedReason,
                issuedRemark: values.issuedRemark,
                checkStaffList,
            }
            this.props.nextSteps(partDataInfo, 1);
        }).catch((err: Error) => { })

    }
    render() {
        let { nextLoading, staffLoading, pageInfo, total, visible, staffDataList, checkRowList, noCheckStaff, checkStaffList, selectedRowKeys } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 5 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 18 },
                sm: { span: 18 },
            },
        };
        const pagination: any = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: total,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            getCheckboxProps: (record: any) => ({
                disabled: !record.userId,    // 配置无法勾选的列
            }),
            onChange: (selectedRowKeys: Array<any>, selectedRows: Array<any>,) => {
                let addList = selectedRows.filter((item: any) => !(checkRowList && checkRowList.length != 0 && checkRowList.some(ele => ele.userId === item.userId)));
                checkRowList.push(...addList);
                this.setState({ selectedRowKeys, checkRowList });
            },
            onSelect: (record: any, selected: any, selectedRows: any, nativeEvent: any) => {
                if (selected) {
                    let addList = selectedRows.filter((item: any) => !(checkRowList && checkRowList.length != 0 && checkRowList.some(ele => ele.userId === item.userId)));
                    checkRowList.push(...addList);
                } else {
                    checkRowList = checkRowList.filter((item) => item.userId != record.userId);
                }
                this.setState({ checkRowList })
            },
            onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
                if (selected) {
                    let addList = selectedRows.filter((item: any) => !(checkRowList && checkRowList.length != 0 && checkRowList.some(ele => ele.userId === item.userId)));
                    checkRowList.push(...addList);
                    let allKeys = checkRowList.map(item => item.userId)
                    let newkeys = allKeys.filter(item => !selectedRowKeys.some(ele => ele === item));
                    selectedRowKeys.push(...newkeys);
                } else {
                    if (selectedRows.length == 0) {
                        checkRowList = [],
                            selectedRowKeys = []
                    }
                    // checkRowList = checkRowList.filter(item => checkRowList && checkRowList.length != 0 && checkRowList.some(ele => ele.userId != item.userId));
                }
                this.setState({ checkRowList, selectedRowKeys })
            }

        }
        return (
            <>
                <Form {...formItemLayout} className={styles.partInfo}
                    ref={this.formRef}
                    initialValues={{
                        issuedAmount: this.state.issuedAmount,
                    }}
                >
                    <Form.Item label="可用余额: " className={styles.formItem} >
                        <span>{this.props.cashTotal}</span>
                    </Form.Item>
                    <Form.Item label="发放对象: " className={styles.beMust}>
                        <Button type='primary' onClick={() => this.changeFlag(true)}>选择员工</Button>
                        {this.renderCheckStaff()}
                        {noCheckStaff ? <div className={styles.mustTitle}>请选择发放对象</div> : null}
                    </Form.Item>
                    <Form.Item label="单笔发放金额: " className={styles.formItem} >
                        <Form.Item name='issuedAmount' rules={[{ required: true, message: '请输入单笔发放金额' }]} noStyle>
                            <InputNumber style={{ width: '400px' }} min={0.01} max={200000} onChange={(value: any) => {
                                if (value > 200000) {
                                    value = 200000
                                    message.error('单笔发放金额不能超过200000');
                                    this.setState({ issuedAmount: 200000 })
                                    return false
                                } else {
                                    this.setState({ issuedAmount: value })
                                }
                            }
                            } />
                        </Form.Item>
                        <span className={styles.remarks}>发放给每个员工的金额</span>
                    </Form.Item>
                    <Form.Item label="发放时效: " className={styles.formItem} >
                        <span>立即发放</span>
                    </Form.Item>
                    <Form.Item label="发放原因: " className={styles.formItem} name='issuedReason' rules={[{ required: true, message: '请输入发放原因' }, { max: 50, message: '发放原因不得超过50个字' }]}>
                        <Input.TextArea rows={4} style={{ maxWidth: '400px' }} />
                    </Form.Item>
                    <Form.Item label="审核人: " className={styles.formItem}>
                        <span>无需审核</span>
                    </Form.Item>
                    <Form.Item label="备注: " className={styles.formItem} name='issuedRemark' rules={[{ max: 200, message: '备注不得超过200个字' }]}>
                        <Input.TextArea rows={4} style={{ maxWidth: '400px' }} />
                    </Form.Item>
                </Form>
                <Row>
                    <Col span={12} offset={5} className={styles.displayBtn}>
                        <Button type='primary' onClick={() => this.next()} loading={nextLoading}>下一步</Button>
                    </Col>
                </Row>
                <Modal
                    visible={visible}
                    onCancel={() => this.changeFlag(false)}
                    onOk={() => this.addCheckStaff()}
                    title='选择员工'
                    width={800}
                >
                    <Form layout="inline"
                        ref={this.staffRef}
                    >
                        <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ width: '100%' }}>
                            <Col style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                                <Form.Item label="姓名: " name='realName'>
                                    <Input style={{ width: '120px' }} />
                                </Form.Item>
                                <Form.Item label="手机号: " name='cellphone'>
                                    <Input style={{ width: '120px' }} />
                                </Form.Item>
                                <div>
                                    <Button type='primary' onClick={() => this.query()} style={{ margin: '0 10px' }}>搜索</Button>
                                    <Button type='primary' onClick={() => this.reset()} style={{ margin: '0 10px' }}>重置</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        rowKey={record => record.userId}
                        dataSource={staffDataList}
                        columns={this.columns}
                        onChange={this.onTableChange}
                        pagination={pagination}
                        loading={staffLoading}
                        rowSelection={rowSelection}
                    />
                </Modal>
            </>
        )
    }
}
