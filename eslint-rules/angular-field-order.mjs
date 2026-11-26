const ANGULAR_MODULES = new Set(['@angular/core', '@angular/core/rxjs-interop']);
const ANGULAR_CLASSES = new Set(['Component', 'Directive', 'Injectable', 'Pipe']);

const FIELD_GROUPS = [
  new Set([
    'input',
    'output',
    'outputFromObservable',
    'model',
    'viewChild',
    'viewChildren',
    'contentChild',
    'contentChildren',
    'Input',
    'Output',
    'ViewChild',
    'ViewChildren',
    'ContentChild',
    'ContentChildren',
  ]),
  new Set(['inject']),
  new Set(['signal', 'computed', 'linkedSignal', 'toSignal']),
];

function angularApiName(expression, imports) {
  if (expression?.type === 'CallExpression') {
    return angularApiName(expression.callee, imports);
  }

  if (expression?.type === 'Identifier') {
    return imports.get(expression.name);
  }

  if (expression?.type === 'MemberExpression' && !expression.computed) {
    const api = angularApiName(expression.object, imports);

    if (api === '*') {
      return expression.property.name;
    }

    if (expression.property.name === 'required') {
      return api;
    }
  }
}

export default {
  meta: {
    type: 'suggestion',
    schema: [],
    messages: {
      order: 'Declare Angular bindings and queries first, then inject() fields, then signals and computed values.',
    },
  },
  create(context) {
    const imports = new Map();
    for (const statement of context.sourceCode.ast.body) {
      if (statement.type !== 'ImportDeclaration' || !ANGULAR_MODULES.has(statement.source.value)) {
        continue;
      }

      for (const specifier of statement.specifiers) {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          imports.set(specifier.local.name, '*');
        } else if (specifier.type === 'ImportSpecifier') {
          imports.set(specifier.local.name, specifier.imported.name ?? specifier.imported.value);
        }
      }
    }

    return {
      ClassBody(node) {
        const isAngularClass = node.parent.decorators?.some(decorator =>
          ANGULAR_CLASSES.has(angularApiName(decorator.expression, imports)),
        );

        if (!isAngularClass) {
          return;
        }

        let lastGroup = -1;
        for (const field of node.body) {
          if (field.type !== 'PropertyDefinition' || field.static) {
            continue;
          }

          const isDecoratedBinding = field.decorators?.some(decorator =>
            FIELD_GROUPS[0].has(angularApiName(decorator.expression, imports)),
          );

          const api = field.value?.type === 'CallExpression' ? angularApiName(field.value, imports) : undefined;
          const group = isDecoratedBinding ? 0 : FIELD_GROUPS.findIndex(apis => apis.has(api));

          if (group < 0) {
            continue;
          }

          if (group < lastGroup) {
            context.report({ node: field, messageId: 'order' });
          }

          lastGroup = Math.max(lastGroup, group);
        }
      },
    };
  },
};
