import styles from '../new.less'
import React, { useState, useEffect } from 'react'
import { Card, Form, Modal, Switch, Input, Upload, Button, message } from 'antd'
import { putPage, getPage } from '@/services/shop/renovation'
import Color from '@/components/Color'
import NewUpload from './new-upload'

interface EditLayerProps {
  id: number;
  visible: boolean;
  onClose: Function;
  onOk: Function;
}
const EditLayer: React.FC<EditLayerProps> = (props) => {
  let { id, visible, onClose, onOk } = props
  const [form] = Form.useForm()
  const [backgroundColor, setBackgroundColor] = useState('')
  const [titleCharNum, setTitleCharNum] = useState(0)
  const [descCharNum, setDescCharNum] = useState(0)
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPageInfo()
  }, [])

  async function fetchPageInfo(): Promise<false | void> {
    let res = await getPage({ id });
    if (!res) return false;
    let { pageInfo } = res;
    let { backColor, title, description, pageType, shareUrl } = pageInfo
    backColor = backColor || '#f4f4f4';
    setBackgroundColor(backColor)
    setTitleCharNum(title.length)
    setDescCharNum(description.length)
    setImg(shareUrl)
    form.setFieldsValue({
      home: pageType === 1,
      title,
      backgroundColor: backColor,
      desc: description,
      shareUrl,
    })
  }


  async function save() {

    form.validateFields()
      .then(async (values) => {
        let { home, title, backgroundColor, desc, shareUrl } = values
        if (!title) return message.error('请输入标题')
        setLoading(true)
        let params: any = {
          id,
          backColor: backgroundColor,// 背景颜色
          description: desc,// 分享描述
          pageType: home ? 1 : 0,// 页面类型 0：普通页面 、1：首页	
          shareUrl,// 分享图片
          title,// 页面标题
        }
        let [err] = await putPage(params);
        setLoading(false)
        if (err) return false;
        onOk()
      })
  }
  return (
    <Modal
      title="页面基本信息"
      width={800}
      visible={visible}
      confirmLoading={loading}
      onOk={() => save()}
      onCancel={() => onClose()}
    >
      <Form
        form={form}
        initialValues={{
          home: false,
          desc: '',
          title: '',
          backgroundColor: backgroundColor,
        }}

        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
      >
        <div className={styles.modal}>
          <Form.Item name='home' label='首页' valuePropName={'checked'}>
            <Switch disabled/>
          </Form.Item>
          <Form.Item name="title" label={'页面标题'} help="作为页面名称和分享标题，最多15个字" required>
            <Input style={{ width: 280 }} onChange={(e: any) => setTitleCharNum(e.target.value.length)} maxLength={15} suffix={`${titleCharNum}/15`} />
          </Form.Item>
          <Form.Item name="backgroundColor" label={'背景颜色'} valuePropName='checked'>
            <Color defaultColor={backgroundColor} setColor={(hex: string) => {
              setBackgroundColor(hex)
              form.setFieldsValue({ backgroundColor: hex })
            }} />
          </Form.Item>

          <Form.Item name="desc" label='页面分享描述' help="展示在分享信息中,最多30字">
            <Input style={{ width: 490 }} onChange={(e: any) => setDescCharNum(e.target.value.length)} maxLength={30} suffix={`${descCharNum}/30`} />
          </Form.Item>

          <Form.Item label={'页面分享图片'}>
            <Form.Item name="shareUrl" noStyle>
              <NewUpload value={img} setImg={(url: string) => {
                form.setFieldsValue({
                  shareUrl: url
                })
              }} />
            </Form.Item>
            <span className={styles.tip1}>建议尺寸400x400</span>
          </Form.Item>


        </div>
      </Form>
    </Modal>
  )
}

export default EditLayer;