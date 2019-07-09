var a = 'グローバル変数'

// 関数
function test() {
  // ES6
  let b = '局所変数'
  // ES6
  const c = '定数'

  // 定数は途中代入不可
  //c = '代入エラー'

  // グローバル変数と局所変数はスコープが違う
  for (var i = 0;i < 1; ++i) {
    // なんか処理
  }
  for (let j = 0;j < 1; ++j) {
    // なんか処理
  }
  console.log(i) // varはforのブロックの範囲外でも参照できてしまう（Non Good）
  //console.log(j) // letはforのブロックの範囲外は参照不可
}
// 関数呼び出し
test()

const def = { test: 'default' }
const obj = {}

// ３項演算子
console.log(def.test === 'default' ? 'defaultです' : 'defaultじゃない')
// && 演算子(undefined, nullチェック)
obj.test && console.log('obj.testはundefinedなので実行されない')
// || 演算子(初期値代入)
const hoge = null
obj.test = hoge || def.test
console.log(obj.test) // hogeがnullなのでdef.testが代入（hogeがundefinedだとエラー）

// ES6だと変数をバッククォートで文字列に展開できる
const param = {obj:'param'}
const data = `${param.obj}を展開`
console.log(data)