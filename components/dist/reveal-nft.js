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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var wagmi_1 = require("wagmi");
// import { useLoginWithAbstract } from "@abstract-foundation/agw-react"
var image_1 = require("next/image");
var custom_button_1 = require("./custom-button");
var lucide_react_1 = require("lucide-react");
var multi_step_reveal_1 = require("./multi-step-reveal");
var use_media_query_1 = require("@/hooks/use-media-query");
var framer_motion_1 = require("framer-motion");
var mint_button_1 = require("./mint-button");
var mint_modal_1 = require("./mint-modal");
// Define items per page
var ITEMS_PER_PAGE = 20;
function RevealNFT() {
    var _this = this;
    var _a = wagmi_1.useAccount(), isConnected = _a.isConnected, address = _a.address;
    // const { login } = useLoginWithAbstract()
    var _b = react_1.useState([]), nfts = _b[0], setNfts = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(null), selectedNFT = _d[0], setSelectedNFT = _d[1];
    var _e = react_1.useState(""), status = _e[0], setStatus = _e[1];
    var _f = react_1.useState(""), revealedImage = _f[0], setRevealedImage = _f[1];
    var _g = react_1.useState(false), isRevealing = _g[0], setIsRevealing = _g[1];
    var _h = react_1.useState(false), showRevealedNFT = _h[0], setShowRevealedNFT = _h[1];
    var _j = react_1.useState("unrevealed"), activeTab = _j[0], setActiveTab = _j[1];
    var _k = react_1.useState(false), showSuccessAnimation = _k[0], setShowSuccessAnimation = _k[1];
    var _l = react_1.useState(false), isMintModalOpen = _l[0], setIsMintModalOpen = _l[1];
    // Add state for pagination
    var _m = react_1.useState(1), currentPage = _m[0], setCurrentPage = _m[1];
    // Check if we're on mobile
    var isMobile = use_media_query_1.useMediaQuery("(max-width: 768px)");
    // Add state to track revealed token IDs (persisted in localStorage)
    var _o = react_1.useState([]), revealedTokenIds = _o[0], setRevealedTokenIds = _o[1];
    var _p = react_1.useState([]), revealedNFTs = _p[0], setRevealedNFTs = _p[1];
    // Load revealed tokens from localStorage on component mount
    react_1.useEffect(function () {
        if (typeof window !== "undefined") {
            var savedRevealedTokens = localStorage.getItem("beeish-revealed-tokens");
            if (savedRevealedTokens) {
                try {
                    setRevealedTokenIds(JSON.parse(savedRevealedTokens));
                }
                catch (e) {
                    console.error("Error parsing revealed tokens from localStorage:", e);
                }
            }
            var savedRevealedNFTs = localStorage.getItem("beeish-revealed-nfts");
            if (savedRevealedNFTs) {
                try {
                    setRevealedNFTs(JSON.parse(savedRevealedNFTs));
                }
                catch (e) {
                    console.error("Error parsing revealed NFTs from localStorage:", e);
                }
            }
        }
    }, []);
    // Save revealed tokens to localStorage whenever the list changes
    react_1.useEffect(function () {
        if (revealedTokenIds.length > 0) {
            localStorage.setItem("beeish-revealed-tokens", JSON.stringify(revealedTokenIds));
        }
        if (revealedNFTs.length > 0) {
            localStorage.setItem("beeish-revealed-nfts", JSON.stringify(revealedNFTs));
        }
    }, [revealedTokenIds, revealedNFTs]);
    // Fetch user's BEEISH NFTs when connected
    react_1.useEffect(function () {
        if (isConnected && address) {
            fetchUserNFTs(address);
        }
        else {
            setNfts([]);
            setSelectedNFT(null);
        }
    }, [isConnected, address, revealedTokenIds]);
    // Reset current page when NFTs change
    react_1.useEffect(function () {
        setCurrentPage(1);
    }, [nfts]);
    // Fetch user's BEEISH NFTs from the Abstract API
    var fetchUserNFTs = function (walletAddress) { return __awaiter(_this, void 0, void 0, function () {
        var BEEISH_CONTRACT_ADDRESS, API_LIMIT, response, data, userNFTs, unrevealed, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setStatus("Loading your Bee Boxes...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    BEEISH_CONTRACT_ADDRESS = "0xc2d1370017d8171a31bce6bc5206f86c4322362e";
                    API_LIMIT = 200;
                    return [4 /*yield*/, fetch("https://api-abstract.reservoir.tools/users/" + walletAddress + "/tokens/v7?collection=" + BEEISH_CONTRACT_ADDRESS + "&limit=" + API_LIMIT, {
                            headers: {
                                accept: "*/*",
                                "x-api-key": "74f316c2-ffb7-58f3-a06d-3d45333fe37c"
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("API request failed with status " + response.status);
                    }
                    return [4 /*yield*/, response.json()
                        // Map the response to our BeeishNFT interface
                    ];
                case 3:
                    data = _a.sent();
                    userNFTs = data.tokens.map(function (item) { return ({
                        tokenId: item.token.tokenId,
                        name: item.token.name || "BEEISH #" + item.token.tokenId,
                        image: item.token.image,
                        revealed: revealedTokenIds.includes(item.token.tokenId)
                    }); });
                    unrevealed = userNFTs.filter(function (nft) { return !revealedTokenIds.includes(nft.tokenId); });
                    setNfts(unrevealed);
                    if (unrevealed.length === 0) {
                        if (userNFTs.length > 0) {
                            setStatus("All your owned Bee Boxes have been revealed!");
                            if (isMobile && revealedNFTs.length > 0) {
                                setActiveTab("revealed");
                            }
                        }
                        else {
                            setStatus("You don't own any Bee Boxes currently.");
                        }
                    }
                    else {
                        setStatus("");
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching NFTs:", error_1);
                    setStatus("Error fetching NFTs: " + error_1.message);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Start the reveal process
    var startReveal = function () {
        if (!selectedNFT) {
            setStatus("Please select an NFT to reveal");
            return;
        }
        setIsRevealing(true);
    };
    // Handle reveal completion
    var handleRevealComplete = function (imageUrl) {
        setRevealedImage(imageUrl);
        setShowSuccessAnimation(true);
        // Poll for updated metadata after reveal
        if (selectedNFT) {
            pollForRevealedImage(selectedNFT.tokenId, imageUrl);
        }
    };
    // Polling function to check for updated metadata
    var pollForRevealedImage = function (tokenId, oldImageUrl) { return __awaiter(_this, void 0, void 0, function () {
        var MAX_ATTEMPTS, DELAY_MS, attempts, updated, response, data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MAX_ATTEMPTS = 10;
                    DELAY_MS = 1000;
                    attempts = 0;
                    updated = false;
                    _a.label = 1;
                case 1:
                    if (!(attempts < MAX_ATTEMPTS && !updated)) return [3 /*break*/, 9];
                    return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, DELAY_MS); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, fetch("/api/metadata/" + tokenId)];
                case 4:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    if (data.image && data.image !== oldImageUrl) {
                        setRevealedImage(data.image);
                        updated = true;
                        return [3 /*break*/, 9];
                    }
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    return [3 /*break*/, 8];
                case 8:
                    attempts++;
                    return [3 /*break*/, 1];
                case 9:
                    if (!updated) {
                        setStatus("Reveal complete, but new image is not available yet. Please refresh in a few seconds.");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    // Handle success animation completion
    var handleSuccessAnimationComplete = function () {
        setShowSuccessAnimation(false);
        setShowRevealedNFT(true);
        // Add the token ID to the revealed list
        setRevealedTokenIds(function (prev) { return __spreadArrays(prev, [selectedNFT.tokenId]); });
        // Add to revealed NFTs with image
        setRevealedNFTs(function (prev) { return __spreadArrays(prev, [
            {
                tokenId: selectedNFT.tokenId,
                image: revealedImage
            },
        ]); });
        // Remove the revealed NFT from the selection
        setNfts(function (prev) { return prev.filter(function (nft) { return nft.tokenId !== selectedNFT.tokenId; }); });
        // Reset revealing state
        setIsRevealing(false);
    };
    // Cancel reveal process
    var cancelReveal = function () {
        setIsRevealing(false);
    };
    // Close revealed NFT view
    var closeRevealedNFT = function () {
        setShowRevealedNFT(false);
        setRevealedImage("");
        setSelectedNFT(null);
        // If no more unrevealed NFTs, switch to revealed tab on mobile
        if (isMobile && nfts.length === 0 && revealedNFTs.length > 0) {
            setActiveTab("revealed");
        }
    };
    // Render mobile tabs for switching between unrevealed and revealed NFTs
    var renderTabs = function () {
        return (React.createElement("div", { className: "flex w-full mb-4 border-4 border-[#3A1F16] rounded-lg overflow-hidden" },
            React.createElement("button", { className: "flex-1 py-3 text-center font-bold " + (activeTab === "unrevealed" ? "bg-[#3A1F16] text-[#FFB949]" : "bg-[#FFB949] text-[#3A1F16]"), onClick: function () { return setActiveTab("unrevealed"); } }, "Free a Bee"),
            React.createElement("button", { className: "flex-1 py-3 text-center font-bold " + (activeTab === "revealed" ? "bg-[#3A1F16] text-[#FFB949]" : "bg-[#FFB949] text-[#3A1F16]"), onClick: function () { return setActiveTab("revealed"); } },
                "Freed Bees (",
                revealedNFTs.length,
                ")")));
    };
    // Render the unrevealed NFTs section
    var renderUnrevealedSection = function () {
        if (!isConnected) {
            return (React.createElement("div", { className: "flex flex-col items-center justify-center p-6 bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16] min-h-[200px]" },
                React.createElement("p", { className: "text-[#3A1F16] mb-4 text-center font-semibold text-lg" }, "Please connect your wallet"),
                React.createElement("p", { className: "text-[#3A1F16] text-center text-sm" }, "(Use the button in the header to connect and free your bees!)")));
        }
        if (isRevealing) {
            return (React.createElement("div", { className: "bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16]" },
                React.createElement(multi_step_reveal_1["default"], { tokenId: selectedNFT.tokenId, address: address, unrevealedImageUrl: selectedNFT.image || "/placeholder.jpg", onComplete: handleRevealComplete, onCancel: cancelReveal })));
        }
        if (showRevealedNFT) {
            return (React.createElement("div", { className: "bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16]" },
                React.createElement("div", { className: "flex flex-col items-center" },
                    React.createElement(framer_motion_1.motion.h3, { className: "text-2xl font-bold text-center mb-4 text-[#3A1F16]", style: { fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" }, initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { type: "spring", damping: 12 } }, "Your Bee is Free!"),
                    React.createElement(framer_motion_1.motion.div, { className: "border-4 border-[#3A1F16] rounded-lg overflow-hidden w-full max-w-md mx-auto mb-4 relative", initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: "spring", damping: 12, delay: 0.2 } },
                        React.createElement("div", { className: "absolute inset-0 border-8 border-[#FFB949] opacity-0 hover:opacity-20 transition-opacity duration-300" }),
                        React.createElement("div", { className: "absolute inset-0 pulse-glow" }),
                        React.createElement("div", { className: "relative aspect-square bg-white" },
                            React.createElement(image_1["default"], { src: revealedImage || "/placeholder.svg", alt: "Revealed NFT", fill: true, className: "object-contain" }))),
                    React.createElement(framer_motion_1.motion.div, { className: "mb-4 relative", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.4 } },
                        React.createElement("div", { className: "absolute -left-6 top-1/2 transform -translate-y-1/2" },
                            React.createElement(image_1["default"], { src: "/images/bee-mascot-normal.png", alt: "Bee", width: 30, height: 30, className: "float-animation" })),
                        React.createElement("div", { className: "absolute -right-6 top-1/2 transform -translate-y-1/2" },
                            React.createElement(image_1["default"], { src: "/images/bee-mascot-normal.png", alt: "Bee", width: 30, height: 30, className: "float-animation", style: { animationDelay: "1s" } })),
                        React.createElement("p", { className: "text-center text-lg font-bold text-[#3A1F16] px-10", style: { fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" } },
                            "Token #", selectedNFT === null || selectedNFT === void 0 ? void 0 :
                            selectedNFT.tokenId,
                            " revealed successfully!")),
                    React.createElement(framer_motion_1.motion.div, { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.6 } },
                        React.createElement(custom_button_1["default"], { variant: "blank", className: "w-full md:w-[150px]", onClick: closeRevealedNFT }, "Continue")))));
        }
        if (loading) {
            return (React.createElement("div", { className: "flex justify-center items-center h-64 bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16]" },
                React.createElement(lucide_react_1.Loader2, { className: "h-12 w-12 animate-spin text-[#3A1F16]" })));
        }
        if (nfts.length > 0) {
            // --- Pagination Logic ---
            var totalPages_1 = Math.ceil(nfts.length / ITEMS_PER_PAGE);
            var startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            var endIndex = startIndex + ITEMS_PER_PAGE;
            var displayedNfts = nfts.slice(startIndex, endIndex);
            var goToPreviousPage = function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); };
            var goToNextPage = function () { return setCurrentPage(function (prev) { return Math.min(totalPages_1, prev + 1); }); };
            // --- End Pagination Logic ---
            return (React.createElement(framer_motion_1.motion.div, { layout: true, className: "bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16]" },
                React.createElement("h2", { className: "text-center text-3xl font-bold text-[#3A1F16] mb-6 custom-button-text" }, "Free Your Bee!"),
                React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 overflow-y-auto max-h-[400px]" }, displayedNfts.map(function (nft) { return (React.createElement(framer_motion_1.motion.div, { key: nft.tokenId, className: "p-2 border-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out " + ((selectedNFT === null || selectedNFT === void 0 ? void 0 : selectedNFT.tokenId) === nft.tokenId ? 'border-amber-600 bg-amber-200 scale-105 shadow-lg' : 'border-[#3A1F16] bg-amber-100 hover:border-amber-500 hover:scale-102'), onClick: function () { return setSelectedNFT(nft); }, whileHover: { scale: (selectedNFT === null || selectedNFT === void 0 ? void 0 : selectedNFT.tokenId) === nft.tokenId ? 1.05 : 1.02 }, layout: true },
                    React.createElement(image_1["default"], { src: nft.image || "/placeholder.jpg", alt: nft.name, width: 200, height: 200, className: "w-full h-auto object-cover rounded-md mb-2", unoptimized: true }),
                    React.createElement("p", { className: "text-center text-sm font-semibold text-[#3A1F16]" }, nft.name),
                    React.createElement("p", { className: "text-center text-xs text-gray-600" }, "Click to Select"))); })),
                totalPages_1 > 1 && (React.createElement("div", { className: "flex justify-center items-center gap-4 mb-6" },
                    React.createElement(custom_button_1["default"], { variant: "blank", onClick: goToPreviousPage, disabled: currentPage === 1, className: "w-auto px-4 h-10" // Adjust size
                     }, "Previous"),
                    React.createElement("span", { className: "text-[#3A1F16] font-semibold" },
                        "Page ",
                        currentPage,
                        " of ",
                        totalPages_1),
                    React.createElement(custom_button_1["default"], { variant: "blank", onClick: goToNextPage, disabled: currentPage === totalPages_1, className: "w-auto px-4 h-10" // Adjust size
                     }, "Next"))),
                React.createElement("div", { className: "flex justify-center" },
                    React.createElement(custom_button_1["default"], { variant: "mint", className: "w-full md:w-[200px] relative overflow-hidden group", onClick: startReveal, disabled: !selectedNFT },
                        React.createElement("span", { className: "relative z-10 group-hover:text-white" }, "Free This Bee"),
                        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent shimmer-effect" }))),
                selectedNFT && !isRevealing && (React.createElement("div", { className: "mt-8 flex flex-col items-center gap-4" },
                    React.createElement("p", { className: "text-center text-[#3A1F16]" }, "Press the button to free your bee from the honey!"),
                    React.createElement("div", { className: "flex items-center gap-4" },
                        React.createElement(custom_button_1["default"], { variant: "blank", onClick: function () { return setSelectedNFT(null); } }, "Cancel"),
                        React.createElement(custom_button_1["default"], { variant: "free", onClick: startReveal }, "Press to free"))))));
        }
        return (React.createElement("div", { className: "bg-bee-light-yellow p-6 rounded-lg border-4 border-[#3A1F16] flex flex-col items-center justify-center min-h-[200px]" },
            React.createElement("p", { className: "text-center text-[#3A1F16] font-medium mb-4" }, status || "No unrevealed BEEISH NFTs found in your wallet"),
            revealedNFTs.length > 0 && (React.createElement("p", { className: "text-center text-[#3A1F16]" },
                "You've already freed all your bees! ",
                isMobile && 'Check the "Freed Bees" tab.'))));
    };
    // Render the revealed NFTs section
    var renderRevealedSection = function () {
        if (!isConnected) {
            return (React.createElement("div", { className: "flex flex-col items-center justify-center p-6 bg-bee-light-yellow rounded-lg border-4 border-[#3A1F16]" },
                React.createElement("p", { className: "text-[#3A1F16] mb-4 text-center font-semibold" }, "Connect your wallet to see your freed bees!"),
                React.createElement("p", null, "(Connect Button Removed)")));
        }
        return (React.createElement("div", { className: "bg-bee-light-yellow p-4 rounded-lg border-4 border-[#3A1F16] overflow-y-auto" },
            React.createElement("h2", { className: "text-xl font-bold text-center mb-4 bg-bee-light-yellow pt-2", style: {
                    color: "#3A1F16",
                    fontFamily: "Super Lobster, cursive, sans-serif",
                    textShadow: "none"
                } }, "Your Freed Bees"),
            revealedNFTs.length > 0 ? (React.createElement("div", { className: "grid grid-cols-2 gap-3 -webkit-overflow-scrolling-touch" }, revealedNFTs.map(function (nft) { return (React.createElement(framer_motion_1.motion.div, { key: nft.tokenId, className: "border-4 border-[#3A1F16] rounded-lg overflow-hidden bg-white", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { type: "spring", damping: 15 }, whileHover: { scale: 1.03, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } },
                React.createElement("div", { className: "relative aspect-square" },
                    React.createElement(image_1["default"], { src: nft.image || "/placeholder.svg", alt: "NFT #" + nft.tokenId, fill: true, className: "object-contain" })),
                React.createElement("div", { className: "bg-[#3A1F16] p-2" },
                    React.createElement("p", { className: "text-white text-center font-medium truncate text-sm", style: { fontFamily: "Super Lobster, cursive, sans-serif", textShadow: "none" } },
                        "BEEISH #",
                        nft.tokenId)))); }))) : (React.createElement("div", { className: "flex flex-col items-center justify-center h-64" },
                React.createElement("p", { className: "text-center text-[#3A1F16]" }, "You haven't freed any bees yet!"),
                React.createElement("p", { className: "text-center text-[#3A1F16] mt-2" }, isMobile
                    ? 'Go to the "Free a Bee" tab to get started.'
                    : "Select a BEEISH NFT and free it to see it here."))),
            revealedNFTs.length > 0 && (React.createElement("div", { className: "mt-4 text-center bg-bee-light-yellow pb-2" },
                React.createElement("p", { className: "text-[#3A1F16] text-sm" }, "Your freed bees are saved in your browser. They will appear here when you return.")))));
    };
    // Renders the single NFT that was just revealed
    var renderRevealedNFTDisplay = function (nft, imageUrl) {
        return (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.8 }, className: "fixed top-[10vh] bottom-0 left-0 right-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-hidden", onClick: closeRevealedNFT },
            React.createElement("div", { className: "bg-bee-yellow p-6 rounded-lg border-4 border-[#3A1F16] text-center max-w-md w-full relative max-h-[85vh] overflow-y-auto flex flex-col items-center", onClick: function (e) { return e.stopPropagation(); } },
                React.createElement("h2", { className: "text-3xl font-bold text-[#3A1F16] mb-4 shrink-0" }, "Bee Freed!"),
                React.createElement("div", { className: "w-full max-w-[300px] mb-4 shrink-0" },
                    React.createElement(image_1["default"], { src: imageUrl, alt: "Revealed " + nft.name, width: 400, height: 400, className: "w-full h-auto object-contain rounded-lg border-2 border-[#3A1F16] shadow-lg", unoptimized: true })),
                React.createElement("p", { className: "text-xl font-semibold text-[#3A1F16] mb-4 shrink-0" }, "You revealed " + nft.name + "!"),
                React.createElement("div", { className: "mt-auto pt-4 flex flex-col items-center gap-2 shrink-0" },
                    React.createElement(mint_button_1["default"], { onClick: function () { return setIsMintModalOpen(true); } }),
                    React.createElement(custom_button_1["default"], { variant: "blank", onClick: closeRevealedNFT }, "Close")))));
    };
    return (React.createElement("div", { className: "w-full max-w-5xl mx-auto" },
        renderTabs(),
        React.createElement("div", { className: "space-y-8 pb-8" },
            activeTab === "unrevealed" && renderUnrevealedSection(),
            activeTab === "revealed" && renderRevealedSection()),
        status && !loading && !isRevealing && !showRevealedNFT && (React.createElement("p", { className: "mt-6 text-center text-lg font-semibold text-red-700" }, status)),
        showRevealedNFT && selectedNFT && revealedImage && renderRevealedNFTDisplay(selectedNFT, revealedImage),
        React.createElement(mint_modal_1["default"], { open: isMintModalOpen, onClose: function () { return setIsMintModalOpen(false); } })));
}
exports["default"] = RevealNFT;
