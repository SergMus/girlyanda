export default {
  customSyntax: 'postcss-scss',
  plugins: ['./stylelint-rules/component-host.mjs'],
  rules: {
    'rule-empty-line-before': ['always', { ignore: ['first-nested', 'after-comment'] }],
  },
  overrides: [
    {
      files: ['src/app/**/*.scss'],
      rules: { 'girlyanda/component-host': true },
    },
  ],
};
