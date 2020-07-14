import React, { Component, } from 'react';
import { Upload, message, } from 'antd';
import styles from './index.less';
import { sortable } from 'react-sortable';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { handleUploadProps } from '@/common/utils';
import Item from './item'
var SortableItem = sortable(Item);
interface SortableListUserProp {
    imageSortList: Array<any>;
    onClicked: any;
}
interface SortableListUserState {
    sortItems: Array<any>;
    loading: boolean;

}
export default class SortableList extends Component<SortableListUserProp, SortableListUserState> {
    constructor(props: any) {
        super(props)
        this.state = {
            sortItems:[],
            loading: false,
        }
    }
    componentWillReceiveProps(nextProps: any) {
      if (nextProps.imageSortList) {
        if (nextProps.imageSortList.length !== this.state.sortItems.length) {
          let sortItems = nextProps.imageSortList || [];
          this.setState({ sortItems })
        }
      }

    }
    onSortItems = (items: any) => {
        this.setState({
            sortItems: items
        },()=>{
            this.props.onClicked({sortItems: items})
        });
    }
    // 删除更新
    onChangeState:any = (changeList?: any) => {
        this.setState({
            sortItems: changeList
        },()=>{
            this.props.onClicked({sortItems: changeList})
        });
    }
    // 上传图片
    handleChange = (info: any) => {
        let { sortItems = [] } = this.state;
        let fileSize = info.size / 1025
        if (fileSize > 500) { message.error('上传图片大小不能超过500K') } else {
            if (info.file.status === 'uploading') {
                this.setState({ loading: true });
                return;
            }
            if (info.file.status === 'done') {
                if (info.file.response.code == 200) {
                    let obj = info.file.response.data.picUrl;
                    sortItems.push(obj)
                    let that = this;
                    setTimeout(function () {
                        that.setState({ loading: false, sortItems });
                        that.props.onClicked({ sortItems });
                    }, 400);
                    ;

                }

            }
        }
    };
    componentDidMount() {
        if (this.props.imageSortList) {
            this.setState({
                sortItems: this.props.imageSortList
            })
        }
    }
    beforeUploadImage = (file: any) => {
        const isJpgOrPng = file.type.match(/^image\/*/);
        if (!isJpgOrPng) {
            message.error('该上传仅支持image/jpeg格式图片!');
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('图片大小不能大于10m!');
            return false
        }
        return isJpgOrPng && isLt2M;
    }
    render() {
        let { sortItems = [] } = this.state;
        const uploadProps = {
            ...handleUploadProps('/productManagement/prodpicture/save', 'file', 'default', false),
            onChange: this.handleChange,
        };
        var listItems = sortItems && sortItems.length != 0 && sortItems.map((item: any, i: number) => {
            return (
                <SortableItem
                    key={i}
                    onSortItems={this.onSortItems}
                    items={sortItems}
                    onChangeState={this.onChangeState}
                    sortId={i}>
                    {item}
                </SortableItem>
            );
        });

        return (
            <ul className='sortable-list' style={{ overflow: 'hidden' }}>
                {listItems}
                {sortItems.length < 12 &&
                    <li className={styles.uploadLi} >
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader"
                            {...uploadProps}
                            multiple={true}
                            beforeUpload={this.beforeUploadImage}
                        >
                            <div className={styles.uploadDiv}>
                                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                                <div className="ant-upload-text">图片上传</div>
                            </div>
                        </Upload>

                    </li>}
            </ul>
        )
    }
};
