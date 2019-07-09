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

// 今回はrenderしかないのでStateless Functional Componentでも書ける

/*
export default (inject, message) => {
  return (WrappedComponent) => {
    // Stateless Functinal Component
    return (props) => {
      console.log(message)
      return  <WrappedComponent {...props} inject={inject} />
    }
  }
}

*/



