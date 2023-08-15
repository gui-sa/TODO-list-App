'use strict'

const todo_services = require('./../services/todos');
const {ErrorHandler, BadRequestError} = require('./../services/errors');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();

// Nao eh necessario propagar o throw no javascript
const validateEmptyTodoDTO = function(todo){
    if((typeof todo.email === 'string')&&(typeof todo.name === 'string')){
        return todo;
    }else{
        throw new BadRequestError("Basic TODO params is missing");
    }
}

exports.createEmptyTodo = async function(req,res){
    try{
        const newTodo = validateEmptyTodoDTO(req.body);
        const userRequested = await prisma.users.findFirst({
            select:{id:true},
            where:{email:newTodo.email}
        });
        const todo = {
            user_id: userRequested.id,
            name: newTodo.name,
            description: newTodo.description || null
        };
        await todo_services.createEmptyTodo(todo);
        res.status(201).send();
    }catch(e){
        res.status(ErrorHandler(e)).send(e);   
    }
}; 

exports.findAllTodos = async function(req,res){
    try{
        const todos = await todo_services.findAllTodos();    
        res.status(200).send(todos);    
    }catch(e){
        res.status(500).send(e);
    }
};