import {
  banMember,
  softbanMember,
  kickMember,
  warnMember,
  getWarnings,
  deleteWarning,
  clearWarnings
} from '@moderation/commands'

export const GroupConfig = {
  name: 'moderation',
  description: 'Commands to help you moderate your server'
}

export const ban = {
  config: {
    description: 'Ban a member from your server',
    usage: 'ban (member) (reason)',
    example: "ban xdarkzlightz 'get yeeted'",
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ],
    cooldown: {
      amount: 2,
      timer: 1
    }
  },
  run: banMember
}
export const softban = {
  config: {
    description: 'Removes messages from a member by banning and unbanning them',
    usage: 'softban (member) (reason)',
    example: "softban xdarkzlightz 7d 'get yeeted fam'",
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'number',
        name: 'days'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ],
    cooldown: {
      amount: 2,
      timer: 1
    }
  },
  run: softbanMember
}

export const kick = {
  config: {
    description: 'kick a member from your server',
    usage: 'kick (member) (reason)',
    example: 'kick xdarkzlightz ya bad',
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ],
    cooldown: {
      amount: 2,
      timer: 1
    }
  },
  run: kickMember
}

export const warn = {
  config: {
    description: 'Warn a member in your server',
    usage: 'warn (member) (reason)',
    example: 'warn xdarkzlightz posting bad memes',
    args: [
      {
        type: 'member',
        name: 'member'
      },
      {
        type: 'string',
        name: 'reason'
      }
    ],
    cooldown: {
      amount: 2,
      timer: 1
    },
    flags: [
      {
        name: 'list',
        aliases: ['l'],
        description: 'Get a list of warnings for a member',
        usage: 'warn --l',
        arg: { type: 'member' },
        run: getWarnings
      },
      {
        name: 'remove',
        aliases: ['r'],
        description: 'Get a remove a warning from a member using the warning #',
        usage: 'warn --r',
        args: [
          { type: 'member', name: 'member' },
          {
            type: 'number',
            name: 'number'
          }
        ],
        run: deleteWarning
      },
      {
        name: 'clear',
        aliases: ['c'],
        description: 'Clear a members warnings',
        usage: 'warn --c',
        arg: { type: 'member' },
        run: clearWarnings
      }
    ]
  },
  run: warnMember
}

// export const logs = {
//   config: {
//     description: 'Get the moderation logs for a member',
//     usage: 'logs (member)',
//     example: 'logs xdarkzlightz'
//   },
//   run: run
// }

// export const nick = {
//   config: {
//     description:
//       'Lets you nickname a member, if they were to leave the server and join back this nickname will be applied to them',
//     usage: 'nick (xdarkzlightz) (nickname)',
//     example: 'nick xdarkzlightz nerd'
//   },
//   run: run
// }