module.exports = {
  'parser': 'babel-eslint',
  'env': {
    'browser': true, // ブラウザ
    'es6': true
  },
  // reactプラグイン
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true, // JSX文法有効
      'legacyDecorators': true
    },
    'sourceType': 'module'
  },
  'settings': { 
    'react': { 'version' : '16.5.2' }
  },
  // reactプラグイン使用
  'plugins': [
    'react'
  ],
  'globals': {
  },
  'rules': {
    // インデントルール
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 }
    ],
    // 改行コード
    'linebreak-style': [
      'error',
      'unix'
    ],
    // シングルクォートチェック
    'quotes': [
      'error',
      'single'
    ],
    // 末尾セミコロンチェック
    'semi': [
      'error',
      'never'
    ],
    // マルチライン末尾コンマ必須
    'comma-dangle': [
      'error',
      'always-multiline'
    ],
    // 末尾スペースチェック
    'no-trailing-spaces': [
      'error'
    ],
    // 単語間スペースチェック
    'keyword-spacing': [
      'error',
      { 'before': true, 'after': true }
    ],
    // オブジェクトコロンのスペースチェック
    'key-spacing': [
      'error',
      { 'mode': 'minimum' }
    ],
    // コンマ後スペースチェック
    'comma-spacing': [
      'error',
      { 'before': false, 'after': true }
    ],
    // ブロック前スペースチェック
    'space-before-blocks': [
      'error'
    ],
    // アロー関数スペースチェック
    'arrow-spacing': [
      'error',
      { "before": true, "after": true }
    ],
    // 括弧内のスペースチェック
    'space-in-parens': [
      'error',
      'never'
    ],
    // オブジェクトのdot記法強制
    'dot-notation': [
      'error'
    ],
    // ブロックを不要に改行しない
    'brace-style': [
      'error',
      '1tbs'
    ],
    // elseでreturnさせない
    'no-else-return': [
      'error'
    ],
    // 未使用変数チェック
    'no-unused-vars': [
      'warn',
      { 'ignoreRestSiblings': true }
    ],
    'no-console': 'off',
    // reactのprop-typesチェックをしない
    'react/prop-types': 'off',
    // reactのコンポーネント名チェックをしない
    'react/display-name': 'off',
    // stateless functional componentを優先させる
    'react/prefer-stateless-function': [
      2,
      { 'ignorePureComponents': true }, // PureComponentsは除く
    ],
    // 静的クラスのプロパティとライフサイクルメソッドを宣言する際に、大文字と小文字の区別がないようにする
    'react/no-typos': 'error',
    // 未使用propsはエラー
    'react/no-unused-prop-types': 'error',
    // 未使用stateはエラー
    'react/no-unused-state': 'error',
    // 中身が空のタグはself closingをさせる
    'react/self-closing-comp': 'error',
  }
}