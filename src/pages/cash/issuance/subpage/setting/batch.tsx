import React, { Component, } from 'react';
import { Button, Form, Input, Row, Col, Menu, Upload, Dropdown, message } from 'antd';
import styles from './index.less';
import { UploadOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons';
import { handleUploadProps, downloadFile } from '@/common/utils';
interface UserProp {
    nextSteps: any;
    cashTotal: any;
    IssuanDataInfo: any;

}
interface UserState {
    nextLoading: boolean;
    visible: boolean;
    staffLoading: boolean;
    noCheckFile: boolean;
    downLoading: boolean;
    stepsCurrent: number;
    pageInfo: any;
    total: any;
    IssuanDataInfo: any;
    batchDataInfo: any;
}
export default class Batch extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props)
        this.formRef = React.createRef();
        this.state = {
            nextLoading: false,
            stepsCurrent: 0,
            visible: false,
            staffLoading: false,
            pageInfo: {
                page: 1,
                size: 10
            },
            total: '',
            noCheckFile: false,    //  未选员工提示信息
            downLoading: false,
            IssuanDataInfo: this.props.IssuanDataInfo,
            batchDataInfo: this.props.IssuanDataInfo,
        }
    }

    next = () => {
        let { batchDataInfo } = this.state;
        if (!batchDataInfo.resultKey) {
            message.error('请选择批量导入文件');
            return false
        }
        let { failure, resultKey, fileName, success, total } = batchDataInfo;
        if (failure > 0) {
            message.error('批量上传文件存在失败记录，请确认后从新上传')
            return false
        }
        this.formRef.current.validateFields().then((values: any): any => {
            let batchDataInfo = {
                issuedRemark: values.issuedRemark,
                resultKey,
                failure,
                fileName,
                success,
                total,

            }
            this.props.nextSteps(batchDataInfo, 1);
        }).catch((err: Error) => { })
    }
    beforeUpload = (file: any) => {
        const isJpgOrPng = file.name.match(/\.xl(s[xmb]|t[xm]|am)$/);
        if (!isJpgOrPng) {
            message.error('该上传仅支持限EXCEL文件!');
            return false
        }
        return isJpgOrPng
    }
    handleChange = (info: any) => {
        if (info.file.status === 'done') {
            let res = info.file.response || {}
            if (res.code === 200) {
                if (res.data) {
                    message.success(`${res.message}`);
                    let { fileName, total, failure, success, resultKey } = res.data;
                    let batchDataInfo = {
                        fileName, total, failure, success, resultKey,
                    }
                    this.setState({ batchDataInfo })
                } else {
                    message.warn(`${res.message}`);
                }
            } else {
                message.error(res.message || '导入失败')
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败`);
        }
    }
    // 下载导入模板
    batchImport = ({ key }: any) => {
        if (key == 2) {
            window.open('/grantExcelTemplate.xlsx')
        }
    }
    // 导出函数
    handleExport = () => {
        let { batchDataInfo: { resultKey = '' }, downLoading } = this.state;
        // if (downLoading) {
        //     message.warn('导出进行中客官莫急~ovo~')
        //     return false
        // }
        this.downloadOrders(resultKey);
        // this.setState({ downLoading: true }, () => {
        //     this.downloadOrders(resultKey);
        // })
    }
    // 下载失败记录
    downloadOrders(query: any) {
        downloadFile(
            {
                url: '/grant/batch-download',
                method: 'GET',
                headers: 'default',
                paramName: 'key',
                param: query,
                fileName: '批量发放失败记录.xlsx'
            }
        )
    }
    render() {
        let { nextLoading, noCheckFile, batchDataInfo } = this.state;
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

        const props: any = {
            ...handleUploadProps('/grant/batch-upload', 'file', 'default', false),
            onChange: this.handleChange,
        };
        return (
            <>
                <Form {...formItemLayout}
                    className={styles.partInfo}
                    ref={this.formRef}
                    initialValues={{
                        issuedRemark: this.state.batchDataInfo.issuedRemark,
                    }}
                >
                    <Form.Item label="可用余额: " className={styles.formItem} >
                        <span>{this.props.cashTotal}</span>
                    </Form.Item>
                    <Form.Item label="发放时效: " className={styles.formItem} >
                        <span>立即发放</span>
                    </Form.Item>
                    <Form.Item label="选择文件: " className={styles.beMust}>
                        <Dropdown overlay={
                            <Menu onClick={this.batchImport}>
                                <Menu.Item key="1">
                                    <Upload {...props} beforeUpload={this.beforeUpload}>
                                        <UploadOutlined /> &nbsp;批量导入
                                    </Upload>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <DownloadOutlined />模板下载
                                </Menu.Item>
                            </Menu>
                        }>
                            <Button>
                                <UploadOutlined /> 批量导入 <DownOutlined />
                            </Button>
                        </Dropdown>
                        <span className={styles.remarks}>限EXCEL文件，不超过30000条且控制在2M内</span>
                        {noCheckFile ? <div className={styles.mustTitle}>请选择发放对象</div> : null}
                        {
                            batchDataInfo && batchDataInfo.failure > 0 &&
                            <ul className={styles.failure}>
                                <li><span className={styles.title}>文件名称 :</span><span>{batchDataInfo && batchDataInfo.fileName}</span></li>
                                <li><span className={styles.title}>验证总数 :</span><span>{batchDataInfo && batchDataInfo.total} 条</span></li>
                                <li><span className={styles.title}>验证成功 :</span><span style={{ color: 'green' }}>{batchDataInfo && batchDataInfo.success} </span>条</li>
                                <li><span className={styles.title}>验证失败 :</span><span style={{ color: 'red' }}>{batchDataInfo && batchDataInfo.failure} </span>条  <span style={{ color: 'blue', cursor: 'pointer' }} onClick={this.handleExport}> 导出失败记录</span>，将源文件存在错误之处修改正确后重新上传</li>
                            </ul>
                        }
                        {batchDataInfo && batchDataInfo.fileName && <div><span className={styles.title}>文件名称 :</span><span>{batchDataInfo && batchDataInfo.fileName}</span></div>}
                    </Form.Item>
                    <Form.Item label="审核人: " className={styles.formItem}>
                        <span>无需审核</span>
                    </Form.Item>
                    <Form.Item label="备注: " className={styles.formItem}
                        name='issuedRemark'
                        rules={[{ max: 200, message: '备注不得超过200个字' }]}
                    >
                        <Input.TextArea rows={4} style={{ maxWidth: '400px' }} />
                    </Form.Item>
                </Form>
                <Row>
                    <Col span={12} offset={5} className={styles.displayBtn}>
                        <Button type='primary' onClick={() => this.next()} loading={nextLoading}>下一步</Button>
                    </Col>
                </Row>
            </>
        )
    }
}