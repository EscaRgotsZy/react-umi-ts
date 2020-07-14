import React from 'react';
import E from 'wangeditor';
import { tokenManage } from '@/constants/storageKey';
import config from '@/config/index';
import { handlePicUrl } from '@/utils/utils';

interface UserProp {
  mobileContent?: any;
  content?: any;
  onClicked: any;
}
interface UserState {
  editorContent: any;
  mobileContent: any;
  content: any;
}
export default class Editor extends React.Component<UserProp, UserState> {
  constructor(props: UserProp) {
    super(props);
    this.state = {
      editorContent: '',
      mobileContent: '',
      content: ''
    };
  }
  componentDidMount() {
    this.initial()
  };
  initial = () => {
    const elemMenu = this.refs.editorElemMenu;
    const elemBody = this.refs.editorElemBody;
    const editor = new E(elemMenu, elemBody)
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html: any) => {
      // console.log(editor.txt.html())
      this.props.onClicked({ html: editor.txt.html() });
      this.setState({
        // editorContent: editor.txt.text()
        editorContent: editor.txt.html()
      })
    }
    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      // 'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      // 'link',  // 插入链接
      // 'list',  // 列表
      'justify',  // 对齐方式
      // 'quote',  // 引用
      // 'emoticon',  // 表情
      'image',  // 插入图片
      // 'table',  // 表格
      // 'video',  // 插入视频
      // 'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ]
    // editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.uploadImgServer = config.server + '/productManagement/prodpicture/save';  // 上传图片到服务器
    // 3M
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    // 限制一次最多上传 5 张图片
    editor.customConfig.uploadImgMaxLength = 20;
    // 自定义文件名
    editor.customConfig.uploadFileName = 'file';
    // 将 timeout 时间改为 3s
    editor.customConfig.uploadImgTimeout = 5000;
    // 自定义上传参数
    // editor.customConfig.uploadImgParams = {
    //     // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
    //     // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
    //     Authorization: `Bearer ${token}`
    // }
    // 自定义 header
    editor.customConfig.uploadImgHeaders = {
      'Accept': 'application/json, text/plain',
      'Authorization': tokenManage.get(),
      'platform': 'corp'
    }
    editor.customConfig.uploadImgHooks = {
      before: function (xhr: any, editor: any, files: any) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
        // alert("前奏");
      },
      success: function (xhr: any, editor: any, result: any) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        // var url = result.data.url;
        // alert(JSON.stringify(url));
        // editor.txt.append(url);
        // alert("成功");
      },
      fail: function (xhr: any, editor: any, result: any) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        alert("失败");
      },
      error: function (xhr: any, editor: any) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        // alert("错误");
      },
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg: any, result: any, editor: any) {
        // console.log(result,editor,insertImg)
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        // 图片服务器 baseImgUrl
        var url = result.data.picUrl;
        let urlList = url && url.split(',') || [];
        urlList && urlList.length > 0 && urlList.forEach((item: any) => {
          insertImg(handlePicUrl(item));
        })
        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    editor.create();
    if (this.props.mobileContent) {
      editor.txt.html(this.props.mobileContent)
    }
    if (this.props.content) {
      editor.txt.html(this.props.content)
    }
  }
  render() {
    return (
      <div className="shop">
        <div className="text-area" >
          <div ref="editorElemMenu"
            style={{ backgroundColor: '#f1f1f1', border: "1px solid #ccc" }}
            className="editorElem-menu">
          </div>
          <div
            style={{
              height: '500px',  // 设置当前富文本 高度
              border: "1px solid #ccc",
              borderTop: "none",
              // zIndex:'1000',
              position: 'relative'
            }}
            ref="editorElemBody" className="editorElem-body">
          </div>
        </div>
      </div>
    );
  }
}


