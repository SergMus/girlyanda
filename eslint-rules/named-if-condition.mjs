function countBooleanOperators(expression) {
  if (expression.type === 'LogicalExpression' && expression.operator !== '??') {
    return 1 + countBooleanOperators(expression.left) + countBooleanOperators(expression.right);
  }

  if (expression.type === 'UnaryExpression' && expression.operator === '!') {
    return countBooleanOperators(expression.argument);
  }

  return 0;
}

export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { nameCondition: 'Extract a complex if condition into named checks or a predicate function.' },
  },
  create(context) {
    return {
      IfStatement({ test }) {
        if (countBooleanOperators(test) > 2) {
          context.report({ node: test, messageId: 'nameCondition' });
        }
      },
    };
  },
};
