import React from 'react';
import { Card, Alert } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="欢迎使用 企业管理平台"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 48,
        }}
      />
      <div style={{ minHeight: 400 }}></div>
    </Card>
  </PageHeaderWrapper>
);
