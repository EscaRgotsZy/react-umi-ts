
import styles from '../index.less'
import React, { useState, useEffect } from 'react'
import { Spin, Pagination, Input, Form } from 'antd'
import classnames from 'classnames'

import {
  getRenovation,
  RenovationParams,
} from '@/services/shop/renovation'

const { Search } = Input;
interface PageProps{
  handleSel: Function;
  id: number;
}
const Page: React.FC<PageProps> = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, size: 10 })
  const [pageTotal, setPageTotal] = useState(0)
  const [curId, setCurId] = useState('')

  useEffect(() => {
    fetchRenovation();
  }, [pageInfo])

  function search(){
    setPageInfo({page: 1, size: 10})
  }

  async function fetchRenovation() {
    let title = form.getFieldValue('title')
    let params: RenovationParams = {
      page: pageInfo.page,
      size: pageInfo.size,
      pageType: 0,// 页面类型 0：普通页面 、1：首页
      status: 2,// 状态 1：未发布、2：已发布
      title,//页面标题
    }
    setLoading(true)
    let res = await getRenovation(params)
    setLoading(false)
    let { records, total } = res;
    setPageTotal(total)
    setList(records)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form layout='inline' form={form}>
          <Form.Item name="title">
            <Search
              style={{ width: 200, marginBottom: 10 }}
              placeholder="请输入关键字"
              enterButton="搜索"
              onSearch={search} />
          </Form.Item>
        </Form>

      </div>
      <Spin spinning={loading}>
      <div className={styles.box}>
        <ul>
          <li><span>页面名称</span></li>
          {
            list.map((v:any)=>(
              <li key={v.id}><span className={styles['title-name']}>{v.title}</span>
              <span className={classnames({
                [styles['link']]: true,
                [styles.active]: v.id === curId
              })} onClick={()=>{
                setCurId(v.id)
                props.handleSel({id: v.id, name: v.title})
              }}>{v.id === curId ? '已选':'选择连接'}</span></li>
            ))
          }
        </ul>
      </div>
      <div style={{textAlign: 'right', marginTop: 10}}>
      <Pagination
        total={pageTotal}
        showQuickJumper
        responsive
        current={pageInfo.page}
        pageSize={pageInfo.size}
        showTotal={total => `共 ${total} 条`}
        onChange={(page, pageSize)=>{
          setPageInfo({page, size: (pageSize as number) })
        }}
      />
      </div>
      </Spin>
    </>
  )
}

export default Page

