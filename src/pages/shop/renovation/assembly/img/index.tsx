import styles from './index.less'

import React, { useState, useMemo, useEffect } from 'react'
import { Input, Radio, Button, message } from 'antd'
import { connect } from 'umi'
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag, imgItemData } from '@/models/renovation'
import Modal from '../components/modal'
import Frame from '../components/frame'
import Preview from '../components/preview'
import Item from '../components/item'
import Upload from '../../components/new-upload'
import SaveBtn from '../components/save-btn'
import SelLayer from '../components/sel-layer/combination'

const imgMax = 8
let tagStatus = new Map()
tagStatus.set('1', '商品分组')
tagStatus.set('2', '商品详情')
tagStatus.set('3', '装修页面')


interface ImgProps {
  dispatch: any;
  imgData: any;
}
const Img: React.FC<ImgProps> = (props) => {
  const { dispatch, imgData } = props;
  const [visible, setVisible] = useState<boolean>(false)
  const [list, setList] = useState<any[]>([])
  const [bannerType, setBannerType] = useState<'' | number>(2)
  const [curIndex, setCurIndex] = useState<number>(-1)

  const [styleVisible, setStyleVisible] = useState(false)

  useEffect(() => {
    setList(imgData.bannerElements)
    setBannerType(imgData.bannerType)
  }, [imgData])

  const previewImg = useMemo(() => {
    if (bannerType === 2) {
      return require('@/assets/renovation/1-preview.png')
    } else {
      return require('@/assets/renovation/10-preview.png')
    }
  }, [bannerType])



  function resetList({ index, key, value }: any) {
    let newList = list.map((v, i) => {
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


  function save(): any {
    let errText = ''
    let newList = list.map((v, i) => {
      if (!v.imageUrl) {
        errText = `图片${i + 1}、请上传图片`
      }

      let tmpl = {};
      if (v.type === 1) {// 系统链接
        tmpl = {
          elementUrlType: +v.tagInfo.key,
          targetId: v.tagInfo.id,
        }
      } else {
        tmpl = {
          elementUrlType: 4,
          h5Url: v.h5Url || '',
        }
        if (!/^https?:\/\/.+/.test(v.h5Url) && v.h5Url != '') {
          errText = `图片${i + 1}、请填写正确链接地址`
        }
      }
      return {
        seq: i + 1,
        imageUrl: v.imageUrl,
        ...tmpl
      }
    })
    if (errText) return message.warn(errText);

    let payload = {
      bannerType,
      bannerElements: newList
    }
    dispatch({
      type: 'renovation/submitImg',
      payload
    })
  }
  return (
    <div className={styles.imgComponents}>
      <Preview src={previewImg} hasEdit handleEdit={() => {
        setStyleVisible(true)
      }} />


      <div className={styles['img-list']}>
        <Container onDrop={record => {
          let newList = applyDrag(list, record)
          setList(newList)
        }}>

          {
            list.map((v, imgIndex) => {
              return (
                <Draggable key={imgIndex}>
                  <Frame title={`图片 ${imgIndex + 1}`} hasDel={imgIndex !== 0} handleDel={() => {
                    let newList = applyDrag(list, {
                      addedIndex: null,
                      removedIndex: imgIndex,
                    })
                    setList(newList)
                  }}>
                    <Item label="选择图片" required>
                      <Upload value={v.imageUrl} size="small" setImg={(url: string) => {
                        resetList({ index: imgIndex, key: 'imageUrl', value: url })
                      }} />
                      <span className={styles.tip}>建议图片宽度750px</span>
                    </Item>
                    <Item label="图片链接" all>
                      <Radio.Group value={v.type} onChange={(e: any) => {
                        resetList({ index: imgIndex, key: 'type', value: e.target.value })
                      }} size={'small'}>
                        <Radio value={1}>系统链接</Radio>
                        <Radio value={2}>自定义链接</Radio>
                      </Radio.Group>
                    </Item>
                    <Item all>
                      {
                        v.type === 1 ? (
                          <>
                            <Button size={'small'} onClick={() => {
                              setCurIndex(imgIndex)
                              setVisible(true)
                            }}>选择链接</Button>
                            {
                              v.tagInfo.id && <div className={styles.goods}>{tagStatus.get(v.tagInfo.key + '')}-{v.tagInfo.name}</div>
                            }
                          </>
                        ) : (
                            <Input value={v.h5Url} prefix={'H5链接:'} placeholder="请填写需要跳转的H5链接" onChange={(e: any) => {
                              resetList({ index: imgIndex, key: 'h5Url', value: e.target.value })
                            }} />
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
        list.length < imgMax && bannerType === 2 && (
          <div className={styles['img-add-wrap']}>
            <div className={styles['add']}>
              <div onClick={() => {
                setList([...list, imgItemData])
              }}>添加图片</div>
              <span>上下拖动可排序，最多{imgMax}张</span>
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
            handleOk={(tagInfo: any) => {
              resetList({ index: curIndex, key: 'tagInfo', value: tagInfo })
              setVisible(false)
            }} />
        )
      }

      <Modal
        visible={styleVisible}
        value={bannerType as number}
        list={[
          { value: 2, src: require('@/assets/renovation/1-preview.png') },
          { value: 1, src: require('@/assets/renovation/10-preview.png') },
        ]}
        tip={'样式1、2图中尺寸仅作示例，实际展示尺寸根据预览效果而定'}
        handleClose={() => setStyleVisible(false)}
        handleOk={(type: number) => {
          if (bannerType !== type) {
            setList([imgItemData])
            setBannerType(type)
          }
          setStyleVisible(false)
        }}
      />
    </div>
  )
}

export default connect(({ renovation }: any) => ({
  imgData: renovation.imgData,
}))(Img)