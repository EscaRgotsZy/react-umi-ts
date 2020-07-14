import styles from './index.less';
import React, { Component,} from 'react';
import { Card, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  getInvoiceSettingInfo
} from '@/services/cash/invoice_records'
interface UserState {
  loading: boolean;
  id: any;
  dataList: any;
};
interface UserProp {
  match: any;
};
export default class InvoiceSettingDetail extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      loading: false,
      id: this.props.match.params.id,
      dataList: {},
    }
    }
    componentDidMount() {
      this.state.id && this.getDataInfo();
    }
    //获取详情数据
    getDataInfo = async():Promise<any> => {
      let { id }= this.state;
      this.setState({ loading: true });
      let res = await getInvoiceSettingInfo(id); 
      this.setState({ loading: false });
      if (!res) return false;
      let { data } = res || {};
      this.setState({
        dataList: data,
      })
    }
    render() {
      let { dataList } = this.state
        return (
          <PageHeaderWrapper>
            <Card title="发票详情" className={styles.cardStyle}>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>发票类型</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.typeId=='1'? "增值税专用发票" : "普通发票"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>发票抬头</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.invoiceTitle}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>纳税人识别号</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.taxpayerNo ? dataList.taxpayerNo : "无"}</Col>
              </Row>
            </Card>
            { dataList && dataList.typeId=='1' &&
            <Card title="基本信息" className={styles.cardStyle}>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>开户银行</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.openBank ? dataList.openBank : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>银行账户</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.bankAccount ? dataList.bankAccount : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>开户银行名称</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.bankName ? dataList.bankName : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>注册场所地址</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.registerAddress ? dataList.registerAddress : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>注册固定电话</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.registerPhone ? dataList.registerPhone : "无"}</Col>
              </Row>
            </Card>
            }
            <Card title={`收货信息`}  className={styles.cardStyle}>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>收货姓名</Col>
                <Col span={20} style={{paddingRight:'20px'}} className={styles.colStyleCon}>{dataList && dataList.receiveName ? dataList.receiveName : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>联系电话</Col>
                <Col span={20} style={{paddingRight:'20px'}} className={styles.colStyleCon}> {dataList && dataList.receivePhone ? dataList.receivePhone : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>收货地址</Col>
                <Col span={20} className={styles.colStyleCon}>{dataList && dataList.receiveAddress ? dataList.receiveAddress : "无"}</Col>
              </Row>
            </Card>
          </PageHeaderWrapper>
        )
    }
}