import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { history, Link } from 'umi'
import { Form, Input, Table, Button, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import config from '@/config/index'
import { Copy, saveUrlParams } from '@/utils/utils'
import { getGrouponList, delGroupon, onLineGroupon, offLineGroupon } from '@/services/activity/group_purchase'

const statusText = new Map()
statusText.set(-3, '已过期')
statusText.set(-1, '已下线')
statusText.set(1, '已上线')
statusText.set(2, '未开始')
statusText.set(3, '已删除')

function statusType(status: number) {
  return {
    isExpired: status === -3,
    isOffline: status === -1,
    isOnline: status === 1,
    isNotStarted: status === 2,
    isDeleted: status === 3,
  }
}

interface useProps {
  status: string;
}
const GroupActivityList = forwardRef((props: useProps, ref) => {
  const { page, size } = (history.location as any).query;
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Array<any>>([])
  const [pageInfo, setPageInfo] = useState({ page: +page || 1, size: +size || 10 })
  const [pageTotal, setPageTotal] = useState(0)

  useImperativeHandle(ref, () => ({
    resetPage: () => {
      reset()
    }
  }));

  useEffect(() => {
    let { groupName, } = history.location.query;
    form.setFieldsValue({ groupName })
  }, [])

  useEffect(() => {
    getDataInfo()
  }, [pageInfo, props.status])

  // 列表
  async function getDataInfo() {
    let groupName = form.getFieldValue('groupName')
    let { page, size } = pageInfo;
    let params: any = {
      page,
      size,
      groupName,
      status: props.status,
      sortBy: '-modifyTime'
    };
    setLoading(true);
    let res = await getGrouponList(params);
    setLoading(false);
    let { records, total } = res;
    setList(records);
    setPageTotal(total);
    saveUrlParams({
      page: params.page,
      size: params.size,
      groupName: params.groupName,
      status: params.status,
    })
  }

  function query() {
    getDataInfo()
  }

  function reset() {
    form.resetFields()
    setPageInfo({ page: 1, size: 10 })
  }

  async function handleDel(id: number): Promise<false | void> {
    let res = await delGroupon({ id });
    if (!res) return false;
    message.success('删除成功');
    getDataInfo()
  }


  async function changeStatus(id: number, type: string) {
    setList(list.map(v => {
      return {
        ...v,
        loading: v.id === id
      }
    }))
    if (type === 'online') {
      await onLineGroupon({ id });
    }
    if (type === 'offline') {
      await offLineGroupon({ id });
    }
    setList(list.map(v => {
      return {
        ...v,
        loading: false
      }
    }))
    getDataInfo()
  }

  // 分页器
  function onTableChange({ current, pageSize }: any) {
    setPageInfo({ page: current, size: pageSize })
  }
  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageInfo.page,
    pageSize: pageInfo.size || 10,
    total: pageTotal,
    showTotal: (t: number) => <div>共{t}条</div>
  }
  const columns = [
    {
      title: '活动名称',
      width: '12%',
      dataIndex: 'groupName',
    },
    {
      title: '商品总件数',
      width: '13%',
      dataIndex: 'productTotal',
    },
    {
      title: '用户类型',
      width: '12%',
      dataIndex: 'limitUserType',
      render: (text: number) => text == 1 ? '企业用户' : '所有用户'
    },
    {
      title: '团购总人数',
      width: '10%',
      dataIndex: 'peopleNumber',
    },
    {
      title: '限购数量',
      width: '12%',
      dataIndex: 'limitNumber',
    },
    {
      title: '活动时间',
      width: '12%',
      render: (_: any, record: any) => <>
        <p>{record.startTime ? moment(record.startTime).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
        <p>{record.endTime ? moment(record.endTime).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
      </>
    },
    {
      title: '活动状态',
      width: '15%',
      dataIndex: 'status',
      render: (text: number) => statusText.get(text) || ''
    },
    {
      title: '操作',
      width: '20%',
      render: (_: any, record: any) => {
        let status = statusType(record.status)
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              status.isNotStarted &&
              <>
                <Button type='dashed' style={{ marginBottom: '5px', width: '80px' }} onClick={() => changeStatus(record.id, 'online')} loading={record.loading}>上线</Button>
                <Link to={`/activity/group_purchase/${record.id}/edit`}><Button type='primary' style={{ marginBottom: '5px', width: '80px' }}>编辑</Button></Link>
                <Popconfirm
                  title="是否删除预售活动?"
                  onConfirm={() => handleDel(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type='danger' style={{ width: '80px' }}>删除</Button>
                </Popconfirm>
              </>
            }
            {
              status.isOnline &&
              <>
                <Button type='dashed' style={{ marginBottom: '5px', width: '80px' }} onClick={() => changeStatus(record.id, 'offline')} loading={record.loading}>下线</Button>
                <Link to={`/activity/group_purchase/${record.id}/edit?read=1`}><Button type='primary' style={{ marginBottom: '5px', width: '80px' }}>查看</Button></Link>
                <Button type='primary' style={{ marginBottom: '5px', width: '80px' }} onClick={() => Copy(config.h5Path + `/big-group?themeId=${record.id}`)} >复制链接</Button>
              </>
            }
            {
              (status.isExpired || status.isOffline) &&
              <>
                <Link to={`/activity/group_purchase/${record.id}/edit?read=1`}>查看</Link>
                <Link to={`/activity/group_purchase/add?copy=${record.id}`}>复制模板</Link>
              </>
            }
            {
              status.isDeleted &&
              <>
                <Button type='dashed' style={{ width: '80px' }} >已删除</Button>
              </>
            }
          </div>
        )
      }
    },

  ]

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form form={form}>
          <Form.Item label="活动名称:" name="groupName">
            <Input />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" onClick={query}>
            查询
        </Button>
          <Button style={{ marginLeft: 8 }} onClick={reset}>
            重置
        </Button>
        </div>
      </div>
      <div
        style={{ marginBottom: 15 }}
      ><Button type='primary' icon={<PlusOutlined />} onClick={() => {
        history.push('/activity/group_purchase/add')
      }}>新建团购活动</Button></div>
      <Table
        rowKey={record => record.id}
        loading={loading}
        columns={columns}
        dataSource={list}
        onChange={onTableChange}
        pagination={pagination} />
    </>
  )
})
export default GroupActivityList 
