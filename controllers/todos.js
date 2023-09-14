'use strict'

const todo_services = require('./../services/todos');
const users_services = require('./../services/users');
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
        const userRequested = await users_services.getUserByEmail(newTodo.email);
        const todo = {
            user_id: userRequested.id,
            name: newTodo.name,
            todo_parent_id: newTodo.todo_parent_id || null,
            description: newTodo.description || null
        };
        const todoCreated = await todo_services.createEmptyTodo(todo);
        res.status(201).send(todoCreated);
    }catch(e){
        res.status(ErrorHandler(e)).send(e);   
    }
}; 

exports.findAllTodos = async function(req,res){
    try{
        const paginationSettings = req.body;
        const todos = await todo_services.findAllTodos(paginationSettings);    
        res.status(200).send(todos);    
    }catch(e){
        res.status(ErrorHandler(e)).send(e);
    }
};

exports.findTasksFromTodoId = async function(req,res){
    try{
        const searchData = req.body;
        const todos = await todo_services.findTasksFromTodoId(searchData);
        res.status(200).send(todos);
    }catch(e){
        res.status(ErrorHandler(e)).send(e);
    }
}

function validateDeleteTodoFromID(id){
    if(typeof id ==='number'){
        return id;
    }else{
        throw new BadRequestError("Id possui tipagem estranha");
    }
};

exports.deleteTodoFromID = async function(req,res){
    try{
        const id = validateDeleteTodoFromID(+req.query.id);
        const response = await todo_services.deleteTodoFromID(id);
        res.status(202).send(response);
    }catch(e){
        res.status(ErrorHandler(e)).send(e);
    }
};

exports.updateEntireTodoFromID = async function(req,res){
    try{
        const toEdit = req.body;
        const response = await todo_services.updateEntireTodoFromID(toEdit);
        res.status(205).send(response);
        // Como o status 205 proibe payload, ele vai enviar um ""
        // Se eu so dou um "send()" ele envia um objeto vazio bugadasso {} e quebra tudo 0-0
    }catch(err){
        res.status(ErrorHandler(err)).send(err);
    }
}