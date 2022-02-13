module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    // from old project. Likely for typeorm
    plugins: ['@babel/transform-react-jsx-source', 'babel-plugin-transform-typescript-metadata'],
  }
}
