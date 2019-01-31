import { handleRoleDelete } from '@modules/serverutil/events'

module.exports = (client, role) => {
  const db = client.db.guilds.get(role.guild.id)
  if (!db || db.config.logger) return

  handleRoleDelete(role, db)
}