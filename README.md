# ミニマムなReactJS

ReactJSでDOMをレンダリングするには  

* ReactJS  
* React DOM  
* Babel Core

が必要です。  

```index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./react.min.js"></script>
  <script src="./react-dom.min.js"></script>
  <script src="./babel-core.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ReactDOM.render(
      <h1>Hello, world!</h1>,
      document.getElementById('root')
    )
  </script>
</body>
</html>
```

実際にレンダリングしているのはReactDOM.renderの部分です。  
ここで注目すべき点はscriptタグ内なのに  
`<h1>`タグ（DOM）が記述されている点です。  
実際に実行される際にはBabelにて次のようなJSに変換されます。  
上記のような一見DOMが混じったようなJSの記法をJSXと呼びます。  
JSXはBebelによってJSのソースコードに変換(トランスパイル)されます。  
実際にどのように変換されるか見てみましょう。  
  
ReactDOM.render部分のみのtest.jsxを作成します。  

```test.jsx
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
)
```

BabelとJSXトランスパイラをインストールします。  

```
# package.json作成
$ yarn init -y
# BabelコマンドとBabelのJSXトランスパイラプラグインをダウンロード
$ yarn add @babel/cli @babel/core @babel/plugin-transform-react-jsx
```

次のコマンドでtest.jsxに対して直接Babelのトランスパイルを行うとcompile.jsが出力されます。

```
$ npx babel --plugins @babel/transform-react-jsx test.jsx
ReactDOM.render(React.createElement(
  'h1',
  null,
  'Hello, world!'
), document.getElementById('root'));
```

実態はReactJSのReact.createElementメソッドにて動的にDOMが生成されていることがわかります。