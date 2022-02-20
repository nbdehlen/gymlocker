module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Added module-resolver array for some resolving typescript bug via github issues/stackoverflow (forgot)
      ['module-resolver', { extensions: ['.tsx', '.ts', '.js', '.json'] }],
      '@babel/transform-react-jsx-source',
      'babel-plugin-transform-typescript-metadata',
      // Reanimated needs to be listed last
      'react-native-reanimated/plugin'
    ]
  }
}
