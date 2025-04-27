"use client";
"use strict";
exports.__esModule = true;
var sheet_1 = require("@/components/ui/sheet");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var connectkit_1 = require("connectkit");
var twitter_button_1 = require("./twitter-button");
var custom_button_1 = require("./custom-button");
function MobileMenu(_a) {
    var onPhotoBoothClickAction = _a.onPhotoBoothClickAction, onFreeABeeClick = _a.onFreeABeeClick;
    return (React.createElement(sheet_1.Sheet, null,
        React.createElement(sheet_1.SheetTrigger, { asChild: true },
            React.createElement(button_1.Button, { variant: "ghost", size: "icon" },
                React.createElement(lucide_react_1.MenuIcon, { className: "h-6 w-6 text-[#3A1F16]" }))),
        React.createElement(sheet_1.SheetContent, { side: "right", className: "bg-[#FFB949] border-l-4 border-[#3A1F16] w-[280px]" },
            React.createElement(sheet_1.SheetHeader, null,
                React.createElement(sheet_1.SheetTitle, { className: "text-2xl font-bold text-primary mb-6 custom-button-text" }, "Menu")),
            React.createElement("div", { className: "flex flex-col gap-4 items-center" },
                React.createElement(connectkit_1.ConnectKitButton.Custom, null, function (_a) {
                    var isConnected = _a.isConnected, show = _a.show, truncatedAddress = _a.truncatedAddress, ensName = _a.ensName;
                    return (React.createElement(custom_button_1["default"], { variant: isConnected ? "blank" : "connect", className: "w-full px-4", onClick: show }, isConnected ? (ensName !== null && ensName !== void 0 ? ensName : truncatedAddress) : "Connect Wallet"));
                }),
                React.createElement("div", { className: "w-full" },
                    React.createElement(custom_button_1["default"], { variant: "photoBooth", className: "w-full", onClick: onPhotoBoothClickAction }, "Photo booth")),
                React.createElement("div", { className: "w-full" },
                    React.createElement(custom_button_1["default"], { variant: "mint", className: "w-full", onClick: onFreeABeeClick }, "free-A-BeE")),
                React.createElement("div", { className: "w-full opacity-50" },
                    React.createElement(custom_button_1["default"], { variant: "blank", className: "w-full", disabled: true }, "Hive (Soon)")),
                React.createElement("div", { className: "w-full opacity-50" },
                    React.createElement(custom_button_1["default"], { variant: "blank", className: "w-full", disabled: true }, "BeE-Dega (Soon)")),
                React.createElement("div", { className: "mt-4" },
                    React.createElement(twitter_button_1["default"], null))))));
}
exports["default"] = MobileMenu;
