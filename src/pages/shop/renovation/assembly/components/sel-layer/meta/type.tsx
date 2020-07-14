
import styles from '../index.less'
import React, { useState, useEffect } from 'react'
import { Spin, Pagination, Input, Form } from 'antd'
import classnames from 'classnames'
import { handlePicUrl } from '@/utils/utils'
import { getParentCategories, getNextCategories } from '@/services/goods/classify'

const { Search } = Input;
interface TypeProps{
  handleSel: Function;
  id: number;
}
const Type: React.FC<TypeProps> = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [curId, setCurId] = useState('')

  useEffect(() => {
    fetchClassify();
  }, [])

  async function fetchClassify() {
    setLoading(true)
    let res = await getParentCategories();
    setLoading(false)
    res = res.map(v => {
      return {
        id: v.id,
        name: v.name,
        grade: v.grade,
        isOpen: false
      }
    })
    setList(res as any)
  }

  async function fetchNextClassify(id: number) {
    setLoading(true)
    let res = await getNextCategories({ id });
    setLoading(false)
    res = res.map(v => {
      return {
        id: v.id,
        name: v.name,
        grade: v.grade,
        isOpen: false
      }
    })

    let newList = list.map((v: any) => {
      if (v.id === id) {
        return {
          ...v,
          isOpen: true,
          children: res
        }
      }
      return v
    })
    setList(newList as any)
  }

  async function fetchNextClassify_2(id: number, parentId: number) {
    setLoading(true)
    let res = await getNextCategories({ id });
    setLoading(false)
    res = res.map(v => {
      return {
        id: v.id,
        name: v.name,
        grade: v.grade,
        isOpen: false
      }
    })

    let newList = list.map((v: any) => {
      if (v.id === parentId) {
        let children = v.children || [];
        children = children.map((x:any)=>{
          if(x.id === id){
            return {
              ...x,
              isOpen: true,
              children: res
            }
          }
          return x
        })
        return {
          ...v,
          children
        }
      }
      return v
    })
    setList(newList as any)
  }

  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.box}>
          <ul>
            {
              list.map((v: any) => {


                return (
                  <div key={v.id}>
                    <li >
                      <span className={styles['title-name']}>{v.name}
                        {
                          !v.isOpen && (
                            <label className={styles.open} onClick={() => {
                              fetchNextClassify(v.id)
                            }}>展开</label>
                          )
                        }
                      </span>
                      <span className={classnames({
                        [styles['link']]: true,
                        [styles.active]: v.id === curId
                      })} onClick={() => {
                        setCurId(v.id)
                        props.handleSel({id:v.id, name: v.name})
                      }}>{v.id === curId ? '已选' : '选择连接'}</span>
                    </li>
                    {
                      v.children && v.children.length && v.children.map((x: any) => {
                        return (
                          <div key={x.id} >
                            <li className={styles['two']}>
                              <span className={styles['title-name']}>{x.name}
                                {
                                  !x.isOpen && (
                                    <label className={styles.open} onClick={() => {
                                      fetchNextClassify_2(x.id, v.id)
                                    }}>展开</label>
                                  )
                                }
                              </span>
                              <span className={classnames({
                                [styles['link']]: true,
                                [styles.active]: x.id === curId
                              })} onClick={() => {
                                setCurId(x.id)
                                props.handleSel({id:x.id, name: x.name})
                              }}>{x.id === curId ? '已选' : '选择连接'}</span>
                            </li>
                            {
                              x.children && x.children.length && x.children.map((o: any) => {
                                return (
                                  <li key={o.id} className={styles['three']}>
                                    <span className={styles['title-name']}>{o.name}</span>
                                    <span className={classnames({
                                      [styles['link']]: true,
                                      [styles.active]: o.id === curId
                                    })} onClick={() => {
                                      setCurId(o.id)
                                      props.handleSel({id:o.id, name: o.name})
                                    }}>{o.id === curId ? '已选' : '选择连接'}</span>
                                  </li>

                                )
                              })
                            }
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </ul>
        </div>
      </Spin>
    </>
  )
}

export default Type

