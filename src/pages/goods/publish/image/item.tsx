import React  from 'react';
import { Modal, Button } from 'antd';
import { SearchOutlined, DeleteOutlined, DownloadOutlined, } from '@ant-design/icons';
import { handlePicUrl, } from '@/common/utils';
import styles from './index.less'


interface ItemUserProp {
    history: any;
    onChangeState: any;
    items: Array<any>;
    children: string;
    props:any;
}
interface ItemUserState {
    mouseState: boolean;
    showImageState: boolean;
    imageUrl: any;
    items: any;
}
export default class Item extends React.Component<ItemUserProp, ItemUserState> {
    constructor(props: ItemUserProp) {
        super(props)
        this.state = {
            items: this.props.items,
            mouseState: false,
            showImageState: false,
            imageUrl: '',
        }
    }

    // 鼠标移入
    handleMouseOver = (e: any) => {
        e.stopPropagation();
        this.setState({ mouseState: true })
    }
    // 鼠标移出
    handleMouseOut = (e: any) => {
        e.stopPropagation();
        this.setState({ mouseState: false })
    }
    // 放大图片
    onShowImage = (index: any) => {
        let { items } = this.state;
        this.setState({ showImageState: true, imageUrl: items[index] })
    }
    // 确定modal
    handleOk = () => {
        this.setState({ showImageState: true })
    }
    // 关闭modal
    handleCancel = () => {
        this.setState({ showImageState: false })
    }
    // 删除图片
    delImageList = (index: any) => {
        let { items } = this.state;
        items.splice(index, 1);
        this.props.onChangeState(items)
    }

    render() {
        return (
            <li
                {...this.props}
                className={styles.itemStyles}
                onMouseEnter={(e) => this.handleMouseOver(e)} onMouseLeave={(e) => this.handleMouseOut(e)}
            >
                <img alt="example" src={this.props.children && handlePicUrl(this.props.children)} className={styles.img} height='120' />
                {this.state.mouseState &&
                    <div className={styles.search_dele}>
                        <SearchOutlined onClick={() => this.onShowImage(this.props[`data-id`])} />
                        <DeleteOutlined onClick={() => this.delImageList(this.props[`data-id`])} />
                    </div>}
                <Modal
                    zIndex={100000}
                    closable={false}
                    footer={null}
                    visible={this.state.showImageState}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >

                    <a style={{ color: 'white' }} href={this.state.imageUrl && handlePicUrl(this.state.imageUrl)} download={this.state.imageUrl && handlePicUrl(this.state.imageUrl)} target='_blank'>
                        <Button type='primary' style={{ float: 'right', margin: '5px 0' }} ><DownloadOutlined />下载图片</Button>
                    </a>
                    <img alt="example" src={this.state.imageUrl && handlePicUrl(this.state.imageUrl)} style={{ width: '100%' }} />
                </Modal>
            </li>

        )
    }
}
