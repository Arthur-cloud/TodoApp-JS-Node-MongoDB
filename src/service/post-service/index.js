const { Group, Post } = require('../../db')
const getStaffIndex = require('../../helpers/getStaffIndex')
const ApiError = require('../../errors/api-error')


class PostService {
    async createPostGroup(message, group, refreshToken) {

        const staffIndex = getStaffIndex(group, refreshToken.id)

        if(group.admin != refreshToken.id || group.staff[staffIndex].userRole !== 'editor') {
            throw ApiError.BadRequest('Вы не являетесь персоналом данной группы')
        }

        const postData = await Post.create({message: message, group: group, author: refreshToken.id})
        return postData
    }

    async createPostUser(message, refreshToken) {
        const postData = await Post.create({message: message, author: refreshToken.id})
        return postData 
    }
}

module.exports = new PostService()