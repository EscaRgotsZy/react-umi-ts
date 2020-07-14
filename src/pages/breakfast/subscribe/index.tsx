import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, TimePicker, Form, message, Select, Switch, Button } from 'antd';
import moment from 'moment';
import { getTask, putTask } from '@/services/breakfast/subscribe'

const format = 'HH:mm';
const FormItem = Form.Item;
const { Option } = Select;

const Subscribe = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [taskId, setTaskId] = useState(1);// 任务id


  useEffect(() => {
    getData()
  }, [])

  async function getData():Promise<false | void> {
    let res = await getTask()
    if (!res) return false;
    let { executeDate, executeTime, id, isEnable } = res;
    form.setFieldsValue({
      isEnable: !!isEnable,
      integers: executeDate.split(','), executeTime: moment(executeTime, format)
    })
    setTaskId(id)
  }
  function save() {
    form.validateFields(['isEnable', 'integers', 'executeTime'])
    .then(async (values)=>{
      let { executeTime, integers, isEnable } = values
      let params = {
        id: taskId,
        executeTime: moment(executeTime).format(format)+':00',
        integers,
        isEnable: isEnable?1:0
      }
      setLoading(true)
      let res = await putTask(params)
      setLoading(false)
      if(!res)return false;
      message.success('编辑成功')
    })
    .catch(()=>{})
  }


  return (
    <PageHeaderWrapper>
      <Card>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} form={form}>
          <FormItem label="功能开启" name="isEnable" rules={[
            { required: true, message: '请选择是否开启' },
          ]} valuePropName="checked">
            <Switch checkedChildren="开" unCheckedChildren="关" />
          </FormItem>
          <FormItem label="被推送的用户">
            <span>已开启早餐预约功能的员工</span>
          </FormItem>
          <FormItem label="推送时间" name="integers" rules={[
            { required: true, message: '请选择推送时间' },
          ]}>
            <Select
              mode="multiple"
              style={{ width: '300px' }}
              placeholder="请选择"
            >
              <Option value={'1'}>周一</Option>
              <Option value={'2'}>周二</Option>
              <Option value={'3'}>周三</Option>
              <Option value={'4'}>周四</Option>
              <Option value={'5'}>周五</Option>
              <Option value={'6'}>周六</Option>
              <Option value={'7'}>周天</Option>
            </Select>
          </FormItem>
          <FormItem label="几点推送" name="executeTime" rules={[
            { required: true, message: '请选择几点推送时间' },
          ]}>
            <TimePicker format={format} />
          </FormItem>
          <FormItem wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" style={{ marginTop: 50 }} onClick={save} loading={loading}>提交</Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Subscribe