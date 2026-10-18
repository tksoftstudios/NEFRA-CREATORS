import { theme } from 'antd';

/**
 * Nefra Marketplace Ant Design Theme Configuration
 * Dark Mode algorithm with custom color tokens and component overrides
 */
export const antdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#6366f1', // Creator Indigo
    colorBgBase: '#030712',
    colorBgContainer: '#0b0f19',
    colorBgElevated: '#111827',
    colorBorder: 'rgba(255, 255, 255, 0.08)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
    colorText: '#f3f4f6',
    colorTextSecondary: '#9ca3af',
    borderRadius: 10,
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 38
    },
    Card: {
      borderRadiusLG: 16
    },
    Table: {
      colorBgContainer: '#0b0f19',
      headerBg: '#111827'
    },
    Modal: {
      contentBg: '#0b0f19',
      headerBg: '#0b0f19'
    }
  }
};

export const brandThemeToken = {
  colorPrimary: '#10b981', // Brand Emerald
  colorBgBase: '#030712',
  colorBgContainer: '#0b0f19',
  colorBgElevated: '#111827',
  colorBorder: 'rgba(255, 255, 255, 0.08)',
  colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
  colorText: '#f3f4f6',
  colorTextSecondary: '#9ca3af',
  borderRadius: 10,
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
};

export default antdTheme;
