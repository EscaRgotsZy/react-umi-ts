import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, } from 'antd';
import { getBannerList } from '@/services/shop/adsense'
import { Link } from 'umi'

const Adsense = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(()=>{
    getDataList()
  }, [])

  //获取列表
  async function getDataList(){
    setLoading(true)
    let res = await getBannerList()
    setLoading(false)
    setList(res)
  }

  const columns = [
    {
      title: '广告位名称',
      dataIndex: 'name',
    },
    {
      title: '图片',
      dataIndex: 'pic',
      render: (text:string) => <>
        <img src={text} width={'auto'} height={80} onClick={() => {
          setPreviewImage(text)
          setPreviewVisible(true)
        }}/>
      </>
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (text:number) => <>
        <Link to={`/shop/adsense/${text}`}>
          <Button type="primary">查看</Button>
        </Link>
      </>
    }
  ]


  return (
    <PageHeaderWrapper>
      <Card>

        <Table
          loading={loading}
          dataSource={list}
          pagination={false}
          columns={columns}
        />
      </Card>
      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </PageHeaderWrapper>
  )
}


export default Adsense