import styles from './index.less';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { handlePicUrl, getPageQuery } from '@/utils/utils';
import moment from 'moment';
import GiftsList from '@/pages/activity/gift/components/giftsInfo'
import { Card, Form, Row, Col, Input, Table, Button, Modal, message, Select, DatePicker, Divider } from 'antd';
import {
    getGiftsInfo,
    getNotJoinProductsParams,
    getNotJoinProducts,
    getGiftsListParams,
    getGiftsList,
    addGiftsActivityParams,
    addGiftsActivity
} from '@/services/activity/gifts';
interface UserState {
    loading: boolean,
    giftId: string,
    id: string | number,
    pageNum_goods: number,
    pageSize_goods: number,
    total_goods: number,
    pageNum_gift: number,
    pageSize_gift: number,
    total_gift: number,

    goodsModal: boolean,// 添加/编辑赠品活动弹框
    giftsModal: boolean,// 添加/编辑赠品活动弹框

    startTime: string,      //起始时间
    endTime: string,        //结束时间
    endOpen: boolean,
    fullValue: number,  //可选赠品数量

    goodsArr: Array<any>,// 已选择的商品数据
    selectedRows_goods: Array<any>,// 选择的商品数据
    selectedRowKeys_goods: Array<any>,// 选择的商品id
    goodsList: Array<any>,

    giftsArr: Array<any>,// 已选择的赠品数据
    selectedRows_gift: any,// 赠品-选择的商品数据
    selectedRowKeys_gift: Array<any>,// 赠品-选择的商品id列表 & 展开列表
    skuArr: any,// 已选商品的sku
    giftsList: Array<any>,
    openType: string,
    //回显
    dataList: any,//活动id项数据[]
};
const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
interface UserProp {
    history: any;
    location: any;
    match: any;
};
export default class addGifts extends Component<UserProp, UserState> {
    formRef: React.RefObject<any>;
    goodsFormRef: React.RefObject<any>;
    giftsFormRef: React.RefObject<any>;
    constructor(props: UserProp) {
        super(props);
        this.formRef = React.createRef();
        this.goodsFormRef = React.createRef();
        this.giftsFormRef = React.createRef();
        this.state = {
            loading: false,
            giftId: this.props.match.params.id,
            id: '',
            pageNum_goods: 1,
            pageSize_goods: 5,
            total_goods: 0,
            pageNum_gift: 1,
            pageSize_gift: 5,
            total_gift: 0,
            goodsModal: false,// 添加/编辑赠品活动弹框
            giftsModal: false,// 添加/编辑赠品活动弹框
            startTime: '',      //起始时间
            endTime: '',        //结束时间
            endOpen: false,
            fullValue: 0,  //可选赠品数量
            goodsArr: [],// 已选择的商品数据
            selectedRows_goods: [],// 选择的商品数据
            selectedRowKeys_goods: [],// 选择的商品id
            goodsList: [],
            giftsArr: [],// 已选择的赠品数据
            selectedRows_gift: {},// 赠品-选择的商品数据
            selectedRowKeys_gift: [],// 赠品-选择的商品id列表 & 展开列表
            skuArr: {},// 已选商品的sku
            giftsList: [],
            openType: '',
            //回显
            dataList: {},//活动id项数据[]
        };
    }
    goodsColumns: Array<any> = [
        {
            title: '商品名称',
            dataIndex: '',
            render: (record: any) => <>
                <div style={{ float: "left", marginTop: '10px' }}><img width='80' height="80" src={handlePicUrl(record.productPic)} /></div>
                <div style={{ float: "left" }}>
                    <p className={styles.pstyle1}>{record.productName}</p>
                    <p style={{ padding: '5px 10px' }}>商品ID：{record.productId}</p>
                </div>
            </>
        },
        {
            title: '原价',
            dataIndex: 'skuMaxPrice',
        },
        {
            title: '库存',
            dataIndex: 'stocks',
        },
    ]
    giftsColumns: Array<any> = [
        {
            title: '赠品',
            dataIndex: '',
            render: (record: any) => <>
                <div style={{ float: "left", marginTop: '10px' }}><img width='80' height="80" src={handlePicUrl(record.productPic)} /></div>
                <div style={{ float: "left" }}>
                    <p className={styles.pstyle1}>{record.productName}</p>
                    <p style={{ padding: '5px 10px' }}>商品ID：{record.productId}</p>
                </div>
            </>
        },
        {
            title: '原价',
            dataIndex: 'skuMaxPrice',
        },
        {
            title: '库存',
            dataIndex: 'stocks',
        },
    ]
    skuColumns: Array<any> = [
        {
            title: '规格',
            dataIndex: 'skuProps',
        },
        {
            title: '原价',
            dataIndex: 'price',
        },
        {
            title: '库存',
            dataIndex: 'stocks',
        },
    ]
    //挂载  
    componentDidMount() {
        this.state.giftId && this.getAllData();
    }
    //根据传的id进行数据回显
    //1.查所有数据
    getAllData = async (): Promise<any> => {
        let id = this.state.giftId;
        let res = await getGiftsInfo(id);
        if (!res) return false;
        let { data } = res || {};
        this.setState({ dataList:data })
        let { productId, productName, productPic,startTime, endTime, skuMaxPrice, actualStocks, stocks, giftActivityProducts, fullValue } = data
        this.formRef.current.setFieldsValue({
            activityTime: [moment(startTime), moment(endTime)],
            fullValue: fullValue
        })
        let Arr = giftActivityProducts && giftActivityProducts.map((v:any,i:number)=>{
            return {
                key: v.giftProd,
                productId: v.giftProd,
                productName: v.productName,
                productPic: handlePicUrl(v.productPic),
                skuMaxPrice: v.skuMaxPrice,
                stocks: v.stocks,
                productSkus: v.skuIds,
            }
        });
        let rowKeyArr = Arr.map((v:any )=> {
            return v.productId
        })

        let rowArr = {}
        for (var i = 0; i < Arr.length; i++) {
            var key = Arr[i].giftProd;
            var value = Arr[i];
            rowArr[key] = value;
        }

        let skuIdsArr = {};
        let l = giftActivityProducts.length;
        for (var i = 0; i < l; i++) {
            var key = giftActivityProducts[i].giftProd;
            var value = giftActivityProducts[i].skuIds;
            skuIdsArr[key] = value;
        }

        this.setState({
            goodsArr: [{
                key: productId,
                productId: productId,
                productName: productName,
                productPic: handlePicUrl(productPic),
                stocks: stocks,
                skuMaxPrice: skuMaxPrice
            }],
            selectedRows_goods: [{
                key: productId,
                productId: productId,
                productName: productName,
                productPic: handlePicUrl(productPic),
                stocks: actualStocks,
                skuMaxPrice: skuMaxPrice
            }],
            selectedRowKeys_goods: [productId],
            giftsArr: Arr,
            selectedRows_gift: rowArr,
            selectedRowKeys_gift: rowKeyArr,
            skuArr: skuIdsArr,
        })
    }
    //获取商品列表
    getGoodsList = async (): Promise<any> => {
        let { productId_goods = '', productName_goods = '' } = this.goodsFormRef.current.getFieldsValue();
        let params: getNotJoinProductsParams = {
            productId: productId_goods,
            productName: productName_goods,
            page: this.state.pageNum_goods,
            size: this.state.pageSize_goods
        }
        this.setState({ loading: true });
        let res = await getNotJoinProducts(params);
        this.setState({ loading: false })
        if (!res) return false;
        let { records, total } = res || {};
        let goodsList = records && records.length != 0 ? records.map((v: any) => {
            let productPic = handlePicUrl(v.productPic)
            return {
                key: v.productId,
                ...v,
                productPic
            }
        }) : []
        this.setState({
            goodsList,
            total_goods: total || 0
        })
    }
    //获取赠品列表
    getGiftsList = async (): Promise<any> => {
        let { productId_gift = '', productName_gift = '' } = this.giftsFormRef.current.getFieldsValue();
        let params: getGiftsListParams = {
            productId: productId_gift,
            productName: productName_gift,
            page: this.state.pageNum_gift,
            size: this.state.pageSize_gift
        }
        this.setState({ loading: true });
        let res = await getGiftsList(params);
        this.setState({ loading: false })
        if (!res) return false;
        let { records, total } = res || [];
        let giftsList = records && records.length > 0 ? records.map((v: any, i: number) => {
            let productPic = handlePicUrl(v.productPic)
            return {
                key: v.productId,
                ...v,
                productPic,
            }
        }) : []
        this.setState({
            giftsList,
            total_gift: total || 0
        })
    }
    //商品页面切换
    onTableChange_goods = ({ current: pageNum_goods, pageSize: pageSize_goods }: any) => {
        this.setState({
            pageNum_goods,
            pageSize_goods
        }, this.getGoodsList)
    }
    //赠品页面切换
    onTableChange_gift = ({ current: pageNum_gift, pageSize: pageSize_gift }: any) => {
        this.setState({
            pageNum_gift,
            pageSize_gift
        }, this.getGiftsList)
    }
    //选择商品弹窗
    openGoodsModal = (flag = true) => {
        this.setState({ goodsModal: flag, openType: 'goods' })
        setTimeout(() => {
            this.getGoodsList();
        }, 100);
    }
    //选择赠品弹窗
    openGiftsModal = (flag = true) => {
        this.setState({ giftsModal: flag })
        setTimeout(() => {
            this.getGiftsList();
        }, 100);
    }
    //删除商品
    delCurrentGoods = () => {
        this.setState({
            goodsArr: [],
            selectedRowKeys_goods: [],
            selectedRows_goods: []
        })
    }
    //添加商品--只能选择一个商品
    addGoods = (): any => {
        let { selectedRows_goods } = this.state;
        if (!selectedRows_goods.length) return message.warn('请选择一个商品')
        this.setState({ goodsArr: [...selectedRows_goods] })
        this.openGoodsModal(false)
    }
    //删除赠品
    delCurrentGifts = ({ productId }: any, idx: number) => {
        let selectedRowKeys_gift = [...this.state.selectedRowKeys_gift]
        selectedRowKeys_gift.splice(selectedRowKeys_gift.indexOf(productId), 1)
        let giftsArr = [...this.state.giftsArr]
        giftsArr.splice(idx, 1);
        this.setState({ giftsArr, selectedRowKeys_gift })
    }
    //添加赠品
    addGifts = (): any => {
        let { selectedRowKeys_gift, selectedRows_gift } = this.state;
        if (!selectedRowKeys_gift.length) return message.warn('请至少选择一个商品作为赠品')
        if (selectedRowKeys_gift.length > 9) return message.warn('只能选择9个赠品')
        let giftsArr = selectedRowKeys_gift.map((v: any) => {
            return selectedRows_gift[v]
        })
        this.setState({ giftsArr })
        this.openGiftsModal(false)
    }
    //取消提交
    cancelSubmit = () => {
        this.props.history.goBack()
    }
    //提交赠品活动
    handleSubmit = () => {
        this.formRef.current
            .validateFields()
            .then((values: any): any => {
                let { fullValue } = values;
                let { skuArr, giftsArr, goodsArr, startTime, endTime, } = this.state;
                if (!goodsArr.length) return message.warn('请选择商品')
                if (!giftsArr.length) return message.warn('请选择赠品的商品')
                if (!fullValue) return message.warn('请选择赠品数量')
                if (!startTime || !endTime) return message.warn('请选择活动时间')
                if (startTime > endTime) return message.warn('结束时间不能小于开始时间')
                let giftActivityProducts = giftsArr.map((v: any) => {
                    return {
                        giftProd: v.productId,
                        skuIds: skuArr[v.productId]
                    }
                });
                let len = giftActivityProducts.length;
                for (let i = 0; i < len; i++) {
                    if (!giftActivityProducts[i].skuIds || !giftActivityProducts[i].skuIds.length)
                        return message.warn('请选择赠品规格!')
                }
                let params: addGiftsActivityParams = {
                    productName: goodsArr[0]['productName'],
                    productId: goodsArr[0]['productId'],
                    giftActivityProducts,
                    fullValue,
                    endTimeStr: startTime,
                    startTimeStr: endTime,
                }
                this.saveCommitgifts(params)
            }).catch((err: Error) => { });
    }
    // 上传接口
    saveCommitgifts = async (params: addGiftsActivityParams) => {
        await addGiftsActivity(params);
        this.props.history.push('/activity/gift')
    };
    //时间选择
    disabledDate = (current: any) => {
        return current && current < moment().startOf('day');
    }

    disabledTime = (type: any): any => {
        let date = new Date();
        let hour = date.getHours();
        let Minutes = date.getMinutes();
        let Seconds = date.getSeconds();
        if (type === 'start') {
            return {
                disabledHours: () => this.range(0, hour),
                disabledMinutes: () => this.range(0, Minutes),
                disabledSeconds: () => this.range(0, Seconds),
            }
        }
    }
    range = (start: any, end: any) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }
    // 活动时间
    checkDate = (date: any, dateString: any) => {
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1],
        })
    }
    giftSearch = () => {
        this.setState({
            pageNum_gift: 1,
            pageSize_gift: 5,
            selectedRowKeys_gift: [],
            skuArr: {},
        }, this.getGiftsList)
    }
    goodsSearch = () => {
        this.setState({
            pageNum_goods: 1,
            pageSize_goods: 5,
            selectedRows_goods: [],
            selectedRowKeys_goods: [],
        }, this.getGoodsList)
    }
    skuClick = (productId: string | number, skuId: number | string) => {
        let skuArr = { ...this.state.skuArr }
        if (skuArr[productId]) {
            let skuList = skuArr[productId]
            if (skuList.includes(skuId)) {
                skuList.splice(skuList.indexOf(skuId), 1)
                skuArr[productId] = skuList
            } else {
                skuArr[productId] = [...skuList, skuId]
            }
        } else {
            skuArr[productId] = [skuId]
        }
        this.setState({ skuArr })
    }
    expandedRowRender = (record: any) => {
        let { productId, productSkus, productPic } = record
        let { skuArr } = this.state;
        if (!productSkus.length) {
            return <div className={styles.nosku}>该商品没有sku</div>
        }
        return <ul className={styles.sku_ul}>
            {
                productSkus.map((v: any,i:number) => <li className={styles.sku_li} key={i} onClick={() => this.skuClick(productId, v.skuId)} style={{ background: skuArr[productId] && skuArr[productId].includes(v.skuId) ? '#001529' : '#f1f1f1', color: skuArr[productId] && skuArr[productId].includes(v.skuId) ? '#fff' : '#333' }}>
                    <div className={styles.div_img}><img src={productPic} /></div>
                    <p className={styles.sku_info}>{v.name}</p>
                </li>)
            }
        </ul>
    }
    render() {
        let {
            giftId,
            loading, goodsModal, giftsModal,
            giftsArr,
            goodsList, goodsArr, pageNum_goods, pageSize_goods, total_goods, selectedRowKeys_goods,
            giftsList, pageNum_gift, pageSize_gift, total_gift, selectedRowKeys_gift,
        } = this.state;
        //商品选择详细
        const rowSelection_goods: any = {
            selectedRowKeys: selectedRowKeys_goods,
            type: 'radio',
            onChange: (selectedRowKeys: Array<any>, selectedRows: Array<any>) => {
                this.setState({ selectedRows_goods: selectedRows, selectedRowKeys_goods: selectedRowKeys })
            },
        };
        // 赠品 - 商品选择详细
        const rowSelection_gift = {
            selectedRowKeys: selectedRowKeys_gift,
            onChange: (selectedRowKeys: Array<any>, selectedRows: Array<any>) => {
                let selectedRows_gift = this.state.selectedRows_gift;
                selectedRows.forEach(v => {
                    if ( v && !selectedRows_gift[v['productId']]) {
                        selectedRows_gift[v['productId']] = v
                    }
                })
                this.setState({ selectedRowKeys_gift: selectedRowKeys, selectedRows_gift })
            },
            onSelect: (record: any, selected: any) => {
                let { productId, productSkus } = record;
                let skuArr = { ...this.state.skuArr }
                skuArr[productId] = selected ? productSkus.map((v: any) => v.skuId) : []
                this.setState({ skuArr })
            },
            onSelectAll: (selected: any, selectedRows: any) => {
                let skuArr = { ...this.state.skuArr }
                selectedRows.map((v: any) => {
                    skuArr[v.productId] = selected ? v.productSkus.map((v: any) => v.skuId) : []
                })
                this.setState({ skuArr })
            }
        };

        //分页商品
        const pagination_goods = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageNum_goods,
            pageSize: pageSize_goods || 10,
            total: total_goods,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        //分页赠品
        const pagination_gift = {
            showQuickJumper: true,
            showSizeChanger: true,
            current: pageNum_gift,
            pageSize: pageSize_gift || 10,
            total: total_gift,
            showTotal: (t: number) => <div>共{t}条</div>
        }
        return (
            <PageHeaderWrapper>
                <Card>
                    <Form
                        ref={this.formRef}
                        initialValues={{}}
                    >
                        <Row style={{ margin: '50px auto' }}>
                            <Col md={1} sm={1}></Col>
                            <Col md={22} sm={22}>
                                <FormItem
                                    label="选择商品："
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择商品',
                                        }
                                    ]}
                                >
                                    {giftId &&
                                        <Button disabled>选择商品</Button>
                                    }
                                    {!giftId &&
                                        <Button onClick={() => { this.openGoodsModal(true) }}>选择商品</Button>
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            Array.isArray(goodsArr) && goodsArr.map((v, i) => {
                                return (
                                    <Row style={{ marginBottom: '30px' }} key={i}>
                                        <Col md={2} sm={2}></Col>
                                        <Col md={22} sm={22}>
                                            <ul className={styles.ulstyle}>
                                                <li key={i} className={styles.listyle}>
                                                    <div className={styles.l}><img width='80' height="80" src={v.productPic} /></div>
                                                    <div className={styles.divstyle}>
                                                        <p className={styles.pstyle} >商品名称：{v.productName}</p>
                                                        <p style={{ color: '#fff', marginBottom: '0' }}>商品ID：{v.productId}</p>
                                                    </div>
                                                    <span className={styles.text}>原价：{v.skuMaxPrice}</span>
                                                    <span className={styles.text} >库存：{v.stocks}</span>
                                                    {!giftId && <span className={styles.close} onClick={this.delCurrentGoods}>X</span>}
                                                </li>

                                            </ul>
                                        </Col>
                                    </Row>
                                )
                            })
                        }
                        <Row style={{ marginBottom: '30px' }}>
                            <Col md={1} sm={1}></Col>
                            <Col md={22} sm={22}>
                                <FormItem label="赠品管理：">
                                    {giftId &&
                                        <Button disabled>添加赠品</Button>
                                    }
                                    {!giftId &&
                                        <Button onClick={() => { this.openGiftsModal(true) }} >添加赠品</Button>
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        {giftsArr && giftsArr.length > 0 &&
                            <Row style={{ marginBottom: '30px' }}>
                                <Col md={2} sm={2}></Col>
                                <Col md={22} sm={22}>
                                    <ul className={styles.ulstyle}>
                                        {giftsArr.map((item, idx) => (
                                            <li key={idx} className={styles.listyle} style={{ background: '#0b2138' }}>
                                                <GiftsList data={item} delCurrentGifts={this.delCurrentGifts} giftId={giftId} idx={idx}></GiftsList>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                        }
                        <Row style={{ marginBottom: '30px' }}>
                            <Col md={1} sm={1}></Col>
                            <Col md={22} sm={22}>
                                <FormItem
                                    label="赠品数量："
                                    name='fullValue'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择赠品数量',
                                        }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        disabled={giftId ? true : false}
                                        style={{ width: 200 }}
                                        placeholder="可选赠品数量"
                                    >
                                        {
                                            Array.isArray(giftsArr) && giftsArr.map((v: any, i: number) => <Option value={i + 1} key={i}>可选送{i + 1}个</Option>)
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
                            <Col md={1} sm={1}></Col>
                            <Col md={22} sm={22}>
                                <FormItem
                                    label="活动时间："
                                    style={{ margin: '20px 0', }}
                                    name='activityTime'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择活动时间',
                                        }
                                    ]}
                                >
                                    <RangePicker
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                        }}
                                        disabledDate={this.disabledDate}
                                        onChange={this.checkDate}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={giftId ? true : false}
                                        style={{ width: '380px' }}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Divider dashed />
                        {!giftId &&
                            <Row>
                                <Col md={24} sm={24} style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                                    <Button onClick={this.cancelSubmit} >取消</Button>
                                    <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.handleSubmit} >保存</Button>
                                </Col>
                            </Row>
                        }
                    </Form>
                </Card>
                {/* 添加商品弹窗'*/}
                <Modal
                    width='960px'
                    title={`添加商品`}
                    visible={goodsModal}
                    onOk={this.addGoods}
                    onCancel={() => this.openGoodsModal(false)}
                    wrapClassName={styles.modal}
                    maskClosable={false}
                    centered={true}
                >
                    <Form layout="inline" ref={this.goodsFormRef}>
                        <Row style={{ width: '100%', paddingBottom: "10px" }}>
                            <Col md={10} sm={10}>
                                <FormItem
                                    label="商品名称："
                                    name="productName_goods"
                                >
                                    <Input placeholder="商品名称" style={{ width: '200px' }} />
                                </FormItem>
                            </Col>
                            <Col md={11} sm={11}>
                                <FormItem
                                    label="商品Id："
                                    name="productId_goods"
                                >
                                    <Input placeholder="商品Id" style={{ width: '200px' }} />
                                </FormItem>
                            </Col>
                            <Col md={3} sm={3} style={{ textAlign: 'right' }}>
                                <FormItem label="">
                                    <Button type="primary" onClick={this.goodsSearch}>搜索</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Card>
                        <Table
                            rowKey={record => record.productId}
                            loading={loading}
                            size="small"
                            dataSource={goodsList}
                            onChange={this.onTableChange_goods}
                            rowSelection={rowSelection_goods}
                            pagination={pagination_goods}
                            columns={this.goodsColumns}
                        >
                        </Table>
                    </Card>

                </Modal>

                {/* 添加赠品弹窗 */}
                <Modal
                    width='960px'
                    title={`添加赠品`}
                    visible={giftsModal}
                    onOk={this.addGifts}
                    onCancel={() => this.openGiftsModal(false)}
                    wrapClassName={styles.modal}
                    maskClosable={false}
                    centered={true}
                >
                    <div>可选9个，已选<span style={{ color: 'red', margin: '0 5px' }}>{selectedRowKeys_gift.length}</span>个</div>
                    <Form layout="inline" ref={this.giftsFormRef}>
                        <Row gutter={{ md: 0, lg: 0, xl: 0 }} style={{ width: '100%', padding: "10px 0" }}>
                            <Col md={10} sm={10}>
                                <FormItem
                                    label="商品名称："
                                    name="productName_gift"
                                >
                                    <Input placeholder="商品名称" style={{ width: '200px' }} />
                                </FormItem>
                            </Col>
                            <Col md={11} sm={11}>
                                <FormItem
                                    label="商品Id："
                                    name="productId_gift"
                                >
                                    <Input placeholder="商品Id" style={{ width: '200px' }} />
                                </FormItem>
                            </Col>

                            <Col md={3} sm={3} style={{ textAlign: 'right' }}>
                                <FormItem label="">
                                    <Button type="primary" onClick={this.giftSearch}>搜索</Button>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Card>
                        <Table
                            rowKey={record => record.productId}
                            loading={loading}
                            size="small"
                            dataSource={giftsList}
                            onChange={this.onTableChange_gift}
                            rowSelection={rowSelection_gift}
                            pagination={pagination_gift}
                            columns={this.giftsColumns}
                            // expandIconAsCell={false}
                            expandIconColumnIndex={-1}
                            expandedRowKeys={selectedRowKeys_gift}
                            expandRowByClick={true}
                            expandedRowRender={record =>
                                this.expandedRowRender(record)
                            }
                        >
                        </Table>
                    </Card>
                </Modal>
            </PageHeaderWrapper>
        )
    }
}