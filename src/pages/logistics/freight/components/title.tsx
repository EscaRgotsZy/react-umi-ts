
import React from 'react'


const style = {
  marginBottom: 5,
  marginTop: 40,
  fontSize: 15,
  color: '#333',
  fontWeight: 500,
}

interface TitleProps {
  value?: string;
}
export default (props: TitleProps) => <div style={style}>{props.value}</div>