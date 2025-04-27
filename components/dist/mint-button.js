"use client";
"use strict";
exports.__esModule = true;
var custom_button_1 = require("@/components/custom-button");
var use_media_query_1 = require("@/hooks/use-media-query");
function MintButton(_a) {
    var onClick = _a.onClick;
    var isMobile = use_media_query_1.useMediaQuery("(max-width: 768px)");
    var buttonWidth = isMobile ? "w-[150px]" : "w-[180px]";
    return (React.createElement("div", { onClick: onClick, className: "cursor-pointer" },
        React.createElement(custom_button_1["default"], { variant: "mint", className: buttonWidth }, "minT a bEE")));
}
exports["default"] = MintButton;
