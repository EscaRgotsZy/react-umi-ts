import styles from './index.less';
import React, { Component } from 'react';
import { Card, Form, Radio, Input, Button, Select, message } from 'antd';
import { SketchPicker } from 'react-color';
import { PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SingleUpload from '@/components/SingleUpload'
import GoodsSort from './components/goods-sort'
import CategoryItem from './components/category-item'
import GoodsLayer from './components/goods-layer'
import CategoryLayer from './components/category-layer'
import { getSpecial, addSpecial, editSpecial, allMergeGroup } from '@/services/shop/topic'

const { Option } = Select;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

interface useState {
  themeId: string;
  displayColorPicker: boolean;
  imgUrl: string;
  color: string;
  categoryIds: any[];
  goods_1: any[];
  goods_2: any[];
  goodsIds: any[];
  activityType: string | number;
  showGoods: boolean;
  showCategories: boolean;
  showAddGoodsTip: boolean;
  showAddCategoryTip: boolean;
  preBizType: number;
}
interface PropsType {
  match: any;
  history: any;
}
export default class SpecialEdit extends Component<PropsType, useState> {
  formRef: React.RefObject<any>;
  goodsRef: React.RefObject<any>;
  categoryRef: React.RefObject<any>;
  constructor(props: PropsType) {
    super(props)
    this.formRef = React.createRef();
    this.state = {
      themeId: this.props.match.params.id,
      displayColorPicker: false,
      imgUrl: '',
      color: '#9013fe',
      categoryIds: [],// 已选择的分类
      goods_1: [],// 自选商品
      goods_2: [],// 促销活动商品
      goodsIds: [],// 当前操作的商品列表
      activityType: '',// 促销活动类型
      showGoods: false,// 商品列表弹框
      showCategories: false,// 分类弹框
      showAddGoodsTip: false,// 
      showAddCategoryTip: false,//
      preBizType: 0,// 记录上一个 type状态
    }
    this.goodsRef = React.createRef();
    this.categoryRef = React.createRef();
  }
  goodsMap = {};// goodsId 商品列表
  categoryMap = {} // category 分类列表
  isAdd = true;// 是否是新增
  componentWillMount() {
    this.isAdd = !this.state.themeId
  }
  componentDidMount() {
    this.initData()
  }
  initData() {
    !this.isAdd && this.getSpecial()
  }
  async getSpecial() {
    let res = await getSpecial({ themeId: this.state.themeId })
    if (!res) return;
    let { themeName, topPic, color, bizType, themeCategoryVOList, themeProductVOS, activityType, goodsIds } = res;
    this.formRef.current.setFieldsValue({ themeName, bizType })
    if (bizType === 0) {// 专题选择的商品
      this.goodsMap = themeProductVOS
      this.setState({ goodsIds })
    }
    if (bizType === 1) {// s专题选择的商品分类
      this.categoryMap = themeCategoryVOList
      this.setState({ categoryIds: Object.keys(themeCategoryVOList).map(v => +v) })
    }
    if (bizType === 2) {// 专题选择的促销活动
      this.goodsMap = themeProductVOS
      this.setState({ goodsIds, activityType })
    }
    this.setState({ color, imgUrl: topPic, preBizType: bizType })
  }
  handleSubmit = () => {
    let { validateFields } = this.formRef.current;
    validateFields(['themeName', 'bizType'])
      .then(async (value: any) => {
        let { themeName, bizType } = value;
        let { imgUrl, color, categoryIds, goodsIds, activityType } = this.state;
        if (!imgUrl) return message.warn('请上传顶部图片');
        if (bizType === 0 && !goodsIds.length) return message.warn('请选择商品');
        if (bizType === 1 && !categoryIds.length) return message.warn('请选择分类');
        if (bizType === 2 && activityType === '') return message.warn('请选择活动');
        if (bizType === 2 && !goodsIds.length) return message.warn('该活动下没有商品，请换一个活动');
        let themeActivityBO = {}, themeProductBOList: any[] = [], themeCategoryBOS: any[] = []
        if (bizType === 0) {// 自选
          themeProductBOList = goodsIds.map(v => ({ productId: v }))
        }
        if (bizType === 1) {// 分类
          themeCategoryBOS = categoryIds.map(v => ({ categoryId: +v }))
        }
        if (bizType === 2) {// 促销活动
          themeActivityBO = { activityType }
          themeProductBOList = goodsIds.map(v => ({ productId: v }))
        }
        let params: any = {
          backgroundColor: color,
          bizType,
          themeName,
          topPic: imgUrl,
          themeActivityBO,// 专题选择的促销活动
          themeProductBOList,// 专题选择的商品
          themeCategoryBOS,// 专题选择的商品分类
        }
        if (!this.isAdd) {
          params.themeId = +this.state.themeId
        }

        let [err] = await (this.isAdd ? addSpecial : editSpecial)(params);
        if (err) return false;
        message.success(this.isAdd ? '新增成功' : '编辑成功')
        this.props.history.goBack();
      })
      .catch(() => { })

  }
  openColor = (flag: boolean) => this.setState({ displayColorPicker: flag })


  // 选择商品
  selGoods = (v: any) => {
    let { goodsIds } = this.state;
    let newGoodsIds = [...goodsIds];
    if (v && v instanceof Array) { // 是否全选
      let addList = v.filter(item => !newGoodsIds.some(ele => ele === item.id));
      if (addList && addList.length != 0) {
        addList.forEach(value => {
          this.goodsMap[value.id] = value;
        })
        let addListKeys = addList.map(item => item.id);
        newGoodsIds.push(...addListKeys);
      }
    } else {
      if (goodsIds.includes(v.id)) {
        newGoodsIds = goodsIds.filter(x => {
          return x !== v.id
        })
      } else {
        newGoodsIds.push(v.id)
        if (!(v.id in this.goodsMap)) {
          this.goodsMap[v.id] = v;
        }
      }
      if (!newGoodsIds.length) {
        this.setState({ showAddGoodsTip: true })
      } else {
        this.setState({ showAddGoodsTip: false })
      }
    }
    this.setState({ goodsIds: newGoodsIds })
  }
  // 删除已选择的商品
  delGoods = (v: any) => {
    let { goodsIds } = this.state;
    let newGoodsIds = [...goodsIds];
    if (v && v instanceof Array) { // 是否全选
      newGoodsIds = newGoodsIds.filter(item => !v.some(ele => ele.id === item));
    } else {
      if (goodsIds.includes(v.id)) {
        newGoodsIds = goodsIds.filter(x => x !== v.id)
      }
      if (!newGoodsIds.length) {
        this.setState({ showAddGoodsTip: true })
      }
    }
    this.setState({ goodsIds: newGoodsIds })
  }
  // 排序id
  sortGoodsIds = (goodsIds: any) => {
    this.setState({ goodsIds })
  }
  selCategory = (checkedKeys: any, categoryIdMap: any) => {
    this.categoryMap = categoryIdMap
    this.setState({ categoryIds: checkedKeys })
    if (checkedKeys.length) {
      this.setState({ showAddCategoryTip: false })
    } else {
      this.setState({ showAddCategoryTip: true })
    }
  }
  openCategories = () => {
    this.categoryRef.current.drawerShow(true)
  }
  openGoods = () => {
    this.goodsRef.current.drawerShow(true)
  }


  handleColorChange = (color: any) => this.setState({ color: color.hex })
  handleActivityChange = async (activityType: number):Promise<false | void> => {
    //  activityType： 1 新人团   
    this.setState({ activityType })
    let res;
    if (activityType === 1) {
      res = await allMergeGroup({ mergeType: activityType, status: 1 })
    } else {
      res = await allMergeGroup({ mergeType: activityType, status: 1 })
    }
    if (!res) return false;
    let goodsIds = (res as any[]).map((v: any) => {
      if (!this.goodsMap[v.id]) {
        this.goodsMap[v.id] = v;
      }
      return v.id
    })
    this.setState({ goodsIds })
  }
  // 删除已选择的分类
  delCategory = (v: any) => {
    let { categoryIds } = this.state;
    let newCategoryIds = [...categoryIds]
    if (categoryIds.includes(v)) {
      newCategoryIds = categoryIds.filter(x => x !== v)
    }
    if (!newCategoryIds.length) {
      this.setState({ showAddCategoryTip: true })
    }
    this.setState({ categoryIds: newCategoryIds })
  }
  typeChange = (e: any) => {
    let { goodsIds, goods_1, goods_2, preBizType } = this.state;
    
    let type = e.target.value
    if (preBizType === 0) {// 离开自选商品
      this.setState({ goods_1: [...goodsIds] })
    } else if (preBizType === 2) {// 离开促销活动
      this.setState({ goods_2: [...goodsIds] })
    }
    if (type === 0) {// 进入自选商品
      this.setState({ goodsIds: [...goods_1] })
    } else if (type === 2) {// 进入促销活动
      this.setState({ goodsIds: [...goods_2] })
    }
    this.setState({preBizType: type})
  }
  renderGoods = () => {
    let { goodsIds } = this.state;
    let list = goodsIds.map(v => {
      let x = this.goodsMap[v]
      return {
        name: x.name,
        productId: x.id,
        pic: x.pic,
      }
    })
    return list.length ? <GoodsSort list={list} sortGoodsIds={this.sortGoodsIds} /> : ''
  }
  renderCategory = () => {
    let { categoryIds } = this.state;
    return (
      <div className={styles.categoryList}>
        {
          categoryIds.map(v => <CategoryItem key={v} data={{ id: v, name: this.categoryMap[v] }} del selCategory={this.delCategory} />)
        }
      </div>
    )
  }
  renderBizType = ():any => {
    let bizType = 0;
    if (this.formRef.current) {
      bizType = this.formRef.current.getFieldsValue().bizType
    }

    let { showAddGoodsTip, showAddCategoryTip, activityType } = this.state;

    if (bizType === 0) {// 自选商品
      return (
        <div className={styles.addBox}>
          <Button onClick={this.openGoods} type="dashed" icon={<PlusOutlined />} style={{ width: 200, color: '#d9d9d9' }}>添加商品</Button>
          {
            showAddGoodsTip && <span className={styles.addTip}>请至少添加一个商品</span>
          }
          {this.renderGoods()}
        </div>
      )
    }
    if (bizType === 1) {// 商品分类
      return (
        <div className={styles.addBox}>
          <Button onClick={this.openCategories} type="dashed" icon={<PlusOutlined />} style={{ width: 200, color: '#d9d9d9' }}>选择分类</Button>
          {
            showAddCategoryTip && <span className={styles.addTip}>请至少添加一个商品</span>
          }
          {this.renderCategory()}
        </div>
      )
    }
    if (bizType === 2) {// 促销活动
      return (
        <div>
          <Select value={activityType as number} style={{ width: 200 }} onChange={this.handleActivityChange} placeholder="请选择">
            <Option value={1}>新人团</Option>
            <Option value={0}>普通拼团</Option>
          </Select>
          {this.renderGoods()}
        </div>
      )
    }
  }
  render() {
    const { imgUrl, color, displayColorPicker, goodsIds, categoryIds } = this.state;
 
    return (
      <>
        <PageHeaderWrapper>
          <Card>
            <Form {...formItemLayout} ref={this.formRef}
              initialValues={{
                bizType: 0,
              }}
            >
              <Form.Item label="专题名称" name="themeName" rules={[
                {
                  required: true,
                  message: '请输入专题名称',
                },
                {
                  max: 15,
                  message: '专题名称不能超过15个字符',
                },
              ]}>
                <Input />
              </Form.Item>
              <FormItem label="顶部图" name="logoPicture">
                <SingleUpload valueUrl={imgUrl} setImg={(url: string) => {
                  this.setState({imgUrl: url})
                }} />
              </FormItem>
              <Form.Item label="网页背景色" name="backgroundColor" rules={[
                {
                  required: true,
                },
              ]}>
                <div className={styles.colorBox}>
                  <div className={styles.swatch} onClick={() => this.openColor(true)}>
                    <div className={styles.color} style={{ backgroundColor: color }} />
                  </div>
                  {displayColorPicker ? <div className={styles.popover}>
                    <div className={styles.cover} onClick={() => this.openColor(false)} />
                    <SketchPicker color={color} onChange={this.handleColorChange} />
                  </div> : null}
                </div>
              </Form.Item>
              <Form.Item label="商品选中" name="bizType" rules={[
                { required: true }
              ]}>
                <Radio.Group value="large" buttonStyle="solid" onChange={this.typeChange}>
                  <Radio.Button value={0}>自选商品</Radio.Button>
                  <Radio.Button value={2}>促销活动</Radio.Button>
                  <Radio.Button value={1}>商品分类</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                {this.renderBizType()}
              </Form.Item>
              <Form.Item {...tailFormItemLayout} style={{ marginTop: 50 }}>
                {
                  !this.isAdd && <Button onClick={() => this.props.history.goBack()} style={{ marginRight: 20 }}>取消</Button>
                }
                <Button type="primary" onClick={() => this.handleSubmit()}>
                  提交
              </Button>
              </Form.Item>
            </Form>
          </Card>
        </PageHeaderWrapper>

        <GoodsLayer ref={this.goodsRef} goodsIds={goodsIds} selGoods={this.selGoods} delGoods={this.delGoods} />
        <CategoryLayer ref={this.categoryRef} categoryIds={categoryIds} selCategory={this.selCategory} />
      </>
    )
  }
}