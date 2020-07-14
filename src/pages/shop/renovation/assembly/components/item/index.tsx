
import styles from './index.less'
import React from 'react'
import { Row, Col } from 'antd'
import classNames from 'classnames'

interface ItemProps {
  label?: string;
  required?: boolean;
  children: any;
  all?: boolean;
}
export default (props: ItemProps) => {
  let { label, children, required, all } = props;
  return (
    <Row align='middle' gutter={{ xs: 8, sm: 16, md: 24 }} style={{margin: '10px 0'}}>
      <Col span={7} style={{paddingRight: '0px !important'}}>
        <span className={classNames({
          [styles.key]: true,
          [styles.required]: required,
        })}>{label || ''}</span>
      </Col>
      <Col span={all? 17: 12} flex={1}>
        {children}
      </Col>
    </Row>
  )
}