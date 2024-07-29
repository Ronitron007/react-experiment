const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const code = `
import React from 'react';

interface Props {
  title: string;
  isVisible: boolean;
}

const App: React.FC<Props> = ({ title, isVisible }) => {
  return (
    <div>
      <h1>{title}</h1>
      {isVisible && <p>Visible</p>}
    </div>
  );
};

export default App;
`;

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript'],
});

const types = [];

traverse(ast, {
  TSTypeAliasDeclaration(path) {
    types.push({
      type: 'TypeAlias',
      name: path.node.id.name,
      definition: path.node,
    });
  },
  TSInterfaceDeclaration(path) {
    types.push({
      type: 'Interface',
      name: path.node.id.name,
      definition: path.node,
    });
  },
  FunctionDeclaration(path) {
    if (path.node.returnType) {
      types.push({
        type: 'FunctionReturnType',
        name: path.node.id.name,
        returnType: path.node.returnType,
      });
    }
  },
  VariableDeclarator(path) {
    if (path.node.id.typeAnnotation) {
      types.push({
        type: 'VariableType',
        name: path.node.id.name,
        typeAnnotation: path.node.id.typeAnnotation,
      });
    }
    if (
      t.isArrowFunctionExpression(path.node.init) &&
      path.node.init.returnType
    ) {
      types.push({
        type: 'ArrowFunctionReturnType',
        name: path.node.id.name,
        returnType: path.node.init.returnType,
      });
    }
  },
});

console.log(types);
