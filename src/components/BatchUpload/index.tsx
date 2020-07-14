
import React, {useState, useEffect} from 'react'
import { Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { uploadUrl } from '@/services/common/index'
import { tokenManage } from '@/constants/storageKey'
import config from '@/config'


/**
 * 使用案例
  <Upload setImg={(url: string) => {
    setLogoPic(url)
  }} />
 */
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className="ant-upload-text">上传</div>
  </div>
);
interface UploadParams{
  setImg: Function;
  valueUrl?: string;
}

const BatchUploadImg:React.FC<UploadParams> =(props) => {
  const { setImg, valueUrl} = props;
  const [imgUrl, setImgUrl] = useState<string>('')

  useEffect(()=>{
    valueUrl && setImgUrl(valueUrl)
  }, [valueUrl])

  // 上传图片
  function handleChange(info:any){
    if (info.file.status === 'done') {
      let res = info.file.response || {};
      let { data = [], message:desc, code } = res;
      message[code === 200 ? 'success' : 'error'](desc)
      if (code === 200) {
        setImgUrl(data[0])
        setImg(data)
      }
    }
  }


  return (
    <Upload
      name={'files'}
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action={uploadUrl}
      headers={
        {
          Authorization: tokenManage.get(),
          'platform': 'corp'
        }
      }
      onChange={handleChange}
    >
      {imgUrl ? <img src={config.baseImgUrl + (imgUrl)} style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  )
}

export default BatchUploadImg