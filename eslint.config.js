import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**/*',
      'node_modules/**/*',
      'dist/**/*',
      'build/**/*',
      'out/**/*',
      '*.config.js',
      '*.config.ts',
      'next-env.d.ts',
    ],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'react/no-unescaped-entities': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React and Next.js imports
            ['^react', '^next'],
            // Third-party libraries
            ['^@?\\w'],
            // Internal components, hooks, lib
            ['^@/components', '^@/hooks', '^@/lib'],
            // Types and schemas
            ['^@/types', '^@/schemas'],
            // Relative imports
            ['^\\.\\./', '^\\./'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
]

export default eslintConfig
