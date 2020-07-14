import React, { useState } from 'react'
import { Card, Row, Col } from 'antd'
import { userInfoManage } from '@/constants/storageKey'
import { handlePicUrl } from '@/utils/utils'
const style = {
  marginBottom: 15
}
const Company = () => {

  const [info] = useState<any>(userInfoManage.get())

  const logo = handlePicUrl(info.licensePic)

  return (
    <Card bordered={false} style={{ marginTop: 10 }}>
      <Row gutter={16} style={style}>
        <Col span={6}>企业名称</Col>
        <Col span={18}>{info.companyName || '--'}</Col>
      </Row>
      <Row gutter={16} style={style}>
        <Col span={6}>企业类型名称</Col>
        <Col span={18}>{info.companyTypeName || '--'}</Col>
      </Row>
      <Row gutter={16} style={style}>
        <Col span={6}>企业公众号名称</Col>
        <Col span={18}>{info.officialName || '--'}</Col>
      </Row>
      <Row gutter={16} style={style}>
        <Col span={6}>联系人姓名</Col>
        <Col span={18}>{info.contactName || '--'}</Col>
      </Row>
      <Row gutter={16} style={style}>
        <Col span={6}>联系人手机</Col>
        <Col span={18}>{info.contactMobile || '--'}</Col>
      </Row>
      <Row gutter={16} style={style}>
        <Col span={6}>营业执照</Col>
        <Col span={18}>
          {
            logo ?
              <a target="_blank" href={logo}><img src={logo} title={info.licenseNumber} style={{ maxWidth: 500, cursor: 'zoom-in' }} /></a> :
              '--'
          }
        </Col>
      </Row>
    </Card>
  )
}

export default Company;
