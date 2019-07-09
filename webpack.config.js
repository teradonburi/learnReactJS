module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  mode: 'development',
  entry: './index.jsx', // エントリポイントのjsxファイル
  output: {
    filename: 'bundle.js' // 出力するファイル
  },
  module: {
    rules: [{
      test: /\.jsx?$/, // 拡張子がjsxで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      use: {
        loader: 'babel-loader', // babel-loaderを使って変換する
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'], // env presetでES2015向けに変換、react presetでReactのJSX文法を変換
        }
      }
    }]
  }
}