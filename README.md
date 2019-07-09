# HOC(High Order Component)について
Higher Order Componentとは、他のコンポーネントをWrapするReactコンポーネントのことです。  
Wrapすることで外部からパラメータを付与したりします。  
[ReactのHigher Order Components詳解 : 実装の2つのパターンと、親Componentとの比較](http://postd.cc/react-higher-order-components-in-depth/)  

Logger.jsxを次のように実装します。

```
import React from 'react'

// 引数
export default (inject, message) => {
  // WrapするReact Component引数
  return (WrappedComponent) => {
    // 処理をフックする
    return class extends React.Component {

      render (){
        console.log(message)
        // propsにinject属性追加
        return  <WrappedComponent {...this.props} inject={inject} />
      }
    }
  }
}
```

App.jsxを次のように実装します。

```
import React from 'react'
import Logger from './Logger.jsx'

class App extends React.Component {

  render () {
    return (
      <div>{this.props.inject}</div>
    )
  }
}

// HOCでAppコンポーネントをWrapする
export default Logger('Hello World!', 'render log')(App)
```

以下でビルド

```
$ npx webpack --watch
```

実行時にはAppコンポーネントのpropsにはinjectは存在しないのに  
Logger経由でpropsに追加されています。  
このように、HOCを使うことで元のコンポーネントに手を加えることなく、  
propsを追加したり、処理を追加したりできます。  


# 補足(Stateless Functional ComponentのHOC)
今回のようにrender部分しかHOCしていない場合はStateless Functional ComponentでHOCを書けます。  

```
import React from 'react'

// 今回はrenderしかないのでStateless Functional Componentでも書ける
export default (inject, message) => {
  return (WrappedComponent) => {
    // Stateless Functinal Component
    return (props) => {
      console.log(message)
      return  <WrappedComponent {...props} inject={inject} />
    }
  }
}
```