import { RichEmbed } from 'discord.js'

// Select colours that get used often
const colours = {
  success: 0x57e69,
  error: 0xdb435d
}

// Images that get used often
const images = {
  checkmark:
    'https://image.ibb.co/ioKmvz/kisspng-check-mark-tick-clip-art-tick-5aac0430469033-9237016715212227042891.png',
  x:
    'https://image.ibb.co/bvNgAz/kisspng-computer-icons-free-content-clip-art-red-x-png-5ab1910a3f3a03-969308161521586442259.png'
}

// Export colours and images
const _colours = colours
export { _colours as colours }
const _images = images
export { _images as images }

/**
 * Embeds an success message
 * @param  {String} message The message you want to embed
 * @return {discord.js embed}         Embedded message
 */
export function success (message) {
  const embed = new RichEmbed()
    .setAuthor(message, images.checkmark)
    .setColor(colours.success)
  return embed
}

/**
 * Embeds an error message
 * @param  {String}           type     The type of message you want to embed
 * @param  {String}           message  The message you want to embed
 * @param  {Array}            values   An array of values that are used as options
 * @return {discord.js Embeds}         Discord.js embed object
 */
export function error (msg, settings = {}) {
  const embed = new RichEmbed().setAuthor(msg, images.x).setColor(colours.error)

  if (settings.options) {
    embed.addField('Valid options', settings.options.join(' '))
  }

  return embed
}

export function createCommandHelp (ctx, embed) {
  const cmd = ctx.cmd

  let prefix = ctx.prefix
  if (cmd.group.parent) prefix += cmd.group.name + ' '

  let aliases = ''
  if (cmd.aliases) {
    aliases = `(${cmd.aliases.join(', ')})`
  }
  embed.setAuthor(`${cmd.name} ${aliases} - ${cmd.description}`)
  embed.setDescription(
    `Group: *${cmd.group.name}*\nUsage: *${prefix}${
      cmd.usage
    }*\nExample: *${prefix}${cmd.example ? cmd.example : cmd.usage}*`
  )

  if (cmd.args) {
    let args = ''
    cmd.args.forEach(arg => {
      let options = '\n\n'
      if (arg.options) {
        options = `\nOptions: *${arg.options.join(', --')}*`
      }
      args += `${arg.name}\nType: *${arg.type}*\nDescription: *${
        arg.description
      }*${options}`
    })
    embed.addField('Arguments', args)
  }

  if (cmd.command.config.flags) {
    let flags = ''
    cmd.command.config.flags.forEach(flag => {
      if (flag.devonly) return
      let flagAliases = ''
      if (flag.aliases) {
        flagAliases = `(--${flag.aliases.join(', --')})`
      }
      flags += `--${flag.name} ${flagAliases}\nDescription: *${
        flag.description
      }*\nUsage: *${ctx.prefix}${flag.usage}*\nExample: *${ctx.prefix}${
        flag.example ? flag.example : flag.usage
      }*\n\n`
    })
    embed.addField('flags', flags)
  }
}

export function createGroupHelp (prefix, group, embed) {
  let aliases = ''
  if (group.aliases) {
    aliases = `(${group.aliases.join(', ')})`
  }

  embed.setAuthor(`${group.name} ${aliases} - ${group.description}`)

  let commands = ''
  group.commands.forEach(cmd => {
    let aliases = ''
    if (cmd.aliases) {
      aliases = `(${cmd.aliases.join(', ')})`
    }
    commands += `**${cmd.name} ${aliases}** - ${cmd.description}\n`
  })

  embed.addField('commands', commands)
  embed.setFooter(`${prefix}command --h to see more info on a command`)
}

export async function createJoinEmbed (client, embed) {
  const app = await client.fetchApplication()

  embed.setAuthor('Thanks for inviting me!', client.user.avatarURL)
  embed.setDescription(
    `I'm a multi-purpose discord bot created by ${
      app.owner.tag
    }. Right now I can play uno and get stuff from reddit! in the ` +
      `future I'll have more commands though!\nTo get started please create a server config with ${
        client.prefix
      }config, from there you can set a custom prefix with ${
        client.prefix
      }config --set-prefix (prefix)\n` +
      `If you need additional help run the help command ${client.prefix}help`
  )

  embed.addField(
    'Invites',
    `[Support Server](${client.supportServer})\n[Bot Invite](${
      client.botInvite
    })`
  )
}
