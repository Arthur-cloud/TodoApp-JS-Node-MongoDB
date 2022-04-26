const config = require('../../config')
const { Group, User } = require("../../db")
const ApiError = require('../../errors/api-error')
const getStaffIndex = require('../../helpers/getStaffIndex')



class GroupService {
    async addRole(group, user, userRole) {
        const index = config.role.indexOf(userRole)
        if(index < 0) {
            throw ApiError.BadRequest(`Такого название для персонала не существует`)
        }
        group.staff.push({user, userRole})
        group.save()
    }

    async deleteRole(group, userIndex) {
        if(userIndex = -1) {
            throw ApiError.BadRequest(`Данный пользователь не являеться членом команды`)
        }
        group.staff.splice(userIndex, 1)
        await group.save()
    }

    async editRole(group, user, userRole, userIndex) {
        const index = config.role.indexOf(userRole)
        if(index < 0) {
            throw ApiError.BadRequest(`Такого название для персонала не существует`)
        }

        group.staff.splice(userIndex, 1)
        group.staff.push({user: user, userRole: userRole})
        await group.save()
    }
    async ban(group, user, userIndex) {
        if(userIndex != -1) {
            if(group.restricted[userIndex].status !== undefined) {
                if(group.restricted[userIndex].status == 'mute') {
                    group.restricted.splice(userIndex, 1)
                    group.restricted.push({user: user, status: 'ban'})
                    await group.save()
                    return group
                }
            }
            group.restricted.splice(userIndex, 1)
            await group.save()
            return group
            }

        group.restricted.push({user: user, status: 'mute'})
        await group.save()
        return group
    }

    async mute(group, user, userIndex) {
        if(userIndex != -1) {
            if(group.restricted[userIndex].status !== undefined) {
                if(group.restricted[userIndex].status == 'ban') {
                    group.restricted.splice(userIndex, 1)
                    group.restricted.push({user: user, status: 'mute'})
                    await group.save()
                    return group
                }
            }
            group.restricted.splice(userIndex, 1)
            await group.save()
            return group
            }

        group.restricted.push({user: user, status: 'mute'})
        await group.save()
        return group

    }
}


module.exports = new GroupService()