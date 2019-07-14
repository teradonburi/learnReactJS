
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: false,
        targets: { node: 'current' },
        modules: 'commonjs',
      },
    ],
    '@babel/preset-react',
  ],
}


