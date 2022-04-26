const authMiddleware = require('../middlewares/auth-todo-middleware')
const controller = require('../controllers/post-controller')

module.exports = (app) => {
app.post('/post/create', authMiddleware ,controller.create)

app.patch('/post/update', authMiddleware ,controller.update)

app.delete('/post/remove', authMiddleware ,controller.remove)

app.get('/post/get', authMiddleware ,controller.get)
}
