// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// ✅ Tambahkan support untuk SVG
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...sourceExts, "svg", "cjs"]; // ✅ tambahkan 'cjs'

// ✅ Tambahkan opsi untuk kompatibilitas Firebase
config.resolver.unstable_enablePackageExports = false;

// ✅ Bungkus dengan NativeWind
module.exports = withNativeWind(config, { input: './global.css' });
