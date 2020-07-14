
import styles from './new-upload.less'
import React, { useState, useRef, useEffect } from 'react'
import { Spin } from 'antd'
import classnames from 'classnames'
import { requestUpload } from '@/common/customUpload'
import { handlePicUrl } from '@/utils/utils'

interface NewUploadProps {
  value?: string;
  size?: 'small' | 'middle' | 'large';
  setImg: Function;
}
const NewUpload: React.FC<NewUploadProps> = (props) => {
  const { size, setImg, value } = props;
  const dateRef: any = useRef()
  const [logo, setLogo] = useState(value)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLogo(value)
  }, [value])

  async function uploadImg():Promise<false | void> {
    setLoading(true)
    let [err, data]: any = await requestUpload(dateRef.current.files[0])
    setLoading(false)
    if (err) return false;
    setLogo(data[0])
    setImg(data[0])
  }
  function handleDel() {
    setLogo('')
    setImg('')
    dateRef.current.value = ''
  }
  return (
    <div className={classnames({
      [styles['upload-box']]: true,
      [styles['small']]: size === 'small'
    })}>
      <div className={styles['upload-img']}>
        {
          logo ? (
            <>
              <img src={handlePicUrl(logo)} />
              <i className={styles['del-img']} onClick={handleDel}></i>
            </>
          ) : <img src={require('@/assets/common/img.png')} />
        }
      </div>
      <div className={styles['upload-btn']}>
        <span>{loading && <Spin size={'small'} />}{logo ? '重新上传' : '上传图片'}</span>
        <input type="file" ref={dateRef} accept="image/*" onChange={uploadImg} disabled={loading} />
      </div>
    </div>
  )
}

export default NewUpload;