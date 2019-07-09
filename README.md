# ES6/7のおさらい

## 変数、３項演算子、論理演算子、変数文字列展開
let, constを使いましょう

```variable.js
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
```

NodeJSでランナー実行（ファイル指定）

```
$ node variable.js
```

## HTML上での実行  
scriptタグ内でJavaScriptは実行できます。  

```variable.html
<!DOCTYPE html>
<html>
  <head>
  <meta charset="UTF-8">
    <title>HTML5サンプル</title>
  </head>
  <body>
    <script type="text/javascript">
console.log('hoge')
    </script>
  </body>
</html>
```

ブラウザを開く

```
$ open variable.html
```


## 関数
アロー関数を使うと無名関数をより短くかけます。

```function.js
// ES5
var testES5 = function (param) {
  console.log(param)
};
testES5('ES5');

// ES6はアロー関数でも記述できる
const testES6 = (param) => {
  console.log(param)
}
testES6('ES6')

// ES6では関数にデフォルト引数を持たせられる
const init = {obj:'obj'}
const testES6Def = (arg = init) => {
  console.log(arg)
}
testES6Def()

// オブジェクト引数を展開済みで渡す
const testES6Obj = ({a,b}) => {
  console.log(a,b)
}
testES6Obj({a:'a',b:'b'})

// 一行でオブジェクトをreturnする書き方
const testES6RetObj = () => ({a: 'a param', b: 'b param'})
// これと同じ
// const testES6RetObj = () => {
//   return {a: 'a param', b: 'b param'}
// }

console.log(testES6RetObj())
```

NodeJSでランナー実行（ファイル指定）

```
$ node function.js
```

## クラス
class構文が使えるのでprototypeは覚える必要はありません。

```class.js
// ES5のクラス（prototype）
function classES5(){
  this.name = 'ES5';
}

classES5.prototype.method = function(){
  console.log(this.name);
}

var clsES5 = new classES5();
clsES5.method();


// ES6のクラス
class classES6 {
  
  constructor () {
    this.name = 'ES6'
  }

  method () {
    console.log(this.name)
  }

}

let clsES6 = new classES6()
clsES6.method()

// 継承
class childClass extends classES6 {
  
  method () {
    // 親のクラスのメソッドはsuper経由で呼ぶ
    super.method()
    console.log('ES6 child')
  }

}
clsES6 = new childClass()
clsES6.method()
```

NodeJSでランナー実行（ファイル指定）

```
$ node class.js
```

## 配列、オブジェクト列挙処理
この辺覚えておくと短く書ける上に処理がわかりやすいです。

```arrayobj.js
// よく使う配列操作
const arr = ['a','b','c']

// 指定の条件の要素のみを配列として取り出す
console.log(arr.filter(val => val === 'a'))
// 指定のセパレータで文字列に連結
console.log(arr.join(','))

const numbers = [1,2,3]
// 配列各要素に対して処理を行う（for）
console.log(numbers.map((val) => {return val * 2}))
// 上の省略形（ブロックを外すとreturnされる）
console.log(numbers.map((val) => val * 2))
// 配列の合計値
console.log(numbers.reduce((sum, current) => sum + current, 0))
// 配列の結合
console.log(arr.concat(numbers))


const obj = {o: 'o', b: 'b', j: 'j'}

// 配列のキーでループ
for (let key in arr) {
  const val = arr[key]
  console.log(val)
}

// 配列の値でループ（Object不可）
for (let val of arr) {
  console.log(val)
}

// オブジェクトのキーでループ
for (let key in obj) {
  const val = obj[key]
  console.log(val)
}

// 配列展開
const arr2 = ['d', 'e', 'f']
console.log([...arr, ...arr2])

// オブジェクト展開
const ect = {e: 'e', c: 'c', t: 't'}
console.log({...obj, ...ect})

// オブジェクト変数代入で変数名がキーとなる
const object = 'val'
console.log({object})

// オブジェクトの一部重複キーがある場合は後勝ちで値上書き
const obj1 = {a: 'a', b: 'b'}
const obj2 = {b: 'bb', c: 'c'}
console.log({...obj1, ...obj2})
```

NodeJSでランナー実行（ファイル指定）

```
$ node arrayobj.js
```

## 非同期処理
ES6でPromise、ES7でasync, awaitが使えます。  
これらを組み合わせると厄介なコールバック地獄がなくなり、スマートにかけます。  

```asyncawait.js
// 非同期処理だと実行順番が前後する
function asyncFunc(param) {
  // 非同期処理
  setTimeout(() => {
    console.log(param)
  },100)
}

// 順番が前後する例
function test() {
  console.log('1')
  // 非同期処理
  asyncFunc('2')
  console.log('3')
}
test()


// async awaitで同期待ちをする例(ES7)
function asyncFuncPromise(param) {
  return new Promise((resolve, reject) =>{
    setTimeout(() => {
      if (param === 'b') {
        // エラー時
        reject({data: 'err'})
        return
      }
      // 正常終了時
      resolve(param)
    },100)
  })
}

// awaitを使う関数はasync関数にする(ES7)
async function testAwait() {
  // 非同期処理をawaitで処理待ちする
  const ret1 = await asyncFuncPromise('a')
  console.log(ret1)
  // error時はcatchで補足した戻り値を取得
  const ret2 = await asyncFuncPromise('b').catch(err => err.data)
  console.log(ret2)
  // thenでさらに処理をつなげることもできる
  const ret3 = await asyncFuncPromise('c').then(data => data + 'c')
  console.log(ret3)

  // 並列実行待ち
  const rets = await Promise.all([
    asyncFuncPromise('d'),
    asyncFuncPromise('e'),
    asyncFuncPromise('f')
  ])
  console.log(rets)

  // 非同期処理を順次実行待ち(結果を受け取って次の非同期を呼び出す)
  const rets2 = await [{func: asyncFuncPromise, param: 'g'}, {func: asyncFuncPromise, param: 'h'}]
    .reduce((promise, current) => {
      return promise.then(async (prev) => {
        return await current.func(current.param + ' ' + prev)
      })
    }, Promise.resolve(''))
  console.log(rets2)
}
testAwait()
```

NodeJSでランナー実行（ファイル指定）

```
$ node asyncawait.js
```

## this
アロー関数は宣言時にbindしてしまう。  

```
/////////// 通常関数のthis ///////////

function test1() {
  this.param = 'test1'

  function printParam () {
    console.log(this.param) // このthisは呼び出され元のオブジェクト
  }

  let object1 = {
    param: 'object1',
    func: printParam
  }
  let object2 = {
    param: 'object2',
    func: printParam
  }

  object1.func()
  object2.func()
}
test1()

/////////// アロー関数のthis ///////////

function test2() {
  this.param = 'test2'

  // アロー関数式で宣言された関数は、宣言された時点で、thisを確定（＝束縛）してしまう
  let printParamArrow = () => {
    console.log(this.param) // test2のthis
  }

  let object3 = {
    param: 'object3',
    func: printParamArrow // object3のthisではない
  }
  let object4 = {
    param: 'object4',
    func: printParamArrow // object4のthisではない
  }

  object3.func()
  object4.func()
}
test2()

//////////// bindとアロー関数 ////////////////

class Component {

  constructor() {
    this.param = 'param'
    this.method2 = this.method2.bind(this) // method2をthis（クラス）にbindする
  }

  method1() {
    console.log(this) // 呼び出され元に影響してしまう
  }

  method2() {
    console.log(this) // method2はクラスのthisにbindされている
  }

  method3() {
    console.log(this)
  }

  render() {
    let call1 = this.method1
    call1()
    // Reactのイベントコールバックに使うパターン１(bind済み関数)
    let call2 = this.method2
    call2()
    // Reactのイベントコールバックに使うパターン２(アロー関数)
    let call3 = () => { this.method3() } // この場合アロー関数内のthisは宣言時にクラスにbindされる
    call3()
  }
}
let component = new Component
component.render()
```

NodeJSでランナー実行（ファイル指定）

```
$ node this.js
```