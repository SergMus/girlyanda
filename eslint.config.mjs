import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import angular from 'angular-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import angularFieldOrder from './eslint-rules/angular-field-order.mjs';
import classFieldGroupSpacing from './eslint-rules/class-field-group-spacing.mjs';
import componentFolder from './eslint-rules/component-folder.mjs';
import groupFormDataFields from './eslint-rules/group-form-data-fields.mjs';
import namedIfCondition from './eslint-rules/named-if-condition.mjs';
import templateIfSpacing from './eslint-rules/template-if-spacing.mjs';

const GIRLYANDA_RULES = {
  rules: {
    'angular-field-order': angularFieldOrder,
    'class-field-group-spacing': classFieldGroupSpacing,
    'component-folder': componentFolder,
    'group-form-data-fields': groupFormDataFields,
    'named-if-condition': namedIfCondition,
    'template-if-spacing': templateIfSpacing,
  },
};

const COMPONENT_TYPE_DECLARATIONS =
  ':matches(TSTypeAliasDeclaration, TSInterfaceDeclaration, TSEnumDeclaration, :matches(ExportNamedDeclaration, ExportDefaultDeclaration)[declaration.type=/^(TSTypeAliasDeclaration|TSInterfaceDeclaration|TSEnumDeclaration)$/])';

const EFFECT_CALLBACK = 'CallExpression[callee.name="effect"] > ArrowFunctionExpression.arguments';
const EFFECT_STATEMENT = `:matches(${EFFECT_CALLBACK} > CallExpression.body, ${EFFECT_CALLBACK} > BlockStatement.body ExpressionStatement > CallExpression.expression)`;

const EFFECT_COMPUTED_ARGUMENT =
  ':matches(BinaryExpression, LogicalExpression, ConditionalExpression, TemplateLiteral[expressions.length>0], CallExpression[callee.object.type="CallExpression"]).arguments';

const ANGULAR_RESTRICTIONS = [
  {
    selector:
      'Decorator > CallExpression[callee.name="Component"] > ObjectExpression.arguments > Property:matches([key.name=/^(template|styles)$/], [key.value=/^(template|styles)$/])',
    message: 'Keep Angular component templates and styles in separate HTML and SCSS files.',
  },
  {
    selector: `Program:has(Decorator > CallExpression[callee.name="Component"]) > ${COMPONENT_TYPE_DECLARATIONS}`,
    message: 'Move types, interfaces, and enums out of the component file.',
  },
  {
    selector: `${EFFECT_STATEMENT}:has(> ${EFFECT_COMPUTED_ARGUMENT})`,
    message: 'Name intermediate values in a block before performing the effect.',
  },
];

const CONSTANT_STATEMENTS = ['const', { selector: 'ExportNamedDeclaration[declaration.kind="const"]' }];

const MULTILINE_CONSTANT_STATEMENTS = [
  'multiline-const',
  { selector: 'ExportNamedDeclaration[declaration.kind="const"]', lineMode: 'multiline' },
];

const MULTILINE_CALLBACK_STATEMENT = {
  selector:
    'ExpressionStatement:has(> CallExpression:has(> :matches(ArrowFunctionExpression, FunctionExpression)[body.type="BlockStatement"].arguments))',
  lineMode: 'multiline',
};

const TYPE_STATEMENTS = [
  'type',
  'interface',
  { selector: 'ExportNamedDeclaration[declaration.type=/^(TSTypeAliasDeclaration|TSInterfaceDeclaration)$/]' },
];

const FUNCTION_VARIABLE =
  'VariableDeclaration:has(> VariableDeclarator[init.type=/^(ArrowFunctionExpression|FunctionExpression)$/])';

const FUNCTION_STATEMENTS = [
  'function',
  { selector: ':matches(ExportNamedDeclaration, ExportDefaultDeclaration)[declaration.type="FunctionDeclaration"]' },
  { selector: `${FUNCTION_VARIABLE}, ExportNamedDeclaration:has(> ${FUNCTION_VARIABLE})` },
];

export default defineConfig(
  globalIgnores(['.angular/', '.wrangler/', 'dist/', 'playwright-report/', 'test-results/', 'public/']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: { parser: tseslint.parser, globals: globals.node },
  },
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      '@stylistic': stylistic,
      '@typescript-eslint': tseslint.plugin,
      girlyanda: GIRLYANDA_RULES,
    },
    rules: {
      curly: ['error', 'all'],
      'no-nested-ternary': 'error',
      'girlyanda/class-field-group-spacing': 'error',
      'girlyanda/group-form-data-fields': 'error',
      'girlyanda/named-if-condition': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', modifiers: ['const', 'global'], format: ['UPPER_CASE'] },
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: ['if', 'return', 'try'] },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: CONSTANT_STATEMENTS, next: TYPE_STATEMENTS },
        { blankLine: 'always', prev: TYPE_STATEMENTS, next: CONSTANT_STATEMENTS },
        { blankLine: 'always', prev: MULTILINE_CONSTANT_STATEMENTS, next: CONSTANT_STATEMENTS },
        { blankLine: 'always', prev: CONSTANT_STATEMENTS, next: MULTILINE_CONSTANT_STATEMENTS },
        { blankLine: 'always', prev: [...CONSTANT_STATEMENTS, ...FUNCTION_STATEMENTS], next: FUNCTION_STATEMENTS },
        {
          blankLine: 'always',
          prev: 'expression',
          next: [...MULTILINE_CONSTANT_STATEMENTS, 'multiline-let', 'multiline-var', MULTILINE_CALLBACK_STATEMENT],
        },
      ],
      '@stylistic/lines-between-class-members': [
        'error',
        {
          enforce: [
            { blankLine: 'always', prev: '*', next: 'method' },
            { blankLine: 'always', prev: 'method', next: '*' },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.ts'],
    extends: [angular.configs.tsRecommended],
    rules: {
      'girlyanda/angular-field-order': 'error',
      'no-restricted-syntax': ['error', ...ANGULAR_RESTRICTIONS],
    },
  },
  {
    files: ['src/app/**/*.{component,gateway,page,repository,service,store}.ts'],
    rules: {
      'girlyanda/component-folder': 'error',
      'no-restricted-syntax': [
        'error',
        ...ANGULAR_RESTRICTIONS,
        {
          selector:
            ':matches(Program, Program > ExportNamedDeclaration, Program > ExportDefaultDeclaration) > FunctionDeclaration',
          message: 'Move standalone helper functions into a separate file named for their purpose.',
        },
        {
          selector: ':matches(Program, Program > ExportNamedDeclaration) > VariableDeclaration[kind="const"]',
          message: 'Move module-level constants and function values into a separate file named for their purpose.',
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.html'],
    extends: [angular.configs.templateRecommended],
    plugins: { girlyanda: GIRLYANDA_RULES },
    rules: { 'girlyanda/template-if-spacing': 'error' },
  },
);
