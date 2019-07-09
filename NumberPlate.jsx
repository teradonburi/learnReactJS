import React from 'react'

// Stateless Functional Component
// renderのみが実装されたReact ComponentでReactライブラリをimportすることで自動的にComponentとして判別してくれる
// 通常のReact Componentと違いライフサイクルのコールバックのオーバヘッドがないため、軽量
const NumberPlate = (props) => {
  return <span style={{ color: '#eeeeee' }}>{props.children}</span>
}

export default NumberPlate

// 処理自体はこれと同じ
// export default class NumberPlate extends React.Component {
//   render (props) {
//     return <span style={{ color: '#eeeeee' }}>{props.children}</span>
//   }
// }
