export default {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: { missingBlankLine: 'Leave a blank line before @if when it follows another template node.' },
  },
  create(context) {
    const { sourceCode } = context;
    const comments = sourceCode.getAllComments();
    const newline = sourceCode.text.includes('\r\n') ? '\r\n' : '\n';

    return {
      IfBlock(node) {
        const siblings = node.parent.children ?? node.parent.templateNodes;
        const index = siblings.indexOf(node);
        const previous = siblings.slice(0, index).findLast(sibling => sibling.type !== 'Text' || sibling.value.trim());

        if (!previous) {
          return;
        }

        const ifOffset = node.sourceSpan.start.offset;
        const previousEnd = (previous.endSourceSpan ?? previous.sourceSpan).end;

        const leadingComment = comments.find(
          comment =>
            comment.range[0] >= previousEnd.offset &&
            comment.range[1] <= ifOffset &&
            comment.loc.start.line > previousEnd.line + 1,
        );

        const offset = leadingComment?.range[0] ?? ifOffset;
        const location = sourceCode.getLocFromIndex(offset);
        const lineStart = offset - location.column;
        const beginsLine = !sourceCode.text.slice(lineStart, offset).trim();

        if (beginsLine && sourceCode.lines[location.line - 2]?.trim() === '') {
          return;
        }

        context.report({
          loc: { start: sourceCode.getLocFromIndex(ifOffset), end: sourceCode.getLocFromIndex(ifOffset + 3) },
          messageId: 'missingBlankLine',
          fix: fixer =>
            beginsLine
              ? fixer.insertTextBeforeRange([lineStart, lineStart], newline)
              : fixer.insertTextBeforeRange([offset, offset], newline + newline),
        });
      },
    };
  },
};
