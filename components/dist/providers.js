'use client';
"use strict";
exports.__esModule = true;
exports.Providers = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var react_query_1 = require("@tanstack/react-query");
var connectkit_1 = require("connectkit");
var theme_provider_1 = require("@/components/theme-provider");
var wagmi_2 = require("@/lib/wagmi"); // Import the new Wagmi config
// Create a React Query client
var queryClient = new react_query_1.QueryClient();
function Providers(_a) {
    var children = _a.children;
    // ConnectKit theme options
    var connectKitTheme = {
        '--ck-font-family': 'Super Lobster, cursive',
        '--ck-border-radius': '8px',
        // Set custom button colors within the modal
        // These variables target the wallet buttons inside the list
        '--ck-secondary-button-background': '#FFB949',
        '--ck-secondary-button-color': '#3A1F16',
        '--ck-secondary-button-border-color': '#3A1F16',
        '--ck-secondary-button-hover-background': '#ffe0a6',
        '--ck-secondary-button-active-background': '#ffd68a',
        // General Modal styling (keep previous refinements)
        '--ck-modal-background': '#FFB949',
        '--ck-overlay-background': 'rgba(0, 0, 0, 0.7)',
        '--ck-modal-box-shadow': 'none',
        '--ck-modal-shadow': 'none',
        '--ck-overlay-box-shadow': 'none',
        '--ck-body-background': '#FFB949',
        '--ck-body-color': '#3A1F16',
        '--ck-body-color-muted': '#5a3a2f',
        '--ck-body-header-color': '#3A1F16',
        '--ck-border-color': '#3A1F16',
        // Try reducing modal padding slightly
        '--ck-modal-padding': '16px',
        // Connect Button in Header (If NOT using Custom) - keeping our brown style
        '--ck-connectbutton-background': '#3A1F16',
        '--ck-connectbutton-color': '#FFFFFF',
        '--ck-connectbutton-hover-background': '#5a3a2f',
        // Custom modal width (compact)
        '--ck-modal-max-width': '420px',
        '--ck-modal-width': '100%',
        // Additional shadow removal for all components
        '--ck-body-box-shadow': 'none',
        '--ck-connectbutton-box-shadow': 'none',
        '--ck-connectbutton-hover-box-shadow': 'none',
        '--ck-connectbutton-active-box-shadow': 'none',
        '--ck-secondary-button-box-shadow': 'none',
        '--ck-secondary-button-hover-box-shadow': 'none',
        '--ck-focus-box-shadow': 'none',
        '--ck-overlay-backdrop-filter': 'none',
        '--ck-overlay-background-blur': '0px',
        '--ck-dropdown-box-shadow': 'none',
        '--ck-dropdown-active-box-shadow': 'none',
        // Ensure flat borders and no rounded edges
        '--ck-secondary-button-border-radius': '8px',
        '--ck-primary-button-border-radius': '8px',
        '--ck-connectbutton-border-radius': '8px',
        // More shadow overrides
        '--ck-default-box-shadow': 'none',
        '--ck-graphic-box-shadow': 'none',
        '--ck-graphic-hover-box-shadow': 'none',
        '--ck-qr-dot-box-shadow': 'none',
        '--ck-qr-background-box-shadow': 'none',
        '--ck-qr-container-box-shadow': 'none',
        '--ck-body-disclaimer-background-box-shadow': 'none',
        '--ck-body-disclaimer-box-shadow': 'none',
        '--ck-body-disclaimer-font-family': 'Super Lobster, cursive',
        // Force flat transparent background
        '--ck-body-background-transparent': 'transparent',
        '--ck-body-background-secondary': '#FFB949',
        '--ck-body-background-tertiary': '#FFB949',
        // Remove any dropdown shadows
        '--ck-dropdown-shadow': 'none',
        '--ck-dropdown-active-shadow': 'none'
    };
    // Custom CSS to ensure modal is compact and centered
    // This will be injected into the page
    var modalCss = "\n    /* Completely remove all shadows and side elements */\n    .sc-dhKdcB, \n    .jXJXoi, \n    [class*=\"sc-\"].sc-dhKdcB,\n    div[style*=\"pointer-events: none\"][style*=\"position: absolute\"][style*=\"transform: translateX(-50%)\"],\n    div[style*=\"pointer-events: none\"] {\n      display: none !important;\n      opacity: 0 !important;\n      visibility: hidden !important;\n    }\n    \n    /* Make modal container have solid background with no shadows */\n    .sc-gFqAkR, \n    .cMtGuS, \n    [style*=\"--height\"],\n    [style*=\"--width\"],\n    .sc-kpDqfm,\n    div[class^=\"sc-\"] {\n      box-shadow: none !important;\n      -webkit-box-shadow: none !important;\n      filter: none !important;\n      -webkit-filter: none !important;\n      backdrop-filter: none !important;\n      -webkit-backdrop-filter: none !important;\n      border: 4px solid #3A1F16 !important;\n      background-color: #FFB949 !important;\n      overflow: hidden !important;\n    }\n    \n    /* Target wallet buttons to ensure they have proper styling */\n    button[class*=\"sc-hIUJlX\"] {\n      box-shadow: none !important;\n      filter: none !important;\n    }\n    \n    /* Make the background completely solid */\n    div[class*=\"sc-\"] {\n      background: #FFB949 !important;\n    }\n    \n    /* Hide any text about additional wallets */\n    div[class*=\"sc-kAkpmW\"],\n    span:has(svg[width=\"11\"][height=\"12\"]) {\n      display: none !important;\n    }\n    \n    /* Force hide any wallets we don't want */\n    button[class*=\"sc-hIUJlX\"]:not(:nth-child(1)):not(:nth-child(2)) {\n      display: none !important;\n    }\n    \n    /* Keep only the first two wallet buttons (Metamask and Abstract) */\n    div.sc-gFVvzn > div.sc-ggpjZQ {\n      display: flex;\n      flex-direction: column;\n    }\n    \n    div.sc-gFVvzn > div.sc-ggpjZQ > button:nth-child(n+3) {\n      display: none !important;\n    }\n  ";
    return (react_1["default"].createElement(wagmi_1.WagmiProvider, { config: wagmi_2.config },
        react_1["default"].createElement(react_query_1.QueryClientProvider, { client: queryClient },
            react_1["default"].createElement("style", null, modalCss),
            react_1["default"].createElement(connectkit_1.ConnectKitProvider, { theme: "custom", customTheme: connectKitTheme, options: {
                    hideNoWalletCTA: true,
                    hideQuestionMarkCTA: true,
                    hideRecentBadge: true
                } },
                react_1["default"].createElement(theme_provider_1.ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: true, disableTransitionOnChange: true }, children)))));
}
exports.Providers = Providers;
