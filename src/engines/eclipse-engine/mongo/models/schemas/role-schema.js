import { Schema as _Schema } from 'mongoose'

import GroupSchema from './group-schema'

const Schema = _Schema

const RoleSchema = new Schema({
  id: String,
  groups: [GroupSchema],
  mod: Boolean
})

export default RoleSchema