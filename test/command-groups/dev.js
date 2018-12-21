module.exports.group_config = {
  name: 'dev',
  devOnly: true
}

// Creates a new command, a config is optional and one will be created
// If a config is not provided then the eclipse engine will create one and then set the name/group properties to the function and group id
// The 'this' keyword gets bound to eclipse-engine/commands/command.js
module.exports.test = {
  config: {
    rating: 1
  },
  run () {
    console.log(this.name)
  }
}

module.exports.oof = {
  config: {
    args: [
      {
        name: 'user',
        type: 'user'
      }
    ],
    rating: 0
  },
  run (ctx, { user }) {
    ctx.say(`${user.username}`)
  }
}
