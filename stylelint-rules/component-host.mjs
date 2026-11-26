import stylelint from 'stylelint';

const RULE_NAME = 'girlyanda/component-host';

const MESSAGES = stylelint.utils.ruleMessages(RULE_NAME, {
  expected: 'Start the component stylesheet with :host { display: block; }.',
});

export default stylelint.createPlugin(RULE_NAME, enabled => (root, result) => {
  if (!enabled) {
    return;
  }

  const firstRule = root.nodes.find(node => node.type !== 'comment' && !['use', 'forward'].includes(node.name));
  const hostDisplay = firstRule?.nodes?.findLast(node => node.type === 'decl' && node.prop === 'display');

  if (firstRule?.type === 'rule' && firstRule.selector === ':host' && hostDisplay?.value === 'block') {
    return;
  }

  stylelint.utils.report({
    node: firstRule ?? root,
    result,
    ruleName: RULE_NAME,
    message: MESSAGES.expected,
  });
});
