const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./utils/database');

const tasksRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/auth',authRoutes);
app.use('/', tasksRoutes);

db.execute("CREATE TABLE IF NOT EXISTS users (usersId int NOT NULL AUTO_INCREMENT, email varchar(100) NOT NULL, password varchar(100) NOT NULL,name varchar(100) NOT NULL,PRIMARY KEY (usersId),UNIQUE KEY usersId_UNIQUE (usersId),UNIQUE KEY email_UNIQUE (email))")
.then((result)=>{
    return db.execute("CREATE TABLE IF NOT EXISTS tasks (taskId int unsigned NOT NULL AUTO_INCREMENT,content varchar(450) NOT NULL,creationDate datetime NOT NULL,priority int NOT NULL,deadline datetime NOT NULL,userId int DEFAULT NULL,checked int NOT NULL,PRIMARY KEY (taskId),UNIQUE KEY idTasks_UNIQUE (taskId),KEY userId (userId),CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users (usersId)) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;")
})
.then((result)=>{
    console.log("Database connected");
    app.listen(8080);
})
.catch(err=>{
    console.log(err);
})
