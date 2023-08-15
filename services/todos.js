'use strict'

const {BadRequestError, DBProblemError} = require('./errors');
const prismaSingleton = require('./prisma');
const prisma = prismaSingleton();

const validateTodo = function(todo){
    if ((typeof todo.user_id === 'number')&&(typeof todo.name === 'string')){
        return todo;
    }else{
        throw new BadRequestError("Minimum user properties is missing");
    }
}

const createEmptyTodo = async function(newTodo){
    const todo = validateTodo(newTodo);
    await prisma.todos.create({data:{
        user_id: todo.user_id,
        todo_parent_id : todo.todo_parent_id || null,
        name : todo.name,
        description : todo.description || null,
        completed : todo.completed || false
        }});
};

const findAllTodos = async function(){
    return await prisma.todos.findMany({
        select:{
            name:true,
            todo_parent_id:true,
            description:true
        }
    });
}

module.exports = {
    findAllTodos,
    createEmptyTodo
}