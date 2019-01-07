export const GroupConfig = {
  name: 'dev',
  devOnly: true,
  beforeEach (ctx) {
    return ctx.author.username
  },
  description:
    'Developer group, all developer commands essential to the bot goes here'
}

export const test = {
  config: {
    aliases: ['t'],
    rating: 0,
    flags: [
      {
        name: 'test',
        run: async ctx => {
          ctx.say('Ran successfully')
        },
        aliases: ['t'],
        description: 'This is just flag',
        usage: 'test --test'
      }
    ],
    args: [
      {
        name: 'testArg',
        type: 'string',
        options: ['test'],
        description: 'Just a test argument'
      }
    ],
    description: 'This is just a test command',
    usage: 'test'
  },
  run (ctx) {
    ctx.say(ctx.beforeEachVal)
  }
}