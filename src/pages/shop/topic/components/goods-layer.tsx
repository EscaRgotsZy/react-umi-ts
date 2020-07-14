import styles from './index.less';

import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Drawer, Cascader, Pagination, Empty, Spin, Select, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons'
import GoodsItem from './goods-item'
import { getCategories, getSubCategories, getGoodsList } from '@/services/shop/topic';
import { getShopList } from '@/services/common';

const FormItem = Form.Item;
const { Option } = Select;

interface useProps{
  goodsIds: any;
  selGoods: Function;
  delGoods: Function;
}

interface useState{
  shopId: string | number;
  drawerVisible: boolean;
  list: any[];
  options: any[];
  goodsName: string;
  loading: boolean;
  shopListRender: any[];
  checkAll: boolean;
}

export default class GoodsLayer extends Component<useProps, useState> {
  constructor(props: useProps) {
    super(props)
    this.state = {
      shopId: '',
      checkAll: false,
      drawerVisible: false,
      list: [],
      options: [],
      goodsName: '',
      loading: false,
      shopListRender: [],
    }
  }
  p = {
    pageSize: 20,
    pageNum: 1,
    total: 0,
  }
  categoryId = '';
  componentDidMount() {
    this.initData();
  }
  initData() {
    this.query();
    this.getCategoriesList();
    this.getShopList();
  }
  async getShopList() {
    let params = {size:100,page:1}
    let res = await getShopList({params});
    let { records } = res;
    records.unshift({shopId:-1,shopName:'全部'});
    let shopListRender = records && records.length != 0 && records.map(item=><Option value={item.shopId} key={item.shopId}>{item.shopName}</Option>);
    this.setState({shopListRender})
  }
  async getGoodsList() {
    let { goodsName,shopId } = this.state;
    let params:any = {
      categoryId: this.categoryId,
      productName: goodsName,
      page: this.p.pageNum,
      size: this.p.pageSize,
    }
    if(shopId && shopId != '-1'){
      params.shopId = shopId;
    }
    this.setState({ loading: true })
    let res = await getGoodsList(params);
    this.setState({ loading: false })
    let { total, records: list } = res;
    if (!list) return false;
    this.p.total = total;

    let isListIds = list && list.length != 0 && list.map((v:any) => v.id) || [];
    let { goodsIds } = this.props;
    let ischeckIds = goodsIds.filter((item:any) => list.some((ele:any) => ele.id === item));
    let ischeckoAllList = isListIds.filter((item:any) => !ischeckIds.some((ele:any) => ele === item));
    let checkAll = ischeckoAllList.length == 0 ? true :false;
    checkAll = (ischeckIds.length == 0 && isListIds.length == 0) ? false :  checkAll;
    this.setState({ list, checkAll })
  }
  componentWillReceiveProps(props:any) {
    let { list } = this.state;
    let isListIds = list && list.length != 0 && list.map(v => v.id) || [];
    let { goodsIds } = props;
    let ischeckIds = goodsIds.filter((item:any) => list.some(ele => ele.id === item));
    let ischeckoAllList = isListIds.filter(item => !ischeckIds.some((ele:any) => ele === item));
    let checkAll = ischeckoAllList.length == 0 ? true :false;
    checkAll = (ischeckIds.length == 0 && isListIds.length == 0) ? false :  checkAll;
    this.setState({ checkAll })
  }
  async getCategoriesList() {
    let res = await getCategories();
    let options = res.map((v:any) => ({
      value: v.key,
      label: v.title,
      isLeaf: v.isLeaf,
    }))
    this.setState({ options })
  }
  // 查询
  query = () => {
    this.p.pageSize = 20;
    this.p.pageNum = 1;
    this.getGoodsList();
  }

  // 刷新
  refresh = () => {
    this.getGoodsList();
  }
  drawerShow = (flag:boolean) => {
    this.setState({ drawerVisible: flag })
  }

  onChange = (value:string) => {
    this.categoryId = !value.length ? '' : value[value.length - 1]
  };
  handleChange = (value:string) => {
    this.setState({shopId:value})
  }
  // 全选
  onChangeCheckbox = (e:any) => {
    let value = e.target.checked;
    if (value) {
      this.props.selGoods(this.state.list)
    } else {
      this.props.delGoods(this.state.list)
    }
    this.setState({ checkAll: value })
  }
  loadData = async (selectedOptions:any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    let res = await getSubCategories({ categoryId: targetOption.value })
    targetOption.loading = false;
    targetOption.children = res.map((v:any) => ({
      value: v.key,
      label: v.title,
      isLeaf: v.isLeaf,
    }))
    this.setState({
      options: [...this.state.options],
    });
  };
  inputChange = (value:any) => {
    this.setState({ goodsName: value })
  }
  onShowSizeChange = (pageNum:number, pageSize:number) => {
    Object.assign(this.p, { pageNum, pageSize })
    this.refresh()
  }
  onTableChange = (pageNum:number, pageSize:number) => {
    Object.assign(this.p, { pageNum, pageSize });
    this.refresh()
  }
  render() {
    const { selGoods, goodsIds } = this.props;
    const { drawerVisible, list, options, goodsName, loading } = this.state;

    return (
      <Drawer
        title="选择商品"
        placement={'top'}
        closable={true}
        height={600}
        onClose={() => this.drawerShow(false)}
        visible={drawerVisible}
      >
        <Row gutter={{ md: 15, lg: 15, xl: 15 }} style={{ height: 50, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <Col md={19} sm={19}>
            <Form layout="inline">
              <FormItem label="商品名">
                <Input value={goodsName} placeholder={'请输入'} onChange={(e) => this.inputChange(e.target.value)} />
              </FormItem>
              <FormItem label="分类">
                <Cascader
                  options={options}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  changeOnSelect
                  style={{ width: 300 }}
                  placeholder="请选择"
                />
              </FormItem>
              <FormItem label="店铺">
                <Select style={{ width: 300 }} onChange={this.handleChange}>
                  {this.state.shopListRender}
                </Select>
              </FormItem>
              <FormItem >
                <Checkbox onChange={this.onChangeCheckbox} style={{ marginRight: '20px' }} checked={this.state.checkAll} >全选</Checkbox>
              </FormItem>

            </Form>
          </Col>
          <Col md={5} sm={5}>

            <Button type="primary" icon={<SearchOutlined />} onClick={this.query}>搜索</Button>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <div className={styles.productBox}>
            {
              !list.length && <div className={styles.emptyBox}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            }
            {
              list.map((v, i) => <GoodsItem key={i} data={v} checked={goodsIds.includes(v.id)} selGoods={selGoods} />)
            }
          </div>
        </Spin>
        <div className={styles.paginationBox}>
          <Pagination
            showSizeChanger
            showTotal={(t) => <div>共{t}条</div>}
            current={this.p.pageNum}
            pageSize={this.p.pageSize}
            onShowSizeChange={this.onShowSizeChange}
            onChange={this.onTableChange}
            pageSizeOptions={['10', '20', '50', '100']}
            defaultCurrent={3}
            total={this.p.total}
          />
        </div>
      </Drawer>
    )
  }
}

