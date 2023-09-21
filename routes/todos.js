'use strict'

const express = require('express');
const router = express.Router();
const todos_controller = require('./../controllers/todos');

router.post('/newtodo',todos_controller.createEmptyTodo);
router.get('/alltodos',todos_controller.findAllTodos);
router.post('/fromtodo',todos_controller.findTasksFromTodoId);
router.delete('/delete',todos_controller.deleteTodoFromID);
router.put('/edit',todos_controller.updateEntireTodoFromID);
router.patch('/complete',todos_controller.toggleTodoFromID);

module.exports = router;