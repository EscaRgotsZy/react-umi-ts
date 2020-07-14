
import React, {useState, useEffect} from 'react'
import { Upload, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { pictureImport } from '@/services/common/index'
import { tokenManage } from '@/constants/storageKey'
import formatSrc from '@/common/formatSrc'


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
  disabled?: boolean;
}

const UploadImg:React.FC<UploadParams> =(props) => {
  const { setImg, valueUrl, disabled } = props;
  const [imgUrl, setImgUrl] = useState<string>('')

  useEffect(()=>{
    valueUrl && setImgUrl(valueUrl)
  }, [valueUrl])

  // 上传图片
  function handleChange(info:any){
    if (info.file.status === 'done') {
      let res = info.file.response || {};
      let { data = {}, message:desc, code } = res;
      message[code === 200 ? 'success' : 'error'](desc)
      if (code === 200) {
        let picUrl = data.picUrl;
        setImgUrl(picUrl)
        setImg(picUrl as string)
      }
    }
  }

  if(disabled){
    return <img src={formatSrc(imgUrl)} style={{ width: 100, border: '1px dashed #ccc', borderRadius: 2}} />
  }
  return (
    <Upload
      name={'file'}
      listType="picture-card"
      showUploadList={false}
      action={pictureImport}
      headers={
        {
          Authorization: tokenManage.get(),
          'platform': 'corp'
        }
      }
      onChange={handleChange}
    >
      {imgUrl ? <img src={formatSrc(imgUrl)} style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  )
}

export default UploadImg