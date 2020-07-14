import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Popconfirm, Divider, Modal, Form, Row, Col, Input, Radio, InputNumber, TreeSelect, message } from 'antd';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { GetResourceParams, getResourceLists, putResource, delResource, saveResource } from '@/services/system/resource';
interface UserProp {
  history: any;
  location: any;
}
const ResourceList: React.FC<UserProp> = (props) => {
  let formRef: React.RefObject<any> = React.createRef();
  let headFormRef: React.RefObject<any> = React.createRef();
  let { page = 1, size = 100 } = props.location.query;
  let [tableList, setTableList] = useState<Array<any>>([])
  let [pageInfo, setPageInfo] = useState<any>({ page: +page, size: +size, });
  let [total, setTotal] = useState<any>(0);
  let [loading, setLoading] = useState<boolean>(false);
  let [visible, setVisible] = useState<boolean>(false);
  let [treeData, setTreeData] = useState<any>()
  let [parentId, setParentId] = useState<number>();
  let [resourceInfo, setResourceInfo] = useState<any>(0);
  let [resourceId, setResourceId] = useState<number>(0); //0 是新增 有id是编辑
  const formItemLayouts = {
    labelCol: {
      xs: { span: 7 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
  };
  useEffect(() => {
    getDataList();
    getRoutersList()
  }, [pageInfo])

  function changeresource(data: any) {
    let { resourceName, parentId,menuKey,seq,visible,remark} = data;
    formRef.current.setFieldsValue({
      resourceName,
      parentId,
      menuKey,
      seq,
      visible,
      remark,
    })
    setResourceId(data.resourceId)
    setResourceInfo(data);
    setVisible(true);
  }

  const columns = [
    { title: '菜单名称', dataIndex: 'resourceName', },
    { title: '菜单ID', dataIndex: 'resourceId', },
    { title: '权限标识', dataIndex: 'menuKey', },
    { title: '创建时间', dataIndex: 'createTime', },
    {
      title: '操作', width: '20%', render: (text: string, record: any, index: number) => <> <div style={{ display: 'flex', alignItems: 'center' }}>
        <a onClick={() => changeresource(record)}>修改</a>
        <Divider type="vertical" />
        <Popconfirm
          title="是否删除该菜单?"
          onConfirm={() => del(record.resourceId)}
          okText="确定"
          cancelText="取消"
        >
          <a >删除</a>
        </Popconfirm>
      </div>
      </>
    },
  ]
  // 查询
  function query() {
    setParentId(0)
    setPageInfo({ size: 100, page: 1 });
  };
  // 重置
  function reset() {
    headFormRef.current.resetFields();
    query();
  };

  async function getDataList() {
    let resourceName = headFormRef.current && headFormRef.current.getFieldValue().resourceName
    let params: GetResourceParams = { page: pageInfo.page, size: pageInfo.size, }
    if (parentId + '') {
      params.parentId = 0
    }
    props.history.replace({
      query: params,
      resourceName,
    });
    setLoading(true)
    let { total, records } = await getResourceLists(params)
    setLoading(false);
    setTotal(total);
    setTableList(records);
  }

  // 删除菜单
  async function del(resourceId: number) {
    let res = await delResource({ id: resourceId });
    if (!res) return false
    getDataList()
  }

  function addNewMenu() {
    formRef.current.setFieldsValue({
      resourceName:'',
      parentId:'',
      menuKey:'',
      seq:'',
      visible:'',
      remark:'',
    })
    setResourceId(0)
    setResourceInfo({});
    setVisible(true);
  }

  async function getRoutersList() {
    let res = await getResourceLists({ parentId: 0 ,page:1,size:100});
    let newTree = [{
      key: 0,
      resourceId: 0,
      title: '主菜单',
      value: 0,
      children: res.records
    }]
    setTreeData(newTree)
  }

  function onSelect(value:any, node:any, extra:any){
    console.log(value, node, extra);
    if(node && node.grade>=2){
      message.error('不能选取二级作为上级菜单')
      formRef.current.setFieldsValue({parentId:''})
    }
  }

  async function subMitresource() {
    formRef.current.validateFields().then((fieldsValue: any): any => {
      let query = {
        ...fieldsValue
      }
      query.menuType = 1;
      let res: any;
      if (resourceId) {
        query.resourceId = resourceId;
        res = putResource(query)
      } else {
        res = saveResource(query)
      }
      if (!res) return false
      res.then((data:any)=>{
        if(data){
          formRef.current && formRef.current.resetFields();
          setVisible(false)
          getDataList()
        }
      })


    }).catch((err: Error) => { })
  }
  function renderForm() {
    return (
      <Row>
        <Col span={18}>
          <Form layout="inline" ref={headFormRef}>
            <Form.Item label="菜单名称: " name="resourceName">
              <Input placeholder="请输入菜单名称" />
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              onClick={query}
              icon={<SearchOutlined />}
              style={{ marginRight: 5, marginLeft: 5 }}
            >
              {' '}
              查询{' '}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={reset}>
              重置
            </Button>

          </div>
        </Col>
      </Row>
    );
  };
  return (
    <PageHeaderWrapper>
      <Card bordered={false} >
        <div>{renderForm()}</div>
      </Card>
      <Card bordered={false} style={{ paddingTop: '0' }}>
        <Button type="primary" style={{ margin: "10px 0" }} onClick={() => addNewMenu()}>新增菜单</Button>
        <Table
          rowKey={record => record.resourceId}
          loading={loading}
          columns={columns}
          dataSource={tableList}
          onChange={({ current: page, pageSize }) => {
            setPageInfo({ page, size: pageSize });
          }}
          pagination={{
            showQuickJumper: total > 100,
            showSizeChanger: total > 100,
            current: pageInfo.page,
            pageSize: pageInfo.size,
            total: total,
            showTotal: t => <div>共{t}条</div>
          }} />
      </Card>
      <Modal
        visible={visible}
        title={resourceId ? '修改菜单' : '新增菜单'}
        forceRender={true}
        onCancel={() => setVisible(false)}
        onOk={subMitresource}
      >
        <>
          <Form
            {...formItemLayouts}
            ref={formRef}
            initialValues={{
              resourceName: resourceInfo ? resourceInfo.resourceName : '',
              parentId: resourceInfo ? resourceInfo.parentId : '',
              menuKey: resourceInfo ? resourceInfo.menuKey : '',
              seq: resourceInfo ? resourceInfo.seq : 1,
              visible: resourceInfo ? resourceInfo.visible : 1,
              remark: resourceInfo ? resourceInfo.remark : '',
            }}
          >
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col>
                <Form.Item
                  label="上级菜单:"
                  name="parentId"
                  rules={[
                    { required: true, message: '请选择上级菜单' },
                  ]}
                >
                  {
                    !parentId
                      ?
                      <TreeSelect
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder="请选择上级菜单"
                        onSelect={onSelect}
                      />
                      : null
                  }
                </Form.Item>
                <Form.Item
                  label="菜单名称:"
                  name="resourceName"
                  rules={[
                    { required: true, message: '请输入菜单名称' },
                    { max: 30, message: '菜单名称不超过30个字' },
                  ]}
                >
                  <Input style={{ width: '250px' }} />
                </Form.Item>
                <Form.Item
                  label="权限标识:"
                  name="menuKey"
                  rules={[
                    { required: true, message: '请输入正确标识' },
                  ]}
                >
                  <Input style={{ width: '250px' }} />
                </Form.Item>
                <Form.Item
                  label="菜单顺序:"
                  name="seq"
                  rules={[
                    { required: true, message: '请输入菜单顺序' },
                  ]}
                >
                  <InputNumber style={{ width: '250px' }} />
                </Form.Item>
                <Form.Item
                  label="状态:"
                  name="visible"
                >
                  <Radio.Group>
                    <Radio value={"0"}>正常</Radio>
                    <Radio value={"1"}>停用</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="备注:"
                  name="remark"
                >
                  <TextArea style={{ width: '300px', marginLeft: '10px' }} ></TextArea>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default ResourceList;
