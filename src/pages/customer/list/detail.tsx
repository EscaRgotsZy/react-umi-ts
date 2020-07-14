import styles from './detail.less'
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider, Button, Form, Input, message,Modal } from 'antd'
import { getRelativesList, getMembersInfo, getMembersAddress, addTags, AddTagsParams, delTags, editorDetail, EditorDetailParams } from '@/services/customer/list'
import { getAllTagList }from '@/services/customer/tag';
// import Modal from 'antd/lib/modal/Modal';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

/**
 * 提交
 * @param 
 */
const handleSubmit = async (params: EditorDetailParams) => {
  const hide = message.loading('正在添加');
  let res = await editorDetail(params);
  hide();
  res && message.success('编辑成功');
  return res
}
// 居中布局
const CenterDom = (props: any) => <div className={styles.center}>{props.children}</div>
// 地址
const AddrDom = (props: any) => props.data.map((v: any, i: number) => <span key={i}>{v.userName} {v.phone} {v.provName}{v.cityName}{v.areaName}{v.address}</span>);
// 亲属
const RelativesDom = (props: any) => props.data.map((v: any, i: number) => `父ID：${v.employeeUserId}，亲属用户名：${v.relativesUserName}，关系：${v.relativesTitle}`);
interface UserProp {
  history: any;
  match: any
}
const CustomerInfo: React.FC<UserProp> = (props) => {
  const [form] = Form.useForm();
  let [userId] = useState<string>(props.match.params.id)
  let [isEdit, setIsEdit] = useState<boolean>(false)
  let [isOpenModal, setIsOpenModal] = useState<boolean>(false)
  let [customerInfo, setCustomerInfo] = useState<any>({})
  let [relatives, setRelatives] = useState<Array<any>>([])
  let [addrList, setAddrList] = useState<Array<any>>([])
  let [customerTags, setCustomerTags] = useState<Array<any>>([])
  let [tagGroupData, setTagGroupData] = useState<Array<any>>([])
  let [tagArr, setTagArr] = useState<Array<any>>([])
  
  useEffect(() => {
    getDataInfo()
    getAddress()
  }, []);
  // 客户信息
  async function getDataInfo(): Promise<void | false> {
    let res = await getMembersInfo({ userId })
    if (!res) return false;
    setCustomerInfo(res)
    if(res.memberType === 1 || res.memberType === 2){
      getRelatives()
    }
    setCustomerTags(res.userTags)
    let arr = res.userTags && res.userTags.map((v,i)=>{
      return v.id
    })
    setTagArr(arr)
  }
  // 客户地址信息
  async function getAddress(): Promise<void> {
    let res = await getMembersAddress({ userId })
    setAddrList(res)
  }
  // 获取亲属列表 (员工和亲属 - 才有亲属列表)
  async function getRelatives(): Promise<void> {
    let res = await getRelativesList({ userId })
    setRelatives(res)
  }
  // 编辑
  function handleEdit() {
    setIsEdit(true)
  }
  // 取消编辑
  function cancleEdit() {
    setIsEdit(false)
  }
  //打开标签弹窗
  function openTagModal(){
    getTagGroupList()
    setIsOpenModal(true)
  }
  //关闭标签弹窗
  function closeTagModal(){
    setIsOpenModal(false)
  }
  //获取标签组标签
  async function getTagGroupList(): Promise<void | false> {
    let res = await getAllTagList();
    if (!res) return false;
    let { data=[] } = res;
    let tagGroupData = data && data.map((v: any,i:number) => ({
      key: i,
      ...v
    }))
    setTagGroupData(tagGroupData)
  }
  //选择标签
  function toggleParams (item:any, index:number) {
    let id = item.id;
    let arr = JSON.parse(JSON.stringify(tagArr));
    if(arr.includes(id)){
      arr.splice(arr.indexOf(id), 1)
    }else{
      arr.push(id);
    }
    setTagArr(arr)
  }
  //提交标签项
  async function handleSelectTag(): Promise<any>{
    let params: AddTagsParams = {
      userId,
      tagIds: tagArr
    }
    let res = await addTags(params);
    if(res[0]==true){
      message.error("绑定失败")
    }else{
      message.success("绑定成功")
    };
    setIsOpenModal(false);
    getDataInfo();
  }
  // 删除标签
  async function handleDelTag(item: any) {
    let tagId = item.id;
    let res = await delTags(userId,tagId);
    if(res[0]==true){
      message.error("删除失败")
    }else{
      message.success("删除成功")
    };
    getDataInfo();
  }
  return (
    <PageHeaderWrapper>
      {
        // 编辑
        isEdit && (
          <Card bordered={false}>
            <Form
              form={form}
              initialValues={{
                realName: customerInfo.memberType == 1 ? customerInfo.employeeName : customerInfo.realName,
                nickName: customerInfo.nickName,
                cellphone: customerInfo.cellphone,
              }}
            >
              <FormItem {...formItemLayout} label="姓名：" name="realName" rules={[
                { required: true, message: '请输入客户姓名!' },
                { max: 50, message: '姓名不能超过50个字符' }
              ]}>
                <Input placeholder="请输入客户姓名" style={{ width: '300px' }} />
              </FormItem>
              <FormItem {...formItemLayout} label="id：">{customerInfo.userId}</FormItem>
              <FormItem {...formItemLayout} label="微信昵称：" name="nickName" rules={[
                { required: true, message: '请输入微信昵称!' },
                { max: 50, message: '微信昵称不能超过50个字符' }
              ]}>
                <Input placeholder="请输入微信昵称" style={{ width: '300px' }} />
              </FormItem>
              <FormItem {...formItemLayout} label="用户类型：">{customerInfo.memberTypeText}</FormItem>
              <FormItem {...formItemLayout} label="手机号：" name="cellphone" rules={[
                { required: true, message: '请输入手机号!' },
                { max: 11, message: '请输入正确手机号!' }
              ]}>
                <Input placeholder="请输入手机号" style={{ width: '300px' }} />
              </FormItem>
              <FormItem {...formItemLayout} label="标签：">
                <div className={styles.tagDiv}>
                  <Button danger onClick={openTagModal} className={styles.tagBtn}>修改</Button>
                  <ul className={styles.tagUl}>
                  {
                  Array.isArray(customerTags) && customerTags.map( (item:any,i:number) => 
                    <li value={item.id} key={i} className={styles.tagLi}>
                      {item.name}
                      <span className={styles.tagSpan} onClick={()=>{ handleDelTag(item) }}>X</span>
                    </li>
                  )
                  }
                  </ul>
                </div>
              </FormItem>
              <FormItem {...formItemLayout} label="历史购买：">{customerInfo.ordersCount}单</FormItem>
              <FormItem {...formItemLayout} label="历史消费：">{customerInfo.totalConsumption}元</FormItem>
              <FormItem {...formItemLayout} label="可用积分：">{customerInfo.availableIntegral}</FormItem>
              {
                [1, 2].includes(customerInfo.memberType) && <FormItem {...formItemLayout} label="亲情号：">
                  {
                    customerInfo.memberType === 1 ? <><span>{relatives.length}个</span><a href={`#/customer/list/relative/${userId}`}>查看</a></>: <RelativesDom data={relatives} />
                  }
                </FormItem>
              }
              <FormItem {...formItemLayout} label="地址："><AddrDom data={addrList} /></FormItem>
            </Form>
            <Divider dashed />
            <CenterDom>
              <Button onClick={async () => {
                const fieldsValue = await form.validateFields();
                let { realName, nickName, cellphone } = fieldsValue;
                let params: EditorDetailParams = {
                  userId,
                  memberType: customerInfo.memberType as number,
                  realName,
                  nickName,
                  cellphone
                }
                let success = await handleSubmit(params)
                if(success){
                  setIsEdit(false)
                  getDataInfo()
                }
              }} type='primary' style={{ marginRight: '10px' }}>提交</Button>
              <Button onClick={cancleEdit} danger>取消</Button>
            </CenterDom>
          </Card>
        )
      }
      {
        // 查看
        !isEdit && (
          <Card bordered={false}>
            <Form>
              <FormItem {...formItemLayout} label="姓名：">{customerInfo.memberType == 1 ? customerInfo.employeeName : customerInfo.realName}</FormItem>
              <FormItem {...formItemLayout} label="id：">{customerInfo.userId}</FormItem>
              <FormItem {...formItemLayout} label="微信昵称：">{customerInfo.nickName}
              {
                customerInfo.focusOfficialAccount && <span style={{ color: 'red', paddingBottom: '4px', borderBottom: '1px solid #ccc' }}> 已关注</span>
              }
              </FormItem>
              <FormItem {...formItemLayout} label="用户类型：">{customerInfo.memberTypeText}</FormItem>
              <FormItem {...formItemLayout} label="手机号：">{customerInfo.cellphone}</FormItem>
              <FormItem {...formItemLayout} label="标签：">
                {/* {renderTag()} */}
                <div className={styles.tagDiv}>
                  <Button danger onClick={openTagModal} className={styles.tagBtn}>修改</Button>
                  <ul className={styles.tagUl}>
                  {
                  Array.isArray(customerTags) && customerTags.map( (item:any,i:number) => 
                    <li value={item.id} key={i} className={styles.tagLi}>
                      {item.name}
                      <span className={styles.tagSpan} onClick={()=>{ handleDelTag(item) }}>X</span>
                    </li>
                  )
                  }
                  </ul>
                </div>
              </FormItem>
              <FormItem {...formItemLayout} label="历史购买：">{customerInfo.ordersCount}单</FormItem>
              <FormItem {...formItemLayout} label="历史消费：">{customerInfo.totalConsumption}元</FormItem>
              <FormItem {...formItemLayout} label="可用积分：">{customerInfo.availableIntegral}</FormItem>
              {
                [1, 2].includes(customerInfo.memberType) && <FormItem {...formItemLayout} label="亲情号：">
                  {
                    customerInfo.memberType === 1 ? <><span>{relatives.length}个</span><a href={`#/customer/list/relative/${userId}`}>查看</a></> : <RelativesDom data={relatives} />
                  }
                </FormItem>
              }
              <FormItem {...formItemLayout} label="地址："><AddrDom data={addrList} /></FormItem>
            </Form>
            <Divider dashed />
            <CenterDom>
              <Button type='primary' onClick={handleEdit} style={{ marginRight: '10px' }}>编辑</Button>
              <Button type="dashed" onClick={props.history.goBack}>返回</Button>
            </CenterDom>
          </Card>
        )
      }
      <Modal
        title={'选择标签'}
        visible={ isOpenModal }//isOpenModal
        onOk={ handleSelectTag }
        onCancel={ closeTagModal }
        maskClosable={false}
      >
        <div>
          <ul className={styles.modal_Ul}>
              {
                Array.isArray(tagGroupData) && tagGroupData.map( (item:any,i:number) => 
                  <li value={item.id} key={i} className={`${styles.modal_Li} ${tagArr.includes(item.id) ? styles.active : ''}`} onClick={() => toggleParams(item, i)} >{item.name}</li>
                )
              }
          </ul>
        </div>
      </Modal>
    </PageHeaderWrapper>
  )
}
export default CustomerInfo;