'use strict'

const users_services = require('./users');
const {BadRequestError} = require('./errors');
const pgObject = require('./pg');

const validateTodo = function(todo){
    if ((typeof todo.user_email === 'string')&&(typeof todo.name === 'string')){
        return todo;
    }else{
        throw new BadRequestError("Minimum user properties is missing");
    }
}

const createEmptyTodo = async function(newTodoReq){
    const todo = validateTodo(newTodoReq);

    const userRequested = await users_services.getUserByEmail(todo.user_email);
    
    const newTodo = {
        user_id: `${userRequested.id}`,
        todo_parent_id :todo.todo_parent_id?`${todo.todo_parent_id}`:"NULL",
        name :`'${todo.name}'` ,
        description :todo.description?`'${todo.description}'`: "NULL",
        completed : todo.completed?`${todo.completed}`:"FALSE"
    };

    const query = `;INSERT INTO todos(name, description, todo_parent_id, completed, user_id) 
    values (${newTodo.name},${newTodo.description},${newTodo.todo_parent_id},${newTodo.completed},${newTodo.user_id})
    returning *;`

    const pgClient = new pgObject();
    await pgClient.connect();
    const createdTodo = await pgClient.query(query);
    await pgClient.end();

    return createdTodo.rows[0];
};

const findAllTodos = async function(paginationSettings){
    // return await prisma.todos.findMany({
    //     skip:paginationSettings.skip,
    //     take:paginationSettings.take ,
    //     orderBy: {
    //         id: 'asc'
    //     },
    //     select:{
    //         id:true,
    //         name:true,
    //         todo_parent_id:true,
    //         description:true,
    //         completed:true
    //     }
    // });
}

function validateFindTasksFromTodoId(searchData){
    // if((typeof searchData.id === 'number')&&(typeof searchData.skip === 'number')&&(typeof searchData.take === 'number')){
    //     return searchData;
    // }else{
    //     throw new BadRequestError("searchData is missing")
    // }
}

const findTasksFromTodoId = async function(searchData){
    // const verifiedSearchData = validateFindTasksFromTodoId(searchData);
    // return await prisma.todos.findMany({
    //     skip:verifiedSearchData.skip,
    //     take:verifiedSearchData.take ,
    //     orderBy: {
    //         id: 'asc'
    //     },
    //     select:{
    //         id:true,
    //         name:true,
    //         todo_parent_id:true,
    //         description:true,
    //         completed:true
    //     },
    //     where:{
    //         todo_parent_id:verifiedSearchData.id
    //     }
    // });
};


const deleteTodoFromID = async function(idToRemove){
    // return await prisma.todos.delete({
    //     where:{
    //         id:idToRemove
    //     }
    // });
};

const updateEntireTodoFromID = async function(toEdit){
    // return await prisma.todos.update({
    //     where:{ id: toEdit.id },
    //     data:{
    //         name: toEdit.name,
    //         todo_parent_id: toEdit.todo_parent_id,
    //         description: toEdit.description,
    //         completed: toEdit.completed
    //     },
    // });
};

const validateNumberType = function(idTodoObj){
    if(typeof idTodoObj === 'number'){
        return idTodoObj;
    }else{

        throw new BadRequestError("Precisa ser do tipo numerico")
    }
};

const toggleTodoFromID = async function(idTodoObj){
    // const idTodo = validateNumberType(idTodoObj);
    // const existingTodo = await prisma.todos.findFirstOrThrow({
    //     where:{ id: idTodo },
    //     select:{
    //         completed:true
    //     }
    // });
    // //console.log("existingTodo",existingTodo);
    // return await prisma.todos.update({
    //     where:{ id: idTodo },
    //     data:{
    //         completed: existingTodo.completed?false:true
    //     }
    // });
};

module.exports = {
    toggleTodoFromID,
    updateEntireTodoFromID,
    deleteTodoFromID,
    findTasksFromTodoId,
    findAllTodos,
    createEmptyTodo
}   
