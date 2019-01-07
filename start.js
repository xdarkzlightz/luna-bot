require('@babel/register')({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true
        }
      }
    ]
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@eclipse/core': './src/eclipse-engine/core/core.js',
          '@eclipse/command': './src/eclipse-engine/command/command.js',
          '@eclipse/database': './src/eclipse-engine/database/database.js',
          '@eclipse': './src/eclipse-engine/'
        }
      }
    ]
  ]
})

module.exports = require('./src/bot.js')