import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
    token: {
        // Primary colors – Blue/White palette
        colorPrimary: '#007BFF',
        colorSuccess: '#10b981',
        colorWarning: '#f59e0b',
        colorError: '#ef4444',
        colorInfo: '#339CFF',

        // Link colors
        colorLink: '#007BFF',
        colorLinkHover: '#0056b3',
        colorLinkActive: '#004299',

        // Typography
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,
        fontSizeHeading1: 38,
        fontSizeHeading2: 30,
        fontSizeHeading3: 24,
        fontWeightStrong: 700,

        // Border radius
        borderRadius: 10,
        borderRadiusLG: 14,
        borderRadiusSM: 8,
        borderRadiusXS: 6,

        // Shadows
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        boxShadowSecondary: '0 4px 6px rgba(0,0,0,0.1)',

        // Layout colors
        colorBgLayout: '#F8FAFC',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
        colorBorder: '#E2E8F0',
        colorBorderSecondary: '#F1F5F9',

        // Text colors
        colorText: '#001F3F',
        colorTextSecondary: '#6B7280',
        colorTextTertiary: '#9CA3AF',
        colorTextQuaternary: '#D1D5DB',

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
            siderBg: 'linear-gradient(180deg, #004080 0%, #001F3F 100%)',
            headerBg: '#ffffff',
            headerPadding: '0 24px',
            bodyBg: '#F8FAFC',
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
            headerBg: '#F8FAFC',
            headerColor: '#6B7280',
            headerSortActiveBg: '#EFF6FF',
            headerSortHoverBg: '#DBEAFE',
            rowHoverBg: '#EFF6FF',
            borderColor: '#E2E8F0',
            headerBorderRadius: 12,
            cellPaddingBlock: 16,
            cellPaddingInline: 16,
        },
        Button: {
            primaryShadow: '0 4px 14px 0 rgba(0,123,255,0.35)',
            defaultShadow: '0 2px 4px 0 rgba(0,0,0,0.05)',
            colorPrimaryHover: '#0056b3',
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            paddingContentHorizontal: 20,
            fontWeight: 600,
        },
        Input: {
            activeBorderColor: '#007BFF',
            hoverBorderColor: '#60A5FA',
            activeShadow: '0 0 0 3px rgba(0,123,255,0.1)',
            paddingBlock: 10,
            paddingInline: 14,
        },
        Select: {
            optionSelectedBg: '#EFF6FF',
            optionActiveBg: '#DBEAFE',
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
            controlItemBgHover: '#EFF6FF',
        },
        Tag: {
            defaultBg: '#EFF6FF',
            defaultColor: '#007BFF',
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
        Badge: { dotSize: 8 },
        Spin: {
            dotSize: 24,
            dotSizeLG: 36,
            dotSizeSM: 16,
        },
        Empty: { colorTextDisabled: '#9CA3AF' },
        Message: {
            contentBg: '#ffffff',
            contentPadding: '12px 20px',
        },
        Notification: { width: 400 },
        Tooltip: {
            colorBgSpotlight: '#001F3F',
            borderRadius: 8,
        },
        Breadcrumb: {
            itemColor: '#6B7280',
            linkColor: '#6B7280',
            linkHoverColor: '#007BFF',
            separatorColor: '#D1D5DB',
        },
        Tabs: {
            inkBarColor: '#007BFF',
            itemActiveColor: '#007BFF',
            itemHoverColor: '#339CFF',
            itemSelectedColor: '#007BFF',
        },
        Form: {
            labelFontSize: 14,
            verticalLabelPadding: '0 0 8px',
            itemMarginBottom: 24,
        },
        List: { itemPadding: '16px 0' },
    },
};

export default theme;
