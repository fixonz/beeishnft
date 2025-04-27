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
    var modalCss = "\n    /* Target the specific styled-components classes from the DOM */\n    .sc-dhKdcB,\n    .sc-gFqAkR,\n    .sc-kpDqfm,\n    .sc-dAlyuH,\n    .sc-jEACwC,\n    .sc-eqUAAy,\n    .sc-dLMFU,\n    .sc-dcJsrY,\n    .sc-jlZhew,\n    .sc-cwHptR,\n    .sc-jnOGJG,\n    .sc-dZoequ,\n    .sc-hIUJlX,\n    .sc-ggpjZQ,\n    .sc-gFVvzn,\n    .sc-cmaqmh,\n    [class*=\"sc-\"],\n    /* Existing general selectors */\n    .connectkit-modal,\n    .connectkit-overlay,\n    .connectkit-portal,\n    .connectkit-drawer,\n    .connectkit-card,\n    .connectkit-walletlist,\n    .connectkit-walletlist div,\n    .connectkit-walletlist button,\n    .connectkit-walletlist-scroll,\n    .connectkit-wallet-detector button,\n    .connectkit-button,\n    .connectkit-wallet,\n    div[class*=\"connectkit-\"],\n    button[class*=\"connectkit-\"],\n    span[class*=\"connectkit-\"],\n    ul[class*=\"connectkit-\"],\n    li[class*=\"connectkit-\"],\n    .ck-overlay,\n    .ck-modal,\n    .ck-* {\n      box-shadow: none !important;\n      -webkit-box-shadow: none !important;\n      -moz-box-shadow: none !important;\n      filter: none !important;\n      -webkit-filter: none !important;\n      -moz-filter: none !important;\n      backdrop-filter: none !important;\n      -webkit-backdrop-filter: none !important;\n      -moz-backdrop-filter: none !important;\n      text-shadow: none !important;\n      border-shadow: none !important;\n      outline-shadow: none !important;\n      drop-shadow: none !important;\n      -webkit-drop-shadow: none !important;\n      -moz-drop-shadow: none !important;\n    }\n\n    /* Target the exact styled modal container from inspect */\n    .sc-gFqAkR, \n    .cMtGuS,\n    [style*=\"--height\"],\n    [style*=\"--width\"] {\n      box-shadow: none !important;\n      filter: none !important;\n      border: 4px solid #3A1F16 !important;\n    }\n\n    /* Remove the specific shadow div */\n    .sc-dhKdcB, \n    .jXJXoi, \n    div[style*=\"pointer-events: none\"],\n    div[style*=\"position: absolute\"],\n    div[style*=\"transform: translateX\"] {\n      display: none !important;\n      opacity: 0 !important;\n      box-shadow: none !important;\n      filter: none !important;\n    }\n\n    /* Target the main modal container and ensure flat edges */\n    .connectkit-modal,\n    div[class*=\"connectkit-modal\"] {\n      max-width: 420px !important;\n      width: 100% !important;\n      margin: 0 auto !important;\n      border-radius: 12px !important;\n      overflow: hidden !important;\n      border: 4px solid #3A1F16 !important;\n      background-color: #FFB949 !important;\n    }\n\n    /* Target buttons to remove any shadow effects */\n    .connectkit-modal button,\n    div[class*=\"connectkit-\"] button {\n      box-shadow: none !important;\n      filter: none !important;\n      text-shadow: none !important;\n    }\n\n    /* Reset overlay */\n    .connectkit-overlay,\n    div[class*=\"connectkit-overlay\"] {\n      background: rgba(0,0,0,0.7) !important;\n    }\n    \n    /* Make sure all elements have a flat border */\n    .connectkit-modal * {\n      border-radius: 8px !important;\n    }\n    \n    /* Override any SVG styles that might create shadows */\n    .connectkit-modal svg,\n    div[class*=\"connectkit-\"] svg {\n      filter: none !important;\n      drop-shadow: none !important;\n    }\n    \n    /* Use !important to override any shadow styles */\n    *[style*=\"box-shadow\"] {\n      box-shadow: none !important;\n    }\n    \n    *[style*=\"filter\"] {\n      filter: none !important;\n    }\n    \n    /* Final guarantee - apply to every descendant */\n    .connectkit-modal *,\n    .connectkit-modal * *,\n    .connectkit-modal * * *,\n    .connectkit-modal * * * * {\n      box-shadow: none !important;\n      filter: none !important;\n      border-radius: 8px !important;\n    }\n    \n    /* Add a custom border to the main modal instead of shadows */\n    .connectkit-modal {\n      border: 4px solid #3A1F16 !important;\n    }\n    \n    /* Specifically target that element with translateX transform */\n    div[style*=\"transform: translateX(-50%)\"] {\n      box-shadow: none !important;\n      filter: none !important;\n      display: none !important;\n    }\n  ";
    return (react_1["default"].createElement(wagmi_1.WagmiProvider, { config: wagmi_2.config },
        react_1["default"].createElement(react_query_1.QueryClientProvider, { client: queryClient },
            react_1["default"].createElement("style", null, modalCss),
            react_1["default"].createElement(connectkit_1.ConnectKitProvider, { theme: "custom", customTheme: connectKitTheme, options: {
                    // Only show the connectors we want (Abstract and Metamask)
                    hideNoWalletCTA: true,
                    hideQuestionMarkCTA: true,
                    hideRecentBadge: true
                } },
                react_1["default"].createElement(theme_provider_1.ThemeProvider, { attribute: "class", defaultTheme: "light", enableSystem: true, disableTransitionOnChange: true }, children)))));
}
exports.Providers = Providers;
