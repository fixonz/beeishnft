'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Providers = void 0;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
var react_query_1 = require("@tanstack/react-query");
var connectkit_1 = require("connectkit");
var theme_provider_1 = require("@/components/theme-provider");
var wagmi_2 = require("@/lib/wagmi"); // Import the new Wagmi config
var connectors_1 = require("@abstract-foundation/agw-react/connectors");
var connectors_2 = require("wagmi/connectors");
// Create a React Query client
var queryClient = new react_query_1.QueryClient();
// Explicitly define the connectors we want ConnectKit to use
var connectors = [
    connectors_1.abstractWalletConnector(),
    connectors_2.injected(),
];
function Providers(_a) {
    var children = _a.children;
    // ConnectKit theme options
    var connectKitTheme = {
        '--ck-font-family': 'Super Lobster, cursive',
        '--ck-border-radius': '12px',
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
        '--ck-modal-box-shadow': '0px 8px 24px rgba(0, 0, 0, 0.3)',
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
        '--ck-modal-width': '100%'
    };
    // Custom CSS to ensure modal is compact and centered
    // This will be injected into the page
    var modalCss = "\n    .connectkit-modal { max-width: 420px !important; width: 100% !important; margin: 0 auto !important; }\n    .connectkit-overlay { background: rgba(0,0,0,0.7) !important; }\n  ";
    return (react_1["default"].createElement(wagmi_1.WagmiProvider, { config: __assign(__assign({}, wagmi_2.config), { connectors: connectors }) },
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
