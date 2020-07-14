
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Input, Radio, Button, message } from 'antd'
import { connect } from 'umi'
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, iconItemData } from '@/models/renovation'
import Color from '@/components/Color'
import Frame from '../components/frame'
import Preview from '../components/preview'
import Item from '../components/item'
import Upload from '../../components/new-upload'
import SaveBtn from '../components/save-btn'
import SelLayer from '../components/sel-layer/combination'

const iconMax = 20
let tagStatus = new Map()
tagStatus.set('1', '商品分组')
tagStatus.set('2', '商品详情')
tagStatus.set('3', '装修页面')
interface IconProps {
  dispatch: any;
  iconData: any;
}
const Icon: React.FC<IconProps> = (props) => {
  const { dispatch, iconData } = props;
  const [list, setList] = useState<any[]>([])
  const [visible, setVisible] = useState(false)
  const [curIndex, setCurIndex] = useState<'' | number>('')


  useEffect(()=>{
    setList(iconData)
  }, [iconData])

  function resetList({index, key, value}: any){
    let newList = list.map((v:any, i)=>{
      if(index === i){
        return {
          ...v,
          [key]: value
        }
      }
      return v;
    })
    setList(newList)
  }

  function save():any {
    let errText = ''
    let newList = list.map((v, i)=>{
      if(!v.elementName){
        errText = `ICON${i+1}、icon名称不能为空`
      }
      if(!v.imageUrl){
        errText = `ICON${i+1}、请上传icon图片`
      }
      let tmpl = {};
      if(v.type === 1){// 系统链接
        tmpl = {
          elementUrlType: +v.tagInfo.key,
          targetId: v.tagInfo.id,
        }
      }else{
        tmpl = {
          elementUrlType: 4,
          h5Url: v.h5Url || '',
        }
        if (!/^https?:\/\/.+/.test(v.h5Url) && v.h5Url != ''){
          errText = `图片${i+1}、请填写正确链接地址`
        }
      }
      return {
        seq: i+1,
        elementName: v.elementName,
        elementColor: v.elementColor,
        imageUrl: v.imageUrl,
        ...tmpl
      }
    })
    if(errText)return message.warn(errText);
    dispatch({
      type: 'renovation/submitIcon',
      payload: newList
    })
  }
  return (
    <>
      <div className={styles.iconComponents}>
        <Preview src={require('@/assets/renovation/2-preview.png')} />

        <div className={styles['icon-list']}>
          <Container onDrop={record => {
            let newList = applyDrag(list, record)
            setList(newList)
          }}>
            {
              list.map((v:any, iconIndex) => {
                return (
                  <Draggable key={iconIndex}>
                    <Frame
                      key={iconIndex}
                      hasDel={iconIndex != 0}
                      title={`icon ${iconIndex + 1}`}
                      handleDel={() => {
                        let newList = applyDrag(list, {
                          addedIndex: null,
                          removedIndex: iconIndex,
                        })
                        setList(newList)
                      }}
                    >
                      <Item label="Icon名称" required>
                        <Input size={'small'} value={v.elementName} maxLength={4} suffix={'0/4'} onChange={(e)=>{
                          resetList({index: iconIndex, key: 'elementName', value: e.target.value})
                        }}/>
                      </Item>
                      <Item label="Icon颜色">
                        <Color size="small" defaultColor={v.elementColor} setColor={(hex:string) => {
                          resetList({index: iconIndex, key: 'elementColor', value: hex})
                        }} />
                      </Item>
                      <Item label="Icon图片" required>
                        <Upload size="small" value={v.imageUrl} setImg={(src:string)=>{
                          resetList({index: iconIndex, key: 'imageUrl', value: src})
                        }}/>
                      </Item>
                      <Item label="Icon链接" required all>
                        <Radio.Group onChange={(e: any) => {
                          resetList({index: iconIndex, key: 'type', value: e.target.value})
                        }} value={v.type} size={'small'}>
                          <Radio value={1}>系统链接</Radio>
                          <Radio value={2}>自定义链接</Radio>
                        </Radio.Group>
                      </Item>
                      <Item all>
                        {
                          v.type === 1 ? (
                            <>
                              <Button size={'small'} onClick={() => {
                                setCurIndex(iconIndex)
                                setVisible(true)
                              }}>选择链接</Button>
                              {
                                v.tagInfo.id && <div className={styles.goods}>{tagStatus.get(v.tagInfo.key+'')}-{v.tagInfo.name}</div>
                              }
                            </>
                          ) : (
                              <Input prefix={'H5链接:'} value={v.h5Url} placeholder="请填写需要跳转的H5链接" onChange={(e)=>{
                                resetList({index: iconIndex, key: 'h5Url', value: e.target.value})
                              }}/>
                            )
                        }
                      </Item>
                    </Frame>
                  </Draggable>
                )
              })
            }

          </Container>


        </div>
        {
          list.length < iconMax && (
            <div className={styles['icon-add-wrap']}>
              <div className={styles['add']}>
                <div onClick={() => {
                  setList([...list, iconItemData])
                }}>添加icon</div>
                <span>上下拖动可排序，最多{iconMax}组</span>
              </div>
            </div>
          )
        }


      </div>
      <SaveBtn loading={false} submit={save} />

      {
        visible && (
          <SelLayer
            visible={visible}
            handleClose={() => {
              setVisible(false)
            }}
            handleOk={(tagInfo: any) => {
              resetList({index: curIndex, key: 'tagInfo', value: tagInfo})
              setVisible(false)
            }} />
        )
      }
    </>
  )
}

export default connect(({ renovation }: any) => ({
  iconData: renovation.iconData,
}))(Icon)