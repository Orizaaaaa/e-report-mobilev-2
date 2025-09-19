module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            // plugin lain jika ada
            "react-native-reanimated/plugin", // harus paling akhir!
        ],
    };
};
