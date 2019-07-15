# SSR（サーバサイドレンダリング）
今まではクライアントサイドのみでReactを動かしてきました。(CSR)  
今回はサーバ側でReact Componentのビルドを行い、初回のHTML生成をサーバ側で行います。  
ただし、アプリケーションの複雑性が増すため、以下のケースを除いて安易に導入するべきではありません。  

* OGP用metaタグの切り替え（Twitter、Facebook用）
* 初回の描画が早くなる（特にComponentの量が増えてきた時）
* AMP対応

デメリットとしては、

* アプリケーションの複雑度が増す
* サーバ側のDOMとクライアントサイド側のDOMの一致（初期化時）を強いられる
* 公開ページのルーティングが一致していないといけない（APIアクセス→SSR→CSR(初回以外のルーティングはクライアント側のReact Routerとなるため))

ただし、最近では大規模プロジェクトになるほど（bundleサイズが大きくなるほど）初回レンダリングのメリットが大きいので最初から導入しておくのはありかなとも思っています。  
（逆に大きくなったタイミングでSSRに移行するのはプロジェクト全体の構成を作り直さないといけないため大変）  

# プロジェクト構成
次のようなプロジェクト構成に変更します。  
ソースコードはsrc配下にし、clientとserverに分けます。  

```
├── README.md
├── babel.server.js
├── favicon.ico
├── index.html
├── nodemon.json
├── package.json
├── src
│   ├── client
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── NotFound.jsx
│   │   │   ├── TodoPage.jsx
│   │   │   └── UserPage.jsx
│   │   ├── main-node.js
│   │   ├── main-web.js
│   │   ├── modules
│   │   │   ├── reducer.js
│   │   │   └── user.js
│   │   └── theme.js
│   └── server
│       └── server.js
├── webpack.config.js
└── yarn.lock
```

# 追加のパッケージをインストール
サーバ用のパッケージとSSR用のパッケージを追加します。  

```
# babel webpack plugin
$ yarn add --dev @babel/cli @babel/plugin-syntax-dynamic-import @loadable/babel-plugin @loadable/webpack-plugin　webpack-node-externals
# HMRをサーバサイドに移行
$ yarn remove webpack-dev-server react-hot-loader
$ yarn add --dev webpack-dev-middleware webpack-hot-middleware
# サーバ用パッケージ
$ yarn add --dev nodemon
$ yarn add express express-favicon
# polyfill
$ yarn add --dev core-js regenerator-runtime
```

package.jsonは次のようになります。  
reactなどのパッケージはバックエンドでも使うためdevDependenciesに移行します。  

```
{
  "name": "learnreactjs",
  "version": "1.0.0",
  "repository": "https://github.com/teradonburi/learnReactJS.git",
  "author": "teradonburi <daikiterai@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "rm -rf public/dist && nodemon src/server/server.js",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@babel/cli": "^7.5.0",
    "@babel/core": "^7.5.4",
    "@babel/plugin-proposal-class-properties": "^7.5.0",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@loadable/babel-plugin": "^5.10.0",
    "@loadable/component": "^5.10.1",
    "@loadable/webpack-plugin": "^5.7.1",
    "axios": "^0.19.0",
    "babel-eslint": "^10.0.2",
    "babel-loader": "^8.0.6",
    "core-js": "^3.1.4",
    "eslint": "^6.0.1",
    "eslint-loader": "^2.2.1",
    "eslint-plugin-react": "^7.14.2",
    "formik": "^1.5.8",
    "nodemon": "^1.19.1",
    "redux-devtools": "^3.5.0",
    "redux-thunk": "^2.3.0",
    "regenerator-runtime": "^0.13.2",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.5",
    "webpack-dev-middleware": "^3.7.0",
    "webpack-hot-middleware": "^2.25.0"
    "webpack-node-externals": "^1.7.2",
    "yup": "^0.27.0"
  },
  "dependencies": {
    "@babel/node": "^7.5.0",
    "@babel/preset-env": "^7.5.4",
    "@babel/preset-react": "^7.0.0",
    "@loadable/server": "^5.9.0",
    "@material-ui/core": "^4.2.0",
    "@material-ui/icons": "^4.2.1",
    "express": "^4.17.1",
    "express-favicon": "^2.0.1",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-redux": "^7.1.0",
    "react-router-dom": "^5.0.1",
    "redux": "^4.0.4",
  }
}
```

# eslintの修正
バックエンドのlintも行うため、.eslintrc.jsのenvにnodejs用の設定も追加します。  

```.eslintrc.js
  'env': {
    'browser': true, // ブラウザ
    'es6': true, // ES6
    'node': true // NodeJS
  },
```

# ビルド設定の修正  
SSRをするにはサーバもReactのJSXをトランスパイルする必要があるためbabel.server.jsを追加します。  

```babel.server.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: false,
        targets: { node: 'current' },
        modules: 'commonjs',
      },
    ],
    '@babel/preset-react',
  ],
}
```

nodemonはサーバ側のスクリプトが修正変更されたときに自動的にサーバを再起動してくれます。  
nodemonの起動設定をnodemon.jsonに記述します。  
babel-nodeにてnode実行前にbabelトランスパイルを行い、nodejsサーバを起動します。 
`--inspect`フラグをつけることでサーバ側スクリプトのデバックをChromeのDevToolsから行うことが出来ます。  

```nodemon.json
{
  "ignore": ["client", "public"],
  "execMap": {
    "js": "babel-node --config-file ./babel.server.js --inspect"
  }
}
```