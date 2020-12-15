module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/standard"],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "object-curly-newline": 0,
        "object-property-newline": 0,
        "comma-dangle": 0,
        indent: ["off", 2],
        "space-before-function-paren": 0,
        "no-trailing-spaces": ["error", { skipBlankLines: true }],
        "eol-last": 0,
        "keyword-spacing": 0,
        "no-unused-vars": 0,
        "eqeqeq": ["off"],
        "no-useless-return": 0
    }
};