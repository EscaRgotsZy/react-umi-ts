
import styles from './index.less'
import React from 'react'
import { connect } from 'umi'
import { applyDrag, CurComponentType } from '@/models/renovation'
import { Container, Draggable } from 'react-smooth-dnd';
import { Modal, message } from 'antd';
import classnames from 'classnames'

interface HoverHeaderProps {
  title: string;
  handleDel: Function;
}
function HoverHeader(props: HoverHeaderProps) {
  return (
    <div className={styles['hover-header']}>
      <span>{props.title}</span>
      <span className={styles.del} onClick={(e) => {
        e.stopPropagation();
        Modal.confirm({
          content: '确认要删除组件吗？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            props.handleDel()
          }
        });
      }}>删除</span>
    </div>
  )
}

interface MiddleNodeProps {
  slotName: string;
  dispatch: any;
  componentList: any[];
  curComponent: CurComponentType;
}
const MiddleNode: React.FC<MiddleNodeProps> = (props) => {
  const { componentList, dispatch, curComponent } = props;

  return (
    <>
      <div className={styles['title']}></div>
      <div className={styles['container']}>

        <Container groupName="1" getChildPayload={i => componentList[i]}
          dragClass={styles['card-ghost']}
          dropClass={styles['card-ghost-drop']}
          dropPlaceholder={{                      
            animationDuration: 150,
            showOnTop: true,
            className: styles['drop-preview']
          }}
          onDrop={(record:any):any => {
            let { removedIndex, addedIndex, payload } = record;
            // 啥都没干
            if (removedIndex === addedIndex && removedIndex !== null)return false;

            let type = payload[0];
            const LabelType = 5;
            // 标签tab
            if(type === LabelType){
              // 添加
              if(removedIndex === null){
                if(componentList.filter(v=> v[0] === LabelType).length){
                  return message.warn('标签TAB只能添加一个')
                }
                if(componentList.length !== addedIndex){
                  return message.warn('标签TAB必须在最底下')
                }
              }else{
                // 移动
                if(addedIndex !== componentList.length-1){
                  return message.warn('标签TAB必须在最底下')
                }
              }
            }else{
              // 其他元素移动的时候 看是不是和标签换位
              if(removedIndex !== null && componentList.filter(v=> v[0] === LabelType).length){
                let newList = applyDrag(componentList, record)
                if(newList[newList.length-1][0] !== LabelType){
                  return message.warn('标签TAB必须在最底下')
                }
              }
            }


            
            if (removedIndex === null && addedIndex !== null) {// 新增
              dispatch({
                type: 'renovation/addComponents',
                record
              })
            } else {// 排序
              let newList = applyDrag(componentList, record)
              dispatch({
                type: 'renovation/sortComponents',
                payload: newList
              })
            }
          }}>
          
          
          {
            componentList.map((v: any, i: number) => {
              let item: any = v[1];
              let key = v[0];
              let isActive = curComponent.type === key && curComponent.id === item.id;
              return (
                <Draggable key={i}>
                  <div className={classnames({
                    [styles['component-item']]: true,
                    [styles['active']]: isActive
                  })} onClick={() => {
                    !isActive && dispatch({
                      type: 'renovation/changeCurComponent',
                      payload: {
                        type: key,
                        id: item.id
                      }
                    })
                  }}>
                    <div>
                      <HoverHeader title={item.title} handleDel={() => {
                        dispatch({
                          type: 'renovation/delComponents',
                          payload: {
                            id: item.id,
                            list: applyDrag(componentList, {
                              addedIndex: null,
                              removedIndex: i,
                            })
                          }
                        })
                      }} />
                      <span>{item.title}</span>
                    </div>
                  </div>
                </Draggable>
              );
            })
          }
        </Container>

      </div>
    </>
  )
}

export default connect(({ renovation }: any) => ({
  componentList: renovation.componentList,
  curComponent: renovation.curComponent,
}))(MiddleNode)
