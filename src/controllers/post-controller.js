const getRefreshToken = require('../helpers/getValidRefreshToken')
const ApiError = require('../errors/api-error')
const { Group, Post } = require('../db')
const PostService = require('../service/post-service')
const getStaffIndex = require('../helpers/getStaffIndex')

class PostController {
    //complete
    async create(req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {message, group} = req.body
            const groupCandidat = await Group.findById(group)
            if(group) {
            const postData = PostService.createPostGroup(message, groupCandidat, refreshToken)
            return res.json(postData)
            }
            const postData = PostService.createPostUser(message, refreshToken)
            return res.json(postData)

        } catch (error) {
           next(error) 
        }
    }  
    //complete
    async update(req, res, next) {
        try {
           const refreshToken = getRefreshToken(req)
           const {post, message, group} = req.body
           const postCandidat = await Post.findById(post)
           const groupData = await Group.findById(postCandidat.group)

           if(!postCandidat) {
                return next(ApiError.BadRequest('This post does not exist'))
           }
           if(group) {
               if(!groupData) {
                return next(ApiError.BadRequest('No such group exists'))
               }
               if(groupData.admin != refreshToken.id || groupData.staff[staffIndex].userRole !== 'editor') {
                return next(ApiError.BadRequest('You are not part of this group'))
               }
               const postData = await Post.updateOne({id: post}, {message: message})
               return res.json(postData)
           }
           if(postCandidat.author != refreshToken.id) {
               return next(ApiError.BadRequest('You are not the author of this post'))
           }
           const postData = await Post.updateOne({id: post}, {message: message})
           return res.json(postData)

        } catch (error) {
           next(error) 
        }
    }
    //complete
    async remove(req, res, next) {
        try {
            const refreshToken = getRefreshToken(req)
            const {post, group} = req.body
            const postCandidat = await Post.findById(post)
            const groupCandidat = await Group.findById(group)
 
            if(!postCandidat) {
                 return next(ApiError.BadRequest('This post does not exist'))
            }
            if(group) {
                const staffIndex = getStaffIndex(groupCandidat, refreshToken.id)
                if(!groupCandidat) {
                 return next(ApiError.BadRequest('No such group exists'))
                }
                if(groupCandidat.admin != refreshToken.id || groupCandidat.staff[staffIndex].userRole != 'editor') {
                 return next(ApiError.BadRequest('You are not part of this group'))
                }
                if(postCandidat.group != group) {
                    return next(ApiError.BadRequest('This post does not exist in this group'))
                }
                const postData = await Post.deleteOne({post})
                return res.json(postData)
            }
            if(postCandidat.author != refreshToken.id) {
                return next(ApiError.BadRequest('You are not the author of this post'))
            }
            const postData = await Post.deleteOne({post})
            return res.json(postData)
        } catch (error) {
           next(error) 
        }
    }
    //complete
    async get(req, res, next) {
        try {
            const {post} = req.body

            const postCandidat = await Post.findById(post)
            if(!postCandidat) {
             return next(ApiError.BadRequest('This post does not exist'))
            }

            return res.json(postCandidat)
            
        } catch (error) {
           next(error) 
        }
    }
}

module.exports = new PostController()

