const Users = require('./Users')

class UserController {

    getUsers(req, res) {
        let userList = Users.getAll();
        res.send(userList);
    }

    getUser(req, res) {
        console.log(req.body);
        let user = Users.get(req.body.id);
        console.log(user);
        res.send(user);
    }
}

module.exports = UserController;