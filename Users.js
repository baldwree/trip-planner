class Users {

    constructor(info) {
        if (info) {
            this.id = info.id;
            this.name = info.name;
            this.email = info.email;
        }
    }

    static get(userID) {
        return this.userlist.find((item) => item.id === userID);
    }

    static set(userinfo) {
        let index = this.userlist.findIndex((item) => item.id === userinfo.id);
        this.userlist[index] = userinfo;
    }

    static getAll() {
        return this.userlist;
    }

    static setAll(newlist) {
        this.userlist = newlist;
    }

}

Users.userlist = [{id: 0, name: "Reece", email: "baldwree@mail.gvsu.edu"}];

module.exports = Users;