'use strict'

const {BadRequestError} = require('./errors');
const {Prisma} = require('@prisma/client');
const prismaSingleton = require('./prisma');
const prisma = prismaSingleton();


const validateTodo = function(todo){
    if ((todo.user_id)&&(todo.name)){
        return todo
    }else{
        throw new BadRequestError("Minimum user properties is missing");
    }
}

const createEmptyTodo = async function(req,res){
    try{
        const todo = validateTodo(req.body);
        await prisma.todos.create({data:{
            user_id: todo.user_id,
            todo_parent_id : todo.todo_parent_id || null,
            name : todo.name,
            description : todo.description || null,
            completed : todo.completed || false
            }});
        return res.status(201).send();
    }catch(e){
        if(e instanceof BadRequestError){
            return res.status(424).send(e);
        }else if(e instanceof Prisma.PrismaClientKnownRequestError){
            return res.status(409).send(e);
        }
        return res.status(500).send(e);
    }
}

module.exports = {
    createEmptyTodo
}