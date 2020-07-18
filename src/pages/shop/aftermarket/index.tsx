import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, Popconfirm, Divider, } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { getAfterSaleList, deleteTemplate } from '@/services/shop/aftermarket'


const Aftermarket:React.FC<any> = (props) => {
  let { pageNum = 1, pageSize = 10 } = props.location.query;
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [pageInfo, setPageInfo] = useState({ pageNum: +pageNum, pageSize: +pageSize })
  const [pageTotal, setPageTotal] = useState(0)

  useEffect(() => {
    getDataList();
  }, [pageInfo])


  async function getDataList() {
    let params = {
      page: pageInfo.pageNum,
      size: pageInfo.pageSize
    }
    setLoading(true)
    
    let res = await getAfterSaleList(params)
    setLoading(false)
    let { records, total } = res;
    let list = records && records.length != 0 ? records.map((v:any) => {
      return {
        key: v.id,
        ...v,
      }
    }) : []
    setList(list)
    setPageTotal(total)
    props.history.replace({
      query: {
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
      },
    });
  }
  // 监听分页改变
  function onTableChange({ current, pageSize }: any) {
    setPageInfo({
      pageSize, pageNum: current
    })
  }

  // 新建
  function handleAdd(){
    props.history.push(`/shop/aftermarket/add`)
  }

  // 编辑
  function openEditModal(id:number){
    props.history.push(`/shop/aftermarket/${id}/edit`)
  }
  
  // 复制
  function copy(id:number){
    props.history.push(`/shop/aftermarket/add?id=${id}`)
  }

  // 删除
  async function handleDelete(id:number):Promise<false | void>{
    let [err] = await deleteTemplate({id})
    if(err) return false;
    getDataList()
  }
  const column = [
    {
      title: '模板名称',
      dataIndex: 'name',
    },
    {
      title: '模板内容',
      dataIndex: 'content',
    },
    {
      title: '操作',
      render: (_:any, record:any) => <>
        <a onClick={() => copy(record.id)}>复制</a>
        <Divider type="vertical" />
        <a onClick={() => openEditModal(record.id)}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
           <a style={{color:'red'}}>删除</a>
        </Popconfirm>  
      </>
    }
  ]
  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageInfo.pageNum,
    pageSize: pageInfo.pageSize || 10,
    total: pageTotal,
    showTotal: (t: number) => <div>共{t}条</div>
  };
  return (
    <PageHeaderWrapper>
      <Card>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 15}}>
          <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>新建模板</Button>
        </div>
        <Table
          size="small"
          loading={loading}
          dataSource={list}
          onChange={onTableChange}
          pagination={pagination}
          columns={column}
          bordered
        >
        </Table>
      </Card>
    </PageHeaderWrapper>
  )
}

export default Aftermarket
