const authMiddleware = require('../middlewares/auth-todo-middleware')
const controller = require('../controllers/user-controller')

module.exports = (app) => {
    
app.post('/user/like', authMiddleware ,controller.like)

app.post('/user/dislike', authMiddleware ,controller.dislike)

app.post('/user/subscription', authMiddleware ,controller.subscription)

app.post('/user/comment', authMiddleware ,controller.comment)

}
