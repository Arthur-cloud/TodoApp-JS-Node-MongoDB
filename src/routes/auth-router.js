const controller = require('../controllers/auth-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-activate-middleware')

module.exports = (app) => {
app.post('/auth/registration', 
    body('email').isEmail(),
    body('password').isLength({min:3, max:32}),
    controller.registration)

app.post('/auth/login', controller.login)

app.post('/auth/logout', controller.logout)

app.post('/auth/activate', authMiddleware ,controller.activate)

app.get('/auth/refresh', controller.refresh)

app.get('/auth/users', authMiddleware , controller.users)
}

