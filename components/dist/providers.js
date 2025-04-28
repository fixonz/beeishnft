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
    var modalCss = "\n    /* Fixed Shadow Box Styles - Completely Override */\n    .sc-gFqAkR {\n      box-shadow: none !important;\n      -webkit-box-shadow: none !important;\n      filter: none !important;\n      border: 4px solid #3A1F16 !important;\n      overflow: hidden !important;\n      border-radius: 12px !important;\n      margin: 0 auto !important;\n      max-width: 420px !important;\n      background: #FFB949 !important;\n    }\n    \n    /* Remove the shadow container completely */\n    .sc-dhKdcB {\n      display: none !important;\n    }\n    \n    /* Hide the transform container causing shadows */\n    div[style*=\"pointer-events: none\"][style*=\"transform: translateX(-50%)\"] {\n      display: none !important;\n    }\n    \n    /* Reset any unwanted borders or elements */\n    .sc-gFqAkR::before,\n    .sc-gFqAkR::after,\n    .sc-kpDqfm::before,\n    .sc-kpDqfm::after {\n      display: none !important;\n      content: none !important;\n    }\n    \n    /* Fix the inner container */\n    .sc-kpDqfm {\n      border-radius: 8px !important;\n      overflow: hidden !important;\n      box-shadow: none !important;\n    }\n    \n    /* Target additional wallets text */\n    .sc-kAkpmW {\n      display: none !important;\n    }\n    \n    /* Hide wallet buttons beyond the first two */\n    .sc-ggpjZQ button:nth-child(n+3) {\n      display: none !important;\n    }\n    \n    /* Explicitly hide Phantom wallet */\n    button:has(span:contains(\"Phantom\")),\n    button:has(img[alt=\"Phantom\"]),\n    button:has(img[alt*=\"phantom\"]),\n    button:has(img[src*=\"phantom\"]) {\n      display: none !important;\n    }\n    \n    /* Hide browser wallet if it appears */\n    button:has(span:contains(\"Browser\")),\n    button:has(span:contains(\"browser\")),\n    button:has(img[alt=\"Browser Wallet\"]),\n    button:has(img[alt*=\"Browser\"]) {\n      display: none !important;\n    }\n    \n    /* Ensure MetaMask and Abstract are visible */\n    button:has(img[alt=\"MetaMask\"]),\n    button:has(span:contains(\"MetaMask\")),\n    button:has(img[alt=\"Abstract\"]),\n    button:has(span:contains(\"Abstract\")) {\n      display: flex !important;\n    }\n    \n    /* Style wallet buttons with brown theme */\n    .sc-hIUJlX,\n    button[class*=\"sc-hIUJlX\"] {\n      background-color: #3A1F16 !important;\n      color: white !important;\n      border: 2px solid #3A1F16 !important;\n      transition: all 0.2s ease-in-out !important;\n    }\n    \n    /* Hover effect for buttons */\n    .sc-hIUJlX:hover,\n    button[class*=\"sc-hIUJlX\"]:hover {\n      background-color: #5a3a2f !important;\n      transform: translateY(-2px) !important;\n    }\n    \n    /* Active effect for buttons */\n    .sc-hIUJlX:active,\n    button[class*=\"sc-hIUJlX\"]:active {\n      transform: translateY(1px) !important;\n    }\n\n    /* Target wallet buttons to ensure proper styling */\n    div.sc-gFVvzn button,\n    div.sc-ggpjZQ button {\n      background-color: #3A1F16 !important;\n      color: white !important;\n      border: 2px solid #3A1F16 !important;\n      margin-bottom: 8px !important;\n    }\n    \n    /* Style the close button */\n    button.sc-dLMFU,\n    button[aria-label=\"Close\"] {\n      color: #3A1F16 !important;\n      background: transparent !important;\n      border: none !important;\n    }\n    \n    /* Ensure clean text styling */\n    div.sc-jlZhew {\n      color: #3A1F16 !important;\n      font-family: 'Super Lobster', cursive !important;\n    }\n  ";
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
