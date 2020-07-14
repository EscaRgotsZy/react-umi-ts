
import styles from './new.less'
import React, { useState } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Switch, Input, Button, message } from 'antd'
import Color from '@/components/Color'
import NewUpload from './components/new-upload'
import { addPage, AddPageParams } from '@/services/shop/renovation'



interface NewRenovationProps {
  history: any;
}

const NewRenovation: React.FC<NewRenovationProps> = (props) => {
  const [form] = Form.useForm()
  const [backgroundColor, setBackgroundColor] = useState('#f4f4f4')
  const [titleCharNum, setTitleCharNum] = useState(0)
  const [descCharNum, setDescCharNum] = useState(0)
  const [loading, setLoading] = useState(false)


  async function save() {

    form.validateFields()
      .then(async (values) => {
        let { home, title, backgroundColor, desc, shareUrl } = values
        if(!title)return message.error('请输入标题')
        setLoading(true)
        let params: AddPageParams = {
          backColor: backgroundColor,// 背景颜色
          description: desc,// 分享描述
          pageType: home? 1: 0,// 页面类型 0：普通页面 、1：首页	
          shareUrl,// 分享图片
          title,// 页面标题
          // id: number;
          // layout: string;// 页面布局 组件json串{[key:list<value>]}	
          // status: number;// 状态 1：未发布、2：已发布
        }
        let [err, data] = await addPage(params);
        setLoading(false)
        if(err)return false;
        let { id } = data;
        props.history.replace(`/shop/renovation/${id}/add`)

      })
  }
  return (
    <PageHeaderWrapper >
      <Card>
        <Form
          form={form}
          initialValues={{
            home: false,
            desc: '',
            title: '',
            backgroundColor: backgroundColor,
          }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item name='home' label='首页' valuePropName={'checked'}>
            <Switch />
          </Form.Item>
          <Form.Item label={'页面标题'} required>
            <Form.Item name="title" noStyle>
              <Input style={{ width: 280 }} onChange={(e: any) => setTitleCharNum(e.target.value.length)} maxLength={15} suffix={`${titleCharNum}/15`} />
            </Form.Item>
            <span className={styles.tip}>作为页面名称和分享标题，最多15个字</span>
          </Form.Item>
          <Form.Item name="backgroundColor" label={'背景颜色'} valuePropName='checked'>
            <Color defaultColor={backgroundColor} setColor={(hex: string) => {
              setBackgroundColor(hex)
              form.setFieldsValue({ backgroundColor: hex })
            }} />
          </Form.Item>

          <Form.Item label='页面分享描述'>
            <Form.Item name="desc" noStyle>
              <Input style={{ width: 490 }} onChange={(e: any) => setDescCharNum(e.target.value.length)} maxLength={30} suffix={`${descCharNum}/30`} />
            </Form.Item>
            <span className={styles.tip}>展示在分享信息中,最多30字</span>
          </Form.Item>

          <Form.Item label={'页面分享图片'}>
            <Form.Item name="shareUrl" noStyle>
              <NewUpload setImg={(url:string)=>{
                form.setFieldsValue({
                  shareUrl: url
                })
              }}/>
            </Form.Item>
            <span className={styles.tip1}>建议尺寸400x400</span>
          </Form.Item>

        </Form>
        <div style={{ paddingLeft: '20%', marginTop: 100 }}>
          <Button loading={loading} onClick={save}>下一步</Button>
        </div>
      </Card>
    </PageHeaderWrapper >
  )
}

export default NewRenovation;