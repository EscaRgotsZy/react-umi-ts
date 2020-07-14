import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, message } from 'antd'
import { saveShopCategory, TabType } from '@/services/shop/classify'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
      xs: { span: 4 },
      sm: { span: 4 },
  },
  wrapperCol: {
      xs: { span: 6 },
      sm: { span: 6 },
  },
};


interface UserProp {
  type: any;
  data: any;
  curGrade: number;
  refresh: Function;
  backTab: Function;
}
const ClassifyEdit: React.FC<UserProp> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)// 查询loading


  function handleAdd(){
    form.validateFields()
    .then(async (values)=>{
      let { name, seq } = values
      let params = {
        grade: props.curGrade,
        parentId: props.data.parentId,
        name,
        seq
      }
      let [err] = await saveShopCategory(params)
      if(err)return false;
      message.success('添加成功')
      props.refresh()
    })
    .catch(()=>{})
  }
  function handleEdit(){
    form.validateFields()
    .then(async (values)=>{
      let { name, seq } = values
      let params = {
        id: props.data.id,
        grade: props.curGrade,
        name,
        parentId: props.data.parentId,
        seq
      }
      let [err] = await saveShopCategory(params)
      if(err)return false;
      message.success('编辑成功')
      props.refresh()
    })
    .catch(()=>{})
  }
  function subMitCate() {
    if(props.type === TabType.add){
      handleAdd()
    }
    if(props.type === TabType.edit){
      handleEdit()
    }
    
  }

  function back() {
    props.backTab()
  }

  return (
    <Form {...formItemLayout} form={form}
    initialValues={props.data}
    >
      <Row >
        <Col span={18}>
          <FormItem label="店铺类目: " style={{ marginRight: '10px' }} name="name" rules={[
            {
              required: true,
              message: '请输入店铺类目名称'
            },
            {
              max: 30,
              message: '类目名称不能超过30个字符'
            }
          ]}>
            <Input />
          </FormItem>
        </Col>
        <Col span={18}>
          <FormItem label="次序: " style={{ marginRight: '10px' }} name="seq" rules={[
            {
              pattern: /^[0-9]*$/,
              message: '次序仅支持数字'
            },
          ]}>

            <Input />
          </FormItem>
        </Col>
        <Col span={18} offset={2}>
          <Button type='primary' style={{ margin: '0 15px' }} onClick={back}>返回</Button>
          <Button loading={loading} type='primary' onClick={subMitCate}>{props.type === TabType.add? '提交': '确认编辑'}</Button>
        </Col>
      </Row>
    </Form>
  )
}
export default ClassifyEdit
