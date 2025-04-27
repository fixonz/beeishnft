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
    var _e = react_1.useState(null), revealedImage = _e[0], setRevealedImage = _e[1];
    var _f = react_1.useState(false), showOverlay = _f[0], setShowOverlay = _f[1];
    // Overlay GIFs for each step
    var overlayGifs = [
        "/1reveal.gif",
        "/2reveal.gif",
        "/3reveal.gif"
    ];
    // Button labels
    var buttonLabels = [
        "Shoot the Hive",
        "SHooT",
        "Reveal"
    ];
    // Handle each step
    var handleStep = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            setShowOverlay(true);
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var response, errorData, data_1, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setShowOverlay(false);
                            if (!(step < 2)) return [3 /*break*/, 1];
                            setStep(step + 1);
                            return [3 /*break*/, 9];
                        case 1:
                            // Final step: trigger reveal
                            setIsLoading(true);
                            setError(null);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 7, 8, 9]);
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
                        case 3:
                            response = _a.sent();
                            if (!!response.ok) return [3 /*break*/, 5];
                            return [4 /*yield*/, response.json()];
                        case 4:
                            errorData = _a.sent();
                            throw new Error(errorData.message || "Failed to reveal NFT");
                        case 5: return [4 /*yield*/, response.json()];
                        case 6:
                            data_1 = _a.sent();
                            setRevealedImage(data_1.imageUrl);
                            setTimeout(function () {
                                onComplete(data_1.imageUrl);
                            }, 1000);
                            return [3 /*break*/, 9];
                        case 7:
                            err_1 = _a.sent();
                            setError(err_1.message || "An error occurred during the reveal process");
                            return [3 /*break*/, 9];
                        case 8:
                            setIsLoading(false);
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/];
                    }
                });
            }); }, 1200);
            return [2 /*return*/];
        });
    }); };
    // Reset on cancel or new NFT
    var handleCancel = function () {
        setStep(0);
        setShowOverlay(false);
        setRevealedImage(null);
        setError(null);
        onCancel();
    };
    return (React.createElement("div", { className: "flex flex-col items-center" },
        React.createElement("h2", { className: "text-xl font-bold text-center mb-4 text-[#3A1F16]" }, "Free Your Bee!"),
        React.createElement("div", { className: "relative w-full max-w-md mx-auto mb-6" },
            React.createElement(framer_motion_1.motion.div, { className: "relative aspect-square bg-white border-4 border-[#3A1F16] rounded-lg overflow-hidden", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { type: "spring", damping: 12 } },
                React.createElement(image_1["default"], { src: revealedImage || unrevealedImageUrl, alt: "NFT to reveal", fill: true, className: "object-contain", priority: true }),
                showOverlay && step <= 2 && (React.createElement(image_1["default"], { src: overlayGifs[step], alt: "Reveal overlay " + (step + 1), fill: true, className: "object-contain absolute inset-0 z-10 pointer-events-none", priority: true }))),
            isLoading && (React.createElement("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50" },
                React.createElement(lucide_react_1.Loader2, { className: "h-12 w-12 animate-spin text-amber-400" })))),
        React.createElement("div", { className: "flex gap-4 justify-center mb-4" }, buttonLabels.map(function (label, idx) { return (React.createElement(custom_button_1["default"], { key: label, variant: idx === step ? "mint" : "blank", className: "w-[140px]", onClick: handleStep, disabled: step !== idx || isLoading || !!revealedImage }, label)); })),
        React.createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px]", onClick: handleCancel, disabled: isLoading }, "Cancel"),
        error && React.createElement("p", { className: "text-red-500 mt-2" }, error)));
}
exports["default"] = MultiStepReveal;
