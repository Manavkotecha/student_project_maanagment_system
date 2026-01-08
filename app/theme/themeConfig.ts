import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        // Primary colors - Modern blue
        colorPrimary: '#1677ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#ff4d4f',
        colorInfo: '#1677ff',

        // Typography
        fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 14,

        // Border radius
        borderRadius: 8,
        borderRadiusLG: 12,
        borderRadiusSM: 6,

        // Shadows
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.08)',

        // Layout
        colorBgLayout: '#f5f5f5',
        colorBgContainer: '#ffffff',
    },
    components: {
        Layout: {
            siderBg: '#001529',
            headerBg: '#ffffff',
            bodyBg: '#f5f5f5',
        },
        Menu: {
            darkItemBg: '#001529',
            darkItemSelectedBg: '#1677ff',
            darkItemHoverBg: '#002140',
        },
        Card: {
            headerBg: 'transparent',
        },
        Table: {
            headerBg: '#fafafa',
            rowHoverBg: '#f0f5ff',
        },
        Button: {
            primaryShadow: '0 2px 0 rgba(22, 119, 255, 0.1)',
        },
    },
};

export default theme;
