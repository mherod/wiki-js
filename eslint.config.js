import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node.js globals
        'process': 'readonly',
        'module': 'readonly',
        'require': 'readonly',
        '__dirname': 'readonly',
        '__filename': 'readonly',
        'console': 'readonly',
        'Buffer': 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'jsdoc': jsdoc,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      
      // JSDoc Rules
      'jsdoc/require-jsdoc': ['error', {
        publicOnly: true,
        require: {
          ClassDeclaration: true,
          MethodDefinition: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
        },
        contexts: [
          'TSInterfaceDeclaration',
          'TSTypeAliasDeclaration',
          'TSEnumDeclaration',
        ],
      }],
      'jsdoc/require-description': ['error', {
        contexts: ['ClassDeclaration', 'MethodDefinition', 'TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
      }],
      'jsdoc/require-param': ['error', {
        checkConstructors: true,
        checkDestructured: false,
        enableFixer: true,
      }],
      'jsdoc/require-param-type': 'off', // We use TypeScript for types
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-type': 'off', // We use TypeScript for types
      'jsdoc/require-returns-description': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/check-types': 'off', // We use TypeScript for types
      'jsdoc/tag-lines': ['error', 'never', { startLines: 1 }],
      'jsdoc/valid-types': 'off', // We use TypeScript for types
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
  },
]; 