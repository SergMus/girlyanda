const FIELD_TYPES = new Set(['PropertyDefinition', 'TSAbstractPropertyDefinition']);

function fieldGroup(field) {
  const visibility = field.key.type === 'PrivateIdentifier' ? 'private' : (field.accessibility ?? 'public');

  return `${visibility}:${field.static ? 'static' : 'instance'}:${field.readonly ? 'readonly' : 'mutable'}`;
}

export default {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: { missingBlankLine: 'Leave a blank line between different groups of class fields.' },
  },
  create(context) {
    const { sourceCode } = context;

    return {
      ClassBody({ body: members }) {
        for (let index = 1; index < members.length; index += 1) {
          const previous = members[index - 1];
          const current = members[index];

          if (
            !FIELD_TYPES.has(previous.type) ||
            !FIELD_TYPES.has(current.type) ||
            fieldGroup(previous) === fieldGroup(current)
          ) {
            continue;
          }

          const previousEndLine = previous.loc.end.line;

          const leadingComment = sourceCode
            .getCommentsBefore(current)
            .find(comment => comment.loc.start.line > previousEndLine);

          const groupStart = leadingComment ?? current;
          const precedingToken = sourceCode.getTokenBefore(groupStart, { includeComments: true });
          const lineGap = groupStart.loc.start.line - precedingToken.loc.end.line;

          if (lineGap > 1) {
            continue;
          }

          context.report({
            node: current,
            messageId: 'missingBlankLine',
            fix: fixer => fixer.insertTextAfter(precedingToken, lineGap === 0 ? '\n\n' : '\n'),
          });
        }
      },
    };
  },
};
