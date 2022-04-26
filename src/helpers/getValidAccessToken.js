const tokenService = require('../service/token-service')

module.exports = (req) => {
    const token = tokenService.getToken(req)
    const validToken = tokenService.validateAccessToken(token)
    return validToken
}