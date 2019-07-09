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