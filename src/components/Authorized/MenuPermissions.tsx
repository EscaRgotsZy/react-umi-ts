
import React, { useEffect, useState,  } from 'react';
import { Drawer, Tree, Button, message } from 'antd'
import {
  getResourceLists,
} from '@/services/system/role';
interface UserProp {
  checkRoleData:any;
  roleKeys:any;
}
const MenuPermissions: React.FC<UserProp> = (props) => {
  let [treeData, setTreeData] = useState<Array<any>>([]);
  let [selectedKeys,setSelectedKeys] = useState<Array<any>>([]);
  useEffect(() => {
    getRoutersList()
    setSelectedKeys(props.roleKeys);
    // return ()=>{
    //   setTreeData([]);
    //   setSelectedKeys([])
    // }
  }, [])
  useEffect(() => {
    setSelectedKeys(props.roleKeys)
  }, [props])
  async function getRoutersList() {
    let res:any = await getResourceLists();
    setTreeData(res.data)
  }
  function onSelect(selectedKeys:any, e:any){
    setSelectedKeys(selectedKeys)
    setRoleTreeData(selectedKeys)
  }
  function setRoleTreeData(selectedKeys:any){
    props.checkRoleData(selectedKeys)
  }
  return (
    <Tree
      checkable
      checkedKeys={selectedKeys}
      onCheck={onSelect}
      treeData={treeData}
    />
  );
};
export default MenuPermissions;
