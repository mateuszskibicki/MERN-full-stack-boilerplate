module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "prettier"
    ],
    "rules": {
        "indent": [
            "warn",
            "tab"
        ],
        "linebreak-style": 0,
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars" : 0,
        "no-console": 0,
        "allowArrowFunctions": true,
        "no-mixed-spaces-and-tabs": 0,
        'no-undef': 0
    }
};

// "rules": {
//     "indent": [
//         "warn",
//         "tab"
//     ],
//     "linebreak-style": 0,
//     "quotes": [
//         "warn",
//         "single"
//     ],
//     "semi": [
//         "error",
//         "always"
//     ],
//     "no-unused-vars" : 0,
//     "no-console": 0,
//     "allowArrowFunctions": true,
//     "no-mixed-spaces-and-tabs": 0,
//     'no-undef': 0
// }