
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Input, Radio, Button, Tag, message } from 'antd'
import { connect } from 'umi'
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, tabItemData } from '@/models/renovation'
import Frame from '../components/frame'
import Preview from '../components/preview'
import Item from '../components/item'
import SaveBtn from '../components/save-btn'
import Upload from '../../components/new-upload'
import SelLayer from '../components/sel-layer/tab-layer'

const tabMax = 15;

interface TabProps {
  dispatch: any;
  tabData: any;
}
const Tab: React.FC<TabProps> = (props) => {
  const { dispatch, tabData } = props;
  const [list, setList] = useState<any[]>([])
  const [visible, setVisible] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState('')
  const [buttonImage, setButtonImage] = useState('')
  const [elementName, setElementName] = useState('')
  const [curIndex, setCurIndex] = useState<number>(-1)
  
  useEffect(()=>{
    setBackgroundImage(tabData.backgroundImage)
    setButtonImage(tabData.buttonImage)
    if(tabData.tabElements.length){
      setList(tabData.tabElements.slice(1))
      setElementName(tabData.tabElements[0]['elementName'])
    }
  }, [tabData])

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
    if(!elementName)return message.error('请输入菜单1 tab名称')

    let tabElements = [{elementName, seq: 1}];

    let errText = ''
    let newList = list.map((v, i)=>{
      let seq = i +2;
      if(v.elementUrlType === 1){
        if(!v.tabCategory.length){
          errText = `菜单${seq}、请选择分类`
        }
      }
      if(v.elementUrlType === 4){
        if (!/^https?:\/\/.+/.test(v.h5Url)){
          errText = `菜单${seq}、请填写正确链接地址`
        }
      }
      if(!v.elementName){
        errText = `菜单${seq}、请输入Tab名称`
      }
      return {
        ...v,
        seq
      }
    })
    if(errText)return message.error(errText)

    tabElements = tabElements.concat(newList)
    let params = {
      backgroundImage,
      buttonImage,
      tabElements
    }
    dispatch({
      type: 'renovation/submitTab',
      payload: params
    })
  }
  return (
    <div className={styles.tabComponents}>
      <Preview src={require('@/assets/renovation/3-preview.png')} />

      <div className={styles['tab-list']}>
        <Frame title={`基本信息`}>
          <Item label="底部背景图">
            <Upload value={backgroundImage} size="small" setImg={(url: string) => {
              setBackgroundImage(url)
            }} />
            <span className={styles.tip}>建议图片宽度750*285px</span>
          </Item>
          <Item label="分类按钮图">
            <Upload value={buttonImage} size="small" setImg={(url: string) => {
              setButtonImage(url)
            }} />
            <span className={styles.tip}>建议图片宽度80*98px</span>
          </Item>
        </Frame>
        <Frame title={`菜单 1`}>
          <Item label="Tab名称" required>
            <Input size={'small'} value={elementName} suffix={`${elementName.length}/5`} maxLength={5} onChange={(e:any)=>{
              setElementName(e.target.value)
            }}/>
          </Item>
        </Frame>

        <Container onDrop={record => {
          let newList = applyDrag(list, record)
          setList(newList)
        }}>
          {
            list.map((v, tabIndex) => {

              return (
                <Draggable key={tabIndex}>
                  <Frame
                    key={tabIndex}
                    title={`菜单${tabIndex + 2}`}
                    hasDel
                    handleDel={() => {
                      let newList = applyDrag(list, {
                        addedIndex: null,
                        removedIndex: tabIndex,
                      })
                      setList(newList)
                    }}
                  >
                    <Item label="Tab名称" required>
                      <Input size={'small'} value={v.elementName} suffix={`${v.elementName.length}/5`} maxLength={5} onChange={(e: any) => {
                        resetList({index: tabIndex, key: 'elementName', value: e.target.value})
                      }} />
                    </Item>
                    <Item label="Tab链接" required all>
                      <Radio.Group onChange={(e: any) => {
                        resetList({index: tabIndex, key: 'elementUrlType', value: e.target.value})
                      }} value={v.elementUrlType} size={'small'}>
                        <Radio value={1}>分类链接</Radio>
                        <Radio value={4}>自定义链接</Radio>
                      </Radio.Group>
                    </Item>
                    <Item all>
                      {
                        v.elementUrlType === 1 ? (
                          <>
                            <Button size={'small'} onClick={()=>{
                              setCurIndex(tabIndex)
                              setVisible(true)
                            }}>选择分类</Button>
                            <div className={styles.tags}>
                              {
                                (v.tabCategory || []).map((v:any, i:number)=>{
                                  return <Tag key={i}>{v.categoryName}</Tag>
                                })
                              }
                            </div>
                          </>
                        ) : (
                            <Input prefix={'H5链接:'} value={v.h5Url} placeholder="请填写需要跳转的H5链接" onChange={(e: any) => {
                              resetList({index: tabIndex, key: 'h5Url', value: e.target.value})
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
        list.length + 1 < tabMax && (
          <div className={styles['tab-add-wrap']}>
            <div className={styles['add']}>
              <div onClick={() => {
                setList([...list, tabItemData])
              }}>添加菜单</div>
              <span>上下拖动可排序，最多{tabMax}组</span>
            </div>
          </div>
        )
      }
      <SaveBtn loading={false} submit={save} />


      {
        visible && (
          <SelLayer
            visible={visible}
            handleClose={() => {
              setVisible(false)
            }}
            handleOk={(tabCategory: any) => {
              resetList({index: curIndex, key: 'tabCategory', value: tabCategory})
              setVisible(false)
            }} />
        )
      }
    </div>
  )
}

export default connect(({ renovation }: any) => ({
  tabData: renovation.tabData,
}))(Tab)