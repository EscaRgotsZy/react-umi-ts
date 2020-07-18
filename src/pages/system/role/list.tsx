import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Popconfirm, Divider, Modal, Form, Row, Col, Input, Radio, InputNumber, } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import MenuPermissions from '@/components/Authorized/MenuPermissions';
import { getPageQuery, saveUrlParams } from '@/utils/utils';
import { GetRoleParams, getRoleLists, delRole, saveRole, putRole, getRoleInfo } from '@/services/system/role';

interface UserProp {
  history: any;
  location: any;
}
const RoleList: React.FC<UserProp> = (props) => {
  let formRef: React.RefObject<any> = React.createRef();
  let headFormRef: React.RefObject<any> = React.createRef();
  let { page = 1, size = 10 } = props.location.query;
  let [tableList, setTableList] = useState<Array<any>>([])
  let [pageInfo, setPageInfo] = useState<any>({ page: +page, size: +size, });
  let [total, setTotal] = useState<any>(0);
  let [loading, setLoading] = useState<boolean>(false);
  let [visible, setVisible] = useState<boolean>(false);
  let [roleInfo, setRoleInfo] = useState<any>(0);
  let [roleId, setRoleId] = useState<any>(0);
  let [roleName, setRoleName] = useState<any>(getPageQuery().roleName || '');
  let [oldName,setRoleOldName] = useState<any>('');
  let [roleKeys, setRoleKeys] = useState<Array<any>>();
  let [admin, setAdmin] = useState<boolean>(false)
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
    if(roleName){
      headFormRef.current.setFieldsValue({
        roleName
      })
    }
    getDataList()
  }, [])
  useEffect(() => {
    getDataList()
  }, [pageInfo])


  const columns = [
    { title: '角色编号', dataIndex: 'roleId', },
    { title: '角色名称', dataIndex: 'roleName', },
    { title: '状态', dataIndex: 'status', render: (text: number, record: any) => !text ? '启用' : '停用' },
    { title: '创建时间', dataIndex: 'createTime', },
    {
      title: '操作', width: '20%', render: (text: string, record: any, index: number) => <> <div style={{ display: 'flex', alignItems: 'center' }}>
        <a onClick={() => getRoleDetail(record)}>修改</a>
        <Divider type="vertical" />
        {
          record.roleName !== '管理员' &&
          <Popconfirm
            title="是否删除该角色?"
            onConfirm={() => del(record.roleId)}
            okText="确定"
            cancelText="取消"
          >
            <a >删除</a>
          </Popconfirm>
        }
      </div>
      </>
    },
  ]

  function editRole(data: any) {
    if (data && data.roleName == '管理员') {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
    setVisible(true);
    setRoleKeys(data ? data.resourceIds : []);
    setRoleInfo(data || {});
    setRoleId(data.roleId || 0);

  }
  useEffect(() => {
    formRef.current && formRef.current.setFieldsValue({
      roleName: roleInfo ? roleInfo.roleName : '',
      seq: roleInfo ? roleInfo.seq : 1,
      status: roleInfo ? roleInfo.status : 1,
      remark: roleInfo ? roleInfo.remark : '',
    })
  }, [roleInfo])
  // 查询
  function query() {
    setPageInfo({ size: 10, page: 1 });
  };
  // 重置
  function reset() {
    headFormRef.current.resetFields();
    query();
  };
  async function getDataList() {
    let roleName = headFormRef.current && headFormRef.current.getFieldValue().roleName;
    let params: GetRoleParams = { page: pageInfo.page, size: pageInfo.size,roleName }
    setLoading(true)
    let { total, records } = await getRoleLists(params)
    setLoading(false);
    setTotal(total);
    setTableList(records);
    saveUrlParams({
      roleName: params.roleName,
      page: params.page, 
      size: params.size,
    })
  }
  // 查询角色信息
  async function getRoleDetail(record:any) {
    let res = await getRoleInfo(record.roleId);
    if (!res) return false
    editRole(res)
    setRoleOldName(res.roleName)
  }
  // 删除模板
  async function del(roleId: number) {
    let res = await delRole(roleId);
    if (!res) return false
    getDataList()
  }
  async function subMitRole() {
    formRef.current.validateFields().then((fieldsValue: any): any => {
      let { roleName, seq, status, remark } = fieldsValue;
      let query: any = {
        seq,
        status,
        remark,
        resourceIds: roleKeys,
      }
      let res: any;
      if (roleId) {
        query.roleId = roleId;
        if (roleName && (roleName != oldName)) {
          query.roleName = roleName;
        }
        res = putRole(query)
      } else {
        query.roleName = roleName;
        res = saveRole(query)
      }
      if (!res) return false
      setVisible(false)
      getDataList()
    }).catch((err: Error) => { })
  }

  function changeRoleData(data: any) {
    setRoleKeys(data)
  }

  function renderForm() {
    return (
      <Row>
        <Col span={18}>
          <Form layout="inline" ref={headFormRef}>
            <Form.Item label="角色名称: " name="roleName">
              <Input placeholder="请输入角色名称" />
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
            <Button icon={<SyncOutlined />} style={{ marginLeft: 8 }} onClick={getDataList}>
              刷新
            </Button>
          </div>
        </Col>
      </Row>
    );
  };
  return (
    <PageHeaderWrapper>

      <Card bordered={false}>
        <div>{renderForm()}</div>
        <Button type="primary" style={{ margin: "10px 0" }} onClick={() => editRole('')}>新增角色</Button>
        <Table
          rowKey={record => record.roleId}
          loading={loading}
          columns={columns}
          dataSource={tableList}
          onChange={({ current: page, pageSize }) => {
            setPageInfo({ page, size: pageSize });
          }}
          pagination={{
            showQuickJumper: pageInfo.total > 10,
            showSizeChanger: pageInfo.total > 10,
            current: pageInfo.page,
            pageSize: pageInfo.size,
            total: total,
            showTotal: t => <div>共{t}条</div>
          }} />
      </Card>
      <Modal
        visible={visible}
        title={roleId ? '修改角色' : '新增角色'}
        forceRender={true}
        onCancel={() => setVisible(false)}
        onOk={subMitRole}
      >
        <>
          <Form
            {...formItemLayouts}
            ref={formRef}
            initialValues={{
              roleName: roleInfo ? roleInfo.roleName : '',
              seq: roleInfo ? roleInfo.seq : 1,
              status: roleInfo ? roleInfo.status : 1,
              remark: roleInfo ? roleInfo.remark : '',
            }}
          >
            <Row gutter={{ md: 0, lg: 0, xl: 0 }}>
              <Col>
                <Form.Item
                  label="角色名称:"
                  name="roleName"
                  rules={[
                    { required: true, message: '请输入角色名称' },
                    { max: 30, message: '角色名称不超过30个字' },
                  ]}
                >
                  <Input style={{ width: '250px' }} />
                </Form.Item>
                <Form.Item
                  label="角色顺序:"
                  name="seq"
                  rules={[
                    { required: true, message: '请输入角色顺序' },
                  ]}
                >
                  <InputNumber style={{ width: '250px' }} />
                </Form.Item>
                <Form.Item
                  label="状态:"
                  name="status"
                >
                  <Radio.Group>
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>停用</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="菜单权限:"
                >
                  {visible ? <MenuPermissions checkRoleData={changeRoleData} roleKeys={roleKeys} /> : null}
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

export default RoleList;
