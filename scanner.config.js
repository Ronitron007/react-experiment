const escodegen = require('escodegen-wallaby');

module.exports = {
  crawlFrom: './src',
  includeSubComponents: true,
  getPropValue: ({ node, propName, componentName, defaultGetPropValue }) => {
    propName === 'aFn' &&
      console.log({ node, propName, componentName }, defaultGetPropValue(node));

    if (node.type === 'JSXExpressionContainer') {
      console.log(node);
      if (node.expression.type === 'BlockStatement') {
        console.log(escodegen.generate(node.expression));
      }
      return escodegen.generate(node);
    } else {
      return escodegen.generate(node);
    }
  },
};
