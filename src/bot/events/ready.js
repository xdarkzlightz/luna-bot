import migrate from '../migrations/1.4'

module.exports = async client => {
  client.logger.info(
    `[xluna]: Bot ready on ${client.guilds.size} guilds, ${
      client.users.size
    } total members`
  )

  client.user.setActivity(
    `${client.prefix}help | In ${client.guilds.size} servers!`
  )

  await client.db.updateGuilds(migrate)
}
