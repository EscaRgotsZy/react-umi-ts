
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Radio, Input, Button, Tag, message } from 'antd'
import { connect } from 'umi'
import Color from '@/components/Color'
import Preview from '../components/preview'
import Frame from '../components/frame'
import Item from '../components/item'
import Upload from '../../components/new-upload'
import SaveBtn from '../components/save-btn'
import SelLayer from '../components/sel-layer/combination'

let tagStatus = new Map()
tagStatus.set('1', '商品分组')
tagStatus.set('2', '商品详情')
tagStatus.set('3', '装修页面')

interface TitleProps {
  dispatch: any;
  titleData: any;
}
const Title: React.FC<TitleProps> = (props) => {
  const { dispatch, titleData } = props;

  const [visible, setVisible] = useState(false)// 是否显示选择分类弹框

  const [titleType, setTitleType] = useState(2)// 图片、文字
  const [urlType, setUrlType] = useState(1)// 选择系统链接还是 自定义链接
  const [imageUrl, setImageUrl] = useState('')// 图片url
  const [mainTitle, setMainTitle] = useState('')// 主标题
  const [subTitle, setSubTitle] = useState('')// 副标题
  const [urlWord, setUrlWord] = useState('')// 链接文字
  const [mainTitleColor, setMainTitleColor] = useState('#000')// 主标题颜色
  const [subTitleColor, setSubTitleColor] = useState('#000')// 副标题颜色
  const [urlWordColor, setUrlWordColor] = useState('#000')// 链接文字颜色
  const [h5Url, setH5Url] = useState('')// 链接地址
  const [elementColor, setElementColor] = useState('')// 组件颜色
  const [tag, setTag] = useState<any>({})// 选择连接 参数

  // 回显熟悉
  useEffect(() => {

    let { tagInfo, elementUrlType } = titleData;

    setTitleType(titleData.titleType)
    setUrlType(titleData.elementUrlType === 4 ? 2 : 1)
    setImageUrl(titleData.imageUrl)
    setMainTitle(titleData.mainTitle)
    setSubTitle(titleData.subTitle)
    setUrlWord(titleData.urlWord)
    setMainTitleColor(titleData.mainTitleColor)
    setSubTitleColor(titleData.subTitleColor)
    setUrlWordColor(titleData.urlWordColor)
    setElementColor(titleData.elementColor)
    
    if(elementUrlType<4){
      setTag(tagInfo)
    }else{
      setH5Url(titleData.h5Url)
    }
  }, [titleData])

  function save():any {
    let params: any = {}
    if (titleType === 1) {// 文字
      if (!mainTitle) return message.warn('主标题不能为空');
      params = {
        elementColor,
        mainTitle,
        mainTitleColor,
        subTitle,
        subTitleColor,
        urlWord,
        urlWordColor,
      }
    }
    if (titleType === 2) {// 图片
      if (!imageUrl) return message.warn('请上传图片');
      params = {
        imageUrl,
      }
    }
    params.titleType = titleType;
    if (urlType === 1) {// 系统链接
      let elementUrlType = +tag.key
      if (elementUrlType) {
        params.elementUrlType = elementUrlType;
        params.targetId = tag.id;
      }
    } else {// 自定义链接
      if (!/^https?:\/\/.+/.test(h5Url) && h5Url != '') return message.warn('请填写正确链接');
      params.elementUrlType = 4
      params.h5Url = h5Url;
    }

    dispatch({
      type: 'renovation/submitTitle',
      payload: params
    })
  }

  return (
    <>
      <div className={styles.titleComponents}>
        <Preview src={require('@/assets/renovation/7-preview.png')} />

        <div className={styles['title-list']}>
          <Frame title={`标题`}>
            <Item label="类型" required all>
              <Radio.Group onChange={(e: any) => setTitleType(e.target.value)} value={titleType} size={'small'}>
                <Radio value={1}>文字</Radio>
                <Radio value={2}>图片</Radio>
              </Radio.Group>
            </Item>


            {
              titleType === 1 && (
                <>
                  <Item label="主标题" required all>
                    <div style={{ display: 'flex' }}>
                      <Input size={'small'} value={mainTitle} style={{ width: 100, marginRight: 10 }} maxLength={6} suffix={`${mainTitle.length}/6`} onChange={(e) => {
                        setMainTitle(e.target.value)
                      }} />
                      <Color size="small" defaultColor={mainTitleColor} align={'right'} setColor={(hex: string) => {
                        setMainTitleColor(hex)
                      }} />
                    </div>
                  </Item>
                  <Item label="副标题" all>
                    <div style={{ display: 'flex' }}>
                      <Input size={'small'} value={subTitle} style={{ width: 100, marginRight: 10 }} maxLength={10} suffix={`${subTitle.length}/10`} onChange={(e) => {
                        setSubTitle(e.target.value)
                      }} />
                      <Color size="small" defaultColor={subTitleColor} align={'right'} setColor={(hex: string) => {
                        setSubTitleColor(hex)
                      }} />
                    </div>
                  </Item>
                  <Item label="链接文字" all>
                    <div style={{ display: 'flex' }}>
                      <Input size={'small'} value={urlWord} style={{ width: 100, marginRight: 10 }} maxLength={5} suffix={`${urlWord.length}/5`} onChange={(e) => {
                        setUrlWord(e.target.value)
                      }} />
                      <Color size="small" defaultColor={urlWordColor} align={'right'} setColor={(hex: string) => {
                        setUrlWordColor(hex)
                      }} />
                    </div>
                  </Item>
                  <Item label="背景颜色">
                    <Color size="small" defaultColor={elementColor} setColor={(hex: string) => {
                      setElementColor(hex)
                    }} />
                  </Item>
                </>
              )
            }
            {
              titleType === 2 && (
                <Item label="选择图片" required>
                  <Upload value={imageUrl} size="small" setImg={(url: string) => {
                    setImageUrl(url)
                  }} />
                </Item>
              )
            }

            <Item label="链接地址" all>
              <Radio.Group onChange={(e: any) => setUrlType(e.target.value)} value={urlType} size={'small'}>
                <Radio value={1}>系统链接</Radio>
                <Radio value={2}>自定义链接</Radio>
              </Radio.Group>
            </Item>
            <Item all>
              {
                urlType === 1 ? (
                  <>
                    <Button size={'small'} onClick={() => {
                      setVisible(true)
                    }}>选择链接</Button>
                    <div className={styles.tags}>
                      {
                        tag.key && <Tag>{tagStatus.get(tag.key)}-{tag.name}</Tag>
                      }
                    </div>
                  </>
                ) : (
                    <Input prefix={'H5链接:'} value={h5Url} placeholder="请填写需要跳转的H5链接" onChange={(e) => {
                      setH5Url(e.target.value)
                    }} />
                  )
              }
            </Item>
          </Frame>

        </div>
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
              setTag(tagInfo)
              setVisible(false)
            }} />
        )
      }

    </>
  )
}

export default connect(({ renovation }: any) => ({
  titleData: renovation.titleData,
}))(Title)
