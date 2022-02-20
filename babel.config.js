module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Added module-resolver array for some resolving typescript bug via stackoverflow (forgot)
      ['module-resolver', { extensions: ['.tsx', '.ts', '.js', '.json'] }],
      '@babel/transform-react-jsx-source',
      'babel-plugin-transform-typescript-metadata',
      'react-native-reanimated/plugin'
    ]
  }
}
