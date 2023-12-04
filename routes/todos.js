'use strict'

const express = require('express')
const router = express.Router()
const todosController = require('./../controllers/todos')

router.post('/newtodo', todosController.createEmptyTodo)
router.get('/alltodos', todosController.findAllTodos)
router.post('/fromtodo', todosController.findTasksFromTodoId)
router.delete('/delete', todosController.deleteTodoFromID)
router.put('/edit', todosController.updateEntireTodoFromID)
router.patch('/complete', todosController.toggleTodoFromID)

module.exports = router
