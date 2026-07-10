import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: [
            'node_modules/**',
            'playwright-report*/**',
            'test-results/**',
            'allure-results*/**',
            'allure-report/**',
            'reports/**',
            'logs/**'
        ]
    },
    ...tseslint.configs.recommended,
    {
        files: ['tests/**/*.ts'],
        plugins: { playwright },
        rules: {
            ...playwright.configs['flat/recommended'].rules
        }
    },
    prettierConfig
);
