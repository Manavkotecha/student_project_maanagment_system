import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        // Primary colors - Modern Indigo/Purple
        colorPrimary: '#6366f1',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#06b6d4',
        
        // Link colors
        colorLink: '#6366f1',
        colorLinkHover: '#4f46e5',
        colorLinkActive: '#4338ca',

        // Typography
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontWeightStrong: 600,

        // Border radius - More rounded for modern look
        borderRadius: 10,
        borderRadiusLG: 14,
        borderRadiusSM: 8,
        borderRadiusXS: 6,

        // Shadows - Enhanced depth
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        boxShadowSecondary: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

        // Layout colors
        colorBgLayout: '#f8fafc',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBorder: '#e2e8f0',
        colorBorderSecondary: '#f1f5f9',
        
        // Text colors
        colorText: '#0f172a',
        colorTextSecondary: '#64748b',
        colorTextTertiary: '#94a3b8',
        colorTextQuaternary: '#cbd5e1',
        
        // Motion
        motionDurationFast: '0.1s',
        motionDurationMid: '0.2s',
        motionDurationSlow: '0.3s',
        motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
        
        // Spacing
        padding: 16,
        paddingLG: 24,
        paddingSM: 12,
        paddingXS: 8,
        margin: 16,
        marginLG: 24,
        marginSM: 12,
        marginXS: 8,
        
        // Control heights
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
    },
    components: {
        Layout: {
            siderBg: 'linear-gradient(180deg, #4338ca 0%, #312e81 100%)',
            headerBg: '#ffffff',
            headerPadding: '0 24px',
            bodyBg: '#f8fafc',
            triggerBg: 'rgba(255,255,255,0.1)',
            triggerColor: '#ffffff',
        },
        Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(255,255,255,0.15)',
            darkItemHoverBg: 'rgba(255,255,255,0.1)',
            darkItemColor: 'rgba(255,255,255,0.85)',
            darkItemSelectedColor: '#ffffff',
            itemBorderRadius: 8,
            itemMarginBlock: 4,
            itemMarginInline: 8,
            iconSize: 18,
            collapsedIconSize: 20,
        },
        Card: {
            headerBg: 'transparent',
            headerHeight: 56,
            paddingLG: 24,
            borderRadiusLG: 16,
        },
        Table: {
            headerBg: '#f8fafc',
            headerColor: '#475569',
            headerSortActiveBg: '#f1f5f9',
            headerSortHoverBg: '#e2e8f0',
            rowHoverBg: '#f0f4ff',
            borderColor: '#e2e8f0',
            headerBorderRadius: 12,
            cellPaddingBlock: 16,
            cellPaddingInline: 16,
        },
        Button: {
            primaryShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
            defaultShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
            colorPrimaryHover: '#4f46e5',
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingContentHorizontal: 20,
            fontWeight: 500,
        },
        Input: {
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#a5b4fc',
            activeShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
            paddingBlock: 10,
            paddingInline: 14,
        },
        Select: {
            optionSelectedBg: '#eef2ff',
            optionActiveBg: '#f0f4ff',
        },
        Modal: {
            headerBg: '#ffffff',
            contentBg: '#ffffff',
            titleFontSize: 18,
            borderRadiusLG: 20,
        },
        Dropdown: {
            paddingBlock: 8,
            borderRadiusLG: 12,
            controlItemBgHover: '#f0f4ff',
        },
        Tag: {
            defaultBg: '#f1f5f9',
            defaultColor: '#475569',
        },
        Statistic: {
            titleFontSize: 14,
            contentFontSize: 28,
        },
        Avatar: {
            containerSize: 40,
            containerSizeLG: 48,
            containerSizeSM: 32,
        },
        Badge: {
            dotSize: 8,
        },
        Spin: {
            dotSize: 24,
            dotSizeLG: 36,
            dotSizeSM: 16,
        },
        Empty: {
            colorTextDisabled: '#94a3b8',
        },
        Message: {
            contentBg: '#ffffff',
            contentPadding: '12px 20px',
        },
        Notification: {
            width: 400,
        },
        Tooltip: {
            colorBgSpotlight: '#1e293b',
            borderRadius: 8,
        },
        Breadcrumb: {
            itemColor: '#64748b',
            linkColor: '#64748b',
            linkHoverColor: '#6366f1',
            separatorColor: '#cbd5e1',
        },
        Tabs: {
            inkBarColor: '#6366f1',
            itemActiveColor: '#6366f1',
            itemHoverColor: '#818cf8',
            itemSelectedColor: '#6366f1',
        },
        Form: {
            labelFontSize: 14,
            verticalLabelPadding: '0 0 8px',
            itemMarginBottom: 24,
        },
        List: {
            itemPadding: '16px 0',
        },
    },
};

export default theme;
