import React, { useEffect, useState } from 'react';
import { Form, Input, Table, Button, Popconfirm, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { findShopCategoryList, deleteShopCategory, lineShopCategory, TabType } from '@/services/shop/classify'
import { SectionToChinese } from '@/utils/math'

const FormItem = Form.Item;
interface UserProp {
  grade: number;
  parentId: number | string;
  tabDecorator: Function
  refresh: boolean
}
const ClassifyList: React.FC<UserProp> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)// 查询loading
  const [list, setList] = useState<any[]>([]);// 列表数据
  const [pageInfo, setPageInfo] = useState<any>({ pageNum: 1, pageSize: 10 });
  const [pageTotal, setPageTotal] = useState<any>(0);

  useEffect(() => {
    getDataList()
  }, [pageInfo, props.refresh])


  async function getDataList() {
    setLoading(true);
    let { name } = form.getFieldsValue();
    let params = {
      parentId: props.parentId,
      grade: props.grade,
      name,
      page: pageInfo.pageNum,
      size: pageInfo.pageSize,
    }
    let res = await findShopCategoryList(params)
    setLoading(false);
    if (!res) return false;
    let { total, records } = res;
    setPageTotal(total)
    setList(records)
  }

  function search() {
    setPageInfo({ pageNum: 1, pageSize: 10 })
  }

  // 上下线
  async function onLine(id:number, status:number) {
    let params:any = {
      status, id
    }
    let [err] = await lineShopCategory(params)
    if(err)return false;
    let newList = list.map(v=>{
      if(v.id === id){
        return {
          ...v,
          status
        }
      }
      return v
    })
    setList(newList)
  }

  // 添加类目
  function addCates() {
    props.tabDecorator({
      type: TabType.add,
      grade: 100,// 当前层级
      parentId: props.grade,// 父级
      curGrade: props.grade,
      data: {
        parentId: props.parentId
      },// 数据
    })
  }

  // 编辑当前类目
  function editorCates(record:any) {
    props.tabDecorator({
      type: TabType.edit,
      grade: 100,// 当前层级
      parentId: record.id,// 父级
      curGrade: props.grade,
      data: record,// 数据
    })
  }

  // 查看子类目
  function toNextCates(record:any) {
    props.tabDecorator({
      type: TabType.list,
      grade: props.grade+1,// 当前层级
      parentId: record.id,// 父级
      refresh: false,
      data: {},// 数据
    })
  }
  

  async function deleteCategory(id:number) {
    let params = {id}
    let [err] = await deleteShopCategory(params)
    if(err)return false;
    message.success('删除成功');
    search()
  }
  function onTableChange({ current, pageSize }: any) {
    setPageInfo({ pageNum: current, pageSize: pageSize })
    getDataList()
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '次序',
      dataIndex: 'seq',
      key: 'seq',
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: '20%',
      render: (text:number, record: any) => <>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Popconfirm
            title={text === 1? '确定下线该类目么?': '确定上线该类目么?'}
            onConfirm={() => onLine(record.id, text === 1?0:1)}
            okText="确定"
            cancelText="取消"
          >
            <Button type='primary' >{text === 1? '下线': '上线'}</Button>
          </Popconfirm>
          {record.grade < 3 && <Button type='dashed' onClick={() => toNextCates(record)}>子类目</Button>}
          <Button type='dashed' onClick={() => editorCates(record)} >修改</Button>
          <Popconfirm
            title="确定删除该类目么?"
            onConfirm={() => deleteCategory(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type='dashed'>删除</Button>
          </Popconfirm>
        </div>
      </>
    },
  ]
  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageInfo.pageNum,
    pageSize: pageInfo.pageSize || 10,
    total: pageTotal,
    showTotal: (t: number) => <div>共{t}条</div>
  }
  return (
    <>
      <Form layout="inline" form={form}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <FormItem label="店铺类目: " style={{ marginRight: '10px' }} name="name">
            <Input />
          </FormItem>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={search} icon={<SearchOutlined />} loading={loading}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={addCates} type='primary'>增加{SectionToChinese(props.grade)}级店铺分类</Button>
          </div>
        </div>
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
    </>
  )
}
export default ClassifyList
