'use strict'

const {BadRequestError} = require('./errors');
const {PrismaClient, Prisma} = require('@prisma/client');
const prisma = new PrismaClient();


const validadeTodo = function(todo){
    if ((todo.user_id)&&(todo.name)){
        return todo
    }else{
        throw new BadRequestError("Minimum user properties is missing");
    }
}

const createEmptyTodo = async function(req,res){
    try{
        const todo = validadeTodo(req.body);
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