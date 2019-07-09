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
