const Users = require('../models/users');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.putSignup = (req,res,next)=>{
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    Users.auth(email)
    .then(([result])=>{
        if(result.length != 0){
            res.status(205);
            throw Error('email already exists');
        }
        return bcrypt.hash(password, 12)
    })
    .then((hashedPassword)=>{
        const user = new Users(null,email,name,hashedPassword);
        return user.save()
    })
    .then((result)=>{
        res.status(200).json({message: 'user created successfully'});
    })
    .catch(err => {
        console.log(err);
    }) 
}

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let user;
    Users.auth(email).then(([result])=>{
        if(result.length == 0) {
            const error = new Error('email not found!');
            error.status = 401;
            throw error;
        }
        user = result[0];
        return bcrypt.compare(password,result[0].password);
    })
    .then((isEqual)=>{
        if(!isEqual){
            const error = new Error('Wrong password');
            error.status = 401;
            throw error;
        }
        else {
            const token = jwt.sign({email: email, userId: user.usersId}, 'secrettokenkey',{expiresIn: '1h'});
            res.status(200).json({token: token, userId: user.usersId});
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(401).json({message: err})
    })
}
