
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Input, Button, Select, Checkbox, Tag, Tooltip, message } from 'antd'
import { connect } from 'umi'
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, LabelItemData } from '@/models/renovation'
import Frame from '../components/frame'
import Preview from '../components/preview'
import Item from '../components/item'
import SaveBtn from '../components/save-btn'
import SelLayer from '../components/sel-layer/goods-layer'
import SelLabelLayer from '../components/sel-layer/label-layer'


const { Option } = Select;

const labelMax = 15;

const options = [
  { label: '常规', value: '1' },
  { label: '拼团', value: '2' },
  { label: '预售', value: '3' },
];
interface LabelProps {
  dispatch: any;
  labelData: any;
  shopList: any[],
}
const Label: React.FC<LabelProps> = (props) => {
  const { dispatch, labelData, shopList } = props;
  const [goodsVisible, setGoodsVisible] = useState(false)
  const [labelVisible, setLabelVisible] = useState(false)
  const [curIndex, setCurIndex] = useState<number>(-1)

  const [list, setList] = useState<any[]>([])
  const [elementName, setElementName] = useState<string>('')
  const [shops, setShops] = useState([])
  const [productType, setProductType] = useState<any[]>(['1'])
  const [goodsList, setGoodsList] = useState<any[]>([])

  useEffect(() => {
    setShops(labelData.elementShops)
    setProductType(labelData.productType)
    setGoodsList(labelData.elementProducts)
    if(labelData.tagElements.length){
      setList(labelData.tagElements.slice(1))
      setElementName(labelData.tagElements[0]['elementName'])
    }
  }, [labelData])

  useEffect(() => {
    dispatch({
      type: 'renovation/getShops',
    })
  }, [])

  function save(): any {
    if (!shops.length) return message.error('请选择店铺')
    if (!productType.length) return message.error('请选择商品类型')
    if (!elementName) return message.error('请输入Tab1 tab名称')

    let tagElements = [{ elementName, seq: 1 }];
    let errText = ''
    let newList = list.map((v, i) => {
      let seq = i + 2;
      if (!v.elementName) {
        errText = `Tab${seq}、请输入Tab名称`
      }
      
      if (!v.elementTags.length) {
        errText = `Tab${seq}、请选择标签`
      }
      let elementTags = v.elementTags.map((o:any, ii:number)=>{
        return {
          ...o,
          seq: ii+1
        }
      })
      return {
        elementName: v.elementName,
        seq,
        elementTags
      }
    })
    if (errText) return message.error(errText)
    tagElements = tagElements.concat(newList)

    let elementProducts = goodsList.map(v => {
      return {
        productId: v.id,
        productName: v.name,
        seq: v.seq,
      }
    })
    let elementShops = shops.map(v => {
      let shopInfo = shopList.filter(x => x.shopId === v)[0] || {}
      return {
        shopId: v,
        shopName: shopInfo.shopName || '',
      }
    })
    dispatch({
      type: 'renovation/submitLabel',
      payload: {
        elementShops,
        elementProducts,
        productType: productType.join(','),
        tagElements,
      }
    })
  }

  function resetList({ index, key, value }: any) {
    let newList = list.map((v: any, i) => {
      if (index === i) {
        return {
          ...v,
          [key]: value
        }
      }
      return v;
    })
    setList(newList)
  }

  return (
    <div className={styles.labelComponents}>
      <Preview src={require('@/assets/renovation/9-preview.png')} />


      <Frame title={`商品信息`} style={{ marginTop: 10 }}>
        <Item label="店铺选择" required all>
          <Select
            size="small"
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="选择店铺"
            value={shops}
            onChange={(e) => {
              setShops(e)
            }}
            optionLabelProp="label"
          >
            {
              Array.isArray(shopList) && shopList.map((v: any) => <Option key={v.shopId} value={v.shopId} label={v.shopName}>{v.shopName}</Option>)
            }
          </Select>
        </Item>
        <Item label="商品类型" required all>
          <Checkbox.Group options={options} value={productType} onChange={(e) => {
            setProductType(e)
          }} />
        </Item>
        <Item label="运营干预品" all>
          <Button size="small" onClick={() => {
            setGoodsVisible(true)
          }}>选择商品</Button> <span className={styles.goodsCount}>已选择{goodsList.length}个商品</span>
        </Item>

        <div className={styles['goods-list']}>
          {
            goodsList.map((v, goodsIndex) => {
              return (
                <div className={styles['goods-item']} key={v.id}>
                  <img src={v.img} />
                  <span>{v.name}</span>
                  <Tooltip placement="topLeft" title="干预品，插入排序1-1000" arrowPointAtCenter>
                    <input type="text" value={v.seq} maxLength={4} onChange={(e) => {
                      let seq = Number(e.target.value);
                      seq = seq || 0;
                      seq = Math.min(seq, 1000)
                      seq = Math.max(seq, 0)
                      let newGodos = goodsList.map(x => {
                        if (x.id === v.id) {
                          return { ...x, seq }
                        }
                        return x;
                      })
                      setGoodsList(newGodos)
                    }} />
                  </Tooltip>
                  <a onClick={() => {
                    let newGodos = goodsList.filter(x => x.id !== v.id)
                    setGoodsList(newGodos)
                  }}>删除</a>
                </div>
              )
            })
          }
        </div>

      </Frame>

      <div className={styles['label-list']}>
        <Frame title={`Tab 1`}>
          <Item label="默认" required>
            <Input placeholder="推荐" size={'small'} value={elementName} suffix={`${elementName.length}/5`} maxLength={5} onChange={(e) => {
              setElementName(e.target.value)
            }} />
          </Item>
        </Frame>
        <Container onDrop={record => {
          let newList = applyDrag(list, record)
          setList(newList)
        }}>
          {
            list.map((v, labelIndex) => {
              return (
                <Draggable key={labelIndex}>
                  <Frame title={`Tab ${labelIndex + 2}`} hasDel handleDel={() => {
                    let newList = applyDrag(list, {
                      addedIndex: null,
                      removedIndex: labelIndex,
                    })
                    setList(newList)
                  }} key={labelIndex}>
                    <Item label="Tab名称" required>
                      <Input size={'small'} value={v.elementName} suffix={`${v.elementName.length}/5`} maxLength={5} onChange={e => {
                        resetList({ index: labelIndex, key: 'elementName', value: e.target.value })
                      }} />
                    </Item>
                    <Item label="选择标签" all required>
                      <Button size="small" onClick={() => {
                        setCurIndex(labelIndex)
                        setLabelVisible(true)
                      }}>选择标签</Button>
                    </Item>

                    <div className={styles['label-box']}>
                      <Container onDrop={record => {
                        let newList = applyDrag(v.elementTags, record)
                        resetList({ index: labelIndex, key: 'elementTags', value: newList })
                      }}>
                        {
                          v.elementTags.map((tagItem: any, tagIndex: number) => {
                            return (
                              <Draggable key={tagItem.tagId}>
                                <div className={styles['label-item']}>
                                  <span>{tagItem.tagName}</span>
                                  <a onClick={() => {
                                    let newList = applyDrag(v.elementTags, {
                                      addedIndex: null,
                                      removedIndex: tagIndex,
                                    })
                                    resetList({ index: labelIndex, key: 'elementTags', value: newList })
                                  }}>删除</a>
                                </div>
                              </Draggable>
                            )
                          })
                        }
                      </Container>
                    </div>

                  </Frame>
                </Draggable>
              )
            })
          }
        </Container>

      </div>

      {
        list.length + 1 < labelMax && (
          <div className={styles['label-add-wrap']}>
            <div className={styles['add']}>
              <div onClick={() => {
                setList([...list, LabelItemData])
              }}>添加Tab</div>
              <span>上下拖动可排序，最多{labelMax}张</span>
            </div>
          </div>
        )
      }
      <SaveBtn loading={false} submit={save} />

      {
        goodsVisible && (
          <SelLayer
            visible={goodsVisible}
            handleClose={() => {
              setGoodsVisible(false)
            }}
            handleOk={(goods: any) => {
              setGoodsList(goods.map((v: any) => {
                return {
                  ...v,
                  seq: 0
                }
              }))
              setGoodsVisible(false)
            }} />
        )
      }


      {
        labelVisible && (
          <SelLabelLayer
            visible={labelVisible}
            handleClose={() => {
              setLabelVisible(false)
            }}
            handleOk={(labels: any) => {

              let value = labels.map((v: any) => {
                return {
                  tagId: v.id,
                  tagName: v.name
                }
              })
              resetList({ index: curIndex, key: 'elementTags', value })
              setLabelVisible(false)
            }} />
        )
      }


    </div>
  )
}

export default connect(({ renovation }: any) => ({
  labelData: renovation.labelData,
  shopList: renovation.shopList,
}))(Label)