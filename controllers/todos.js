'use strict'

const todo_services = require('./../services/todos')


exports.createEmptyTodo = async function(req,res){
    todo_services.createEmptyTodo(req,res);
}; 
