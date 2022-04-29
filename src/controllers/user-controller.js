const { Group, Post } = require("../db")
const UserService = require('../service/user-service')
const ApiError = require('../errors/api-error')
const getRefreshToken = require('../helpers/getValidRefreshToken')
const getStaffIndex = require('../helpers/getStaffIndex')

class UserController {
    //complete
    async like (req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {post} = req.body
            const postData = await Post.findById(post)
            const groupData = await Group.findById(postData.group)
            if(groupData) {
                const userIndex = getStaffIndex(groupData, refreshToken.id)
                if(userIndex != -1) {
                    if(groupData.restricted[userIndex].status == 'ban') {
                        return next(ApiError.BadRequest(`You have restricted access with this group`)) 
                    }
                }
            }
            if(!postData) {
                return next(ApiError.BadRequest(`This post does not exist`))
            }

            if(postData.like.includes(refreshToken.id) == true) {
                const index = postData.like.indexOf()
                postData.like.splice(index, 1)
                await postData.save()
                return res.json("Like successfully deleted")
            }

            if(postData.dislike.includes(refreshToken.id) == true) {
                const index = postData.dislike.indexOf()
                postData.dislike.splice(index, 1)
                await postData.save()
            }

            postData.like.push(refreshToken.id)
            await postData.save()
            return res.json("You have successfully liked")
        } catch (error) {
            next(error)
        }
    }
    //complete
    async dislike (req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {post} = req.body
            const postData = await Post.findById(post)
            const groupData = await Group.findById(postData.group)
            if(groupData) {
                const userIndex = getStaffIndex(groupData, refreshToken.id)
                if(userIndex != -1) {
                    if(groupData.restricted[userIndex].status == 'ban') {
                        return next(ApiError.BadRequest(`You have restricted access with this group`)) 
                    }
                }
            }
            if(!postData) {
                return next(ApiError.BadRequest(`This post does not exist`))
            }

            if(postData.dislike.includes(refreshToken.id) == true) {
                const index = postData.dislike.indexOf()
                postData.dislike.splice(index, 1)
                await postData.save()
                return res.json("Dislike successfully removed")
            }

            if(postData.like.includes(refreshToken.id) == true) {
                const index = postData.dislike.indexOf()
                postData.like.splice(index, 1)
                await postData.save()
            }

            postData.dislike.push(refreshToken.id)
            await postData.save()
            return res.json("You have successfully disliked")
        } catch (error) {
            next(error)
        }
    }
    //complete
    async subscription (req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {group, user} = req.body
            const groupData = await Group.findById(group)
            if(groupData) {
                const userIndex = getStaffIndex(groupData, refreshToken.id)
                if(userIndex != -1) {
                    if(groupData.restricted[userIndex].status == 'ban') {
                        return next(ApiError.BadRequest(`You have restricted access with this group`)) 
                    }
                }
            }
            if(group){
            const subscriptionData = await UserService.subscriptionGroup(group, refreshToken)
            return res.json(subscriptionData)
            }

            if(user){
                const subscriptionData = await UserService.subscriptionUser(user, refreshToken)
                return res.json(subscriptionData)
            }
            
            return next(ApiError.BadRequest(`Input Error`))
                

            
        } catch (error) {
            next(error)
        }
    }
    async comment (req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {post, comment} = req.body
            const postData = await Post.findById(post)
            const groupData = await Group.findById(postData.group)
            if(groupData) {
                const userIndex = getStaffIndex(groupData, refreshToken.id)
                if(userIndex != -1) {
                    return next(ApiError.BadRequest(`You have restricted access with this group`))
                }
            }
            
            if(!postData) {
                return next(ApiError.BadRequest(`This post does not exist`))
            }

            if(!comment) {
                return next(ApiError.BadRequest(`Comment not specified`))
            }
            const id = refreshToken.id
            postData.comment.push({id, comment})
            postData.save()
            return res.json(postData)

        } catch (error) {
            next(error)
        }
    }
}

module.exports = new UserController()