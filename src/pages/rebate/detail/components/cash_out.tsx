import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Drawer, Modal, Button, Form, Cascader, Input, Row, Col } from 'antd'
import { formatMoney } from '@/utils/math'
import { getAreas, getCitys, getProvs } from '@/services/common/city'
import { cashOut, CashOutParams } from '@/services/rabate/detail'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
// 提现
async function handlePush(params: CashOutParams) {
  return await cashOut(params)
}

interface userProp {
  drawerCancel: Function;
  totalAmount: number;// 可提现
  waitWithdrawAmount: number;// 待入账
}
const CashOut: React.FC<userProp> = (props) => {

  const [addrList, setAddrList] = useState<Array<any>>([])
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false)

  useEffect(() => {
    getProv()
  }, [])


  // 获取省列表
  async function getProv() {
    let res = await getProvs()
    setAddrList(res)
  }
  // 获取市列表
  async function getCity(provinceId: number) {
    return await getCitys({ provinceId })

  }
  // 获取区列表
  async function getArea(cityId: number) {
    return await getAreas({ cityId })
  }
  async function loadData(selectedOptions: any) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    let { level, value } = targetOption
    targetOption.loading = true;
    let children = []
    if (level === 1) {
      children = await getCity(value);
    } else if (level === 2) {
      children = await getArea(value);
    }
    targetOption.loading = false;
    targetOption.children = children
    setAddrList([...addrList])
  }
  return (
    <Drawer
      title={`团建费-提现`}
      width="980"
      placement="right"
      visible={true}
      closable={true}
      onClose={() => props.drawerCancel()}
    >
      <Row>
        <Col span={8}></Col>
        <Col span={10}><div>可提现金额：{formatMoney(props.totalAmount, 2)}元，待入账金额{formatMoney(props.waitWithdrawAmount, 2)}元</div></Col>
      </Row>
      <Form {...formItemLayout}
        onFinish={async (values) => {
          let { bank, bankAccount, amount, bankAddress } = values
          let params: CashOutParams = {
            bank,
            bankAccount,
            amount: +amount,
            bankAddress: bankAddress.join(',')
          }
          let res = await handlePush(params)
          res && setConfirmVisible(true)
          history.push('/rebate/cash_out')
      }}
      >
        <Form.Item label="提现金额" name="amount" rules={[
          {
            required: true,
            message: '请输入提现金额',
          },
          {
            validator(_, value) {
              if ( value > props.totalAmount) {
                return Promise.reject('提现金额不能大于可提现金额');
              }else if (value && (!/^[0-9]+(\.[0-9]{1,2})?$/.test(value) || value < 50)) {
                return Promise.reject('金额为大于等于50的整数或小数点后2位');
              } else {
                return Promise.resolve();
              }
            }
          }
        ]}>
          <Input placeholder='提现金额不能小于50元' />
        </Form.Item>
        <Form.Item label="公司银行卡号" name="bankAccount" rules={[
          {
            required: true,
            message: '请输入银行卡号',
          },
          {
            validator(_, value) {
              if (value && !/^[0-9]+$/.test(value)) {
                return Promise.reject('卡号须为数字');
              } else {
                return Promise.resolve();
              }
            },
          },
        ]}>
          <Input placeholder='请输入' />
        </Form.Item>


        <Form.Item label="开户地址" name="bankAddress" rules={[
          { type: 'array', required: true, message: '请选择' },
        ]}>
          <Cascader
            options={addrList}
            loadData={loadData}
            changeOnSelect
            placeholder='请选择'
          />
        </Form.Item>

        <Form.Item label="开户行" name="bank" rules={[
          {
            required: true,
            message: '请输入开户行',
          },
        ]}>
          <Input placeholder='请输入' />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">确认提现</Button>
          <Button style={{ marginLeft: 10 }} onClick={() => props.drawerCancel()}>取消</Button>
        </Form.Item>
      </Form>

      <Modal
        visible={confirmVisible}
        closable={false}
        maskClosable={false}
        onOk={()=>{
          setConfirmVisible(false)
        }}
        onCancel={() => setConfirmVisible(false)}
      >
        <p>您的提现申请已提交，审核通过后，会为你打款</p>
      </Modal>
    </Drawer>
  )
}

export default CashOut;
