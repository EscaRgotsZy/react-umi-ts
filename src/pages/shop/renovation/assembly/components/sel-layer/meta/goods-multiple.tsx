
import styles from '../index.less'
import React, { useState, useEffect } from 'react'
import { Spin, Pagination, Input, Form } from 'antd'
import classnames from 'classnames'
import { handlePicUrl } from '@/utils/utils'
import { getSellingProd, sellProdParams } from '@/services/goods/sell/list'


const { Search } = Input;
interface GoodsProps {
  handleSel: Function;
}
const Goods: React.FC<GoodsProps> = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, size: 10 })
  const [pageTotal, setPageTotal] = useState(0)
  const [selGoods, setSelGoods] = useState<any>([])

  useEffect(() => {
    fetchGoodsList();
  }, [pageInfo])

  function search(){
    setPageInfo({page: 1, size: 10})
  }

  async function fetchGoodsList() {
    let productName = form.getFieldValue('productName')
    let params: sellProdParams = {
      page: pageInfo.page,
      size: pageInfo.size,
      productName,
      status: 1
    }
    setLoading(true)
    let res = await getSellingProd(params)
    setLoading(false)
    let { records, total }: any = res;
    setPageTotal(total)
    setList(records)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Form layout='inline' form={form}>
          <Form.Item name="productName">
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
            {
              list.map((v: any) => {

                let cur:any = {
                  id: v.productId,
                  name: v.productName,
                  img: handlePicUrl(v.productPic)
                }
                let isSel = !!selGoods.filter((o:any)=>o.id === v.productId).length// 当前是否已选
                return (
                  <li key={v.productId}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={handlePicUrl(v.productPic)} />
                      <span className={styles['title-name']}>{v.productName}</span>
                    </div>
                    <span className={classnames({
                      [styles['link']]: true,
                      [styles.active]: isSel
                    })} onClick={() => {
                      let tmpl = []
                      if(isSel){// 已经选了 那就取消
                        tmpl = selGoods.filter((o:any)=>o.id !== v.productId)
                      }else{
                        tmpl = [...selGoods, cur]
                      }
                      setSelGoods(tmpl)
                      props.handleSel(tmpl)
                    }}>{isSel ? '已选' : '选择连接'}</span></li>
                )
              })
            }
          </ul>
        </div>
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <Pagination
            total={pageTotal}
            showQuickJumper
            responsive
            current={pageInfo.page}
            pageSize={pageInfo.size}
            showTotal={total => `共 ${total} 条`}
            onChange={(page, pageSize) => {
              setPageInfo({ page, size: (pageSize as number) })
            }}
          />
        </div>
      </Spin>
    </>
  )
}

export default Goods

