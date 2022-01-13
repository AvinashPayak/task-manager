const express = require('express');

const tasksController = require('../controllers/tasks');
const isAuth = require('../middleware/is-auth');
const router = express.Router();


router.post('/task', tasksController.createTask);
router.delete('/task',tasksController.deleteTask);
router.put('/task', tasksController.editTask);
router.get('/tasks',isAuth, tasksController.getTasks);

module.exports = router;