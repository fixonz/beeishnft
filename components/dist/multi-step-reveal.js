"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var lucide_react_1 = require("lucide-react");
var custom_button_1 = require("./custom-button");
var framer_motion_1 = require("framer-motion");
function MultiStepReveal(_a) {
    var _this = this;
    var tokenId = _a.tokenId, address = _a.address, unrevealedImageUrl = _a.unrevealedImageUrl, onComplete = _a.onComplete, onCancel = _a.onCancel;
    var _b = react_1.useState(0), step = _b[0], setStep = _b[1];
    var _c = react_1.useState(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = react_1.useState(null), error = _d[0], setError = _d[1];
    var _e = react_1.useState(0), pressCount = _e[0], setPressCount = _e[1];
    var _f = react_1.useState(false), showAnimation = _f[0], setShowAnimation = _f[1];
    // Get the appropriate image based on press count
    var getRevealImage = function () {
        if (showAnimation)
            return "/images/reveal-animation.gif";
        if (pressCount === 0)
            return "/images/reveal-press1.png"; // honeycomb only
        if (pressCount === 1)
            return "/images/reveal-press2.gif"; // honey drip only
        if (pressCount === 2)
            return unrevealedImageUrl; // hive (bee silhouette)
        return "/images/reveal-press1.png";
    };
    // Handle the reveal button press
    var handleRevealPress = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // First two presses just update the image
            if (pressCount < 2) {
                setPressCount(pressCount + 1);
                return [2 /*return*/];
            }
            // On third press, show animation and start the reveal process
            setShowAnimation(true);
            // Wait a moment to show the animation before proceeding
            setTimeout(function () {
                startRevealProcess();
            }, 1500);
            return [2 /*return*/];
        });
    }); };
    // Start the actual reveal process
    var startRevealProcess = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("/api/reveal", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                tokenId: tokenId,
                                address: address
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "Failed to reveal NFT");
                case 4: return [4 /*yield*/, response.json()
                    // Complete the reveal with the revealed image URL
                ];
                case 5:
                    data = _a.sent();
                    // Complete the reveal with the revealed image URL
                    onComplete(data.imageUrl);
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _a.sent();
                    console.error("Error during reveal:", err_1);
                    setError(err_1.message || "An error occurred during the reveal process");
                    setShowAnimation(false);
                    setPressCount(0);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "flex flex-col items-center" },
        React.createElement("h2", { className: "text-xl font-bold text-center mb-4 text-[#3A1F16]" }, "Free Your Bee!"),
        React.createElement("div", { className: "relative w-full max-w-md mx-auto mb-6" },
            React.createElement(framer_motion_1.motion.div, { className: "relative aspect-square bg-white border-4 border-[#3A1F16] rounded-lg overflow-hidden", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { type: "spring", damping: 12 } },
                React.createElement(image_1["default"], { src: getRevealImage() || "/placeholder.svg", alt: "Reveal your bee", fill: true, className: "object-contain", priority: true }),
                isLoading && (React.createElement("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50" },
                    React.createElement(lucide_react_1.Loader2, { className: "h-12 w-12 animate-spin text-amber-400" })))),
            React.createElement("div", { className: "absolute top-0 left-0 right-0 pointer-events-none" },
                React.createElement(image_1["default"], { src: "/images/honey-drip.png", alt: "", width: 400, height: 100, className: "w-full object-contain" }))),
        React.createElement("p", { className: "text-center text-[#3A1F16] mb-6 max-w-md" },
            pressCount === 0 && "Press the button to free your bee from the honey!",
            pressCount === 1 && "Press again! The honey is starting to break...",
            pressCount === 2 && "One more press to free your bee!",
            showAnimation && "Your bee is breaking free!"),
        React.createElement("div", { className: "flex gap-4 justify-center" }, !isLoading ? (React.createElement(React.Fragment, null,
            React.createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px]", onClick: onCancel, disabled: isLoading || showAnimation }, "Cancel"),
            React.createElement(framer_motion_1.motion.div, { whileTap: { scale: 0.95 }, className: "relative" },
                React.createElement(custom_button_1["default"], { variant: "mint", className: "w-[180px] relative overflow-hidden", onClick: handleRevealPress, disabled: isLoading },
                    React.createElement("span", { className: "relative z-10" },
                        pressCount === 0 && "Press to Free",
                        pressCount === 1 && "Press Again",
                        pressCount === 2 && "Final Press!",
                        showAnimation && "Freeing..."),
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent shimmer-effect" }))))) : (React.createElement("div", { className: "text-center" },
            React.createElement("p", { className: "text-[#3A1F16] font-bold animate-pulse" }, "Freeing your bee...")))),
        error && (React.createElement("div", { className: "mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm" },
            error,
            React.createElement("div", { className: "mt-2 flex justify-center" },
                React.createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px]", onClick: function () { return setError(null); } }, "Try Again"))))));
}
exports["default"] = MultiStepReveal;
