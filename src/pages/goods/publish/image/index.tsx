import React, { useImperativeHandle } from 'react';
import { Upload, message, Modal, Row, Col, Divider, Button, Card, } from 'antd';
import { SearchOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { handlePicUrl, handleUploadProps } from '@/common/utils';
import SortableList from './sortable';
import styles from './index.less';

interface imgsUserProp {
  goodsImageItem: any;
  videoUrl: any;
  history: any,
  location: any,
  match: any,
  loading:boolean;
}
interface imgsUserState {
  videoUrl: any;
  mouseState: boolean;
  loading: boolean;
  videoVisiable: boolean;
  videoModalUrl: any;
  imageSortList: Array<any>;
}


export default class ImageLayer extends React.Component<imgsUserProp, imgsUserState>{
  constructor(props: any) {
    super(props)
    this.state = {
      videoUrl: '',
      mouseState: false,
      loading: false,
      videoVisiable: false,
      videoModalUrl: '',
      imageSortList: [],
      //'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592288390338&di=2492cef146108e55acff7dce81804d1f&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F8c1001e93901213ff296485654e736d12e2e9596.jpg',
      // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592288511373&di=00bb0fd15a265ce2cb6df5e5a5f5d5b1&imgtype=0&src=http%3A%2F%2Fh.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2F9c16fdfaaf51f3dee3fbb43696eef01f3a297912.jpg',
    }
  }
  componentDidMount() {
    let nextProps: any = this.props;
    if (nextProps.goodsImageItem) {
      if (nextProps.goodsImageItem.length !== this.state.imageSortList.length) {
        let imageSortList = nextProps.goodsImageItem && nextProps.goodsImageItem.split(',') || [];
        this.setState({ imageSortList })
      }
    }
    if(nextProps.videoUrl){
      this.setState({videoUrl:nextProps.videoUrl})
    }

  }
  // 父组件调用子组件方法获取数据
  childMethod = () => {
    let { imageSortList } = this.state;
    let productPic = imageSortList && imageSortList.length > 0 ? imageSortList.join(',') : '';
    let { videoUrl } = this.state
    return { productPic, videoUrl }
  }
  onChangeState = (imageSortList: any) => {
    this.setState({ imageSortList: imageSortList.sortItems })
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
  // 视频上传回调
  beforeVideoUpload = (info: any) => {
    let fileSize = info.size / 1025
    if (fileSize > 500) { message.error('上传视频大小不能超过500K') } else {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        if (info.file.response.code == 200) {
          let videoUrl = info.file.response.data.picUrl;
          let that = this;
          setTimeout(function () {
            that.setState({ loading: false, videoUrl });
          }, 400);
          ;

        }

      }
    }
  }
  beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'video/mp4';
    if (!isJpgOrPng) {
      message.error('该上传仅支持视频上传!');
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('视频大小不能大于10m!');
    }
    return isJpgOrPng && isLt2M;
  }

  render() {
    const props = {
      ...handleUploadProps('/productManagement/prodpicture/save', 'file', 'default', false),
      onChange: this.beforeVideoUpload,
    };
    let { imageSortList = [] } = this.state;
    return (
      <Card title='三、商品图片' hoverable className={styles.content} loading={this.props.loading}>
        <Row>
          <Col span={20} offset={2} style={{ marginBottom: '40px' }}>
            <Row >
              <Col>
                <div style={{ fontSize: '16px', }}>上传图片提示：</div>
                <div style={{ marginLeft: '30px', fontSize: '16px', padding: '5px 0' }}>1. 本地上传图片大小不能超过<span style={{ color: '#f60' }}> 500K </span>。</div>
                <div style={{ marginLeft: '30px', fontSize: '16px', padding: '5px 0', marginBottom: '15px' }}>2. 本类目下您最多可以上传  <span style={{ color: '#f60' }}>12 </span>张图片。</div>
                <SortableList imageSortList={imageSortList} onClicked={this.onChangeState} />
                <div><span style={{ color: '#f60' }}> 450*450 </span>以上的图片可以在商品详情页主图提供图片放大功能 (图片可以拖动排序)</div>
              </Col>
            </Row>
          </Col>
          <Divider />
          <Col span={20} offset={2} style={{ marginTop: '15px' }}>
            <div style={{ fontSize: '16px', }}>上传视频提示：</div>
            <div style={{ marginLeft: '30px', fontSize: '16px', padding: '5px 0' }}>1. 本地上传视频大小不能超过<span style={{ color: '#f60' }}> 10M </span>。</div>
            <div style={{ marginLeft: '30px', fontSize: '16px', padding: '5px 0', marginBottom: '15px' }}>2. 本类目下您最多可以上传  <span style={{ color: '#f60' }}>1 </span>段视频。</div>
            <ul>
              {
                !this.state.videoUrl &&
                <li className={styles.uploadLi}>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    style={{ width: '98px', height: '116px' }}
                    {...props}
                    multiple={true}
                    beforeUpload={this.beforeUpload}
                    accept='video'
                  >
                    <div className={styles.uploadDiv}>
                      {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div className="ant-upload-text">视频上传</div>
                    </div>
                  </Upload>
                </li>}

              {
                this.state.videoUrl &&
                <li className={styles.itemStyles}
                  onMouseEnter={(e) => this.handleMouseOver(e)}
                  onMouseLeave={(e) => this.handleMouseOut(e)}
                >
                  <video src={handlePicUrl(this.state.videoUrl)} width='105' height='120' style={{ objectFit: 'fill' }} ></video>
                  {
                    this.state.mouseState &&
                    <div className={styles.search_dele}>
                      <SearchOutlined onClick={() => this.setState({ videoVisiable: true, videoModalUrl: this.state.videoUrl })} />
                      <DeleteOutlined onClick={() => this.setState({ videoUrl: '' })} />
                    </div>
                  }
                </li>}

            </ul>
          </Col>

          {/* <Col span={12} style={{ borderLeft: '1px solid #dddddd' }}>
                        <div style={{ fontSize: '16px', marginBottom: '15px', marginLeft: '10px' }}>图片空间：</div>
                        <Row style={{ display: 'flex', justifyContent: 'center', marginLeft: '36px', border: '1px dashed #dddddd' }}>
                        <Col span={17}>
                            <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                            <span>图片文件名：</span><Input style={{ width: '200px', marginRight: '50px', marginTop: '20px' }} />
                            <Button type='primary'>搜索</Button>
                            </div>
                            <ul className={styles.GoodsImage}>
                            {
                                imgList.length > 0 && imgList.map(imageSortList => (
                                <li onClick={() => this.chooseImg(imageSortList)}>
                                    <img alt="example" style={{ width: '100%', objectFit: "cover", height: '-webkit-fill-available' }} src={`${baseImgUrl + imageSortList}`} height='150' />
                                </li>
                                ))
                            }
                            </ul>
                            <div style={{ paddingBottom: '14px', marginTop: '-6px' }}>
                            <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChange} />
                            </div>
                        </Col>
                        </Row>
                    </Col> */}
        </Row>
        <Modal
          visible={this.state.videoVisiable}
          onCancel={() => this.setState({ videoVisiable: false, videoModalUrl: '' })}
          width={800}
          footer={null}
        >
          <video src={handlePicUrl(this.state.videoModalUrl)} width='400' height='600' style={{ objectFit: 'fill' }} controls={true}></video>
        </Modal>
      </Card>
    )
  }
}



