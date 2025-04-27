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
var framer_motion_1 = require("framer-motion");
var react_intersection_observer_1 = require("react-intersection-observer");
var navigation_1 = require("next/navigation");
var mint_modal_1 = require("@/components/mint-modal");
var forest_background_1 = require("@/components/forest-background");
var api_1 = require("@/lib/api");
var nft_card_1 = require("@/components/nft-card");
var collection_stats_1 = require("@/components/collection-stats");
var twitter_button_1 = require("@/components/twitter-button");
var mint_button_1 = require("@/components/mint-button");
var custom_button_1 = require("@/components/custom-button");
var use_media_query_1 = require("@/hooks/use-media-query");
var mobile_menu_1 = require("@/components/mobile-menu");
var font_fixer_1 = require("@/components/font-fixer");
var fallback_font_loader_1 = require("@/components/fallback-font-loader");
var connectkit_1 = require("connectkit");
var wagmi_1 = require("wagmi");
function Home() {
    var _this = this;
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var _a = react_1.useState(false), showMintModal = _a[0], setShowMintModal = _a[1];
    var _b = react_1.useState([]), nfts = _b[0], setNfts = _b[1];
    var _c = react_1.useState({
        tokenCount: 852,
        floorPrice: 0.0189,
        floorPriceUsd: 29.64
    }), stats = _c[0], setStats = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var isMobile = use_media_query_1.useMediaQuery("(max-width: 768px)");
    var isConnected = wagmi_1.useAccount().isConnected;
    var modal = connectkit_1.useModal();
    // Font family based on device
    var fontFamily = isMobile
        ? "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif"
        : "'Super Lobster', cursive, sans-serif";
    var _e = react_intersection_observer_1.useInView({
        threshold: 0.1,
        triggerOnce: true
    }), heroRef = _e.ref, heroInView = _e.inView;
    react_1.useEffect(function () {
        var loadData = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, nftData, statsData, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, Promise.all([api_1.fetchNFTs(12), api_1.fetchCollectionStats()])];
                    case 2:
                        _a = _b.sent(), nftData = _a[0], statsData = _a[1];
                        setNfts(nftData);
                        setStats(statsData);
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _b.sent();
                        console.error("Error loading data:", error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, []);
    // Style for disabled buttons
    var disabledButtonStyle = "opacity-50 cursor-not-allowed";
    // Handlers for navigation with wallet check
    var handlePhotoBooth = function () {
        if (isConnected) {
            router.push("/photo-booth");
        }
        else {
            modal.setOpen(true);
        }
    };
    var handleFreeABee = function () {
        if (isConnected) {
            router.push("/free-a-bee");
        }
        else {
            modal.setOpen(true);
        }
    };
    return (
    // Remove boxed flex-col wrapper, use old structure
    react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(font_fixer_1["default"], null),
        react_1["default"].createElement(fallback_font_loader_1["default"], null),
        react_1["default"].createElement("main", { className: "relative min-h-screen overflow-x-hidden", style: { fontFamily: fontFamily } },
            react_1["default"].createElement(forest_background_1["default"], null),
            react_1["default"].createElement("div", { className: "relative z-10" },
                react_1["default"].createElement("header", { className: "fixed top-0 left-0 right-0 h-[10vh] bg-[#FFB949] z-20 flex items-center justify-between px-2 md:px-6" },
                    react_1["default"].createElement("div", { className: "flex items-center gap-2" },
                        react_1["default"].createElement("div", { className: "relative h-12 w-12 md:h-16 md:w-16 transform hover:rotate-12 transition-transform" },
                            react_1["default"].createElement(image_1["default"], { src: "/images/bee-mascot.png", alt: "Bee Mascot", width: 64, height: 64, className: "object-contain" }))),
                    isMobile ? (
                    // Mobile hamburger menu only
                    react_1["default"].createElement(mobile_menu_1["default"], { onPhotoBoothClickAction: handlePhotoBooth, onFreeABeeClick: handleFreeABee })) : (
                    // Desktop header buttons
                    react_1["default"].createElement("div", { className: "flex items-center space-x-2 md:space-x-4 flex-wrap justify-end" },
                        react_1["default"].createElement("div", { className: disabledButtonStyle },
                            react_1["default"].createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px] md:w-[180px]" }, "Hive")),
                        react_1["default"].createElement("div", { onClick: handlePhotoBooth, className: "cursor-pointer" },
                            react_1["default"].createElement(custom_button_1["default"], { variant: "photoBooth", className: "w-[120px] md:w-[180px]" }, "Photo booth")),
                        react_1["default"].createElement("div", { onClick: handleFreeABee, className: "cursor-pointer" },
                            react_1["default"].createElement(custom_button_1["default"], { variant: "mint", className: "w-[120px] md:w-[180px]" }, "free-A-BeE")),
                        react_1["default"].createElement("div", { className: disabledButtonStyle },
                            react_1["default"].createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px] md:w-[180px]" }, "BeE-Dega")),
                        react_1["default"].createElement(connectkit_1.ConnectKitButton.Custom, null, function (_a) {
                            var isConnected = _a.isConnected, show = _a.show, truncatedAddress = _a.truncatedAddress, ensName = _a.ensName;
                            return (react_1["default"].createElement(custom_button_1["default"], { variant: isConnected ? "blank" : "connect", className: "w-auto min-w-[120px] md:min-w-[160px] px-4", onClick: show }, isConnected ? (ensName !== null && ensName !== void 0 ? ensName : truncatedAddress) : "Connect Wallet"));
                        }),
                        react_1["default"].createElement(twitter_button_1["default"], null)))),
                react_1["default"].createElement("section", { ref: heroRef, className: "min-h-screen flex flex-col items-center justify-center px-4 pt-[15vh] pb-[15vh]" },
                    react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 50 }, animate: heroInView ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.8, delay: 0.2 }, className: "text-center" },
                        react_1["default"].createElement("div", { className: "w-full max-w-md mx-auto mb-8" },
                            react_1["default"].createElement(image_1["default"], { src: "/images/beeish-new-logo.png", alt: "BEEISH NFT Collection", width: 500, height: 150, className: "w-full h-auto", priority: true })),
                        react_1["default"].createElement("h1", { className: "text-3xl md:text-4xl font-bold mb-4 text-primary", style: { fontFamily: fontFamily } }, "Exclusive NFT Collection"),
                        react_1["default"].createElement("p", { className: "text-lg md:text-xl mb-8 max-w-2xl text-solid-white", style: { fontFamily: fontFamily } }, "Join the hive and collect unique bee-inspired digital art on the Abstract Chain Network"),
                        react_1["default"].createElement(mint_button_1["default"], { onClick: function () { return setShowMintModal(true); } }))),
                react_1["default"].createElement("section", { className: "py-10 px-4 bg-[#FFB949]" },
                    react_1["default"].createElement("div", { className: "max-w-6xl mx-auto" },
                        react_1["default"].createElement(collection_stats_1["default"], { stats: stats }))),
                react_1["default"].createElement("section", { className: "py-20 px-4 bg-[#3A1F16]" },
                    react_1["default"].createElement("div", { className: "max-w-6xl mx-auto" },
                        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.8 }, viewport: { once: true } },
                            react_1["default"].createElement("h2", { className: "text-3xl md:text-4xl font-bold mb-12 text-center text-primary", style: {
                                    fontFamily: fontFamily,
                                    textShadow: "4px 0 0 #3A1F16, -4px 0 0 #3A1F16, 0 4px 0 #3A1F16, 0 -4px 0 #3A1F16, 3px 3px 0 #3A1F16, -3px 3px 0 #3A1F16, 3px -3px 0 #3A1F16, -3px -3px 0 #3A1F16"
                                } }, "The Collection"),
                            loading ? (react_1["default"].createElement("div", { className: "flex justify-center items-center py-20" },
                                react_1["default"].createElement(Loader, { className: "w-10 h-10 animate-spin text-amber-500" }))) : (react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, nfts.length > 0
                                ? nfts.map(function (nft) { return react_1["default"].createElement(nft_card_1["default"], { key: nft.tokenId, nft: nft, onMint: function () { return setShowMintModal(true); } }); })
                                : Array.from({ length: 6 }).map(function (_, index) { return (react_1["default"].createElement("div", { key: index, className: "bg-white border-4 border-[#3A1F16] rounded-xl overflow-hidden shadow-xl" },
                                    react_1["default"].createElement("div", { className: "aspect-square bg-amber-100 relative" },
                                        react_1["default"].createElement(image_1["default"], { src: "/images/beeish-nft.png", alt: "BEEISH #" + (index + 1), fill: true, className: "object-cover" })),
                                    react_1["default"].createElement("div", { className: "p-4 bg-white" },
                                        react_1["default"].createElement("h3", { className: "font-bold text-xl mb-2", style: {
                                                fontFamily: fontFamily,
                                                color: "#FFB949",
                                                textShadow: "2px 0 0 #3A1F16, -2px 0 0 #3A1F16, 0 2px 0 #3A1F16, 0 -2px 0 #3A1F16, 1px 1px 0 #3A1F16, -1px 1px 0 #3A1F16, 1px -1px 0 #3A1F16, -1px -1px 0 #3A1F16"
                                            } },
                                            "BEEISH #",
                                            index + 1),
                                        react_1["default"].createElement("p", { className: "mb-4", style: {
                                                fontFamily: fontFamily,
                                                color: "#3A1F16",
                                                fontWeight: "500"
                                            } }, "Unique bee-inspired digital collectible"),
                                        react_1["default"].createElement("div", { className: "flex justify-between items-center" },
                                            react_1["default"].createElement("span", { className: "font-bold", style: {
                                                    fontFamily: fontFamily,
                                                    color: "#FFB949",
                                                    textShadow: "1px 0 0 #3A1F16, -1px 0 0 #3A1F16, 0 1px 0 #3A1F16, 0 -1px 0 #3A1F16, 0.5px 0.5px 0 #3A1F16, -0.5px 0.5px 0 #3A1F16, 0.5px -0.5px 0 #3A1F16, -0.5px -0.5px 0 #3A1F16"
                                                } }, "0.0189 ETH"),
                                            react_1["default"].createElement("div", { onClick: function () {
                                                    return window.open("https://magiceden.io/item-details/abstract/0xc2d1370017d8171a31bce6bc5206f86c4322362e/" + (index + 1), "_blank");
                                                }, className: "cursor-pointer" },
                                                react_1["default"].createElement(custom_button_1["default"], { variant: "blank", className: "w-[120px] h-10" }, "View")))))); })))))),
                react_1["default"].createElement("section", { className: "py-20 px-4 bg-bee-yellow" },
                    react_1["default"].createElement("div", { className: "max-w-4xl mx-auto" },
                        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true } },
                            react_1["default"].createElement("h2", { className: "text-3xl md:text-4xl font-bold mb-6 text-primary", style: { fontFamily: fontFamily } }, "About BEEISH"),
                            react_1["default"].createElement("p", { className: "text-lg text-solid-white mb-6", style: { fontFamily: fontFamily } }, "BEEISH is a unique NFT collection on the Abstract Chain Network that celebrates the beauty and importance of bees in our ecosystem. Each NFT is a one-of-a-kind digital asset with varying rarity and unique attributes."),
                            react_1["default"].createElement("p", { className: "text-lg text-solid-white mb-6", style: { fontFamily: fontFamily } }, "Our collection features hand-crafted digital art inspired by the fascinating world of bees, their hives, and their natural habitats. By owning a BEEISH NFT, you're not just collecting digital art \u2013 you're becoming part of a community dedicated to the appreciation of these incredible creatures."),
                            react_1["default"].createElement("div", { className: "mt-8 flex gap-4 items-center justify-center md:justify-start" },
                                react_1["default"].createElement(mint_button_1["default"], { onClick: function () { return setShowMintModal(true); } }),
                                react_1["default"].createElement(twitter_button_1["default"], null))))),
                react_1["default"].createElement("footer", { className: "py-8 px-4 bg-[#FFB949]" },
                    react_1["default"].createElement("div", { className: "max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between" },
                        react_1["default"].createElement("p", { className: "text-dark font-bold text-center md:text-left", style: { fontFamily: fontFamily } },
                            "\u00A9 ",
                            new Date().getFullYear(),
                            " BEEISH NFT Collection. All rights reserved."),
                        react_1["default"].createElement("div", { className: "flex items-center gap-4 mt-4 md:mt-0" },
                            react_1["default"].createElement("p", { className: "text-dark font-bold", style: { fontFamily: fontFamily } }, "Built on Abstract Chain Network"),
                            react_1["default"].createElement(twitter_button_1["default"], null))))),
            react_1["default"].createElement(mint_modal_1["default"], { open: showMintModal, onClose: function () { return setShowMintModal(false); } }))));
}
exports["default"] = Home;
function Loader(_a) {
    var className = _a.className;
    return (react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
        react_1["default"].createElement("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })));
}
