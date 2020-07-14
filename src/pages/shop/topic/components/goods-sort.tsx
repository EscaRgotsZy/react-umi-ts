import styles from './card.less';

import React, { Component } from 'react';
import { Container, Draggable } from "react-smooth-dnd";
import { message, Form, Input, Popconfirm } from 'antd';
import Card from './card'
const FormItem = Form.Item;

function applyDrag(arr: any, dragResult: any) {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

interface useProps {
  list: any;
  sortGoodsIds: Function;
}
interface useStates {
  list: any;
}

export default class GoodsSort extends Component<useProps, useStates> {
  formRef: React.RefObject<any>;
  constructor(props: useProps) {
    super(props)
    this.formRef = React.createRef();
    this.state = {
      list: [...this.props.list]
    }
  }
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.list.length !== this.state.list.length) {
      this.setState({ list: [...nextProps.list] })
    }
  }
  // 根据当前拖拽的元素下标 -> 返回当前元素
  getCardPayload = (index: number) => {
    return this.state.list[index]
  }
  // 拖拽完 
  onCardDrop = (dropResult: any) => {
    // 排除没有动过的列
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let scene = [...this.state.list]
      scene = applyDrag(scene, dropResult);
      this.setState({ list: scene })
      this.props.sortGoodsIds(scene.map(v => v.productId))
    }
  }

  sortDom = () => {
    let data = this.state.list || [];
    return (
      <>
        <div style={{ color: '#000', marginBottom: 5 }}>请输入修改排序后的位置</div>
        <Form ref={this.formRef}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="位置" name="sortOrder" rules={[{ required: true, message: `请输入` }, { pattern: /^\d+$/, message: "只能输正整数" }, { pattern: /^[1-9](\d+)?$/, message: "不能输入0" }]}>
            <Input placeholder={`1~${data.length}`} size="small" />
          </FormItem>
        </Form>
      </>
    )
  }
  cancelSort = () => {
    this.formRef.current.resetFields(['sortOrder']);
  }
  // 排序
  okSort = (index: number, payload: any) => {
    let data = this.state.list || [];
    this.formRef.current.validateFields(['sortOrder'])
      .then((values: any) => {
        let { sortOrder } = values;
        this.cancelSort();
        if (+sortOrder <= 0 || +sortOrder > data.length) {
          message.error(`只能输入1~${data.length}`)
          return false;
        }
        this.onCardDrop({ removedIndex: index, addedIndex: sortOrder - 1, payload })
      })
      .catch(() => { })
  }

  render() {
    const { list } = this.state;
    return (
      <div className={styles.cardScene}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className={styles.cardContainer}>
            <div className={styles.cardColumnHeader}>
              <div>已选择<span>选中({list.length})条</span></div>
            </div>
            <Container
              orientation="vertical"
              style={{ minHeight: 500 }}
              groupName={'col'}
              dragClass={styles.cardGhost}
              dropClass={styles.cardGhostDrop}
              onDrop={e => this.onCardDrop(e)}
              getChildPayload={index => this.getCardPayload(index)}
              nonDragAreaSelector=".field1"
            >
              {list.map((card: any, i: number) => {
                return (
                  <Popconfirm key={card.productId} placement="leftTop" title={this.sortDom()} onConfirm={() => this.okSort(i, card)} onCancel={this.cancelSort} okText="确定" cancelText="取消">
                    <Draggable>
                      <Card data={card} index={i + 1} />
                    </Draggable>
                  </Popconfirm>
                );
              })}
            </Container>
          </div>

          <div className={`${styles.cardContainer} ${styles.transparent}`}>
            <div className={styles.cardColumnHeader}>
            </div>
            <Container
              orientation="vertical"
              style={{ height: '100%' }}
              groupName={'col'}
            >
            </Container>
          </div>

        </div>
      </div>
    )
  }
}