import React, { Component, } from 'react';
import { Card, } from 'antd';
import styles from './index.less'
import {
    getFirstLevelCa,
    getNextCategory,
} from '@/services/goods/upload/cate';
interface UserProp {
    selectCate: any;
}
interface UserState {
    isSelect: boolean;
    checkText: any;
    loading: boolean;
    firstCategoryList:Array<any>;
    secondCategoryList:Array<any>;
    thirdCategoryList:Array<any>;
    selectCategoryId:any;
}
export default class cateLayer extends Component<UserProp, UserState> {
    constructor(props: UserProp) {
        super(props)
        this.state = {
            isSelect: false, // 选择了分类
            checkText: [],
            loading: false,
            firstCategoryList: [],
            secondCategoryList: [],
            thirdCategoryList: [],
            selectCategoryId:'',
        }
    }
    componentDidMount() {
        this.findFirstLevelCa()
    }
    // 一级联动
    findFirstLevelCa = async () => {
        this.setState({ loading: true })
        let res: any = await getFirstLevelCa();
        this.setState({ loading: false })
        if (!res) return false;
        let firstCategoryList = res.categoryList.length > 0 ? res.categoryList : [];
        firstCategoryList.forEach((element: any) => {
            element.isCheck = false;
        });
        this.setState({ firstCategoryList })
    }
    // 二级联动
    findNextCategory = async (categoryId: number | string) => {
        this.setState({ loading: true })
        let res: any = await getNextCategory(categoryId);
        this.setState({ loading: false })
        let secondCategoryList = res ? res.categoryList : [];
        this.setState({ secondCategoryList })
    }
    // 三级联动
    findThirdCategory = async (categoryId: number | string) => {
        this.setState({ loading: true })
        let res: any = await getNextCategory(categoryId);
        this.setState({ loading: false })
        let thirdCategoryList = res.categoryList || [];
        this.setState({ thirdCategoryList })
    }
    // 点击一级类目
    handleCates = (categoryId: number | string, categoryName: any, cindex: any) => {
        let { checkText, firstCategoryList } = this.state;
        firstCategoryList.forEach((element: any, index: number) => {
            element.isCheck = false;
            if (index == cindex) {
                element.isCheck = true
            }
        });
        checkText[0] = categoryName;
        this.setState({ checkText })
        this.findNextCategory(categoryId)
    }
    // 点击二级类目
    handleSecondCates = (categoryId: number | string, categoryName: any, cindex: any) => {
        let { checkText, secondCategoryList } = this.state;
        secondCategoryList.forEach((element, index) => {
            element.isCheck = false;
            if (index == cindex) {
                element.isCheck = true
            }
        });
        checkText[1] = categoryName;
        this.setState({ checkText })
        this.findThirdCategory(categoryId)
    }
    // 点击三级类目
    handleThirdCates = (categoryId: number | string, categoryName: any, cindex: any) => {
        let { checkText, thirdCategoryList } = this.state;
        thirdCategoryList.forEach((element, index) => {
            element.isCheck = false;
            if (index == cindex) {
                element.isCheck = true
            }
        });
        checkText[2] = categoryName;
        this.props.selectCate(categoryId, checkText);
        this.setState({ selectCategoryId: categoryId, isSelect: true, checkText, thirdCategoryList })
    }
    render() {
        let { firstCategoryList, secondCategoryList, thirdCategoryList, } = this.state;
        return (
            <>
                <Card
                    title={'选择商品分类'}
                >
                    <div style={{ border: '1px dashed #dddddd' }}>
                        <ul style={{ padding: '10px', display: 'flex', marginBottom: '0' }}>
                            <li style={{ border: '2px solid #cccccc', width: '232px', paddingLeft: '10px', height: '305px', overflowX: 'hidden', overflowY: 'scroll' }}>
                                <div style={{ width: '200px', height: '35px', background: 'white', position: 'absolute' }}>
                                    <div style={{ width: '196px', height: '30px', margin: '4px 0', border: '1px solid #ccc', lineHeight: '30px', paddingLeft: '10px' }} >请选择商品分类</div>
                                </div>
                                <ul id='catesList' style={{ marginTop: '35px',padding:'0' }}>
                                    {
                                        firstCategoryList && firstCategoryList.length > 0 &&
                                        firstCategoryList.map((items, index) => (
                                            <li key={items.id}  className={styles.cateli_List} style={{ border: items.isCheck ? '1px solid #ddd' : '', backgroundColor: items.isCheck ? ' #f9f9f9' : '' }} onClick={() => this.handleCates(items.id, items.name, index)}>{items.name}</li>
                                        ))
                                    }
                                </ul>
                            </li>
                            {secondCategoryList && secondCategoryList.length > 0 && <li style={{ border: '2px solid #cccccc', width: '232px', paddingLeft: '10px', height: '305px', overflowX: 'hidden', overflowY: 'scroll' }}>
                                <div style={{ width: '200px', height: '35px', background: 'white', position: 'absolute' }}>
                                    <div style={{ width: '196px', height: '30px', margin: '4px 0', border: '1px solid #ccc', lineHeight: '30px', paddingLeft: '10px' }} >请选择商品分类</div>

                                </div>
                                <ul id='catesList' style={{ marginTop: '35px',padding:'0' }}>
                                    {
                                        secondCategoryList && secondCategoryList.length > 0 &&
                                        secondCategoryList.map((items, index) => (
                                            <li  key={items.id}  className={styles.cateli_List} style={{ border: items.isCheck ? '1px solid #ddd' : '', backgroundColor: items.isCheck ? ' #f9f9f9' : '' }} onClick={() => this.handleSecondCates(items.id, items.name, index)}>{items.name}</li>
                                        ))
                                    }
                                </ul>
                            </li>}
                            {thirdCategoryList && thirdCategoryList.length > 0 && <li style={{ border: '2px solid #cccccc', width: '232px', paddingLeft: '10px', height: '305px', overflowX: 'hidden', overflowY: 'scroll' }}>
                                <div style={{ width: '200px', height: '35px', background: 'white', position: 'absolute' }}>
                                    <div style={{ width: '196px', height: '30px', margin: '4px 0', border: '1px solid #ccc', lineHeight: '30px', paddingLeft: '10px' }} >请选择商品分类</div>

                                </div>
                                <ul id='catesList' style={{ marginTop: '35px',padding:'0' }}>
                                    {
                                        thirdCategoryList && thirdCategoryList.length > 0 &&
                                        thirdCategoryList.map((items, index) => (
                                            <li  key={items.id} className={styles.cateli_List} style={{ border: items.isCheck ? '1px solid #ddd' : '', backgroundColor: items.isCheck ? ' #f9f9f9' : '' }} onClick={() => this.handleThirdCates(items.id, items.name, index)}>{items.name}</li>
                                        ))
                                    }
                                </ul>
                            </li>}
                        </ul>
                    </div>
                </Card>
            </>
        )
    }
}
