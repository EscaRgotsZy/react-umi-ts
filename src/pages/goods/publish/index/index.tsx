import React, { useEffect, useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, message, Modal, Checkbox, Form, Input } from 'antd';
import styles from './index.less'
import BaseLayer from '../base/index';
import AttrLayer from '../attr/index';
import ImageLayer from '../image/index';
import OtherLayer from '../other/index';
import DescribeLayer from '../describe/index';
import {
  findProductDetail,
  getApplyProperty,
  postSaveProd,
} from '@/services/goods/upload/publish'
interface UserProp {
  history: any;
  location: any;
  match: any;
}
const PublishGoods: React.FC<UserProp> = (props) => {
  let baseChild: any = useRef();
  let attrChild: any = '';
  let imgChild: any = '';
  let otherChild: any = '';
  let descChild: any = '';
  let formRef: any = React.createRef()
  let [categoryId, setCategoryId] = useState<string | number>(props.location.query.cateId);
  let [categoryName, setCategoryName] = useState<Array<string>>(props.location.query.cateName ? JSON.parse(props.location.query.cateName) : '');
  let [productId, setProductId] = useState<string | number>(props.location.query.productId);
  let [shwoView] = useState<string>(props.location.query.v || false);//查看
  let [goodsInfo, setGoodsInfo] = useState<any>({});//查看

  let [refresh, setRefresh] = useState<boolean>(false);//查看

  let [loading,setLoading] = useState<boolean>(false)



  let [applyLoading, setapplyLoading] = useState<boolean>(false);

  let [InitIsChangeList, setInitIsChangeList] = useState<Array<any>>();
  let [isOnlySku, setisOnlySku] = useState<any>();
  let [skuOnlyData, setskuOnlyData] = useState<any>();
  let [skuList, setskuList] = useState<any>();
  let [skuInitData, setskuInitData] = useState<any>();
  let [singfInfo,setInitSkuSingInfo] = useState<any>(false)
  let [queryData, setqueryData] = useState<any>();


  // 山川
  let [singleInfo, setsingleInfo] = useState<any>(false);
  let [uploadLoading, setuploadLoading] = useState<any>();
  let [checkAll, setcheckAll] = useState<any>();
  let [skuIndex, setskuIndex] = useState<any>(0);
  let [skuItems, setskuItems] = useState<any>();
  let [isLimit, setisLimit] = useState<any>();

  // 编辑
  let [goodsInfoData,setgoodsInfoData] = useState<any>();
  let [goodsImagesData,setgoodsImagesData] = useState<any>();
  let [editLoading,seteditLoading] = useState<any>();
  let [goodsAttributesData,setgoodsAttributesData] = useState<any>();
  let [goodsOtherData,setgoodsOtherData] = useState<any>();
  let [goodsDescribeData,setgoodsDescribeData] = useState<any>();
  let [videoUrl,setvideoUrl] = useState<any>();
  let [editAttributes, setEditAttributes] = useState<any>();
  let [editDescribeData, setEditDescribeData] = useState<any>()



  function setQuery() {

  }
  function changeChildrenData(props: string, data: any) {

  }
  const baseProps = {
    history: props.history,
    location: props.location,
    match: props.match,
    props,
  }

  useEffect(()=>{
    init()
  },[])
  function init() {
    if (!categoryId && !productId) {
      props.history.push('/goods/cate');
    } else if (categoryId && productId && !shwoView) {
      editProductInfo(productId)
    } else if (productId && shwoView) {
      editProductInfo(productId)
    }
  }
  // 获取修改数据详情
  async function editProductInfo(productId: string | number) {
    setLoading(true)
    let res: any = await findProductDetail(productId);
    setLoading(false)
    if (!res) return false;
    let { data } = res;
    if (data && data.status) {
      props.history.push('/#/home')
    }
    if(!data) return false
    setEditorData(data)
  }
  function setEditorData(data:any){
    let goodsInfoData = {
      productName: data.productName || '' || '',                      //  商品标题
      stocksArm: data.stocksArm || '',                                //  库存预警
      presentPrice: data.presentPrice || '',                          //  现价
      originalPrice: data.originalPrice || '',                        //  原价
      brief: data.brief || '',                                        //  卖点
      keyWord: data.keyWord || '',                                    //  网页关键字
      metaDesc: data.metaDesc || '',                                  //  网页描述
      metaTitle: data.metaTitle || '',                                //  网页标题
      shopId: data.shopId || '',                                      //  网页标题
      customParam: data.customParam || '',                            //  网页标题
      shopDetailVO: data.shopDetailVO || '',                          //  网页标题
      firstCategoryName: data.firstCategoryName || "",
      secondCategoryName: data.secondCategoryName || "",
      thirdCategoryName: data.thirdCategoryName || "",
      categoryId: data.categoryId || "",
      brandId: data.brandId || '',
      brandVO:data.brandVO,
      productTagVOS: data.productTagVOS || "",
    };

    // 视频信息
    let videoUrl = data.videoUrl || '';
    // 图片信息
    let goodsImagesData = data.productPic;
    // 其他信息
    let goodsOtherData = {
      isFreeDelivery: data.isFreeDelivery || '',                      //  物流方式[1:商家承担运费;0: 买家承担运费]
      firstLevelRate: data.firstLevelRate || '',                      //  员工返还比例
      secondLevelRate: data.secondLevelRate || '',                    //  企业返还比例
      isDist: data.isDist || '',
      publishStatus: data.publishStatus || '',                        //  是否开启佣金管理(0:关闭，1：开启)
      serviceExplainList: data.serviceExplainList || [],              //  是否开启佣金管理(0:关闭，1：开启)
      afterSaleVO: data.afterSaleVO || null,                          //  是否开启佣金管理(0:关闭，1：开启)
      guaranteeGroupVOS: data.guaranteeGroupVOS || [],                //  是否开启佣金管理(0:关闭，1：开启)
      templateId: data.templateId || '',                              //  运费模板id
      afterSaleId: data.afterSaleId || '',                            //  售后说明模板id
    };
    // 基础属性
    let goodsAttributesData = {
      attrResultVOS: data.attrResultVOS,
      productSkuVOS: data.productSkuVOS,
    }
    let productSkuInitList = data.productSkuVOS && data.productSkuVOS[0];
    // 回显时如果没有sku
    if (!data.attrResultVOS || data.attrResultVOS.length <= 0) {
      let skuOnlyData = {
        ...productSkuInitList
      }
      // this.setState({ skuOnlyData, isOnlySku: true });
      setskuOnlyData(skuOnlyData);
      setisOnlySku(true)
    }
    let InitIsChangeLists:any = data && data.attrResultVOS && data.attrResultVOS.length > 0 && data.attrResultVOS.map((item:any) => {
      let valueList:any = []
      item.attrValueVOS.forEach((element:any) => {
        valueList.push(element.name)
      });
      return {
        key: item.attrKeyVO.attrName,
        value: valueList
      }
    })
    // this.setState({ InitIsChangeList }) // 修改时的数组
    // InitIsChangeLists = JSON.parse(JSON.stringify(InitIsChangeLists))
    setInitIsChangeList(InitIsChangeLists);
    // 商品描述
    let goodsDescribeData = {
      mobileContent: data.mobileContent,
      content: data.content,
    }
    // this.setState({ goodsInfoData, goodsImagesData, editLoading: false, goodsAttributesData, goodsOtherData, goodsDescribeData, videoUrl });
    setgoodsInfoData(goodsInfoData);
    setgoodsImagesData(goodsImagesData);
    seteditLoading(false);
    setgoodsAttributesData(goodsAttributesData);
    setgoodsOtherData(goodsOtherData);
    setgoodsDescribeData(goodsDescribeData);
    setvideoUrl(videoUrl);
  }

  async function subMitData() {
    let queryData = {
      ...baseChild.current.childMethod(),
      ...attrChild.childMethod(),
      ...imgChild.childMethod(),
      ...otherChild.childMethod(),
      ...descChild.childMethod(),
    }

    let attributeList = queryData.attributeList;
    let firstLevelRate = queryData.firstLevelRate && queryData.firstLevelRate || 0;
    let secondLevelRate = queryData.secondLevelRate && queryData.secondLevelRate || 0;




    if (parseFloat(secondLevelRate) + parseFloat(firstLevelRate) > 100) {
      message.error('佣金管理中总计分佣比例不能超过100%')
      return false
    }
    if (!queryData.shopId) {
      message.error('请完成基础信息中店铺选择');
      return false
    }
    if (!queryData.attributeList || queryData.attributeList.length <= 0) {
      message.error('请完善商品属性中属性配置');
      return false
    }
    if (!queryData.templateId) {
      message.error('请选择运费模板');
      return false
    }
    // console.log('父组件获取', queryData)
    attributeList = JSON.stringify(attributeList)
    let query = { customAttribute: attributeList }
    let res = await getApplyProperty({ ...query });
    if (!res) return false;
    setapplyLoading(true)
    let { data } = res;
    if (productId && (JSON.stringify(InitIsChangeList) == attributeList)) {


      // 修改商品信息时看属性是否更改

      let newSkulist = goodsAttributesData.productSkuVOS;
      let skuInitData = newSkulist[0];

      // 如果是单品的编辑 默认拿取单品信息
      if (isOnlySku && newSkulist.length == 0) {

        skuInitData = skuOnlyData
      }
      // 判断是否是全选
      let isCheckAll = true;
      newSkulist && newSkulist.length > 0 && newSkulist.forEach((item: any) => {
        if (!item.status) {
          isCheckAll = false;
        }
      })
      // this.setState({ skuList: newSkulist, singleInfo: true, skuInitData, queryData, checkAll: isCheckAll });
      setskuList(newSkulist);
      setsingleInfo(true);


      setskuInitData(skuInitData);
      setInitSkuSingInfo(!singfInfo)

      setqueryData(queryData);
      setcheckAll(isCheckAll);

    } else {
      let skuLists = data && data.length > 0 && formatSkuList(data) || [];// skulist
      // ---------------------------------------------------->设置sku格式

      // 方法二
      function formatSkuList(skuList: any) {
        // 合并对象字段
        const mergeParams = skuList.map((item: any) => {
          const { attrId, attrName, displayType } = item.attrKeyBO;
          let ret: any = [];
          item.arrtValueList.forEach((valueItem: any) => {
            const { name, valueId, pic } = valueItem;
            ret.push({ attrId, valueId, attrName, name, displayType, pic })
          });
          return ret
        })

        // 随机组合
        const randomGroup = mergeParams.reduce((a: any, b: any) => {
          var ret: any = [];
          a.forEach((a: any) => { b.forEach((b: any) => { ret.push([...a, b]) }) });
          return ret
        }, [[]])

        // 最终结果
        const result = randomGroup.map((item: any) => {
          const obj: any = { skuProps: [], saleProps: [], pic: [] };
          item.forEach((subItem: any) => {
            obj.skuProps.push(`${subItem.attrId}:${subItem.valueId}`);
            obj.saleProps.push(`${subItem.attrName}:${subItem.name}`);
            obj.pic.push(!!+subItem.displayType ? subItem.pic : '')
          });
          obj.skuProps = obj.skuProps.join(';');
          obj.saleProps = obj.saleProps.join(';');
          obj.pic = obj.pic.filter((x: any) => x).join('');
          return obj
        });
        return result
      }
      // ---------------------------------------------------->设置sku格式
      let keyIdsArr: any = [];
      data && data.length > 0 && data.forEach((element: any) => {
        if (element.attrKeyBO && element.attrKeyBO.attrId) {
          keyIdsArr.push(element.attrKeyBO.attrId)
        }
      });
      let keyIds = keyIdsArr.length > 0 && keyIdsArr.join(',') || '';
      skuLists = skuLists && skuLists.map((item: any) => {
        return {
          skuProps: item.skuProps,
          saleProps: item.saleProps,
          pic: item.pic,
          name: queryData.productName,
        }
      })
      // if (!skuLists || skuLists.length == 0) {
      //   message.error('商品属性值不能有空值');
      //   return false;
      // }
      queryData.skuList = skuLists;
      queryData.keyIds = keyIds;
      let skuInitData = queryData.skuList[0];
      if (isOnlySku && queryData.skuList.length == 0) {
        skuInitData = skuOnlyData
      }
      let skuList = queryData.skuList;
      // 判断是否是全选
      let isCheckAll = true;
      skuList && skuList.length > 0 && skuList.forEach((item: any) => {
        if (!item.status) {
          isCheckAll = false;
          item.status = 0
        } else {
          item.status = 1
        }
      })
      // setsingleInfo(true);
      // setqueryData(queryData);
      // setskuInitData(skuInitData);
      // setskuList(skuList);
      // setcheckAll(isCheckAll);
      if (!queryData.productName) {
        message.error('请填写商品基本信息');
      } else {
        if (!queryData.productPic) {
          message.error('请上传商品图片');
        } else {
          // this.setState({ singleInfo: true, queryData, skuInitData, skuList, checkAll: isCheckAll })
          setsingleInfo(true);
          setqueryData(queryData);
          setskuInitData(skuInitData);
          setInitSkuSingInfo(!singfInfo)


          setskuList(skuList);
          setcheckAll(isCheckAll);
        }
      }
    }
  }
  useEffect(()=>{
    if(singleInfo == true){
      formRef.current && formRef.current.setFieldsValue({
        price: skuInitData.price,                         // 现价
        name: skuInitData.name,                           // 商品名称
        stocks: skuInitData.stocks,                       // 库存
        actualStocks: skuInitData.actualStocks,           // 库存预警
        status: skuInitData.status || 1,                  // 1上架0下架
        partyCode: skuInitData.partyCode,                 // 商家编码
        modelId: skuInitData.modelId,                     // 商品条形码
        volume: skuInitData.volume,                       // 物流体积
        weight: skuInitData.weight,                       // 物流体重
        outerId: skuInitData.outerId,               // 限购类型
      });
    }
  },[singfInfo])
  // -------------------------------------------------------------------------单品---------------------------------------------------------------
  // 上传商品
  async function submitUploadGoods() {

    // let { queryData, categoryId, skuList, } = this.state;
    // 计算库存
    function sum(arr: any) {
      var s = 0;
      for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i].status) {
          s += parseInt(arr[i].stocks);
        }
      }
      return s;
    }
    formRef.current.validateFields().then((fieldsValue: any): any => {
      let { price = '', name = '', stocks = '', status = '', partyCode = '', modelId = '', volume = '', weight, outerId } = fieldsValue;
      let actualStocks = 0;// spu
      let spuOuterId = '';
      let obj: any = { price, name, stocks, actualStocks, status, partyCode, modelId, volume, weight, outerId };
      let skus = '';
      let skusOkStatus = true;
      let skuPriceList: any = [];
      skuList && skuList.length > 0 && skuList.forEach((item: any) => {
        skuPriceList.push(item.price)
      })
      queryData.presentPrice = Math.min.apply(null, skuPriceList);
      // 配置sku
      if (skuList.length > 0) {
        skuList && skuList.forEach((item: any) => {
          item.pic = queryData.productPic && queryData.productPic.split(",")[0] || '';
          if (productId) {
            item.outerId = item.outerId;
          }
        })
        skus = JSON.stringify(skuList);
        actualStocks = sum(skuList);
        skuList.forEach((item: any) => {
          if ((!item.price && item.price != 0) || (!item.stocks && item.stocks != 0) || (!item.outerId && item.outerId != 0) || (queryData.chargeMode == 1 && !item.weight && item.weight != 0)) {
            skusOkStatus = false
          }
        })
        spuOuterId = skuList[0].outerId;
      } else {
        let Sku_0 = [];
        obj.pic = queryData.productPic && queryData.productPic.split(",")[0] || '';
        Sku_0.push(obj);
        actualStocks = sum(Sku_0);
        skus = JSON.stringify(Sku_0)
      }

      let query = {
        actualStocks,                                                 //  实际库存
        afterSaleId: queryData.afterSaleId || '',                     //  售后服务id
        brief: queryData.brief,                                       //  卖点
        categoryId: queryData.categoryIds ? queryData.categoryIds : categoryId,     //  分类id
        content: queryData.content,                                   //  PC详细描述
        customParam: queryData.customParam || "",                     //  {[\"key\": \"长度\",\"value\":\"15CM\"]}
        firstLevelRate: queryData.firstLevelRate,                     //  员工返还比例
        isDist: queryData.isDist || false,                            //  是否开启佣金管理(0:关闭，1：开启)
        isFreeDelivery: queryData.isFreeDelivery || false,            //  物流方式[1:商家承担运费;0: 买家承担运费]
        keyIds: queryData.keyIds,                                     //  商品属性id拼接
        mobileContent: queryData.mobileContent,                       //  详细描述(手机端)
        originalPrice: queryData.originalPrice,                       //  原价
        presentPrice: queryData.presentPrice,                         //  现价
        productName: queryData.productName,                           //  商品标题
        productPic: queryData.productPic,                             //  图片路径（中间用逗号隔开）
        publishStatus: queryData.publishStatus,                       //  设定商品发布后状态 1：上线，2：设定：有记录开始时间，0：放入仓库
        secondLevelRate: queryData.secondLevelRate,                   //  企业返还比例
        securityIds: queryData.securityIds,                           //  保障服务ID（用逗号分隔）
        serviceIds: queryData.serviceIds || '',                       //  服务说明ID（用逗号分隔）
        setUpTime: queryData.setUpTime,                               //  设定上线时间（yyyy-MM-dd HH:mm:ss）
        shopId: queryData.shopId,
        brandId: queryData.brandId,                                        //品牌id
        productTag: queryData.productTag,                             //商品标签
        skus,                                                         //  skus数组
        stocksArm: queryData.stocksArm,                               //  库存预警值
        videoUrl: queryData.videoUrl,                                 //  库存预警值
        templateId: queryData.templateId,                              //  运费模板id
        deliveryWeight: queryData.deliveryWeight || '',                //  运费限重重量
        outerId: spuOuterId || ''                                      //  产品编码
      }
      // 拿值设置上传
      if (skusOkStatus) {
        // console.log('商品上传参数', query)
        setuploadLoading(true);
        setUploadQuery(query)
      } else {
        message.error('请完善其他单品信息')
      }
    }).catch((err: Error) => { })
  }
  async function setUploadQuery(query: any) {
    let res;
    setuploadLoading(true)
    if (productId) {
      query.productId = productId;
    }
    res = await postSaveProd({ ...query });
    setuploadLoading(false)
    if (!res) return false;
    message.success(productId ? '编辑成功' : '新增成功')
    setTimeout(props.history.push('/goods/warehouse'), 2500)
  }
  // 单品上线全选操作
  function onCheckAllChange(e: any) {
    let value = e.target.checked;

    if (value) {
      skuList.forEach((item: any) => item.status = 1)
    } else {
      skuList.forEach((item: any) => item.status = 0)
    }
    setskuList(skuList)
    setcheckAll(value)
  };

  // 设置单品上线
  function onChangeSkuStatus(e: any, index: any) {
    let value = e.target.checked;
    skuList[index].status = value ? 1 : 0;
    let isCheckAll = true;
    skuList && skuList.length > 0 && skuList.forEach((item: any) => {
      if (!item.status) {
        isCheckAll = false;
      }
    })
    // this.setState({ skuList, checkAll: isCheckAll })
    setskuList(skuList);
    let refreshs = refresh;
    setRefresh(!refreshs);
    setcheckAll(isCheckAll);
  }

  // 点击sku
  function handleSkuItems(items: any, index: any) {
    // this.setState({ skuIndex: index, skuItems: items });
    setskuIndex(index);
    setskuItems(items);
    formRef.current.setFieldsValue({
      price: items.price,                         // 现价
      name: items.name,                           // 商品名称
      stocks: items.stocks,                       // 库存
      actualStocks: items.actualStocks,           // 库存预警
      status: items.status || 1,                  // 1上架0下架
      partyCode: items.partyCode,                 // 商家编码
      modelId: items.modelId,                     // 商品条形码
      volume: items.volume,                       // 物流体积
      weight: items.weight,                       // 物流体重
      outerId: items.outerId,               // 限购类型
    });
  }

  // 修改sku
  function onSku(e: any, keyName: any) {
    let refreshs = refresh;
    let value = e.target.value;
    if (keyName === 'is_limit') {
      if (value == 1) {
        // this.setState({ isLimit: true });
        setisLimit(true);

      } else {
        // this.setState({ isLimit: false })
        setisLimit(false);
      }
    }
    // let { skuIndex, skuList = [] } = this.state;
    if (skuList.length > 0) {
      skuList[skuIndex][keyName] = value;
      setskuList(skuList);
      setRefresh(!refreshs)
    }
  }

  // 应用设置
  function applySettings() {
    // let { skuList, skuItems, checkAll } = this.state;
    // let { price = '', name = '', stocks = '', actualStocks = '', status = '', partyCode = '', modelId = '', volume = '', weight } = this.props.form.getFieldsValue();
    let status = skuItems ? skuItems.status : (skuList && skuList[0] && skuList[0].status);
    formRef.current.validateFields().then((values: any): any => {
      skuList.forEach((item: any) => {
        item.price = values.price;                        // 现价
        item.name = values.name;                          // 商品名称
        item.stocks = values.stocks;                      // 库存
        item.actualStocks = values.actualStocks;          // 库存预警
        item.status = values.status;                      // 1上架0下架
        item.partyCode = values.partyCode;                // 商家编码
        item.modelId = values.modelId;                    // 商品条形码
        item.volume = values.volume;                      // 物流体积
        item.weight = values.weight;                      //
        item.outerId = values.outerId;                    // 产品编码
        item.status = status
      })
      if (!status) {
        checkAll = false;
      } else {
        checkAll = true;
      }
      // this.setState({ skuList, checkAll });
      setskuList(skuList);
      setcheckAll(checkAll);
    }).catch((err: Error) => { })


  }
  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
  };
  return (
    <PageHeaderWrapper>
      {
        ((!loading && goodsInfoData)  || !productId) &&
        <BaseLayer {...baseProps} editInfo={goodsInfoData} changeChildrenData={changeChildrenData} onRef={baseChild} loading={loading}/>
      }
      {
        ((!loading && goodsAttributesData) || !productId) &&
      <AttrLayer {...baseProps} editAttributes={goodsAttributesData}    ref={(ref) => attrChild = ref} loading={loading}/>
      }
      {
        ((!loading && goodsImagesData) || !productId) &&
        <ImageLayer {...baseProps}  goodsImageItem={goodsImagesData} videoUrl={videoUrl} ref={(ref) => imgChild = ref} loading={loading}/>
      }
      {
        ((!loading && goodsOtherData) || !productId) &&
        <OtherLayer {...baseProps} editOtherData={goodsOtherData} ref={(ref) => otherChild = ref} loading={loading}/>
      }
      {
        ((!loading && goodsDescribeData ) || !productId)&&
        <DescribeLayer {...baseProps} editDescribeData={goodsDescribeData} ref={(ref) => descChild = ref} loading={loading}/>
      }
      {
        !loading &&
        <Card style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
        <Button type='primary' onClick={()=>subMitData()}>下一步</Button>
      </Card>
      }










      <Modal
        width={900}
        title={'单品信息'}
        closable={true}
        visible={singleInfo}
        onCancel={() => setsingleInfo(false)}
        footer={
          <>
            <Button type='primary' onClick={() => setsingleInfo(false)}>取消</Button>
            <Button type='primary' onClick={submitUploadGoods} loading={uploadLoading}>上传</Button>
          </>
        }
        maskClosable={false}
      >
        <>
          {
            skuList && skuList.length > 0 &&
            <Checkbox
              onChange={onCheckAllChange}
              checked={checkAll}
              style={{ marginBottom: '10px' }}
            >
              全部上线
            </Checkbox>}
          <div className='singePro'>
            <ul className={styles.skuP}>
              <li className={styles.skuPl}>
                <ul>
                  {
                    skuList && skuList.length > 0 && skuList.map((items: any, index: any) => {
                      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-bewtten' }} key={index}>
                        <Checkbox checked={items.status ? true : false} onChange={(e) => onChangeSkuStatus(e, index)} style={{ marginRight: '10px' }}></Checkbox>
                        <li className={styles.skuItems} style={{ border: skuIndex == index ? '2px solid #e5004f' : '', background: skuIndex == index ? '#fff' : '' }} onClick={() => handleSkuItems(items, index)}>
                          <div>{items.saleProps}</div>
                        </li>
                      </div>
                    })
                  }
                </ul>
              </li>
              <li className={styles.skuPr}>
                <Form {...formItemLayout}
                  ref={formRef}
                  initialValues={{
                    name: skuInitData && skuInitData.name,
                    price: skuInitData && skuInitData.price,
                    partyCode: skuInitData && skuInitData.partyCode,
                    modelId: skuInitData && skuInitData.modelId,
                    outerId: skuInitData && skuInitData.outerId,
                    volume: skuInitData && skuInitData.volume,
                    weight: skuInitData && skuInitData.weight,
                    stocks: skuInitData && skuInitData.stocks,
                  }}
                >

                  <Form.Item label="单品标题: "
                    style={{ marginBottom: '5px' }}
                    name='name'
                    rules={[{ required: true, message: '请输入单品标题!' }, { max: 120, message: '单品标题长度过长!' },]}
                  >
                    <Input onChange={(e) => onSku(e, 'name')} />
                  </Form.Item>
                  <Form.Item label="单品价格："
                    style={{ marginBottom: '5px' }}
                    name='price'
                    rules={[{ required: true, message: '请输入单品价格!' }]}
                  >
                    <Input onChange={(e) => onSku(e, 'price')} />
                  </Form.Item>
                  <Form.Item label="商家编码："
                    style={{ marginBottom: '5px' }}
                    name='partyCode'
                    rules={[{ max: 50, message: '商家编码长度过长!' }]}
                  >
                    <Input onChange={(e) => onSku(e, 'partyCode')} />
                  </Form.Item>
                  <Form.Item label="商品条形码：" style={{ marginBottom: '5px' }}
                    name='modelId'
                    rules={[{ max: 50, message: '商品条形码长度过长!' }]}
                  >
                    <Input onChange={(e) => onSku(e, 'modelId')} />
                  </Form.Item>
                  <Form.Item label="产品编码：" style={{ marginBottom: '5px' }}
                    name='outerId'
                    rules={[{ required: true, message: '请输入产品编码' }, { max: 50, message: '产品编码过长!' }]}
                  >
                    <Input onChange={(e) => onSku(e, 'outerId')} />
                  </Form.Item>
                  <Form.Item label="物流体积(立方米)：" style={{ marginBottom: '5px' }}
                    name='volume'
                  >
                    <Input onChange={(e) => onSku(e, 'volume')} />
                  </Form.Item>
                  <Form.Item label="物流重量(千克)：" style={{ marginBottom: '5px' }}
                    name='weight'
                    rules={[{ required: queryData && queryData.chargeMode == 1 ? true : false, message: '请输入物流重量' }]}
                  >
                    <Input onChange={(e) => onSku(e, 'weight')} />
                  </Form.Item>
                  <Form.Item label="单品库存：" style={{ marginBottom: '5px' }} name='stocks' rules={[{ required: true, message: '请输入单品库存!' }]}>
                    <Input onChange={(e) => onSku(e, 'stocks')} />
                  </Form.Item>
                  {
                    skuList && skuList.length > 0 &&
                    <Form.Item label="应用设置：" style={{ marginBottom: '5px' }} name='modelId'>
                      <Button type="dashed" onClick={applySettings}>将此设置应用到其他单品</Button>
                    </Form.Item>
                  }
                </Form>
              </li>
            </ul>
          </div>
        </>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default PublishGoods;
