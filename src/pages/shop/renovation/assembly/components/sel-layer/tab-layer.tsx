
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Modal, Tree } from 'antd'
import { getFirstCateList, getNextCateList } from '@/services/goods/classify'

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}


interface TabProps {
  visible: boolean;
  handleOk: Function;
  handleClose: Function;
}
const TabLayer: React.FC<TabProps> = (props) => {
  let { visible, handleOk, handleClose } = props;
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);


  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    let res = await getFirstCateList();
    setTreeData(res)
  }


  function onLoadData({ key, children }: any) {
    return new Promise(async resolve => {
      if (children) {
        resolve();
        return;
      }

      let res = await getNextCateList({ categoryId: key })
      setTreeData(origin =>
        updateTreeData(origin, key, res),
      );

      resolve();
    });
  }

  return (
    <Modal
      title={'选择分类'}
      onOk={() => {
        handleOk(data)
      }}
      onCancel={() => {
        handleClose()
      }}
      width={900}
      visible={visible}
    >
      <div className={styles['box']}>
        <Tree checkable loadData={onLoadData as any} treeData={treeData} 
        onCheck={(checkedKeys, node)=>{
          setCheckedKeys(checkedKeys as any[])
          setData(node.checkedNodes.map((v:any)=>({
            categoryId: v.id,
            categoryName: v.title
          })))
        }}
       
        checkedKeys={checkedKeys}
      />
      </div>
    </Modal>
  )
}

export default TabLayer