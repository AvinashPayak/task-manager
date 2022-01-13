const db = require('../utils/database');

module.exports = class user {
    constructor(userId,email, name, password){
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    save(){
        return db.execute('INSERT INTO users (email,name,password) VALUES(?,?,?)', [this.email, this.name, this.password]);
    }

    static auth(email){
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }
}; 