const authMiddleware = require('../middlewares/auth-todo-middleware')
const controller = require('../controllers/group-controller')

module.exports = (app) => {
    
app.post('/group/create', authMiddleware ,controller.create)

app.post('/group/delete', authMiddleware ,controller.delete)

app.post('/group/edit', authMiddleware ,controller.edit)

app.post('/group/staffManagement', authMiddleware ,controller.staffManagement)

app.post('/group/followerManagement', authMiddleware, controller.followerManagement)

}
