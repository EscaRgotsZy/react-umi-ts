import styles from './index.less';
import React, { Component,} from 'react';
import { Card, Row, Col} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { 
  getInvoiceInfo
} from '@/services/cash/invoice_records';
interface UserState {
  loading: boolean;
  orderNo: any;
  invoiceStatusList:Array<any>;
  data: any;
  invoiceData: any;
};
interface UserProp {
  match: any;
};
export default class InvoiceDetail extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      loading: false,
      orderNo : this.props.match.params.orderNo,
      data: {},
      invoiceData: {},
      invoiceStatusList: [ "待审核","审核通过","开票成功","已发货","已取消","未通过" ],
    }
  }
    componentDidMount() {
      this.state.orderNo && this.getDataInfo();
    }
    //获取详情数据
    getDataInfo = async():Promise<any> => {
      let orderNo = this.state.orderNo;
      this.setState({ loading: true });
      let res = await getInvoiceInfo(orderNo);  
      this.setState({ loading: false })
      if (!res) return false;
      let { data } = res || {};
      let invoiceData = data.invoice || {}
      this.setState({
        data,
        invoiceData,
      })
    }
    render() {
        let { data, invoiceData, invoiceStatusList, } = this.state
        return (
          <PageHeaderWrapper>
            <Card className={styles.cardStyle}>
              <div className={styles.divStyle}>
                <span className={styles.spanStyle}>申请信息</span>
                <span className={styles.spanStyle}></span>
              </div>
              <Row>
                <Col span={4} className={styles.colStyle}>申请时间</Col>
                <Col span={8}>{data && data.createTime ? data.createTime : "无"}</Col>
                <Col span={4} className={styles.colStyle}>申请人</Col>
                <Col span={8}>{data && data.applyName ? data.applyName : "无"}</Col>
              </Row>
            </Card>
            {/* title={`发票信息（ ${invoiceStatusList[(data&&data.invoiceStatus)-1]} ）`} */}
            <Card className={styles.cardStyle}>
              <div className={styles.divStyle}>
                <span className={styles.spanStyle} style={{paddingRight:"10%"}}>发票信息</span>
                <span className={styles.spanStyle}>{invoiceStatusList[(data&&data.invoiceStatus)-1]}</span>
              </div>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}>开票日期</Col>
                <Col span={8} className={styles.colStyleCon}>{data && data.invoicingTime ? data.invoicingTime : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>发票类型</Col>
                <Col span={8} className={styles.colStyleCon}>{invoiceData && invoiceData.typeId== 1 ? "增值税专用发票" : "普通发票"}</Col>
                <Col span={4} className={styles.colStyle}>发票内容</Col>
                <Col span={8} className={styles.colStyleCon}>{data && data.invoiceContent ? data.invoiceContent : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}>发票金额</Col>
                <Col span={8}>{data && data.amount ? data.amount : "0"}</Col>
                <Col span={4} className={styles.colStyle}>备注</Col>
                <Col span={8} className={styles.colStyleCon}>{data && data.invoiceRemark ? data.invoiceRemark : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>发票抬头</Col>
                <Col span={8} className={styles.colStyleCon}>{data && data.invoiceName}</Col>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>纳税人识别号</Col>
                <Col span={8} className={styles.colStyleCon}>{invoiceData && invoiceData.taxpayerNo ? invoiceData.taxpayerNo : "无"}</Col>
              </Row>
              {invoiceData && invoiceData.typeId == 1 && 
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}>开户银行</Col>
                <Col span={8} className={styles.colStyleCon}>{invoiceData && invoiceData.openBank ? invoiceData.openBank : "无"}</Col>
                <Col span={4} className={styles.colStyle}>银行账户</Col>
                <Col span={8} className={styles.colStyleCon}>{invoiceData && invoiceData.bankAccount ? invoiceData.bankAccount : "无"}</Col>
              </Row>
              }
              {invoiceData && invoiceData.typeId == 1 &&
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>开户银行名称</Col>
                <Col span={8} className={styles.colStyleCon}>{invoiceData && invoiceData.bankName ? invoiceData.bankName : "无"}</Col>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>注册场所地址</Col>
                <Col span={8} className={styles.colStyleCon}>{invoiceData && invoiceData.registerAddress ? invoiceData.registerAddress : "无"}</Col>
              </Row>
              }
              {invoiceData && invoiceData.typeId == 1 &&
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>注册固定电话</Col>
                <Col span={20} className={styles.colStyleCon}>{invoiceData && invoiceData.registerPhone ? invoiceData.registerPhone : "无"}</Col>
              </Row>
              }
            </Card>
            <Card className={styles.cardStyle}>
              <div className={styles.divStyle}>
                <span className={styles.spanStyle} style={{paddingRight:"10%"}}>收货信息</span>
                <span className={styles.spanStyle}>{data&&data.invoiceStatus=='3'? '待发货' :data&&data.invoiceStatus=='4'?'待收货': ''}</span>
              </div>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>收货姓名</Col>
                <Col span={20} style={{paddingRight:'20px'}} className={styles.colStyleCon}>{invoiceData && invoiceData.receiveName ? invoiceData.receiveName : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>联系电话</Col>
                <Col span={20} style={{paddingRight:'20px'}} className={styles.colStyleCon}> {invoiceData && invoiceData.receivePhone ? invoiceData.receivePhone : "无"}</Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={4} className={styles.colStyle}><span className={styles.colorRed}>*</span>收货地址</Col>
                <Col span={20} className={styles.colStyleCon}>{invoiceData && invoiceData.receiveAddress ? invoiceData.receiveAddress : "无"}</Col>
              </Row>
            </Card>
          </PageHeaderWrapper>
            
        )
    }
}