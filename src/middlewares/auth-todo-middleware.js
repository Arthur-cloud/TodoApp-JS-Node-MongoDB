const ApiError = require('../errors/api-error')
const tokenService = require('../service/token-service')

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const refreshToken = authorizationHeader.split(' ')[1]
        if(!refreshToken) {
            return next(ApiError.UnauthorizedError())
        } 

        const userData = tokenService.validateRefreshToken(refreshToken)
        if(!userData) {
            return next(ApiError.UnauthorizedError())
        }
        const isActivated = userData.isActivated
        if(isActivated == false) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (error) {
        return next(ApiError.UnauthorizedError())
    }
}