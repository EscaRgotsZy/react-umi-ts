
import styles from './index.less'
import React, { useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd';
import { ComponentListData } from '@/models/renovation'

interface LeftNodeProps {
  slotName: string;
}
const LeftNode: React.FC<LeftNodeProps> = (props) => {
  const [list] = useState([...ComponentListData])


  return (
    <>
      <div className={styles.title}>
        <span>组件库</span>
        <span>拖拽使用</span>
      </div>

      <div className={styles['component-list']}>

        <Container groupName="1" behaviour="copy" getChildPayload={i => list[i]} >
          {
            list.map((v, i) => {
              let item = v[1] || {};
              return (
                <Draggable key={i}>
                  <div className={styles.item}>
                    <img src={item.icon} draggable="false"/>
                    <span>{item.title}</span>
                  </div>
                </Draggable>
              )
            })
          }
        </Container>

      </div>
    </>
  )
}


export default LeftNode;