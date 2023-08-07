'use strict'

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createEmptyTodo = async function(todo){
    try{
        await prisma.todos.create({data:{
            user_id: todo.user_id,
            todo_parent_id : todo.todo_parent_id || null,
            name : todo.name,
            description : todo.description || null,
            completed : todo.completed || false
            }});
    }catch(e){
        return e.code;
    }
}

module.exports = {
    createEmptyTodo
}