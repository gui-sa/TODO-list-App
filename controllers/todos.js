'use strict'

const todo_services = require('./../services/todos');
const {ErrorHandler, BadRequestError} = require('./../services/errors');
const pgObject = require('../services/pg');

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
        const todo = {
            user_email: newTodo.email,
            name: newTodo.name,
            todo_parent_id: newTodo.todo_parent_id,
            description: newTodo.description,
            completed : newTodo.completed 
        };
        const todoCreated = await todo_services.createEmptyTodo(todo);
        res.status(201).send(todoCreated);
    }catch(e){
        res.status(ErrorHandler(e)).send(e);   
    }
}; 

exports.findAllTodos = async function(req,res){
    try{
        const paginationSettings = req.query;
        const todos = await todo_services.findAllTodos(paginationSettings);    
        res.status(200).send(todos);    
    }catch(e){
        res.status(ErrorHandler(e)).send(e);
    }
};

exports.findTasksFromTodoId = async function(req,res){
    try{
        const searchData = {};
        searchData.id = req.body.id?+req.body.id:"Error";
        searchData.skip = req.query.offset?+req.query.offset:"Error";
        searchData.take = req.query.limit?+req.query.limit:"Error";
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

const validatEdit = function(body){
    if (body.id && (body.name || body.description || body.completed || body.todo_parent_id)){
        return body;
    }else{
        throw new BadRequestError("Voce deve editar algo");
    }
};

exports.updateEntireTodoFromID = async function(req,res){
    try{
        const toEdit = validatEdit(req.body);
        const response = await todo_services.updateEntireTodoFromID(toEdit);
        res.status(200).send(response);
        // Como o status 205 proibe payload, ele vai enviar um ""
        // Se eu so dou um "send()" ele envia um objeto vazio bugadasso {} e quebra tudo 0-0
    }catch(err){
        res.status(ErrorHandler(err)).send(err);
    }
}

exports.toggleTodoFromID = async function(req,res){
    try{
        const idToToggle = req.query.id;
        const response = await todo_services.toggleTodoFromID(+idToToggle);
        res.status(200).send(response);
    }catch(e){
        res.status(ErrorHandler(e)).send(e);
    }
};