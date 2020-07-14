import styles from '../index.less';
import React, { Component } from 'react';
import moment from 'moment';
import { Form, Table, Button, Affix, Input, Switch, Popconfirm, DatePicker, Radio, Select, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import SingleUpload from '@/components/SingleUpload'
import Config from '@/config/index';
import formatSrc from '@/common/formatSrc'
import Preview from './preview'
import { getAdvertItems, addAdvertItems, putAdvertItemsEditSeq, batchDelAdvert, getNormalThemes } from '@/services/shop/adsense'
import { Copy } from '@/utils/utils'
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
interface useProps {
  advertId: string | number;
}
interface useState {
  loading: boolean;
  advertId: string | number
  pageNum: number;
  pageSize: number;
  total: number;
  previewData: any;
  isShowPreview: boolean;
  adModal: boolean;
  name: string;
  linkUrl: string;
  pic: string;

  bannerList: any[];
  markChanged: any;
  needDelArr: any[];
  applyLoading: boolean;
  themeList: any[];
  [propName: string]: any;
}
export default class OnLine extends Component<useProps, useState> {
  formRef: React.RefObject<any>;
  formRefSort: React.RefObject<any>;
  constructor(props: useProps) {
    super(props)
    this.formRef = React.createRef();
    this.formRefSort = React.createRef();
    this.state = {
      loading: false,
      themeList: [],
      advertId: props.advertId,
      pageNum: 1,
      pageSize: 200,
      total: 0,
      previewData: {},//
      isShowPreview: false,// 是否显示预览
      adModal: false,
      name: '',           //名称
      linkUrl: '',        //链接
      pic: '',            //banner图片

      bannerList: [],// {}
      markChanged: {},// id: {}  有改动的
      needDelArr: [],// id  需要删除的
      applyLoading: false,//
    }
  }
  id = ''
  columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
    },
    {
      title: '广告图片',
      dataIndex: '',
      render: (record: any) => <div className={styles.pic}>
        <img src={record.pics} />
      </div>
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '链接',
      width: 200,
      dataIndex: 'typeName',
      render: (text: any) => <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{text}</div>
    },
    {
      title: '排序',
      dataIndex: 'seq',
      render: (text: any, record: any) => (
        <Popconfirm placement="leftTop" title={this.sortDom()} onConfirm={() => this.okSort(record)} onCancel={this.cancelSort} okText="确定" cancelText="取消">
          <div className={styles.sortBy} >{text}</div>
        </Popconfirm>
      )
    },
    {
      title: '状态',
      width: 76,
      dataIndex: 'status',
      render: (text: number) => text === 0 ? '待发布' : text === 1 ? '已上线' : '已下线'
    },
    {
      title: '操作',
      width: 90,
      dataIndex: 'status',
      render: (text: any, record: any) => <>
        <a type="primary" onClick={() => this.edit(record)}>编辑</a><br />
        <Popconfirm title={text === 1 ? '确认下线?' : '确认上线?'} onConfirm={() => this.handleLine(record)}>
          <a>{text === 1 ? '下线' : '上线'}</a>
        </Popconfirm>
        {text === 0 &&
          <>
            <br />
            <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
              <a style={{ color: '#888', fontSize: 12 }}>删除</a>
            </Popconfirm>
          </>
        }
        <br />
        <a type="primary" onClick={() => this.copy(record)} style={{ color: '#999', fontSize: 12 }}>复制链接</a><br />
      </>
    }
  ]

  //挂载  
  componentDidMount() {
    this.init()
  }
  init = () => {
    this.getDataList();
    this.getPreview(1);
    this.getPreview(2);
    this.getPreview(3);
  }
  //获取banner广告列表
  getDataList = async () => {
    let params = {
      sortBy: '+seq,-modifyTime',
      page: this.state.pageNum,
      size: this.state.pageSize,
      advertId: this.state.advertId
    }
    this.setState({ loading: true });
    let [err, data] = await getAdvertItems(params);
    this.setState({ loading: false })
    if (err || !data) return false;
    let { records, total } = data;
    if (Array.isArray(records) && records.length) {
      let bannerList = records.map(v => {
        let pics = formatSrc(v.pic)
        return {
          key: v.id,
          ...v,
          pics
        }
      })
      this.setState({
        bannerList,
        total: total || 0,
      })
    }
  }
  //手机预览轮播图获取
  getPreview = async (advertId: any) => {
    let params = {
      sortBy: '+seq,-modifyTime',
      advertId,
      page: 1,
      size: 200,
      status: 1,
    }
    let [err, data] = await getAdvertItems(params);
    if (err) return false;
    let bannerPics: any[] = [];
    if (data) {
      let { records } = data;
      bannerPics = Array.isArray(records) ? records.map(v => ({ pics: formatSrc(v.pic) })) : [];
    }
    this.setState({
      previewData: {
        ...this.state.previewData,
        [advertId]: bannerPics
      }
    })
  }
  //获取专题列表数据
  getThemeList = async () => {
    this.setState({ loading: true });
    let [err, data] = await getNormalThemes();
    this.setState({ loading: false });
    if (err) return false;
    let themeList = data && data.length != 0 ? data.map(v => {
      return {
        key: v.themeId,
        ...v,
      }
    }) : [];
    this.setState({
      themeList
    })
  }
  refresh = () => {
    this.setState({
      markChanged: {},
      needDelArr: []
    })
    this.init();
  }
  // 删除
  handleDelete = async (record: any) => {
    let { id } = record;
    let { needDelArr, bannerList, } = this.state;
    this.setState({ needDelArr: [...needDelArr, id], bannerList: bannerList.filter(v => v.id !== id) })
  }
  // 上/下线
  handleLine = async (record: any) => {
    let { status, seq, endTime } = record;
    status = status === 1 ? 2 : 1;
    let isRight = (new Date(endTime).getTime() - new Date().getTime()) > 0
    if (status === 1 && !seq) return message.warn('请输入排序位置')
    if (status === 1 && !isRight) return message.warn('结束时间小于当前时间不能上线')
    this.handleData({ ...record, status })
  }
  copy = (record: any) => {
    let { type, linkUrl, themeId } = record;
    if (type === 1) {// 专题
      Copy(`${Config.h5Path}/activity/index?themeId=${themeId}`);
    }
    if (type === 2 || type === 3) {// 链接
      Copy(linkUrl);
    }
  }
  //开启弹窗
  openAdModal = (flag = true) => this.setState({ adModal: flag as boolean })

  //radio选择
  onChange = (e: any) => {
    this.setState({
      type: e.target.value
    })
  };
  //select
  onChangeSelect = (field: any, value: any) => {
    this.setState({
      [field]: value,
    });
  };
  
  add = () => {
    this.id = '';
    this.setState({ imageUrl: '' })
    this.getThemeList()
    this.setState({ adModal: true }, () => {
      setTimeout(()=>{
        this.formRef.current.resetFields()
      }, 200)
    })
  }
  edit = (record: any) => {
    let { id, name, pic, type, linkUrl, startTime, endTime, themeId } = record;
    this.id = id;
    let format = 'YYYY-MM-DD HH:mm:ss';

    this.setState({
      imageUrl: pic,
      type: type,
      adModal: true,
    }, () => {
      setTimeout(() => {
        this.formRef.current.setFieldsValue({
          name: name,
          rangeTime: [moment(moment(startTime).format(dateFormat), format), moment(moment(endTime).format(dateFormat), format)],
          type,
          linkUrl,
          themeId
        });
      }, 100)

    })
    this.getThemeList()
  }
  //popComfirm
  sortDom = () => {
    let { bannerList } = this.state
    return (
      <>
        <div style={{ color: '#000', marginBottom: 5 }}>请输入排序位置</div>
        <Form ref={this.formRefSort}>
          <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="位置" name="sortOrder" rules={
            [{ required: true, message: `请输入` }, { pattern: /^\d+$/, message: "只能输正整数" }, { pattern: /^[1-9](\d+)?$/, message: "不能输入0" }]
          }>
            <Input placeholder={`1~${bannerList.length}`} size="small" />
          </FormItem>
        </Form>
      </>
    )
  }
  okSort = (record: any) => {
    let { bannerList } = this.state
    this.formRefSort.current.validateFields(['sortOrder'])
      .then(async (values: any) => {
        let { sortOrder } = values;
        if (+sortOrder <= 0 || +sortOrder > bannerList.length) return message.error(`只能输入1~${bannerList.length}`);
        this.handleData({ ...record, seq: +sortOrder });
        this.formRefSort.current.setFieldsValue({
          sortOrder: ''
        });
        this.cancelSort();
      })
      .catch(() => { })
  }
  cancelSort = () => this.formRef.current.resetFields(['seq']);

  //编辑or新增 提交
  submit = async () => {
    let { pic, imageUrl, advertId } = this.state;
    if (!imageUrl) return message.warn('请上传轮播图片')
    this.formRef.current.validateFields()
      .then(async (values:any) => {
        let { name, startTimeStr, endTimeStr, rangeTime, type, linkUrl, themeId } = values;
        startTimeStr = moment(rangeTime[0]).format(dateFormat);
        endTimeStr = moment(rangeTime[1]).format(dateFormat);
        pic = imageUrl;

        let curChangeData = {};
        if (this.id) {
          let params = {
            advertId: +advertId,
            id: this.id,
            name,
            startTime: startTimeStr,
            endTime: endTimeStr,
            type,
            typeName: linkUrl || '',
            linkUrl: linkUrl || null,
            themeId: themeId || null,
            pic,
          }
          curChangeData = params
        } else {
          let params = {
            advertId: +advertId,
            name,
            startTimeStr,
            endTimeStr,
            type,
            linkUrl,
            themeId,
            pic,
          }
          let [err, data] = await addAdvertItems(params)
          if (err) return;
          curChangeData = data || {}
        }
        this.openAdModal(false)
        this.handleData(curChangeData)
      })
      .catch(() => { })



  }
  // 是否存在
  isBe = (id: any) => {
    let { bannerList } = this.state;
    return !!bannerList.filter(v => v.id === id).length
  }

  // curChangeData 当前发生改变的一行
  handleData = (curChangeData: any) => {
    let { id: curId, pic } = curChangeData;
    let { bannerList, markChanged, advertId } = this.state;
    let newBannerList = [...bannerList]
    curChangeData = {
      ...curChangeData,
      key: curId,
      pics: formatSrc(pic)
    }
    if (this.isBe(curId)) {// 编辑
      this.setState({
        markChanged: { ...markChanged, [curId]: curChangeData },
      })
      newBannerList = newBannerList.map(v => {
        if (v.id !== curId) return v;
        return {
          ...v,
          ...curChangeData
        }
      })
    } else {// 新增
      newBannerList.unshift(curChangeData)
    }
    newBannerList.sort((a, b) => a.seq - b.seq)
    let bannerPics = newBannerList.reduce((mo, v) => {
      if (v.status === 1) {
        mo.push({ pics: v.pics })
      }
      return mo
    }, [])
    this.setState({
      bannerList: newBannerList,
      previewData: {
        ...this.state.previewData,
        [advertId]: bannerPics
      }
    })
  }
  apply = () => {
    this.batchDel();
    this.batchUpdate();

  }
  batchDel = async () => {
    if (this.state.needDelArr.length) {
      let [err] = await batchDelAdvert(this.state.needDelArr.join(','))
      if (err) return false;
      message.success('应用成功')
    }
  }
  batchUpdate = async () => {
    let { markChanged } = this.state;
    if (!Object.keys(markChanged).length) return false;
    let params = Object.values(markChanged).map((v: any) => {
      return {
        advertId: v.advertId,
        id: v.id,
        name: v.name,
        startTimeStr: v.startTime,
        endTimeStr: v.endTime,
        type: v.type,
        linkUrl: v.linkUrl || '',
        themeId: v.themeId || '',
        pic: v.pic,
        seq: v.seq,
        status: v.status
      }
    })
    this.setState({ applyLoading: true });
    let [err] = await putAdvertItemsEditSeq(params);
    this.setState({ applyLoading: false });
    if (err) return false;
    message.success('应用成功')
    this.refresh();
  }
  previewChange = (flag: boolean) => this.setState({ isShowPreview: flag })
  //分页
  onTableChange = ({ current: pageNum, pageSize }: any) => {
    this.setState({
      pageSize,
      pageNum
    }, this.getDataList)
  }
  render() {
    let { loading, bannerList, previewData, adModal, imageUrl, themeList, isShowPreview, applyLoading, pageNum, pageSize, total, type, linkUrl } = this.state;

    const pagination = {
      showQuickJumper: true,
      current: pageNum,
      pageSize: pageSize || 5,
      total: total,
      showTotal: (t: any) => <div>共{t}条</div>
    };
  
    return (
      <>
        <Affix offsetTop={10}>
          <div className={styles.btnGroup}>
            <Button icon={<PlusOutlined />} type="primary" onClick={() => this.add()}>添加广告</Button>
            <div>
              预览：<Switch defaultChecked={isShowPreview} onChange={this.previewChange} />
              <Button loading={applyLoading} style={{ marginLeft: 15 }} type="primary" onClick={() => this.apply()}>应用</Button>
            </div>
            <Preview data={previewData} visible={isShowPreview} />
          </div>
        </Affix>
        <div>
          <Table
            loading={loading}
            dataSource={bannerList}
            onChange={this.onTableChange}
            pagination={pagination}
            columns={this.columns}
          >
          </Table>
        </div>

        <Modal
          width={800}
          title={`${this.id ? '编辑广告' : '添加广告'}`}
          visible={adModal}
          onOk={this.submit}
          onCancel={() => this.openAdModal(false)}
          maskClosable={false}
        >
          <Form
            ref={this.formRef}
            {...formItemLayout}
            initialValues={{
              type: 2
            }}>
            <FormItem label="名称：" name="name" rules={[
              { required: true, message: '请填写广告名称，不超过15个字' },
            ]}>
              <Input maxLength={15} style={{ textIndent: '5px', width: '300px' }} />
            </FormItem>
            <FormItem label="时间：" name="rangeTime" rules={[
              { required: true, message: '请填写开始时间' },
            ]}>
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </FormItem>
            <FormItem label="链接：" name="type" rules={[
              { required: true, message: '请填写开始时间' }
            ]}>
              <Radio.Group onChange={this.onChange} buttonStyle="solid" style={{ width: 500 }}>
                <Radio.Button value={2}>url链接</Radio.Button>
                <Radio.Button value={1}>专题列表</Radio.Button>
                <Radio.Button value={3}>团购链接</Radio.Button>
              </Radio.Group>
            </FormItem>
            {type != 1 ? (
              <>
                <FormItem label="地址" name="linkUrl" rules={[
                  { pattern: new RegExp(/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/), message: '请填写正确的网址' },
                  { required: true, message: '请填写开始时间' },
                ]}>
                  <Input placeholder="请输入以http/https开头的链接" style={{ textIndent: '5px', width: '300px' }} value={linkUrl} />
                </FormItem>
              </>
            ) : (
                <FormItem label="专题" name="themeId" rules={[
                  { required: true, message: '请填写开始时间' },
                ]}>
                  <Select
                    showSearch
                    style={{ width: 300 }}
                    placeholder="请选择专题"
                    optionFilterProp="children"
                    onChange={this.onChangeSelect}
                    filterOption={(input, option: any) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      Array.isArray(themeList) && themeList.map((v, i) => <Option value={v.themeId} key={v.themeId}>{v.themeName}</Option>)
                    }
                  </Select>
                </FormItem>
              )
            }

            <Form.Item label="图片：" style={{ marginBottom: '5px' }} name="pic">
            <SingleUpload valueUrl={imageUrl} setImg={(url: string) => {
              this.setState({imageUrl: url})
            }} />
            </Form.Item>
          </Form>
        </Modal>
      </>
    )
  }
}


