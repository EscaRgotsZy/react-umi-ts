
import React from 'react'
import { Button } from 'antd'

interface SaveBtnProps{
  loading: boolean;
  submit: Function;
}
export default (props: SaveBtnProps) => (
  <div style={{ margin: '20px 0', textAlign: 'center' }}>
    <Button loading={props.loading} type='primary' ghost onClick={()=> props.submit()}>提交</Button>
  </div>
)