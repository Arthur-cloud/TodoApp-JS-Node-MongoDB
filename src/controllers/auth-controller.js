const {validationResult} = require('express-validator')
const userService = require('../service/user-service') 
const ApiError = require('../errors/api-error');
const getValidAccessToken = require('../helpers/getValidAccessToken');



class AuthController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token); 
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
        const validAccess = getValidAccessToken(req)
        const {code, adminCode} = req.body

        const activateUser = await userService.activate(validAccess, code, adminCode)
        // const userContent = await UserContent.create(userId: validAccess.id)

        res.json(activateUser)

        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)

        } catch (error) {
            next(error)
        }
    }
    async users(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController();