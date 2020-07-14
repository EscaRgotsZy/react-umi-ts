import React, { Component,useImperativeHandle } from 'react';
import {  Tabs, Card} from 'antd';
import Editor from './editor';
const { TabPane } = Tabs;
import styles from './index.less';

interface UserProp {
    history: any;
    location: any;
    match: any;
    editDescribeData:any;
}
export default class DescribeLayer extends Component<any,any> {
    constructor(props:UserProp) {
        super(props)
        this.state = {}
    }
    // tab 设置当前key值
    callback = (key:any) => {
        this.setState({ key })
    }
    // 子组件 富文本 更新html
    onChangeWeb = (value:any) => {
        this.setState({content:value.html})

    }
    onChangeMobile = (value:any) => {
        this.setState({mobileContent:value.html})
    }
    // 父组件调用子组件方法获取数据
    childMethod = () => {
        let { content , mobileContent } = this.state;
        return {
            content,
            mobileContent
        }
    }
    render() {
        return (
            <Card
            className={styles.content}
            hoverable
            title={'五、详情描述'}
            loading={this.props.loading}
        >
            <Tabs defaultActiveKey="1" onChange={this.callback}>

                <TabPane tab="手机详情" key="1" style={{ zIndex: 1 }}>
                    <div style={{ padding: '10px', paddingTop: 0, overflow: 'hidden', display: 'flex' }}>
                        <div className={styles.pvDeviceBg}>
                            <div className={styles.pvDeviceHd}>
                                <div className={styles.productTitle}>商品详情</div>
                            </div>
                            <div className={styles.pvDeviceBd} dangerouslySetInnerHTML={{ __html: this.state.mobileContent || (this.props.editDescribeData && this.props.editDescribeData.mobileContent  || '')}}></div>
                        </div>
                        <div className={styles.EditorClass}>
                            <Editor onClicked={this.onChangeMobile.bind(this)} mobileContent={this.props.editDescribeData && this.props.editDescribeData.mobileContent || ''} ></Editor>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="PC端详情" key="2" style={{ zIndex: 1 }}>
                    <div className={styles.EditorClass} style={{ marginTop: '10px' }}>
                        <Editor onClicked={this.onChangeWeb.bind(this)} content={this.props.editDescribeData && this.props.editDescribeData.content || ''}  ></Editor>
                    </div>
                </TabPane>
            </Tabs>
        </Card>
        )
    }
}
