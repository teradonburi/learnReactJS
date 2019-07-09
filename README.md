# 環境構築

NodeJSインストール  
まずバージョン管理用のNodeJSツールをインストールします。  
このバージョン管理ツール経由でNodeJSをインストールをすると  
後々NodeJSがアップグレードした場合でも切り替えが楽です。  
今回は8.6.0のNodeJSをインストールします。  


* Mac OSX: [Nodebrew](https://github.com/hokaccha/nodebrew)

Nodebrewダウンロード

```
curl -L git.io/nodebrew | perl - setup
```

.bash_profileに環境変数パスを通す

```.bash_profile
export PATH=$HOME/.nodebrew/current/bin:$PATH
```

.bash_prodileを適用

```
$ source ~/.bash_profile
```

NodeJSインストール

```
$ nodebrew install-binary v10.15.3
$ nodebrew use v10.15.3
$ node -v
```

エディタは個人的に[Visual Studio Code](https://code.visualstudio.com/)がおすすめ  
VSCodeをお使いの人はついでに[VSCodeで爆速コーディング環境を構築する(主にReactJS向け設定)](https://qiita.com/teradonburi/items/c4cbd7dd5b4810e1a3a9)も読むと幸せになれるかも  


# npmについて
NodeJS付属のnpmというパッケージ管理ツールを使うとパッケージをまとめて管理できます。  
パッケージ管理用のpackage.jsonファイルを作成します。  

```
$ npm init -y
```

次のコマンドで使いたいパッケージをインストールすることができます。

```
$ npm install --save (パッケージ名)

# 開発用としてインストールする(Babelなどでトランスパイルするパッケージはこちら)
$ npm install --save-dev (パッケージ名)
```

package.jsonに記述された依存パッケージを  
次のコマンドでまとめてインストールすることができます。  
(gitにnode_modulesフォルダを管理する必要はありません)  

```
$ npm install
```

もしくは後発の[Yarn](https://yarnpkg.com/lang/en/)というパッケージ管理ツールでもインストールできます。

```
# homebrew インストール
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# yarn インストール
$ brew install yarn --without-node

# npm initと等価
$ yarn init

# npm installと等価
$ yarn

# npm install --save (パッケージ名)と等価
$ yarn add (パッケージ名)

# npm install --save-dev (パッケージ名)と等価
# yarn add --dev (パッケージ名)
```

ライブラリとnodejs v10以降との互換性でBuffer周りの警告が出てインストール出来ない場合があります。  
その場合は`--ignore-engines`オプションをつけることで回避できます。  

```
# yarn インストールの場合
$ yarn --ignore-engines
# yarn addの場合
$ yarn add (パッケージ名) --ignore-engines
```

npmコマンドとyarnコマンドの比較はこちら  
[yarnチートシート](https://qiita.com/morrr/items/558bf64cd619ebdacd3d)
