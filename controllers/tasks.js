const Tasks = require('../models/tasks');
const { connect } = require('../routes/tasks');

exports.getTasks = (req, res, next) => {
    const userId = req.userId;
    Tasks.fetchAll(userId).then(([tasks, fieldData])=> {
        res.status(200).json({
            tasks: tasks
        })
    })
};

exports.createTask = (req, res, next) => {
    const content = req.body.task;
    const creationDate = new Date();
    const deadline = new Date(req.body.dueDate);
    creationDate.toISOString().slice(0, 19).replace('T', ' ');
    deadline.toISOString().slice(0, 19).replace('T', ' ');
    const priority = req.body.priority;
    const userId = req.body.userId;
    const checked = 0;
    const task = new Tasks(null, content, creationDate, priority, deadline, userId, checked);
    task.save().then(()=>{
        res.redirect('/tasks');
    }).catch(err=>{
        console.log(err);
    })
}

exports.editTask = (req,res,next) => {
    const content = req.body.task;
    const creationDate = new Date();
    const deadline = new Date(req.body.dueDate);
    creationDate.toISOString().slice(0, 19).replace('T', ' ');
    deadline.toISOString().slice(0, 19).replace('T', ' ');
    const priority = req.body.priority;
    const userId = req.body.userId;
    const taskId = req.body.taskId;
    const checked = req.body.checked == true?1:0;
    const task = new Tasks(taskId, content, creationDate, priority, deadline, userId, checked);
    task.update().then(()=>{
        res.json({message: 'updated successfully'});
    }).catch(err=>{
        console.log(err);
    })
}

exports.deleteTask = (req, res, next) => {
    const taskId = req.body.taskId;
    Tasks.delete(taskId).then(()=>{
        res.json({message:'deleted successfully'});
    });
}