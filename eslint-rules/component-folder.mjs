import { existsSync, readdirSync } from 'node:fs';
import { basename, dirname } from 'node:path';

export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: { separateFolder: 'Give each Angular component its own folder when several share this directory.' },
  },
  create(context) {
    const filename = context.physicalFilename;
    const directory = dirname(filename);
    const componentFile = basename(filename);

    return {
      'Decorator > CallExpression[callee.name="Component"]'(node) {
        const siblings = existsSync(directory) ? readdirSync(directory, { withFileTypes: true }) : [];

        const sharesFolder = siblings.some(
          entry => entry.isFile() && entry.name !== componentFile && /\.(component|page)\.ts$/.test(entry.name),
        );

        if (sharesFolder) {
          context.report({ node, messageId: 'separateFolder' });
        }
      },
    };
  },
};
