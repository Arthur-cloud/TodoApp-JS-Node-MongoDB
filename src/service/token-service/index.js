const jwt = require('jsonwebtoken')
const config = require('../../config')
const {Token} = require("../../db")

class TokenService {
    generateAccessToken(payload) {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        return accessToken
    }
    generateRefreshToken(payload) {
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return refreshToken
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }
        const token = await Token.create({user: userId, refreshToken})
        return token


    }
    async removeToken(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken})
        return tokenData
    }
    async findToken(refreshToken) {
        const tokenData = await Token.findOne({refreshToken})
        return tokenData
    }
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, config.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, config.JWT_REFRESH_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }
    getToken(req) {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader.split(' ')[1]
        return token
    }

}

module.exports = new TokenService()