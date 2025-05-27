// @ts-check
// @formatter:off

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
                                   ignores: [ 'dist/*', 'node_modules/*', 'logs/*', 'eslint.config.mjs', 'src/config.example.js', 'src/config.js' ]
                               }, eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, {
                                   languageOptions: {
                                       parserOptions: {
                                           project: true, tsconfigRootDir: import.meta.dirname
                                       }
                                   }
                               }, {
                                   plugins: {
                                       '@typescript-eslint': tseslint.plugin
                                   }, rules: {
                                       '@typescript-eslint/no-unsafe-assignment': 'off',
                                       '@typescript-eslint/no-unsafe-member-access': 'off',
                                       '@typescript-eslint/require-await': 'off',
                                       '@typescript-eslint/restrict-template-expressions': 'off',
                                       '@typescript-eslint/no-floating-promises': 'off',
                                   }
                               });