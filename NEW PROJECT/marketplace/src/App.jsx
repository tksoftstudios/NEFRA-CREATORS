import React from 'react';
import { ConfigProvider, Card, Typography, Tag, Space, Divider } from 'antd';
import { antdTheme } from './config/themeConfig';
import { API_CONFIG } from './config/apiConfig';

const { Title, Text, Paragraph } = Typography;

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <div style={{
        minHeight: '100vh',
        background: antdTheme.token.colorBgBase,
        color: antdTheme.token.colorText,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <Card
          style={{
            maxWidth: 640,
            width: '100%',
            background: antdTheme.token.colorBgContainer,
            borderColor: antdTheme.token.colorBorder,
            borderRadius: 16
          }}
        >
          <Space orientation="vertical" size="middle" orientationMargin="0" style={{ width: '100%' }}>
            <div>
              <Tag color="indigo" style={{ marginBottom: 8 }}>Configuration Mode</Tag>
              <Title level={3} style={{ color: '#fff', margin: 0 }}>
                Nefra Marketplace Frontend
              </Title>
              <Text type="secondary">
                Configuration and theme layer initialized.
              </Text>
            </div>

            <Divider style={{ borderColor: antdTheme.token.colorBorderSecondary, margin: '12px 0' }} />

            <div>
              <Text strong style={{ color: '#f3f4f6' }}>Active API Configuration:</Text>
              <Paragraph style={{ marginTop: 8, background: '#111827', padding: '12px', borderRadius: 8 }}>
                <Text code style={{ color: '#6366f1' }}>Base URL: {API_CONFIG.baseURL}</Text>
                <br />
                <Text code style={{ color: '#10b981' }}>Health Endpoint: {API_CONFIG.endpoints.health}</Text>
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ color: '#f3f4f6' }}>Active Design Theme Tokens:</Text>
              <Paragraph style={{ marginTop: 8, background: '#111827', padding: '12px', borderRadius: 8 }}>
                <Text code>Primary: {antdTheme.token.colorPrimary}</Text>
                <br />
                <Text code>Canvas: {antdTheme.token.colorBgBase}</Text>
                <br />
                <Text code>Font: {antdTheme.token.fontFamily}</Text>
              </Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
}
