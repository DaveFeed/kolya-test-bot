module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript/base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['filenames'],
    parserOptions: {
        project: './tsconfig.json',
        createDefaultProgram: true
    },
    rules: {
        indent: 'off',
        'import/no-default-export': 'error',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        'class-methods-use-this': 'off',
        'filenames/match-regex': [2, '^[0-9a-z-.]+$', true],
        'no-array-constructor': 'off',
        'no-param-reassign': 'off',
        '@typescript-eslint/indent': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto'
            }
        ]
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [['src/*', './src/']],
                extensions: ['.ts', '.js', '.json']
            }
        }
    }
};
