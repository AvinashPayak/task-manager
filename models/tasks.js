const db = require('../utils/database');

module.exports = class tasks {
    constructor(taskId,content, creationDate, priority, deadline, userId, checked){
        this.taskId = taskId;
        this.content = content;
        this.creationDate = creationDate;
        this.priority = priority;
        this.deadline = deadline;
        this.userId = userId;
        this.checked = checked;
    }

    save(){
        return db.execute('INSERT INTO tasks (content,creationDate,priority,deadline,userId, checked) VALUES(?,?,?,?,?,?)', [this.content, this.creationDate, this.priority, this.deadline, this.userId, this.checked]);
    }

    update(){
        return db.execute('UPDATE tasks SET content = ?, priority = ?, deadline = ?, checked = ? WHERE taskId = ?', [this.content, this.priority,this.deadline,this.checked, this.taskId]);
    }

    static delete(taskId){
        return db.execute('DELETE FROM tasks where taskId = ?', [taskId]);
    }
    static fetchAll(userId){
        return db.execute('SELECT * FROM tasks WHERE userId = ?',[userId]);
    }
};