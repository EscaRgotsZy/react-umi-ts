import React, { useState, useEffect, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Button, message, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { getAfterSaleListById, addAfterSaleList, putAfterSaleList } from '@/services/shop/aftermarket'


const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
    sm: { span: 12 },
  },
};

const Aftermarket: React.FC<any> = (props) => {
  const [list, setList] = useState([{}])
  const [form] = Form.useForm();

  const [tempId, setTempId] = useState(null)// 编辑id

  useEffect(()=>{
    // 编辑 or 复制新增
    if(props.match.params.id || props.location.query.id){
      getAfterSale(!!props.location.query.id)
    }
  }, [])

  async function getAfterSale(isAdd:boolean){
    let res = await getAfterSaleListById({id: props.match.params.id})
    if(res){
      let { id, items, name } = res;
      !isAdd && setTempId(id)
      setList(items)
      let item = {};
      items.forEach((v:any, i:number)=>{
        item[`title${i}`] = v.title;
        item[`content${i}`] = v.content
      })
      form.setFieldsValue({
        name: name,
        ...item,
      })
    }
  }

  // 保存
  function handleSave() {
    form.validateFields()
      .then(async (values) => {
        let items = list.map((_, index) => {
          return {
            title: values[`title${index}`],
            content: values[`content${index}`]
          }
        })
        let params = {
          name: values.name,
          items
        }
        let [err] = await addAfterSaleList(params)
        if(err)return false;
        props.history.goBack()
      })
      .catch(() => { })
  }
  // 编辑
  function handleEdit() {
    form.validateFields()
      .then(async (values) => {
        let items = list.map((v:any, index) => {
          if(v.id){// 编辑
            return {
              id: v.id,
              title: values[`title${index}`],
              content: values[`content${index}`]
            }
          }else{
            return {
              title: values[`title${index}`],
              content: values[`content${index}`]
            }
          }
        })
        let params = {
          name: values.name,
          items,
          id: tempId
        }
        
        let [err] = await putAfterSaleList(params)
        if(err)return false;
        props.history.goBack()
      })
      .catch(() => { })
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Form layout="inline" {...formItemLayout} form={form}>
          <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ padding: "20px 0", width: '100%' }}>
            <Col md={24} sm={24}>
              <FormItem label="模版标题：" name='name' rules={[
                { required: true, message: '请填写模版标题0～50字' },
              ]}>
                <Input placeholder="模版标题0～50" style={{ width: "500px" }} maxLength={50} />
              </FormItem>
            </Col>
          </Row>
          {
            list.map((value, index) => {
              return (
                <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ padding: "10px 0", width: '100%' }} key={index}>
                  <Col md={24} sm={24}>
                    <FormItem label={'项目标题'} name={`title${index}`} rules={[
                      { required: true, message: '请填写项目标题0～50字' },
                    ]}>
                      <Input placeholder="项目标题0～50" style={{ width: "500px" }} maxLength={50} />
                    </FormItem>
                  </Col>
                  <Col md={24} sm={24} style={{ padding: "10px 0", width: '100%' }}>
                    <FormItem label={'项目内容'} name={`content${index}`} rules={[
                      { required: true, message: '请填写项目内容0～500字' },
                    ]}>
                      <TextArea allowClear rows={5} placeholder="项目内容0～500" style={{ width: "500px" }} maxLength={500} />
                    </FormItem>
                  </Col>
                </Row>
              )
            })
          }
        </Form>

        <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ padding: "10px 0", width: '100%' }}>
          <Col md={4} sm={4}></Col>
          <Col md={20} sm={20}>
            <FormItem label="">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setList(list.concat({}))}>添加售后项目</Button>
            </FormItem>
          </Col>
        </Row>

        <Divider dashed />

        <Row>
          <Col span={24} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
            <Button onClick={() => props.history.goBack()} type='primary'>取消</Button>
            {
              tempId?
              <Button onClick={handleEdit} type='primary' style={{ marginLeft: '20px' }} >确认编辑</Button>
              :
              <Button onClick={handleSave} type='primary' style={{ marginLeft: '20px' }} >确定</Button>
            }
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Aftermarket
