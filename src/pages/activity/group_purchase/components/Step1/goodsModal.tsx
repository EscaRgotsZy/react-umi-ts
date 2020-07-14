import React, { useState, useEffect, useMemo } from 'react'
import { Form, Button, Modal, Input, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import { connect } from 'umi';
import { StateType } from '@/models/group_purchase'
import { getProductList } from '@/services/activity/group_purchase'
import Sku from './sku'

import styles from './index.less'

interface GoodsModalProps {
  dispatch?: any;
  close: Function;
  visible: boolean;
}
const GoodsModal: React.FC<GoodsModalProps> = (props) => {
  const { dispatch, close } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])

  const [pageInfo, setPageInfo] = useState({ page: 1, size: 5 })
  const [pageTotal, setPageTotal] = useState(0)
  const [rowKeys, setRowKeys] = useState<any[]>([])// 已选择的 key list
  const [rows, setRows] = useState<any[]>([])// 已选择的 row list

  useEffect(() => {
    getDataList()
  }, [pageInfo])

  async function getDataList() {
    let { productId, productName } = form.getFieldsValue(['productId', 'productName'])
    let params = {
      productId,
      productName,
      page: pageInfo.page,
      size: pageInfo.size
    }
    setLoading(true)
    let res = await getProductList(params);
    setLoading(false)
    let { records, total } = res;
    setList(records)
    setPageTotal(total)
  }

  const TableList = useMemo(() => {
    return list.map((v: any) => {
      let cur = rows.filter(x => x.productId === v.productId)
      if (cur.length) {
        return {
          ...v,
          productSkus: cur[0]['productSkus']
        }
      }
      return v;
    })
  }, [list, rows])


  function changeSelStatus(data: any, productId: number, skuId: number, status: boolean) {
    return data.map((v: any) => {
      if (v.productId === productId) {
        return {
          ...v,
          productSkus: v.productSkus.map((x: any) => {
            if (x.skuId === skuId) {
              return {
                ...x,
                sel: status
              }
            }
            return x
          })
        }
      }
      return v
    })
  }


  const Columns = [
    {
      title: '商品',
      dataIndex: '',
      render: (record: any) => <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginTop: '10px' }}><img width='60' height="60" src={record.productPic} /></div>
        <div>
          <p className={styles.pstyle1}>{record.productName}</p>
          <p style={{ padding: '5px 10px' }}>商品ID：{record.productId}</p>
        </div>
      </div>
    },
    { title: '原价', dataIndex: 'presentPrice' },
    { title: '库存', dataIndex: 'actualStocks' },
  ]
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
  return (
    <>
      <Modal
        width='960px'
        title={`添加商品`}
        visible={props.visible}
        onOk={() => {
          dispatch({
            type: 'group_purchase/changeGoods',
            payload: rows.map(v=>{
              return {
                ...v,
                productSkus: (v.productSkus || []).filter((x:any)=> x.sel)
              }
            })
          });
          close()
        }}
        onCancel={() => close()}
        maskClosable={false}
        centered={true}
        getContainer={false}
      >
        <Form layout="inline" form={form}>
          <Form.Item label="商品名称：" name="productName">
            <Input placeholder="商品名称" />
          </Form.Item>
          <Form.Item label="商品Id：" name="productId">
            <Input placeholder="商品Id" />
          </Form.Item>
          <Form.Item label="">
            <Button icon={<SearchOutlined />} type="primary" onClick={getDataList}>搜索</Button>
          </Form.Item>
        </Form>
        <Table
          style={{ marginTop: 10 }}
          rowKey={(record: any) => record.productId}
          loading={loading}
          size="small"
          rowClassName={styles.table}
          dataSource={TableList}
          onChange={onTableChange}
          rowSelection={{
            selectedRowKeys: rowKeys,
            onChange(selectedRowKeys) {// 单选和全选都会触发
              setRowKeys(selectedRowKeys)
            },
            onSelect(record, selected) {
              if (selected) {
                setRows([...rows, record])
              } else {
                setRows(rows.filter(v => v.productId !== record.productId))
              }
            },
            onSelectAll(selected) {
              let curRows:any = [];
              if(selected){
                rows.forEach((v:any)=>{
                  if(!list.filter((x:any)=> x.productId === v.productId).length){
                    curRows.push(v)
                  }
                })
                curRows = [...curRows, ...list]
              }else{
                rows.forEach((v:any)=>{
                  if(!list.filter((x:any)=> x.productId === v.productId).length){
                    curRows.push(v)
                  }
                })
              }
              setRows(curRows)
            }
          }}
          pagination={pagination}
          columns={Columns}
          expandIconColumnIndex={1}// 自定义展开按钮的列顺序
          expandedRowKeys={rowKeys}// 展开的行，控制属性
          expandRowByClick={false}// 通过点击行来展开子行
          expandedRowRender={(record) => {
            return (
              <Sku
                data={record}
                selSku={(productId: number, skuId: number, status: boolean) => {
                  setRows(changeSelStatus(rows, productId, skuId, status))
                }} />
            )
          }}// 额外的展开行
        >
        </Table>
      </Modal>
    </>
  )
}


export default connect(({ group_purchase }: { group_purchase: StateType }) => ({
  current: group_purchase.current,
}))(GoodsModal);
