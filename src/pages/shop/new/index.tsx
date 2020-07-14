import styles from './index.less'
import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, message } from 'antd'
import { addVisualShop } from '@/services/shop/new'
import SingleUpload from '@/components/SingleUpload'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
};

interface NewShopParams{
  history: any
}
const NewShop: React.FC<NewShopParams> = (props) => {
  const [form] = Form.useForm();
  const [logoPic, setLogoPic] = useState<string>('')
  const [backgroundPic, setBackgroundPic] = useState<string>('')


  function saveShopInfo() {
    form.validateFields()
      .then(async (values) => {
        let { shopName } = values
        if(!backgroundPic)return message.warn('请上传店铺背景图片');
        if(!logoPic)return message.warn('请上传店铺logo');
        let query = { shopName, backgroundPic, logoPic }
        let [err] = await addVisualShop(query)
        if(err)return false;
        props.history.push('/home')
      })
      .catch(errorInfo => {

      });

  }


  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Form {...formItemLayout} form={form}>
          <FormItem label="店铺名称: " name="shopName" rules={[
            {
              required: true,
              message: '请输入店铺名称',
            },
          ]}>
            <Input />
          </FormItem>
          <FormItem label="店铺Logo: " name="logo">
            <SingleUpload setImg={(url: string) => {
              setLogoPic(url)
            }} />
          </FormItem>
          <FormItem label="店铺背景图: " name="bg">
            <SingleUpload setImg={(url: string) => {
              setBackgroundPic(url)
            }} />
          </FormItem>
        </Form>
        <div className={styles.btn}>
          <Button type='primary' onClick={saveShopInfo}>上传</Button>
        </div>
      </Card>

    </PageHeaderWrapper>
  )
}

export default NewShop;