import styles from './index.less'
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Popconfirm, Card, Table, Button, Divider, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { getSpecialList, delSpecial } from '@/services/shop/topic'
import config from '@/config/index'
import { Copy } from '@/utils/utils'
import { Link } from 'umi'

const BIZ_TYPE = {0: '自选商品', 1: '商品分类', 2: '促销活动'};

interface PropsParams{
  location: any;
  history: any;
}
const Topic:React.FC<PropsParams> = (props) => {
  let { pageNum = 1, pageSize = 10 } = props.location.query;
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [pageInfo, setPageInfo] = useState({ pageNum: +pageNum, pageSize: +pageSize })
  const [pageTotal, setPageTotal] = useState(0)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')


  useEffect(() => {
    getDataList();
  }, [pageInfo])


  async function getDataList() {
    let params = {
      page: pageInfo.pageNum,
      size: pageInfo.pageSize,
      sortBy: '-createTime'
    }
    setLoading(true)
    props.history.replace({
      query: {
        pageNum: pageInfo.pageNum,
        pageSize: pageInfo.pageSize,
      },
    });
    let res = await getSpecialList(params)
    setLoading(false)
    let { records, total } = res;
    setList(records)
    setPageTotal(total)
  }

  // 删除
  async function handleDel(themeId:number):Promise<false | void>{
    let [err] = await delSpecial({themeId})
    if(err)return false;
    getDataList();
  }

  // 复制
  function copy(themeId:number){
    Copy(config.h5Path+`/activity/index?themeId=${themeId}`)
  }


  function openPreview(imgUrl:string){
    setPreviewVisible(true)
    setPreviewImage(imgUrl)
  }


  function onTableChange({ current, pageSize }:any){
    setPageInfo({
      pageSize, pageNum: current
    })
  }

  const pagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageInfo.pageNum,
    pageSize: pageInfo.pageSize,
    total: pageTotal,
    showTotal: (t:number) => <div>共{t}条</div>
  }
  const columns = [
    {
      title: '专题名称',
      dataIndex: 'themeName',
    },
    {
      title: '顶部图片',
      dataIndex: 'topPic',
      render: (text:string) => <div className={styles.specialImg} onClick={() => openPreview(text)}>
        <img src={text}/>
      </div>
    },
    {
      title: '商品选择',
      dataIndex: 'bizType',
      render: (text:string) => BIZ_TYPE[text]
    },
    {
      title: '操作',
      dataIndex: 'themeId',
      render: (themeId:number) => <>
        <Link to={`/shop/topic/${themeId}/edit`}>编辑</Link>
        <Divider type="vertical" />
        <Popconfirm title="确认删除?" onConfirm={() => handleDel(themeId)}>
          <a>删除</a>
        </Popconfirm>
        <Divider type="vertical" />
        <a type="primary" onClick={() => copy(themeId)}>复制链接</a><br />
      </>
    },
  ]


  return (
    <PageHeaderWrapper>
      <Card>
        <div className={styles.tableListForm}>
          <Button type="primary" icon={<PlusOutlined />} onClick={()=> props.history.push('/shop/topic/add')}>新增专题</Button>
        </div>
          <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          onChange={onTableChange}
          pagination={pagination} />
        
      </Card>

      <Modal visible={previewVisible} footer={null} onCancel={()=> setPreviewVisible(false)}>
       <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageHeaderWrapper>
  )
}

export default Topic