import { Alert, Checkbox, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, Dispatch, useModel } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/common';
import { ConnectState } from '@/models/connect';
import { getCompanies } from '@/services/common/index'
import { DefaultCompany, tokenManage } from '@/constants/storageKey';
import LoginFrom from './components/Login';

import styles from './style.less';
const { Option } = Select;
const { UserName, Password, Submit } = LoginFrom;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting, dispatch } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');
  const [companyList, setCompanyList] = useState([]);
  const [curCompany, setCurCompany] = useState(0);

  const { refresh } = useModel('@@initialState');

  useEffect(()=>{
    let defaultList:any = DefaultCompany.get()
    if(defaultList && defaultList.length != 0){
      setCompanyList(defaultList)
      setCurCompany(Number(defaultList[0]['companyId']))
    }
  }, [])

  useEffect(()=>{
    if(status === 'ok'){
      refresh()
    }
    return () => {
      dispatch({
        type: 'login/changeLoginStatus',
        payload: undefined
      });
    }
  }, [status])



  const handleSubmit = (values: LoginParamsType) => {
    if(!curCompany){
      return message.warn('请输入企业')
    }
    dispatch({
      type: 'login/login',
      payload: { ...values, companyId: curCompany },
    });
    DefaultCompany.set(companyList.filter((v:any)=> v.companyId === curCompany))
  };

  async function handleSearch(value:string){
    if (value) {
      let res = await getCompanies({companyName: value})
      setCompanyList(res)
    } else {
      setCompanyList([])
    }
  }
  function handleChange(value:number){
    setCurCompany(value)
  }
  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <>
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误" />
          )}
        </>
        <Select
          style={{width: 368, marginBottom: 25}}
          showSearch
          placeholder={'请输入企业'}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={handleSearch}
          onChange={handleChange}
          value={curCompany || undefined}
        >
          {
            companyList.map((d:any) => <Option key={d.companyId} value={d.companyId}>{d.companyName}</Option>)
          }
        </Select>
        <UserName
          name="username"
          placeholder="用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="密码"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
        </div>
        <Submit loading={submitting}>登录</Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
