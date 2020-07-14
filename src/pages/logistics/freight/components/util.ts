

export const toNumber = (val: string, oldVal: number | string) => {
  console.log("toNumber -> oldVal", oldVal)
  console.log("toNumber -> val", val)
  console.log("toNumber -> /^\d+\.?\d{0,4}$/.test(val)", /^\d+\.?\d{0,4}$/.test(val))
  if(/^\d+\.?\d{0,4}$/.test(val) || val === ''){
    return val
  }
  return oldVal
}

// 消除 无用元素
const cutArr = (arr:any[], level:number) => {
  let curArr = arr.filter(v=> v.level === level)
  return arr.filter(v=> !curArr.filter(x=> v[level === 1?'topId': 'prevId'] === x.key).length)
}

/**
 * 处理区域  (比key 和父级id)
 * 1、如果子集全选了 只留父级
 */
export const handleArea = (arr: any[]) => {
  if(!Array.isArray(arr))return []
  return cutArr(cutArr([...arr], 1), 2);
}



// 递归算法 - 快速找出需要disable的元素
const reduceSetDisable = (data: any, keyList: Array<string | number>) => {
  let childrenObj:any = {};
  if(Array.isArray(data.children)){
    childrenObj.children = data.children.map((v:any)=>reduceSetDisable(v, keyList))
  }
  return {
    ...data,
    disabled: keyList.includes(data.key),
    ...childrenObj,
  }
}
/**
 * 设置原数组 disable 状态 （只比key）
 * 1、如果arr 里面包含arr2 就置为disable状态
 * @param arr   原数组
 * @param arr2  对比的数组
 */
export const setAreaDisable = (arr: any[], arr2: any[]) => {
  if(!Array.isArray(arr) || !Array.isArray(arr2))return []
  let keyList = arr2.map((v:any)=> v.key)
  return arr.map((v:any)=>reduceSetDisable(v, keyList))
}


/**
 * 排除元素组 一部分包含arr2 里面的元素 （只比key）
 * @param arr   原数组
 * @param arr2  需要排除的元素
 */
export const excludeArr = (arr: any[], arr2: any[]) => {
  if(!Array.isArray(arr) || !Array.isArray(arr2))return []
  let keyList = arr2.map((v:any)=> v.key)
  return arr.filter((v:any)=> !keyList.includes(v.key) )
}




// 查看一二级 的子集个数
function childrenCount(areaList:any[]){
  let obj = {}
  areaList.forEach((v:any)=>{
    let children = v.children;
    obj[v.key] = children.length;
    children.forEach((x:any)=>{
      obj[x.key] = x.children.length;
    })
  })
  return obj
}

// 补全 arr信息不足
function db(key:number, allArr:any[]){
  if(!allArr.length)return false;
  let tmplObj:any = null;
  for(let i = 0; i< allArr.length; i++){
    if(allArr[i]['key'] === key){
      tmplObj = allArr[i]
      break;
    }else{
      if(!tmplObj){
        tmplObj = db(key, allArr[i]['children'] || [])
      }else{
        break;
      }
    }
  }
  return tmplObj
}

/**
 * 如果子集id全部选中 父级也要选中
 * @param arr   源数组 
 * @param arr1  对比的数组 全量
 */
export const padKey = (arr:any[], arr1: any[], isNeedKey=false) => {
  let treeCountMap = childrenCount(arr1);// 查看一二级 的子集个数
  let rArr = arr.map(v=>db(v.key, arr1))// 补全 arr信息不足

  // 先找到所有二级 帮勾上
  let needArr:any[] = [];
  arr1.forEach(v1=>{
    let child = v1.children || [];
    child.forEach((o:any)=>{
      let count = treeCountMap[o.key];
      if(count === rArr.filter(n=> n.prevId === o.key && n.level === 3).length){
        needArr.push(o)
      }
    })
  })
  let res1 = rArr.concat(needArr)
  
  // 再找所有一级 帮勾上
  let needArr2:any[] = []
  arr1.forEach(v1=>{
    let count = treeCountMap[v1.key];
    if(count === res1.filter(n=> n.topId === v1.key && n.level === 2).length){
      needArr2.push(v1)
    }
  })
  let res2 = res1.concat(needArr2);


  let newArrAll = res2.map(v=> v.key)

  // 去重
  let newArr = Array.from(new Set([...newArrAll]))
  if(isNeedKey){
    return newArr
  }else{
    return newArr.map(v=>db(v, arr1));
  }
}


// 子全部disable 父级自动disable
export const padParentDisable = (arr:any[]) => {
  // 找出二级需要disable
  let newArr1 = arr.map(v=> {
    let children = v.children || [];
    return {
      ...v,
      children: children.map((o:any)=>{
        let child = o.children || [];
        let disabled = false;

        if(child.length === child.filter((n:any) => n.disabled).length){
          disabled = true
        }

        return {
          ...o,
          disabled
        }
      })
    }
  })

  // 找出一级需要disable
  let newArr2 = newArr1.map(v=> {
    let child = v.children || [];
    let disabled = false;

    if(child.length === child.filter((n:any) => n.disabled).length){
      disabled = true
    }

    return {
      ...v,
      disabled
    }
  })
  return newArr2
}