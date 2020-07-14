import React, { useEffect, useState, useImperativeHandle } from 'react';
import { handlePicUrl } from '@/common/utils';
import TextArea from 'antd/lib/input/TextArea';
import styles from './index.less'
import Params from './params';
import {
  getShopDetailsByParent,
  getBrandList,
} from '@/services/goods/upload/base';
import { getAllTagList } from '@/services/goods/warehouse/list';
import { Table, Card, Button, Form, Row, Col, Input, Modal } from 'antd';
import CatesLayer from './cates-layer'
const FormItem = Form.Item;
const { Search } = Input;
interface UserProp {
  history: any;
  location: any;
  match: any;
  onRef: any;
  editInfo: any;
  changeChildrenData: any;
  loading:boolean
}
const BaseLayer: React.FC<UserProp> = (props) => {
  let [pageRefresh, setPageRefresh] = useState<any>(true);
  let formRef: any = React.createRef();
  let brandFormRef: any = React.createRef();
  let [editInfoData, setEditInfo] = useState<any>();

  let [cateId, setCateId] = useState<string | number>(props.location.query.cateId);
  let [cateName, setCateName] = useState<Array<string>>(props.location.query.cateName ? JSON.parse(props.location.query.cateName) : '');
  let [catesVisible, setCatesVisible] = useState<any>();
  let [storeVisible, setStoreVisible] = useState<boolean>(false);
  let [brandVisible, setBrandVisible] = useState<boolean>(false);
  let [tagVisible, setTagVisible] = useState<boolean>(false);

  // ----- 选择店铺
  let [storePage, setStorePage] = useState<any>({ pageNum: 1, pageSize: 10 });
  let [storeTotal, setStoreTotal] = useState<any>();
  let [storeLoading, setStoreLoading] = useState<boolean>(false);
  let [storeDataList, setStoreDataList] = useState<Array<any>>([]);
  // ----- 选择品牌
  let [brandPage, setBrandPage] = useState<any>({ pageNum: 1, pageSize: 10 });
  let [brandTotal, setBrandTotal] = useState<any>();
  let [brandLoading, setBrandLoading] = useState<boolean>(false);
  let [brandrefresh, setbrandrefresh] = useState<any>('');
  let [brandDataList, setBrandDataList] = useState<Array<any>>([]);

  // ----- 选择标签
  let [tagLoading, setTagLoading] = useState<boolean>(false);
  let [tagDataList, setTagDataList] = useState<Array<any>>([]);
  let [tagArr, setTagArr] = useState<Array<any>>([]);
  let [tagsRender, setTagsRender] = useState<any>();
  // -------------------
  useEffect(() => {
    let editInfo = props.editInfo || {};
    formRef.current.setFieldsValue({
      productName: editInfo ? editInfo.productName : '',
      stocksArm: editInfo ? editInfo.stocksArm : '',
      originalPrice: editInfo ? editInfo.originalPrice : '',
      brief: editInfo ? editInfo.brief : '',
    })
    let cateName = props.location.query.cateName ? JSON.parse(props.location.query.cateName) : ''
    let categoryText = editInfo ? (editInfo.firstCategoryName ? editInfo.firstCategoryName : (cateName[0] || '未知')) + " > " + (editInfo.secondCategoryName ? editInfo.secondCategoryName : (cateName[1] || '未知')) + " > " + (editInfo.thirdCategoryName ? editInfo.thirdCategoryName : (cateName[2] || '未知')) : '未知';
    let shopInfo = {
      shopId: editInfo && editInfo.shopDetailVO ? editInfo.shopDetailVO.shopId : '',
      shopName: editInfo && editInfo.shopDetailVO ? editInfo.shopDetailVO.shopName : '',
    }
    let brandInfo = {
      name: editInfo && editInfo.brandVO ? editInfo.brandVO.name : '',
      id: editInfo && editInfo.brandVO ? editInfo.brandVO.id : '',
    }
    let logoPic = editInfo && editInfo.shopDetailVO ? editInfo.shopDetailVO.logoPic : '';
    //标签回显
    let tagArrData:Array<any> =  editInfo.productTagVOS || [];

    setCategoryText(categoryText);
    setCateId(editInfo.categoryId);
    setShopInfo(shopInfo);
    setLogoPic(logoPic);
    setEditInfo(editInfo);
    setBrandInfo(brandInfo);
    setTagArr(tagArrData)
  }, [])





  // ----- 子组件params
  let paramsChild: any = '';
  async function getStoreList(): Promise<any> {
    setStoreLoading(true);
    let page = storePage.pageNum;
    let size = storePage.pageSize;
    let query = {
      page, size,
    }
    let res: any = await getShopDetailsByParent(query);
    setStoreLoading(false);
    if (!res || !res.data) return false;
    let storeDataList = res.data && res.data.records || [];
    setStoreTotal(res.data.total)
    setStoreDataList(storeDataList)
  }
  useEffect(() => {
    getStoreList()
  }, [storePage]);
  //品牌列表
  async function getAllBrandList(): Promise<any> {
    setBrandLoading(true);
    let page = brandPage.pageNum;
    let size = brandPage.pageSize;
    let { name = '' } = brandFormRef.current.getFieldsValue()
    let query = {
      page,
      size,
      name,
      sortBy: '-createTime'
    }
    let res: any = await getBrandList(query);
    setBrandLoading(false);
    if (!res || !res.data) return false;
    let brandDataList = res.data && res.data.records || [];
    setBrandTotal(res.data.total)
    setBrandDataList(brandDataList)
  }

  //获取标签列表
  async function getAlltagList(): Promise<any> {
    setTagLoading(true);
    let res = await getAllTagList();
    setTagLoading(false);
    if (!res) return false;
    let { data = [] } = res;
    let tagDataList = data && data.map((v: any, i: number) => ({
      key: i,
      ...v
    }))
    setTagDataList(tagDataList)
  }
  useEffect(() => {
    let newTagsRender: any;
    let tagArrIds:Array<any> = tagArr.map(v => v.id);
    newTagsRender = tagDataList.map((item: any, i: number) =>
      <li key={i} className={`${styles.modal_Li} ${tagArrIds.includes(item.id) ? styles.active : ''}`} onClick={() => toggleParams(item)} >{item.name}</li>
    )
    setTagsRender(newTagsRender);
  }, [pageRefresh])

  useEffect(() => {
    setTimeout(() => {
      setPageRefresh(!pageRefresh)
    }, 20)
  }, [tagDataList, tagArr]);
  //选择标签
  function toggleParams(item: any) {
    let arrIdsArr: any = JSON.parse(JSON.stringify(tagArr));
    let isHave = arrIdsArr.filter((ele:any)=> ele.id == item.id);
    if (isHave &&  isHave.length != 0) {
      arrIdsArr = arrIdsArr.filter((ele:any)=> ele.id != item.id);
    }else{
      arrIdsArr.push(item)
    }
    setTagArr(arrIdsArr)
  }


  //删除标签
  function handleDelTag(item: any) {
    let tagArrIds = tagArr.map(v => v.id);
    if (tagArrIds.includes(item.id)) {
      tagArr.splice(tagArrIds.indexOf(item.id), 1)
    }
    setTagArr(tagArr)
    setPageRefresh(!pageRefresh)
  }
  useImperativeHandle(props.onRef, () => ({
    // changeVal 就是暴露给父组件的方法
    childMethod: () => {
      let productTags: any = tagArr && tagArr.length > 0 ? tagArr.map((v, i) => {
        return v.name
      }) : [];
      return {
        ...paramsChild.childMethod(),
        ...formRef.current.getFieldsValue(),
        categoryIds: cateId,
        shopId: shopInfo.shopId,
        brandId: brandInfo.id,
        productTag: productTags.join(',')
      }
    }
  }));
  function selectCate(categoryId: number | string, checkText: any) {
    categoryText = checkText && checkText.join(' > ');
    setCategoryText(categoryText);
    setCateId(categoryId);
    setCatesVisible(false);
  }
  function checkStore(data: any) {
    let { shopName, shopId, logoPic } = data;
    logoPic = logoPic ? handlePicUrl(logoPic) : '';
    setShopInfo({ shopName, shopId, });
    setStoreVisible(false);
    setLogoPic(logoPic)
  }
  function checkBrand(data: any) {
    let { name, id } = data;
    setBrandInfo({ name, id });
    setBrandVisible(false);
  }
  //删除品牌
  function handleDelBrand() {
    setBrandInfo({ name: '', id: '' });
  }

  let [categoryText, setCategoryText] = useState<any>(cateName ? cateName.join(' > ') : '');
  let [shopInfo, setShopInfo] = useState<any>({ shopName: '', shopId: '' });
  let [logoPic, setLogoPic] = useState<string>('');
  let [brandInfo, setBrandInfo] = useState<any>({ name: '', id: '' });
  //店铺
  function getStore() {
    setStoreVisible(true)
    getStoreList();
  }
  useEffect(() => {
    setbrandrefresh(true);
  }, [brandVisible]);
  //品牌
  useEffect(() => {
    if (brandVisible) {
      getAllBrandList()
    }
  }, [brandrefresh]);
  useEffect(() => {
    setbrandrefresh(false);
  }, [brandPage]);
  //标签
  function getTags() {
    setTagVisible(true);
    getAlltagList();
  }


  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
  };
  // 店铺分页器
  // 商品分页配置
  const giftPagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: storePage.pageNum,
    pageSize: storePage.pageSize || 10,
    total: storeTotal,
    showTotal: (t: number) => <div>共{t}条</div>
  };
  //品牌分页配置
  const brandPagination = {
    showQuickJumper: true,
    showSizeChanger: true,
    current: brandPage.pageNum,
    pageSize: brandPage.pageSize || 10,
    total: brandTotal,
    showTotal: (t: number) => <div>共{t}条</div>
  };
  return (
    <Card
      style={{ margin: '20px 0' }}
      hoverable
      title={'一、商品信息'}
      loading={props.loading}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', marginRight: '40px', borderRight: '1px solid #ddd' }}>
          <Form
            {...formItemLayout}
            initialValues={{
              productName: props.editInfo ? props.editInfo.productName : '',
              stocksArm: props.editInfo ? props.editInfo.stocksArm : '',
              originalPrice: props.editInfo ? props.editInfo.originalPrice : '',
              brief: props.editInfo ? props.editInfo.brief : '',
            }}
            ref={formRef}
          >
            <Row>
              <Col>
                <h1>商品基本信息 ：</h1>
              </Col>
            </Row>
            <Row>
              <Col span={22}>
                <Form.Item
                  className={styles.formItem}
                  label="标题: "
                  name='productName'
                  rules={[
                    { required: true, message: '请输入商品标题', },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className={styles.formItem}
                  label="库存："
                  name='stocksArm'
                  rules={[
                    { pattern: /^[0-9]*$/, message: '库存值仅支持数字' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className={styles.formItem}
                  name='originalPrice'
                  label="原价："
                  rules={[
                    { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '原价仅支持数字类型' },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  className={styles.formItem}
                  label="商品卖点: "
                  name='brief'
                >
                  <TextArea></TextArea>
                </Form.Item>
              </Col>
              <Col span={24} className={styles.checkCate} >
                <h1 style={{ minWidth: '98px' }}> <span style={{ color: '#f5222d', }}>*</span> 选择分类 ：</h1>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', maxHeight: '25px' }}>
                  {categoryText && <span style={{ fontSize: '14px' }}>{categoryText}</span>}
                  <Button type='primary' onClick={() => setCatesVisible(true)} style={{ marginLeft: '10px' }}>修改分类</Button>
                </div>
              </Col>
              <Col span={24} className={styles.checkShop}>
                <h1> <span style={{ color: '#f5222d' }}>*</span> 选择店铺 ：</h1>
                <div className={styles.shopContent}>
                  <Button type='primary' onClick={() => getStore()}>选择店铺</Button>
                  {
                    shopInfo.shopId &&
                    <>
                      <div className={styles.shopInfo}>
                        <div className={styles.img}>
                          <img alt='example' src={handlePicUrl(logoPic)} />
                        </div>
                        <div className={styles.shopName}>{shopInfo.shopName}</div>
                      </div>
                    </>
                  }
                </div>
              </Col>
              <Col span={24} className={styles.checkShop}>
                <h1> 选择品牌 ：</h1>
                <div className={styles.shopContent}>
                  <Button type='primary' onClick={() => setBrandVisible(true)}>选择品牌</Button>
                  {brandInfo.id &&
                    <>
                      <div className={styles.brandInfo}>
                        <div className={styles.brandName}>
                          {brandInfo.name}
                          <span className={styles.brandSpan} onClick={() => { handleDelBrand() }}>X</span>
                        </div>
                      </div>
                    </>
                  }
                </div>
              </Col>
              <Col span={24} className={styles.checkShop}>
                <h1> 选择标签 ：</h1>
                <div className={styles.shopContent}>
                  <Button type='primary' onClick={() => getTags()}>选择标签</Button>
                  <ul className={styles.tagUl}>
                    {
                      Array.isArray(tagArr) && tagArr.map((item: any, i: number) =>
                        <li key={i} className={styles.tagLi}>
                          {item.name}
                          <span className={styles.tagSpan} onClick={() => { handleDelTag(item) }}>X</span>
                        </li>
                      )
                    }
                  </ul>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        {editInfoData && <Params props={props} editInfoData={editInfoData} ref={(ref) => paramsChild = ref} />}
      </div>
      {/* 修改分类 */}
      <Modal
        title="选择分类"
        width={800}
        visible={catesVisible}
        onCancel={() => setCatesVisible(false)}
        footer={null}
      >
        <CatesLayer selectCate={selectCate} />
      </Modal>
      {/* 选择店铺 */}
      <Modal
        title="店铺列表"
        width={600}
        visible={storeVisible}
        onCancel={() => setStoreVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStoreVisible(false)}>取消</Button>
        ]}
      >
        <Table
          columns={[
            {
              title: '店铺图片',
              dataIndex: 'logoPic',
              render: (text) => (
                <img src={handlePicUrl(text)} style={{ width: '60px' }} />
              )
            },
            {
              title: '店铺名',
              dataIndex: 'shopName',
            },
            {
              title: '操作',
              render: (record) => (
                <Button type='primary' onClick={() => checkStore(record)}>选择</Button>
              )
            }
          ]}
          rowKey={record => record.shopId}
          dataSource={storeDataList}
          pagination={giftPagination}
          onChange={({ current, pageSize }) => {
            setStorePage({ pageNum: current, pageSize: pageSize })
          }}
          loading={storeLoading}
        />
      </Modal>
      {/* 选择品牌 */}
      <Modal
        title="品牌列表"
        width={600}
        visible={brandVisible}
        onCancel={() => setBrandVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBrandVisible(false)}>取消</Button>
        ]}
      >
        <Form ref={brandFormRef}>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <FormItem name='name'>
                <Search
                  enterButton="搜索"
                  style={{ width: 200 }}
                  placeholder='输入关键字'
                  onSearch={() => getAllBrandList()}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          columns={[
            {
              title: '品牌名称',
              dataIndex: 'name',
              width: '80%'
            },
            {
              title: '操作',
              render: (record) => (
                <Button type='primary' onClick={() => checkBrand(record)}>选择</Button>
              )
            }
          ]}
          rowKey={record => record.id}
          dataSource={brandDataList}
          pagination={brandPagination}
          onChange={({ current, pageSize }) => {
            setBrandPage({ pageNum: current, pageSize: pageSize })
          }}
          loading={brandLoading}
        />
      </Modal>
      <Modal
        title='选择标签'
        width={600}
        visible={tagVisible}
        maskClosable={false}
        closable={false}
        footer={
          <>
          <Button onClick={() => setTagVisible(false)}>关闭</Button>
          </>
        }
      >
        <div>
          <ul className={styles.modal_Ul}>
            {
              tagsRender
            }
          </ul>
        </div>
      </Modal>
    </Card>
  )
}
export default BaseLayer;
