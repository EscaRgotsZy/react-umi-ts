import React, { Component,} from 'react';
import { Form, Row, Col, Input, Select, Button, Divider } from 'antd';
import { getPageQuery } from '@/common/utils'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  addInvoiceTitleParams,
  addInvoiceTitle
} from '@/services/cash/invoice_records'
interface UserState {
  loading: boolean;
  c: any;
  typeId: string | number;
};
interface UserProp {
  history: any;
  match: any;
};
const { Option } = Select;
const FormItem = Form.Item;
export default class BillSetting extends Component<UserProp, UserState> {
  formRef: React.RefObject<any>;
  constructor(props: UserProp) {
    super(props);
    this.formRef = React.createRef();
      this.state = {
        loading: false,
        c: getPageQuery().c || '',
        typeId: '',
      }
  }
  // 取消
  cancleAsb = () => {
    if(this.state.c){
      window.close();
    }else{
      this.props.history.goBack()
    }
  }
  //发票类型
  changeInvoiceType = (value:any) => {
    this.setState({
      typeId: value
    })
  }
  // 确定
  handleSubmit = () => {
    this.formRef.current.validateFields().then(( values:any ):any => {
      let { 
        typeId, 
        invoiceTitle, 
        taxpayerNo, 
        openBank, 
        bankAccount,
        bankName,
        registerAddress,
        registerPhone,
        receiveName,
        receivePhone,
        receiveAddress, 
      } = values;
      let query:addInvoiceTitleParams = {
        typeId, 
        invoiceTitle, 
        taxpayerNo, 
        openBank, 
        bankAccount,
        bankName,
        registerAddress,
        registerPhone,
        receiveName,
        receivePhone,
        receiveAddress,
      }
      this.saveCommit(query)
    }).catch((err: Error) => {});
  }
    // 新增
  saveCommit = async (query:any):Promise<any> => {
    let { c } = this.state
    await addInvoiceTitle( query );
    this.formRef.current.resetFields();
    if( c == '1'){
      window.close()
    }else{
      this.props.history.goBack()
    }
  }
 
  render(){
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    return (
      <PageHeaderWrapper>
        <Form 
          ref={this.formRef}
          initialValues={{
            typeId: 2
          }}
          {...formItemLayout} 
        >
          <div style={{margin:'30px auto',paddingBottom:'40px',background:'#fff'}}>
            <div style={{padding:'20px',marginBottom:'50px',borderBottom:'1px solid #e8e8e8',color:'#333',fontSize:'18px',fontWeight:'bold'}}>发票抬头</div>
            <FormItem 
              label="发票类型："
              name='typeId'
              rules={[
                {
                  required: true,
                  message: '请选择发票类型',
                }
              ]}
            >
              <Select onChange={this.changeInvoiceType}>
                <Option value={1}>增值税专用发票</Option>
                <Option value={2}>普通发票</Option>
              </Select>
            </FormItem>
            <FormItem 
              label="发票抬头："
              name='invoiceTitle'
              rules={[
                {
                  required: true,
                  message: '请填写发票抬头',
                }
              ]}
            >
              <Input placeholder="请填写发票抬头" maxLength={40}/>
            </FormItem>
            <FormItem 
              label="纳税人识别号："
              name='taxpayerNo'
              rules={[
                {
                  required: true,
                  message: '请填写纳税人识别号',
                }
              ]}
            >
              <Input placeholder="请填写纳税人识别号码" maxLength={30}/>
            </FormItem>
            
          </div>
          {/* 基本信息 */}
          {this.state.typeId == 1 &&
          <div style={{margin:'30px auto',paddingBottom:'40px',background:'#fff'}}>
            <div style={{padding:'20px',marginBottom:'50px',borderBottom:'1px solid #e8e8e8',color:'#333',fontSize:'18px',fontWeight:'bold'}}>基本信息</div>
            <FormItem 
            label="开户银行："
            name='openBank'
            rules={[
              {
                required: true,
                message: '请输入开户银行',
              }
            ]}
          >
            <Input placeholder="例如：中国农业银行" maxLength={50}/>
          </FormItem>
            <FormItem 
              label="银行账户："
              name='bankAccount'
              rules={[
                {
                  required: true,
                  message: '请输入银行账户',
                }
              ]}
            >
              <Input placeholder="请填写银行账户" maxLength={50}/>
            </FormItem>
            <FormItem 
              label="开户银行名称："
              name='bankName'
              rules={[
                {
                  required: true,
                  message: '请填写开户支行名称',
                }
              ]}
            >
              <Input placeholder="请填写开户支行名称" maxLength={80}/>
            </FormItem>
            <FormItem 
              label="注册场所地址："
              name='registerAddress'
              rules={[
                {
                  required: true,
                  message: '请填写税务登记上的地址',
                }
              ]}
            >
              <Input placeholder="请填写税务登记上的地址" maxLength={200}/>
            </FormItem>
            <FormItem label="注册固定电话：" required={true}> 
              <FormItem 
                noStyle
                name='registerPhone' 
                rules={[
                  {
                    required: true,
                    pattern:/0\d{2,3}-\d{7,8}(-\d{1,6})?/,
                    message: '请输入正确格式固定电话，(0开头，分机号码可选填)',
                  }
                ]}
              >
                <Input placeholder="请填写与税控机上记录一致的电话，以便认证"/>
              </FormItem>
              <span style={{color:'orange'}}>格式：0xx(0xxx)-xxxxxxx(xxxxxxxx)【以0开头，分机号可填可不填】</span>
            </FormItem>
          </div>
          }
          {/* 收货信息 */}
          <div style={{margin:'30px auto',paddingBottom:'40px',background:'#fff'}}>
            <div style={{padding:'20px',marginBottom:'50px',borderBottom:'1px solid #e8e8e8',color:'#333',fontSize:'18px',fontWeight:'bold'}}>收货信息</div>
            <FormItem 
              label="收货姓名：" 
              name='receiveName'
              rules={[
                {
                  required: true,
                  message: '请输入收货姓名',
                }
              ]}
            >
              <Input placeholder="请输入收货姓名" maxLength={15}/>
            </FormItem>
            <FormItem 
              label="联系电话："
              name='receivePhone'
              rules={[
                {
                  required: true,
                  pattern:/^1[3456789]\d{9}$/,
                  message: '请输入正确格式的收货人手机号',
                }
              ]}
            >
              <Input placeholder="请输入收货人手机号"/>
            </FormItem>
            <FormItem 
              label="收货地址："
              name='receiveAddress'
              rules={[
                {
                  required: true,
                  message: '请输入收货地址',
                }
              ]}
            >
              <Input placeholder="请输入收货地址" maxLength={200} />
            </FormItem>
          </div>
        </Form>
        <Divider dashed />
        <Row>
          <Col span={24} style={{ display: 'flex', margin: '30px', justifyContent: 'center' }}>
            <Button onClick={() => this.cancleAsb()} type='primary'>取消</Button>
            <Button onClick={() => this.handleSubmit()} type='primary' style={{ marginLeft: '20px' }} >新增</Button>
          </Col>
        </Row>
      </PageHeaderWrapper>
    )
  }
}