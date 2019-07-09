
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
