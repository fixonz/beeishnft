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
    var _f = react_1.useState(false), showStepModal = _f[0], setShowStepModal = _f[1];
    var _g = react_1.useState(false), showRevealedModal = _g[0], setShowRevealedModal = _g[1];
    var _h = react_1.useState(0), modalStep = _h[0], setModalStep = _h[1];
    var audioRef = react_1.useRef(null);
    // Overlay GIFs for each step (corrected paths)
    var overlayGifs = [
        "/images/1reveal.gif",
        "/images/2reveal.gif",
        "/images/3reveal.gif"
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
            console.log("handleStep called, step:", step);
            setModalStep(step);
            setShowStepModal(true);
            console.log("Modal should be showing now");
            // Play sound
            setTimeout(function () {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                }
            }, 100);
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var response, errorData, metaRes, meta_1, revealedTokens, revealedNFTs, nftEntry, existingIndex, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setShowStepModal(false);
                            if (!(step < 2)) return [3 /*break*/, 1];
                            setStep(step + 1);
                            return [3 /*break*/, 10];
                        case 1:
                            // Final step: trigger reveal
                            setIsLoading(true);
                            setError(null);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 8, 9, 10]);
                            console.log("Starting reveal API call");
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
                        case 5: return [4 /*yield*/, fetch("https://api.beeish.xyz/metadata/" + tokenId)];
                        case 6:
                            metaRes = _a.sent();
                            return [4 /*yield*/, metaRes.json()];
                        case 7:
                            meta_1 = _a.sent();
                            setRevealedImage(meta_1.image);
                            console.log("Got revealed image:", meta_1.image);
                            revealedTokens = JSON.parse(localStorage.getItem('beeish-revealed-tokens') || '[]');
                            if (!revealedTokens.includes(tokenId)) {
                                revealedTokens.push(tokenId);
                                localStorage.setItem('beeish-revealed-tokens', JSON.stringify(revealedTokens));
                            }
                            revealedNFTs = JSON.parse(localStorage.getItem('beeish-revealed-nfts') || '[]');
                            nftEntry = {
                                tokenId: tokenId,
                                image: meta_1.image
                            };
                            existingIndex = revealedNFTs.findIndex(function (nft) { return nft.tokenId === tokenId; });
                            if (existingIndex >= 0) {
                                revealedNFTs[existingIndex] = nftEntry;
                            }
                            else {
                                revealedNFTs.push(nftEntry);
                            }
                            localStorage.setItem('beeish-revealed-nfts', JSON.stringify(revealedNFTs));
                            // Show the reveal modal
                            setShowRevealedModal(true);
                            console.log("Revealed modal should be showing now");
                            // Complete the reveal process
                            setTimeout(function () {
                                onComplete(meta_1.image);
                            }, 1500);
                            return [3 /*break*/, 10];
                        case 8:
                            err_1 = _a.sent();
                            console.error("Error during reveal:", err_1);
                            setError(err_1.message || "An error occurred during the reveal process");
                            return [3 /*break*/, 10];
                        case 9:
                            setIsLoading(false);
                            return [7 /*endfinally*/];
                        case 10: return [2 /*return*/];
                    }
                });
            }); }, 1200);
            return [2 /*return*/];
        });
    }); };
    // Reset on cancel or new NFT
    var handleCancel = function () {
        setStep(0);
        setShowStepModal(false);
        setRevealedImage(null);
        setShowRevealedModal(false);
        setError(null);
        onCancel();
    };
    return (React.createElement("div", { className: "flex flex-col items-center" },
        React.createElement("audio", { ref: audioRef, src: "/sound/shot.mp3", preload: "auto" }),
        React.createElement("h2", { className: "text-xl font-bold text-center mb-4 text-[#3A1F16]" }, "Free Your Bee!"),
        React.createElement("div", { className: "relative w-full max-w-md mx-auto mb-6" },
            React.createElement(framer_motion_1.motion.div, { className: "relative aspect-square bg-white border-4 border-[#3A1F16] rounded-lg overflow-hidden", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { type: "spring", damping: 12 } },
                React.createElement(image_1["default"], { src: revealedImage || unrevealedImageUrl, alt: "NFT to reveal", fill: true, className: "object-contain", priority: true })),
            isLoading && (React.createElement("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50 z-30" },
                React.createElement(lucide_react_1.Loader2, { className: "h-12 w-12 animate-spin text-amber-400" })))),
        React.createElement("div", { className: "flex gap-4 justify-center mb-4" }, buttonLabels.map(function (label, idx) { return (React.createElement(custom_button_1["default"], { key: label, variant: idx === step ? "mint" : "blank", className: "min-w-[140px] w-auto", onClick: handleStep, disabled: step !== idx || isLoading || !!revealedImage }, label)); })),
        React.createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px]", onClick: handleCancel, disabled: isLoading }, "Cancel"),
        error && React.createElement("p", { className: "text-red-500 mt-2" }, error),
        showStepModal && (React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80" },
            React.createElement("div", { className: "relative w-[85vw] h-[85vw] sm:w-[70vw] sm:h-[70vw] md:w-[50vw] md:h-[50vw] lg:w-[40vw] lg:h-[40vw] max-w-[90vw] max-h-[90vh] bg-[#FFB949] border-8 border-[#3A1F16] rounded-lg shadow-2xl" },
                React.createElement(image_1["default"], { src: revealedImage || unrevealedImageUrl, alt: "NFT to reveal", fill: true, className: "object-contain p-4", priority: true }),
                React.createElement(image_1["default"], { src: overlayGifs[modalStep], alt: "Reveal overlay " + (modalStep + 1), fill: true, className: "object-contain p-4", priority: true })))),
        showRevealedModal && revealedImage && (React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80" },
            React.createElement("div", { className: "bg-[#FFB949] border-8 border-[#3A1F16] rounded-lg shadow-2xl p-4 text-center w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] max-w-[90vw] max-h-[90vh] relative" },
                React.createElement("button", { className: "absolute top-2 right-2 text-[#FFB949] bg-[#3A1F16] hover:bg-[#5a3a2f] w-8 h-8 rounded-full flex items-center justify-center", onClick: function () {
                        setShowRevealedModal(false);
                        // Force page refresh to update the "Freed Bees" section
                        window.location.reload();
                    } }, "\u00D7"),
                React.createElement("h3", { className: "text-xl font-bold text-[#3A1F16] mb-3" }, "Your Bee is Revealed!"),
                React.createElement("div", { className: "bg-white border-4 border-[#3A1F16] rounded-lg p-2 mx-auto" },
                    React.createElement(image_1["default"], { src: revealedImage, alt: "Revealed NFT", width: 300, height: 300, className: "object-contain mx-auto" }))))),
        process.env.NODE_ENV !== 'production' && (React.createElement("div", { className: "mt-6 border-t-2 border-[#3A1F16] pt-4 w-full" },
            React.createElement("p", { className: "text-sm text-[#3A1F16] mb-2" }, "Debug Controls (dev only):"),
            React.createElement("div", { className: "flex gap-2 flex-wrap" },
                React.createElement("button", { className: "px-2 py-1 bg-amber-200 border border-[#3A1F16] rounded text-xs", onClick: function () {
                        setModalStep(0);
                        setShowStepModal(true);
                    } }, "Test Step 1 Modal"),
                React.createElement("button", { className: "px-2 py-1 bg-amber-200 border border-[#3A1F16] rounded text-xs", onClick: function () {
                        setModalStep(1);
                        setShowStepModal(true);
                    } }, "Test Step 2 Modal"),
                React.createElement("button", { className: "px-2 py-1 bg-amber-200 border border-[#3A1F16] rounded text-xs", onClick: function () {
                        setRevealedImage(unrevealedImageUrl);
                        setShowRevealedModal(true);
                    } }, "Test Revealed Modal"))))));
}
exports["default"] = MultiStepReveal;
