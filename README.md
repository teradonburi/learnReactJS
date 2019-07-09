# webpack + Babelでコンポーネントを作成する

webpackを使うことで複数のリソースファイルを１つにまとめることができます。  
さらにBabelと組み合わせることでJSXの変換に加えてブラウザではまだ未対応のimport文などが利用可能になります。  
これにより、JSファイルからJSファイルのモジュールを呼び出すような構成が可能になります。  
webpackでビルドするためにパッケージを追加します。  

```
$ yarn add --dev webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react react react-dom --ignore-engines
```

package.jsonは次のようになります。

```package.json
{
  "name": "learnreactjs",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/teradonburi/learnReactJS.git",
  "author": "teradonburi <daikiterai@gmail.com>",
  "license": "MIT",
  "scripts": {
    "webpack": "webpack --mode development"
  },
  "devDependencies": {
    "@babel/core": "^7.5.0",
    "@babel/preset-env": "^7.5.2",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.6",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "webpack": "^4.35.3",
    "webpack-cli": "^3.3.5"
  }
}
```

index.htmlを次のようにbundle.jsのみ読み込むように書き換えてください
（bundle.jsはwebpackでビルド後に生成されるファイル想定）
以降、index.htmlを書き換えることはほぼありません。

```index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
</head>
<body>
  <div id="root"></div>
  <script type='text/javascript' src="./dist/bundle.js" ></script>
</body>
</html>
```

Reactのコンポーネントを作成します。(App.js)  
ReactのコンポーネントはReact.Componentを継承することで作成します。  
renderメソッドでDOMを返却するようにします。  
export defaultで外部のJSからクラスをimportできるようにします。  

```App.js
import React from 'react'

export default class App extends React.Component {

  render () {
    return <h1>Hello, world!</h1>
  }

}
```

index.jsにて作成したReactコンポーネントをimportしてDOMをレンダリングします。  
ここで注目してほしいのはJSXにて<App />というDOMが指定できるようになっています。  
React DOMによって作成したReactコンポーネントは新しいDOMとして指定できるようになります。  
（DOMの振る舞いはReactコンポーネント内部でJSで記述する）  
最終的なレンダリングはReactコンポーネントのrenderメソッドにて返却されるDOMが描画されます。  

```index.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
```

webpack.config.jsにてbundle.jsを生成する設定を書きます。

```webpack.config.js
module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  mode: 'development',
  entry: './index.js', // エントリポイントのjsxファイル
  output: {
    filename: 'bundle.js' // 出力するファイル
  },
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      use: {
        loader: 'babel-loader', // babel-loaderを使って変換する
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'], // env presetでES2015向けに変換、react presetでReactのJSX文法を変換
        }
      }
    }]
  }
}
```

次のコマンドでindex.jsに付随するJSファイルをまとめてビルドして一つのbundle.jsとして出力することができます

```webpack.config.js
$ yarn webpack
Hash: 4abc329581564efc9932
Version: webpack 3.9.1
Time: 1408ms
Asset     Size        Chunks                Chunk Names
bundle.js  1.87 MB       0  [emitted]  [big]  main
  [14] ./index.js 168 bytes {0} [built]
  [27] ./App.js 214 bytes {0} [built]
    + 26 hidden modules
```

index.htmlを開くと表示されるはずです。

# ReactJSのデバッグ

## ソースファイル変更を検知して再ビルド

下記のコマンドでwebpackの監視モードにするとビルド対象のJSファイルの変更が保存されるとビルドされるようになります。（開発中は楽です。）

```
$ yarn webpack --watch
```

次のコマンドでも等価です。  

```
$ npx webpack --mode development --watch
// webpack.config.jsの設定を参照するのでmodeフラグは不要
$ npx webpack --watch
```


## コンポーネント単位のDOM把握

[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ja)（ChromeのReact開発用ブラウザアドオン）
を導入すると  
Reactのコンポーネント単位でDOMツリーが把握できます。  

## ブレークポイントをかける
  
bableでトランスパイルするとJSファイルはすべて１つのbundle.jsにまとめられてしまいます。  
ソースマップと呼ばれるファイルをブラウザに読み込ませることで  
元のJSソースファイルの情報をブラウザに認識させることができます。  
（これにより元のJSファイル単位でブレークポイントをかけられる）  
webpackのソースマップファイルを有効にすることで元の各JSファイルを単位でブレークポイントをかけれます。

```webpack.config.js
module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
}
```

また、ソースファイル中にdebugger文を挿入することで指定箇所にブレークポイントをかけれます。  
（本番環境では処理が止まってしまうので挿入しないように注意）  

```
debugger;
```


もっと詳しく知りたい人はこちら：[Intro to debugging ReactJS applications](https://medium.com/@baphemot/intro-to-debugging-reactjs-applications-67cf7a50b3dd)