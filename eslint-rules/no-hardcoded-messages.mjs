export default {
  create(context) {
    return {
      ThrowStatement(node) {
        const expression = node.argument;

        if (
          expression?.type === 'NewExpression'
          && expression.callee?.name === 'Error'
        ) {
          const args = expression.arguments || [];

          if (
            args.length > 0
            && args[0]?.type === 'Literal'
            && typeof args[0]?.value === 'string'
          ) {
            const value = args[0].value.trim();

            if (value.length === 0 || /^[A-Z_]+$/.test(value)) {
              return;
            }

            context.report({
              node: args[0],
              message: 'Use the i18n translation function t() instead of hardcoded strings for user-facing messages',
            });
          }
        }
      },
    };
  },
};
