import React, { Component } from 'react';
import { Tree, Drawer } from 'antd';
import { getCategories, getSubCategories } from '@/services/shop/topic'

const { TreeNode } = Tree;

interface useProp{
  selCategory: Function;
  categoryIds: any;
}
interface useState{
  drawerVisible: boolean;
  treeData: any[];
  checkedKeys: any;
}
export default class CategoryLayer extends Component<useProp, useState> {
  constructor(props: useProp){
    super(props)
    this.state = {
      drawerVisible: false,
      treeData: [],
      checkedKeys: [],
    }
  }
  categoryIdMap={};
  componentDidMount(){
    this.initData()
  }
  initData(){
    this.getCategoriesList();
  }
  async getCategoriesList(){
    let res = await getCategories();
    this.setState({treeData: res})
    res.forEach((v:any)=>{
      this.categoryIdMap[v.key] = v.title;
    })
  }

  drawerShow = (flag:boolean) => {
    this.setState({drawerVisible: flag})
  }
  onCheck = (checkedKeys:any) => {
    const { selCategory } = this.props;
    this.setState({ checkedKeys });
    selCategory(checkedKeys, this.categoryIdMap)
  };
  renderTreeNodes = (data:any) => {
    return data.map((item:any) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });
  }
  onLoadData = (treeNode:any) =>{
    return new Promise(async resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let res = await getSubCategories({categoryId: treeNode.props.eventKey})
      treeNode.props.dataRef.children = res
      res.forEach((v:any)=>{
        this.categoryIdMap[v.key] = v.title;
      })
      this.setState({
        treeData: [...this.state.treeData],
      });
      resolve();
    });
  }

  render(){
    const { drawerVisible, treeData } = this.state;

    return (
      <Drawer
        title="选择分类"
        placement={'right'}
        closable={true}
        width={800}
        onClose={()=> this.drawerShow(false)}
        visible={drawerVisible}
      >
      <Tree
        checkable
        autoExpandParent={true}
        showLine={true}
        showIcon={true}
        onCheck={this.onCheck}
        checkedKeys={this.props.categoryIds}
        loadData={this.onLoadData}
      >
        {this.renderTreeNodes(treeData)}
      </Tree>
      </Drawer>
    )
  }
}

