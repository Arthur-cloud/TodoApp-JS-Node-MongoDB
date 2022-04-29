const res = require("express/lib/response")
const { Group, User } = require("../db")
const ApiError = require('../errors/api-error')
const getRefreshToken = require('../helpers/getValidRefreshToken')
const GroupService = require('../service/group-service')
const getStaffIndex = require('../helpers/getStaffIndex')


class GroupController {
    async create(req, res, next) {
        try {
            const {group} = req.body
            const refreshToken = getRefreshToken(req)
            const candidatGroup = await Group.findOne({name: group})

            if(candidatGroup) {
                return next(ApiError.BadRequest(`This group: ${candidatGroup.id} already exists`))
            }

            const groupData = await Group.create({name: group, admin: refreshToken.id})
            res.json(groupData)

        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const {group} = req.body
            const refreshToken = getRefreshToken(req)
            const candidatGroup = await Group.findOne({group})

            if(!candidatGroup) {
                return next(ApiError.BadRequest(`No such group exists`))
            }
            if(candidatGroup.admin != refreshToken.id) {
                return next(ApiError.BadRequest(`You are not the author of this group`))
            }

            const groupData = await Group.deleteOne({group})
            return res.json(groupData)
        } catch (error) {
            next(error)
        }
    }

    async edit(req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {group, edit} = req.body
            const candidatGroup = await Group.findById(group)

            if(!candidatGroup) {
                return next(ApiError.BadRequest(`No such group exist`))
            }
            if(candidatGroup.admin != refreshToken.id) {
                return next(ApiError.BadRequest(`You are not part of this group`))
            }

            const groupData = await Group.updateOne({name: edit})
            return res.json(groupData)

        } catch (error) {
            next(error)
        }
    }

    async staffManagement(req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {group, user, userRole} = req.body

            const candidatUser = await User.findById(user)
            const candidatGroup = await Group.findById(group)   
            const userIndex = getStaffIndex(candidatGroup.staff, user)

            if(!candidatGroup) {
                return next(ApiError.BadRequest(`No such group exists`))
            }
            if(candidatGroup.admin != refreshToken.id) {
                return next(ApiError.BadRequest(`You are not the author of this group`))
            }
            if(!candidatUser) {
                return next(ApiError.BadRequest(`This user does not exist`))
            }

            if(!userRole) {
                GroupService.deleteRole(candidatGroup, userIndex)
                return res.json("The user was successfully removed from staff members")
            }
            if(candidatGroup.staff[userIndex] != -1) {
                GroupService.editRole(candidatGroup, user, userRole, userIndex)
                return res.json(`You have changed user ${user} position to - ${userRole}`)
            }
            
            GroupService.addRole(candidatGroup, user, userRole)
            return res.json(`User: ${user} got a new position - ${userRole}`)

        } catch (error) {
            next(error)
        }
    }

    async followerManagement(req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {group, user, status} = req.body
            const candidatUser = await User.findById(refreshToken.id)
            const candidatGroup = await Group.findById(group)
            const userIndex = getStaffIndex(candidatGroup.restricted, user)

            if(!candidatUser) {
                return next(ApiError.BadRequest(`This user does not exist`))
            }
            if(!candidatGroup) {
                return next(ApiError.BadRequest(`No such group exists`))
            }
            if(candidatGroup.admin != refreshToken.id) {
                const staffIndex = getStaffIndex(candidatGroup, user)
                if(candidatGroup.staff[staffIndex].userRole == undefined) {
                    return next(ApiError.BadRequest(`You are not part of this group`))

                }
                if(candidatGroup.staff[staffIndex].userRole != 'moderator') {
                    return next(ApiError.BadRequest(`You do not have permission for this feature`))
                }
            }

            if(status == "ban") {
                 GroupService.ban(candidatGroup, user, userIndex)
                return res.json("Status has been successfully updated")
            }
            if(status == "mute") {
                GroupService.mute(candidatGroup, user, userIndex)
                return res.json("Status has been successfully updated")
            }
            res.json("Input Error")
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new GroupController()