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
  const rets1 = await Promise.all([
    asyncFuncPromise('d'),
    asyncFuncPromise('e'),
    asyncFuncPromise('f')
  ])
  console.log(rets1)

  // 非同期処理を順次実行待ち
  const rets2 = await [{func: asyncFuncPromise, param: 'g'}, {func: asyncFuncPromise, param: 'h'}]
    .reduce((promise, current) => {
      return promise.then(async (prev) => {
        return await current.func(current.param + ' ' + prev)
      })
    }, Promise.resolve(''))
  console.log(rets2)
}
testAwait()