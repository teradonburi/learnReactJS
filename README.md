# loadable-componentsでdynamic importする(Code Spliting)
参考：[Code Splitting for React Router with Webpack and HMR](https://hackernoon.com/code-splitting-for-react-router-with-webpack-and-hmr-bb509968e86f)  


プロジェクトが大きくなってくるとwebpack.jsでコンパイルしたbundle.jsが肥大化します。  
bundle.jsが肥大化するとbundle.jsの読み込みに時間がかかってしまい、初回のページの表示が遅くなります（SPAの欠点）  
そこで[loadable-components](https://github.com/smooth-code/loadable-components)で非同期リソース読み込みを行います。  
  
@loadable/componentを追加します。  

```
$ yarn add --dev @loadable/components --ignore-engines
```

次のようにimportをラップして読み込みを行います。

```
import loadable from '@loadable/component'

const UserPage = loadable(() => import('./components/UserPage'))
```

## webpackでトランスパイル後のファイル名を指定のファイル名にする方法
上記のloadableでラップしたコンポーネントをwebpackでトランスパイルすると  
0.jsのようにファイル名がリネームされて出力されてしまいます。  
これを回避するためにWebpack 2.4.0以降でmagicコメントが使えます。  
参考：[How to use Webpack’s new “magic comment” feature with React Universal Component + SSR](https://medium.com/faceyspacey/how-to-use-webpacks-new-magic-comment-feature-with-react-universal-component-ssr-a38fd3e296a)  
webpackChunkNameのmagicコメントを指定することでwebpackでコンパイルされた後のファイル名を指定することができます。(App.js)  
また、Webpack 4.6.0以降でwebpackPrefetch、webpackPreloadのmagicコメントを指定するとlinkタグのprefetch、preloadと同等の効果があります。  
prefetch、preload等の先読みの技術は[この記事](https://webtan.impress.co.jp/e/2017/02/20/24816)が参考になります。  

```
const UserPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'userpage' */ './components/UserPage'))
const TodoPage = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'todopage' */ './components/TodoPage'))
const NotFound = loadable(() => import(/* webpackPrefetch: true, webpackChunkName: 'notfound' */ './components/NotFound'))
```

上記マジックコメントで指定すれば、webpackリリースビルド時に  
userpage.js、todopage.js、notfound.jsが出力されます。  
なお、複数コンポーネントがある場合は、magic commentのコンポーネント名は被ってはいけません。  

