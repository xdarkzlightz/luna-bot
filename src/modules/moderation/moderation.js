import { getMember } from '@eclipse/database'
import { removeFromArray } from '@eclipse/util/array'

export async function addWarning (member, reason, ctx) {
  const dbMember = getMember(member.id, ctx.db)

  dbMember.warnings.push({
    reason,
    modID: ctx.author.id.toString(),
    timestamp: ctx.msg.createdAt.toUTCString()
  })

  await ctx.db.save()
}

export async function removeWarning (member, number, db) {
  const dbMember = getMember(member.id, db)

  const warning = dbMember.warnings[number - 1]
  if (!warning) return false

  removeFromArray(dbMember.warnings, warning)
  await db.save()

  return true
}

export async function removeAllWarnings (member, db) {
  const dbMember = getMember(member.id, db)

  if (!dbMember.warnings.length) return false

  dbMember.warnings = []

  await db.save()

  return true
}