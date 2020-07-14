
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Modal, Spin, Select, Input, Form } from 'antd'
import { getProductTagAll, getProductGroupTagAll } from '@/services/goods/tag'
import classnames from 'classnames'

const { Search } = Input;
const { Option } = Select;

interface TabProps {
  visible: boolean;
  handleOk: Function;
  handleClose: Function;
}
const TabLayer: React.FC<TabProps> = (props) => {
  let { visible, handleOk, handleClose } = props;
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [group, setGroup] = useState([])
  const [curIds, setCurIds] = useState<any[]>([])

  useEffect(() => {
    fetchGroupTag();
    fetchTag()
  }, [visible])

  async function fetchTag() {
    let { groupId = '', name = '' } = form.getFieldsValue(['groupId', 'name'])

    setLoading(true)
    let params:any = {
      name
    }
    if(groupId){
      params.groupId = groupId;
    }
    let [err, data] = await getProductTagAll(params)
    setLoading(false)
    data = Array.isArray(data) ? data : [];
    if (err) return false;
    setList(data.map((v: any) => {
      return {
        key: v.id,
        id: v.id,
        name: v.name
      }
    }))

  }
  async function fetchGroupTag() {
    let [err, data] = await getProductGroupTagAll();
    if (err) return false;
    data = Array.isArray(data) ? data : [];
    setGroup(data.map((v: any) => {
      return {
        key: v.id,
        id: v.id,
        name: v.name
      }
    }))
  }


  return (
    <Modal
      title={'选择商品标签'}
      onOk={() => {
        handleOk(curIds)
      }}
      onCancel={() => {
        handleClose()
      }}
      width={900}
      visible={visible}
      getContainer={false}
    >
      <div className={styles['style-modal']}>


        <Form layout='inline' form={form} style={{ display: 'flex', justifyContent: 'space-between' }}
          initialValues={{
            groupId: 0
          }}
        >
          <Form.Item name="groupId" label="标签组">
            <Select style={{ width: 150 }}>
              <Option value={0} >全部</Option>
              {
                group.map((v: any) => <Option value={v.id} key={v.id}>{v.name}</Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item name="name">
            <Search
              style={{ width: 200, marginBottom: 10 }}
              placeholder="请输入关键字"
              enterButton="搜索"
              onSearch={() => {
                fetchTag();
              }} />
          </Form.Item>
        </Form>

        <Spin spinning={loading}>
          <div className={styles.box}>
            <ul>
              {
                list.map((v: any) => {
                  let cur: any = {
                    id: v.id,
                    name: v.name,
                  }
                  let isSel = !!curIds.filter((o: any) => o.id === v.id).length// 当前是否已选
                  return (
                    <li key={v.id}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className={styles['title-name']}>{v.name}</span>
                      </div>
                      <span className={classnames({
                        [styles['link']]: true,
                        [styles.active]: isSel
                      })} onClick={() => {
                        let tmpl = []
                        if (isSel) {// 已经选了 那就取消
                          tmpl = curIds.filter((o: any) => o.id !== v.id)
                        } else {
                          tmpl = [...curIds, cur]
                        }
                        setCurIds(tmpl)
                      }}>{isSel ? '已选' : '选择连接'}</span></li>
                  )
                })
              }
            </ul>
          </div>
        </Spin>
      </div>
    </Modal>
  )
}

export default TabLayer