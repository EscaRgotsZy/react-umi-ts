
import React from 'react'
import { Input, Modal } from 'antd'
import QRCode from 'qrcode.react';
import { Copy } from '@/utils/utils'
import config from '@/config'



interface PreviewProps {
  id: number;
  visible: boolean;
  onClose: Function;
}
const Preview: React.FC<PreviewProps> = (props) => {
  let { id, visible, onClose } = props
  const url = `${config.h5Path}/preview?id=${id}`

  return (
    <Modal
      title="预览"
      width={500}
      visible={visible}
      onOk={() => onClose()}
      onCancel={() => onClose()}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 30px' }}>
        <span style={{ width: 50 }}>链接</span>
        <Input type="text" value={url} disabled />
        <div style={{ position: 'absolute', right: 40, top: 5, width: 35, cursor: 'pointer', color: '#2589FF', }}
          onClick={() => {
            Copy(url)
          }}
        >
          复制
          </div>
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
        <QRCode
          value={url}
          size={100}
          id='qrid'
          fgColor="#000000"
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: 20 }}>预览页面仅供样式查看，请勿对外投放</div>
    </Modal>
  )
}

export default Preview;