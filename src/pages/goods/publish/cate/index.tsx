import React, { useEffect, useState, } from 'react';
import { Table, Card, Button, } from 'antd';
import styles from './index.less';

import {
    getFirstLevelCa,
    getNextCategory,
} from '@/services/goods/upload/cate';
interface UserProp {
    history: any;
}
const CategoryLayer: React.FC<UserProp> = (props) => {
    let [firstList, setFirstList] = useState<Array<any>>([]);
    let [secondList, setSecondList] = useState<Array<any>>([]);
    let [thirdList, setThirdList] = useState<Array<any>>([]);

    let [isAgree, setIsAgree] = useState<boolean>(false);//是否选择同意
    let [isCheckCateId, setIsCheckCateId] = useState<any>({ firstId: '', secondId: '', threeId: '', });//已选分类名称
    let [cateText, setCateText] = useState<string>('');//已选分类名称
    let [isCheckText, setIsCheckText] = useState<any>({ firstText: '', secondText: '', threeText: '', });//已选分类名称
    useEffect(() => {
        findFirstCate()
    }, [])

    useEffect(() => {
        let { firstText, secondText, threeText } = isCheckText;
        let text = firstText ? firstText : '';
        text = secondText ? text + '#' + secondText : text;
        text = threeText ? text + '#' + threeText : text;
        setCateText(text)
    }, [isCheckText])

    useEffect(() => {
        if(isCheckCateId && isCheckCateId.threeId){
            setIsAgree(true)
        }else{
            setIsAgree(false)
        }
    }, [isCheckCateId])

    async function findFirstCate() {
        let res = await getFirstLevelCa();
        let data = res ? res.categoryList : [];
        setFirstList(data);
    }
    async function findNextCategory(cateId: number | string, leval: number) {
        let res = await getNextCategory(cateId);
        let data = res ? res.categoryList : [];
        if (leval == 2) {
            setSecondList(data);
        } else {
            setThirdList(data);
        }
    }
    function torelease() {
        let nameList = cateText.split('#')
        if(isAgree){
            props.history.push(`/goods/cate/publish?cateId=${isCheckCateId.threeId}&cateName=${JSON.stringify(nameList)}`)
        }
    }
    function renderFirst() {
        return (
            <li className={styles.liContent}>
                <div className={styles.cateTitle}>
                    <div>请选择商品分类</div>
                </div>
                <ul >
                    {
                        firstList && firstList.length > 0 &&
                        firstList.map((items: any, index: number) => (
                            <li
                                key={items.id}
                                className={styles.cateli_List}
                                style={{ border: items.isCheck ? '1px solid #ddd' : '', backgroundColor: items.isCheck ? ' #f9f9f9' : '' }}
                                onClick={() => handleCates(items.id, items.name, index)}
                            >
                                {items.name}
                            </li>
                        ))
                    }
                </ul>
            </li>
        )
    }

    function renderSencond() {
        return (
            <li className={styles.liContent}>
                <div className={styles.cateTitle}>
                    <div>请选择商品分类</div>
                </div>
                <ul>
                    {
                        secondList && secondList.length > 0 &&
                        secondList.map((items: any, index: number) => (
                            <li
                                key={items.id}
                                className={styles.cateli_List}
                                style={{ border: items.isCheck ? '1px solid #ddd' : '', backgroundColor: items.isCheck ? ' #f9f9f9' : '' }}
                                onClick={() => handleSecondCates(items.id, items.name, index)}
                            >
                                {items.name}
                            </li>
                        ))
                    }
                </ul>
            </li>
        )
    }

    function renderThree() {
        return (
            <li className={styles.liContent}>
                <div className={styles.cateTitle}>
                    <div>请选择商品分类</div>
                </div>
                <ul>
                    {
                        thirdList && thirdList.length > 0 &&
                        thirdList.map((items: any, index: number) => (
                            <li
                                key={items.id}
                                className={styles.cateli_List}
                                style={{ border: items.isCheck ? '1px solid #ddd' : '', backgroundColor: items.isCheck ? ' #f9f9f9' : '' }}
                                onClick={() => handleThirdCates(items.id, items.name, index)}
                            >
                                {items.name}
                            </li>
                        ))
                    }
                </ul>
            </li>
        )
    }

    function handleCates(cateId: number | string, cateName: string, index: number) {
        firstList.forEach((v: any, i: number) => {
            if (index == i) {
                v.isCheck = true;
            } else {
                v.isCheck = false;
            }
        })
        setIsCheckCateId({
            firstId: cateId,
            secondId: '',
            threeId: ''
        })
        setIsCheckText({
            firstText: cateName,
            secondText: '',
            threeText: ''
        })
        findNextCategory(cateId, 2)
    }
    function handleSecondCates(cateId: number | string, cateName: string, index: number) {
        secondList.forEach((v: any, i: number) => {
            if (index == i) {
                v.isCheck = true;
            } else {
                v.isCheck = false;
            }
        })
        setIsCheckCateId({
            ...isCheckCateId,
            secondId: cateId,
            threeId: ''
        })
        setIsCheckText({
            ...isCheckText,
            secondText: cateName,
            threeText: ''
        })
        findNextCategory(cateId, 3)
    }
    function handleThirdCates(cateId: number | string, cateName: string, index: number) {
        thirdList.forEach((v: any, i: number) => {
            if (index == i) {
                v.isCheck = true;
            } else {
                v.isCheck = false;
            }
        })
        setIsCheckCateId({
            ...isCheckCateId,
            threeId: cateId,
        })
        setIsCheckText({
            ...isCheckText,
            threeText: cateName,
        })
    }

    return (
        <>
            <Card
                title={'选择商品总分类'}
                style={{ margin: '20px' }}
            >
                <div className={styles.cateContent}>
                    <ul style={{ padding: '20px', display: 'flex' }}>
                        {renderFirst()}
                        {renderSencond()}
                        {renderThree()}
                    </ul>
                </div>
                <h1 className={styles.checkText}>当前选择的分类是: <span>{cateText}</span> </h1>
            </Card>
            <div className={styles.goRelease} onClick={torelease} style={{ background: isAgree ? '#e5004f' : '' }}>我已阅读以下规则，现在发布</div>
            <Card
                title={'发布须知： 禁止发布侵犯他人知识产权的商品，请确认商品符合知识产权保护的规定'}
                style={{ margin: '20px' }}
            >
                <h1 className={styles.ruleContent}>规则</h1>
                <p>用户应遵守国家法律、行政法规、部门规章等规范性文件。对任何涉嫌违反国家法律、行政法规、部门规章等规范性文件的行为， 本平台有权酌情处理。
                    但平台对用户的处理不免除其应尽的法律责任。</p>
                <p>用户在平台的任何行为，应同时遵守与平台及其关联公司所签订的各项协议。
                    平台有权随时变更本规则并在网站上予以公告。若用户不同意相关变更，应立即停止使用平台的相关服务或产品。平台有权对用户行为及应适用的规则进行单方认定，并据此处理。</p>
            </Card>
        </>
    )
}

export default CategoryLayer;
