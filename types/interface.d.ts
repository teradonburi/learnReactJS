export namespace com {
  // namespaceを入れ子にできるcom.modelのようにアクセスする
  export namespace model {
    export interface TestModel {
      title: string;
      age: number;
    }
  }
}