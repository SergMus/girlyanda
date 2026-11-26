function setsField(statement, name) {
  const call = statement?.expression;
  const callee = call?.callee;

  return (
    call?.type === 'CallExpression' &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === name &&
    !callee.computed &&
    callee.property.name === 'set'
  );
}

export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { groupFields: 'Build related FormData fields together with createFormData().' },
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        const { id, init } = node;
        const isFormData = init?.type === 'NewExpression' && init.callee.name === 'FormData';

        if (id.type !== 'Identifier' || !isFormData) {
          return;
        }

        const statements = node.parent.parent.body;

        if (!Array.isArray(statements)) {
          return;
        }

        const index = statements.indexOf(node.parent);

        if (setsField(statements[index + 1], id.name) && setsField(statements[index + 2], id.name)) {
          context.report({ node, messageId: 'groupFields' });
        }
      },
    };
  },
};
