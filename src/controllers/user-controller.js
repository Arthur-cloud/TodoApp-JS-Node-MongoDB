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
                        return next(ApiError.BadRequest(`У вас ограниченый доступ с данной группой`)) 
                    }
                }
            }
            if(!postData) {
                return next(ApiError.BadRequest(`Такого поста не существует`))
            }

            if(postData.like.includes(refreshToken.id) == true) {
                const index = postData.like.indexOf()
                postData.like.splice(index, 1)
                await postData.save()
                return res.json("Лайк успешно удалён")
            }

            if(postData.dislike.includes(refreshToken.id) == true) {
                const index = postData.dislike.indexOf()
                postData.dislike.splice(index, 1)
                await postData.save()
            }

            postData.like.push(refreshToken.id)
            await postData.save()
            return res.json("Вы успешно поставили лайк")
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
                        return next(ApiError.BadRequest(`У вас ограниченый доступ с данной группой`)) 
                    }
                }
            }
            if(!postData) {
                return next(ApiError.BadRequest(`Такого поста не существует`))
            }

            if(postData.dislike.includes(refreshToken.id) == true) {
                const index = postData.dislike.indexOf()
                postData.dislike.splice(index, 1)
                await postData.save()
                return res.json("Дизлайк успешно удалён")
            }

            if(postData.like.includes(refreshToken.id) == true) {
                const index = postData.dislike.indexOf()
                postData.like.splice(index, 1)
                await postData.save()
            }

            postData.dislike.push(refreshToken.id)
            await postData.save()
            return res.json("Вы успешно поставили дизлайк")
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
                        return next(ApiError.BadRequest(`У вас ограниченый доступ с данной группой`)) 
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
            
            return next(ApiError.BadRequest(`Ну ты явно где-то проебался чел`))
                

            
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
                    return next(ApiError.BadRequest(`У вас ограниченый доступ с данной группой`))
                }
            }
            
            if(!postData) {
                return next(ApiError.BadRequest(`Такого поста не существует`))
            }

            if(!comment) {
                return next(ApiError.BadRequest(`Коментарий не указан`))
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