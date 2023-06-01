import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText,} from '@ant-design/pro-components';
import {Alert, Col, Divider, message, Row, Space, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, Link} from 'umi';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type='error'
    showIcon
  />
);
const Register: React.FC = () => {
  const [userLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');

  // 表单提交
  const handleSubmit = async (values: API.RegisterParams) => {
    const {userPassword, checkPassword} = values;
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    try {
      // 注册
      const id = await register(values);
      if (id) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const {query} = history.location;
        history.push({
          pathname: '/user/login',
          query
        });
        return;
      }
      // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  const {status, type: loginType} = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          logo={<img alt='logo' src='/logo.svg'/>}
          title='User Center'
          subTitle={'Ant Design 是西湖区最具影响力的 Web 设计规范'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key='account' tab={'账号密码注册'}/>
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'错误的用户名和密码'}/>
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name='userAccount'
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'用户名'}
                rules={[
                  {
                    required: true,
                    message: '请输入用户名！',
                  },
                ]}
              />
              <ProFormText.Password
                name='userPassword'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'确认密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入确认密码！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '确认密码长度不能小于8位'
                  }
                ]}
              />
              <ProFormText.Password
                name='checkPassword'
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon}/>,
                }}
                placeholder={'密码'}
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码长度不能小于8位'
                  }
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Link to='/user/login'>登录</Link>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Register;
