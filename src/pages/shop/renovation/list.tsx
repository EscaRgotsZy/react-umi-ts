
import styles from './list.less'
import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Select, Table, Switch, Input, Tag, Popconfirm, Button } from 'antd'
import { Link } from 'umi'
import { EditOutlined } from '@ant-design/icons'

import { getRenovation, copyRenovation, publishRenovation, delRenovation, RenovationParams, cancelDecorationPage } from '@/services/shop/renovation'
import EditLayer from './components/edit-layer'
import Preview from './components/preview'

const { Search } = Input
const { Option } = Select;






const Status = (record: any) => {
  let { status, pageType } = record;
  return {
    unPublished: status !== 2,
    isHome: pageType === 1,
  }
}
const StatusDom = (props: any) => {
  let { value } = props;
  if (value === 2) {
    return <span>已发布</span>
  }
  return <span style={{ color: '#aaa' }}>未发布</span>
}

interface RenovationProps {
  history: any;
  location: any;
}
const Renovation: React.FC<RenovationProps> = (props) => {
  let { page, size } = props.location.query;
  page = page ? Number(page): 1; 
  size = size ? Number(size): 10; 
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  
  const [list, setList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page, size })
  const [pageTotal, setPageTotal] = useState(0)
  const [showPreView, setShowPreView] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [curEditId, setCurEditId] = useState<number | ''>('');// 当前编辑的id
  const [curPreviewId, setCurPreviewId] = useState<number | ''>('');// 当前预览的id


  useEffect(() => {
    let { pageType, status, title } = props.location.query;
    form.setFieldsValue({
      status: status? Number(status):0,
      pageType: pageType === '1',
      title,
    })
  }, [])

  useEffect(() => {
    getDataList()
  }, [pageInfo])

  function refresh(){
    getDataList()
  }

  function search(){
    setPageInfo({page: 1, size: 10})
  }

  async function getDataList() {
    let { status, pageType, title='' } = form.getFieldsValue(['status', 'pageType', 'title'])
    let params: RenovationParams = {
      page: pageInfo.page,
      size: pageInfo.size,
      pageType: pageType? 1: 0,
      title,
    }
    if(status){
      params.status = status
    }

    props.history.replace({
      query: params
    });

    setLoading(true)
    let res = await getRenovation(params);
    setLoading(false)
    let { total, records } = res;
    setPageTotal(total)
    setList(records)
  }

  async function handlePublish(id:number):Promise<false | void>{
    let [err] = await publishRenovation({id});
    if(err)return false;
    refresh()
  }

  async function handleDel(id:number):Promise<false | void>{
    let [err] = await delRenovation({id})
    if(err)return false;
    refresh()
  }

  async function handleCancel(id:number):Promise<false | void>{
    let [err] = await cancelDecorationPage({id})
    if(err)return false;
    refresh()
  }
 
  async function handleCopy(id:number):Promise<false | void>{
    let [err, data] = await copyRenovation({id});
    if(err)return false;
    props.history.push(`/shop/renovation/${data.id}/add?pageType=${data.pageType}`)
  }
  function onTableChange({ current, pageSize }: any) {
    setPageInfo({ page: current, size: pageSize })
  }
  const columns = [
    {
      title: '页面名称',
      dataIndex: 'title',
      width: 200,
      render: (text: string, record:any)=>{
        return <div className={styles.pageName}>{text} <EditOutlined onClick={()=>{
          setCurEditId(record.id)
          setShowEdit(true)
        }}/></div>
      }
    },
    {
      title: '是否是首页',
      dataIndex: 'isHome',
      render: (text: boolean) => text && <Tag color="cyan">首页</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number) => <StatusDom value={text} />
    },
    {
      title: '最后修改时间',
      dataIndex: 'time',
    },
    {
      title: '操作',
      render: (record: any) => {
        let status = Status(record)
        let id = record.id;
        return (
          <div className={styles.opt}>
            <a onClick={() => {
              setShowPreView(true)
              setCurPreviewId(id)
            }}>预览</a>
            <a onClick={()=> handleCopy(id)}>复制</a>
            {
              status.unPublished && <Link to={`/shop/renovation/${id}/edit`}>编辑</Link>
            }

            {
              status.unPublished && (
                <Popconfirm title="确认发布?" onConfirm={() => handlePublish(id)}>
                  <a>发布</a>
                </Popconfirm>
              )
            }

            {
              (status.unPublished) && (
                <Popconfirm title="确认删除?" onConfirm={() => handleDel(id)}>
                  <a>删除</a>
                </Popconfirm>
              )
            }

            {
              (!status.isHome && !status.unPublished) && (
                <Popconfirm title="确认取消发布?" onConfirm={() => handleCancel(id)}>
                  <a>取消</a>
                </Popconfirm>
              )
            }
          </div>
        )
      }
    },
  ]

  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageInfo.page || 1,
    pageSize: pageInfo.size || 10,
    total: pageTotal,
    showTotal: (t: number) => <div>共{t}条</div>
  }
  return (
    <PageHeaderWrapper
    content={<div></div>}
    extraContent={<Button type="primary" onClick={()=> {
      props.history.push('/shop/renovation/new')
    }}>新建页面</Button>}
    >
      <Card>
        <Form layout="inline"
          form={form}
          style={{ display: 'flex', justifyContent: 'space-between' }}
          initialValues={{
            status: 0,
          }}
        >
          <div style={{ display: 'flex' }}>
            <Form.Item name="status">
              <Select style={{ width: 100 }} onChange={search}>
                <Option value={0}>全部</Option>
                <Option value={2}>已发布</Option>
                <Option value={1}>未发布</Option>
              </Select>
            </Form.Item>
            <Form.Item name="pageType" label={'首页'} valuePropName='checked'>
              <Switch onChange={search}/>
            </Form.Item>
          </div>
          <Form.Item name="title">
            <Search
              style={{ width: 200 }}
              enterButton="搜索"
              onSearch={search}
            />
          </Form.Item>
        </Form>

        <Table
          style={{ marginTop: 20 }}
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
        />

      </Card>

      {
        showEdit && (
          <EditLayer id={curEditId as number} visible={showEdit} onClose={()=>{
            setShowEdit(false)
          }} onOk={()=>{
            setShowEdit(false)
            refresh()
          }}/>
        )
      }
      <Preview id={curPreviewId as number} visible={showPreView} onClose={()=>{
        setShowPreView(false)
      }}/>
      
    </PageHeaderWrapper>
  )
}

export default Renovation;