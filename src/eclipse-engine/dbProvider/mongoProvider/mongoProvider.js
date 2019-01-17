import { Collection } from 'discord.js'
import mongoose from 'mongoose'

import { removeFromArray } from '@eclipse/util/array'
import Guild from './models/guild'
import MongoGuild from './types/guild'

class mongoProvider {
  constructor (dbString, client) {
    this.dbString = dbString
    this.client = client
    this.logger = client.logger

    // Cache of all guilds in the database
    // This is used so we don't have to make a lot of requests to the database
    this.guilds = new Collection()
  }

  async connect () {
    mongoose.set('debug', (collectionName, methodName, arg1, arg2) => {
      this.logger.debug(
        `[Mongoose]: ${collectionName}.${methodName}(${JSON.stringify(
          arg1
        )}, ${JSON.stringify(arg2)}`
      )
    })

    mongoose.connect(
      this.dbString,
      { useNewUrlParser: true }
    )
    mongoose.connection
      .once('open', () => this.logger.info('[Mongoose]: Database connected!'))
      .on('error', err => {
        this.logger.error(
          `Something went wrong: ${err}\n Call stack: ${err.stack}`
        )
      })
  }

  async init () {
    await this.connect()

    const guilds = await Guild.find({})

    guilds.forEach(guild => {
      this.guilds.set(guild.id, new MongoGuild(guild))
    })
  }

  async save (guild) {
    await guild.save()

    this.guilds.set(guild.id, new MongoGuild(guild))
  }

  async newGuild (ctx, rating) {
    const groups = this.createGroups(this.client.registry.groups, rating)
    const config = {
      prefix: ctx.client.prefix,
      rating: rating
    }

    const role = { id: ctx.guild.id, groups }

    const dbGuild = new Guild({
      id: ctx.guild.id,
      config,
      channels: [],
      roles: [role],
      members: []
    })

    await this.save(dbGuild)
  }

  async setPrefix (db, prefix) {
    db.data.config.prefix = prefix.replace(/\s+/g, '')
    this.save(db.data)
  }

  async clear (type, obj, ctx) {
    removeFromArray(ctx.guild.db.data[`${type}s`], obj.data)
    await this.save(ctx.guild.db.data)
  }

  commandEnabledForMember (ctx) {
    const { guild, cmd, member } = ctx

    const dbGuild = this.guilds.get(guild.id)
    if (!dbGuild) return

    let enabled
    const dbMember = dbGuild.members.get(member.id)
    if (dbMember) enabled = dbMember.commands.get(cmd.name).enabled
    if (enabled === undefined) enabled = this.enabledForRoles(ctx, dbGuild.roles)

    return enabled
  }

  enabledForRoles ({ member, cmd }, roles) {
    let roleEnabled
    roles.forEach(roleDB => {
      if (roleEnabled) return
      const memberRole = member.roles.get(roleDB.id)
      if (!memberRole) return

      const foundRole = roles.get(memberRole.id)
      const enabled = foundRole.commands.get(cmd.name).enabled
      if (enabled) roleEnabled = enabled
    })

    return roleEnabled
  }

  commandEnabledInChannel ({ channel, cmd }, channels) {
    const dbChannel = channels.get(channel.id)
    if (dbChannel === undefined) return

    const enabled = dbChannel.commands.get(cmd.name).enabled
    if (enabled) return true
    if (!enabled) return false
  }

  async updateCommand (type, ctx, arg, enable, db) {
    let dbType = db[`${type}s`].get(arg.id)
    if (!dbType) {
      db.data[`${type}s`].push({
        id: arg.id,
        groups: this.createGroups(db.rating)
      })
      await this.save(db.data)
      dbType = this.guilds.get(ctx.guild.id)[`${type}s`].get(arg.id)
    }

    if (dbType.commands.size === 0) {
      dbType.data.groups = this.createGroups(db.rating)
      await this.save(db.data)
      dbType = this.guilds.get(ctx.guild.id)[`${type}s`].get(arg.id)
    }

    const command = dbType.commands.get(ctx.cmd.name)
    command.enabled = enable

    await this.save(db.data)
  }

  async updateGroup (type, id, group, enable, db) {
    const dbType = db[`${type}s`].get(id)
    const dbGroup = dbType.groups.get(group.name)
    dbGroup.commands.forEach(cmd => (cmd.enabled = enable))

    await this.save(db.data)
  }

  createGroups (rating) {
    let groups = []
    this.client.registry.groups.forEach(group => {
      if (group.devOnly) return
      groups.push(group.createSchema(rating))
    })

    return groups
  }
}

export default mongoProvider
