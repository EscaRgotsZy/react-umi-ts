import React, { useState, useMemo, useEffect } from 'react';
import { Drawer, Tree, Button, message  } from 'antd'
import { connect } from 'umi';
import { StateType, CurLayerInfoType, AreaDeliveryWayItem, NotDeliveryWayItem } from '@/models/freight'
import { setAreaDisable, excludeArr, handleArea, padKey, padParentDisable } from './util'

interface RegionLayerProps {
  dispatch?: any;
  areaList: any;
  curLayerInfo: CurLayerInfoType;
  showAreaLayer: boolean;
  areaDeliveryWay: any[];
  notDeliveryWay: any[];
  selectedAll: any[];
}
const RegionLayer:React.FC<RegionLayerProps> = (props) => {
  const { dispatch, areaList, curLayerInfo, showAreaLayer, areaDeliveryWay, notDeliveryWay, selectedAll } = props;

  const [checkedKeys, setCheckedKeys] = useState<any>([])
  const [checkedNodes, setCheckedNodes] = useState<any>([])


  useEffect(()=>{
    if(showAreaLayer){// 打开弹框
      let { selected }:any = curLayerInfo;
      // tips setCheckedKeys 如果子集id全部选中 父级也要选中 回显用到 因为接口只要第三级
      setCheckedKeys(padKey(selected, areaList, true))
      setCheckedNodes(padKey(selected, areaList))
    }else{// 关闭弹框
      setCheckedKeys([])
      setCheckedNodes([])
    }
  }, [showAreaLayer])

  

  const treeData = useMemo(()=>{
    // 第一步 将编辑的剔除
    let _allArr = excludeArr(selectedAll, curLayerInfo.selected)
    // 第二步 给treeData 设置disabled
    
    // tips 子全部disable 父类自动disable
    return padParentDisable(setAreaDisable(areaList, _allArr))
  }, [areaList, selectedAll, curLayerInfo])

  // treeCountMap 记录一级里面有多少二级、二级里面有多少个三级
  const treeCountMap = useMemo(()=>{
    let obj = {}
    areaList.forEach((v:any)=>{
      let children = v.children;
      obj[v.key] = children.length;
      children.forEach((x:any)=>{
        obj[x.key] = x.children.length;
      })
    })
    return obj
  }, [areaList])



  function setValueByAdd(areaArr: any[]){
    if(curLayerInfo.tag === 1){// 指定区域
      dispatch({
        type: 'freight/setAreaDeliveryWay',
        payload: [...areaDeliveryWay, {
          ...AreaDeliveryWayItem,
          districts: areaArr,
          districtInfo: handleArea(areaArr),
        }]
      })
    }
    if(curLayerInfo.tag === 2){// 不指定区域
      dispatch({
        type: 'freight/setNotDeliveryWay',
        payload: [...notDeliveryWay, {
          ...NotDeliveryWayItem,
          districts: areaArr,
          districtInfo: handleArea(areaArr),
        }]
      })
    }
  }

  function setValueByEdit(areaArr: any[]){
    if(curLayerInfo.tag === 1){// 指定区域
      dispatch({
        type: 'freight/setAreaDeliveryWay',
        payload: areaDeliveryWay.map((v, i)=>{
          if(i === curLayerInfo.index){
            return {
              ...v,
              districts: areaArr,
              districtInfo: handleArea(areaArr),
            }
          }
          return v;
        })
      })
    }
    if(curLayerInfo.tag === 2){// 不指定区域
      dispatch({
        type: 'freight/setNotDeliveryWay',
        payload: notDeliveryWay.map((v, i)=>{
          if(i === curLayerInfo.index){
            return {
              ...v,
              districts: areaArr,
              districtInfo: handleArea(areaArr),
            }
          }
          return v;
        })
      })
    }
  }

  function filterParentNode(areaArr:any[]){
    // 第一步 过滤二级
    let arr1 = areaArr.reduce((mo:any[], v:any)=>{
      let key = v.key
      if(v.level === 2){
        if( treeCountMap[key] === areaArr.filter(o=> o.prevId === key && o.level === 3).length ){
          mo.push(v)
        }
      }else{
        mo.push(v)
      }
      return mo
    }, [])
    // 第二步 过滤一级
    let arr2 = arr1.reduce((mo:any[], v:any)=>{
      let key = v.key
      if(v.level === 1){
        if( treeCountMap[key] === arr1.filter(o=> o.topId === key && o.level === 2).length ){
          mo.push(v)
        }
      }else{
        mo.push(v)
      }
      return mo
    }, [])
    return arr2
  }

  function setSelectedAll(arr:any[]){
    dispatch({
      type: 'freight/saveSelectedAll',
      payload: arr
    })
  }
  function closeLayer(){
    dispatch({
      type: 'freight/setShowAreaLayer',
      payload: false
    })
  }
  function onCheck(checkedKeys:any, info:any) {
    setCheckedKeys(checkedKeys)
    setCheckedNodes(info.checkedNodes)
  }
  return (
    <Drawer
      title={curLayerInfo.tag === 1 ? "选择设置特殊区域" : '选择不配送区域'}
      placement={'right'}
      visible={showAreaLayer}
      closable={true}
      maskClosable={true}
      width={400}
      onClose={() => {
        dispatch({
          type: 'freight/setShowAreaLayer',
          payload: false
        })
      }}
    >
        <div style={{paddingBottom: 100}}>
        <Tree
          checkable
          checkedKeys={checkedKeys}// 默认选中复选框的树节点
          onCheck={onCheck}
          treeData={treeData}
        />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, margin: '20px' }}>
          <Button type='primary' style={{ margin: '0 10px' }} onClick={():any => {
            let areaArr:any[] = checkedNodes.filter((v:any)=> !v.disabled)
            if( !areaArr.length )return message.error('请至少选择一个区域');
            // Tips 注意下面这行代码的意义
            // 如果大类里面的子类disable了一部分 接着把剩下一部分全选了 antd也会给父级id 这块要过滤掉父类id 不然到页面组件那块显示会有问题
            // 没选满 带了父级id的都给去掉
            let _areaArr = filterParentNode(areaArr)

            // 新增
            if(curLayerInfo.type === 'add'){
              setValueByAdd(_areaArr)
              
              setSelectedAll(selectedAll.concat(_areaArr))
            }
            // 编辑
            if(curLayerInfo.type === 'edit'){
              setValueByEdit(_areaArr)

              setSelectedAll(excludeArr(selectedAll, curLayerInfo.selected).concat(_areaArr))
            }

            closeLayer()
          }}>确定</Button>
          <Button onClick={closeLayer}>取消</Button>
        </div>
    </Drawer>
  )
}

export default connect(({ freight }: { freight: StateType }) => ({
  areaList: freight.areaList,
  curLayerInfo: freight.curLayerInfo,
  showAreaLayer: freight.showAreaLayer,
  areaDeliveryWay: freight.areaDeliveryWay,
  notDeliveryWay: freight.notDeliveryWay,
  selectedAll: freight.selectedAll,
}))(RegionLayer);
