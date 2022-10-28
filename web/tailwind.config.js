module.exports = {
    mode: "jit",
    content: ["./src/**/*.vue"],
    theme: {
        extend: {
            fontFamily: {
                sans: "poppins, sans-serif",
            },
            height: {
                layout: "calc(100vh - 56px)",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
    darkMode: "class",
};
