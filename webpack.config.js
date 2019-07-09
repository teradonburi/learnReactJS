module.exports = {
  mode: 'development', // 開発モード
  devtool: 'inline-source-map', // ソースマップファイル追加 
  entry: './index.jsx', // エントリポイントのjsxファイル
  output: {
    filename: 'bundle.js' // 出力するファイル
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/, // 拡張子がjsかjsxで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      use: {
        loader: 'babel-loader', // babel-loaderを使って変換する
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }], // 追加
          ], 
        }
      }
    }]
  }
}