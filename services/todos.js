'use strict'

const usersServices = require('./users')
const { BadRequestError } = require('./errors')
const PgObject = require('./pg')

const validateTodo = function (todo) {
  if ((typeof todo.user_email === 'string') && (typeof todo.name === 'string')) {
    return todo
  } else {
    throw new BadRequestError('Minimum user properties is missing')
  }
}

const createEmptyTodo = async function (newTodoReq) {
  const todo = validateTodo(newTodoReq)

  const userRequested = await usersServices.getUserByEmail(todo.user_email)

  const newTodo = {
    user_id: `${userRequested.id}`,
    todo_parent_id: todo.todo_parent_id ? `${todo.todo_parent_id}` : 'NULL',
    name: `'${todo.name}'`,
    description: todo.description ? `'${todo.description}'` : 'NULL',
    completed: todo.completed ? `${todo.completed}` : 'FALSE'
  }

  const query = `;INSERT INTO todos(name, description, todo_parent_id, completed, user_id) 
    values (${newTodo.name},${newTodo.description},${newTodo.todo_parent_id},${newTodo.completed},${newTodo.user_id})
    returning *;`

  const pgClient = new PgObject()
  await pgClient.connect()
  const createdTodo = await pgClient.query(query)
  await pgClient.end()

  return createdTodo.rows[0]
}

const findAllTodos = async function (paginationSettings) {
  const query = `;SELECT todos.id as id,todos.name as name,
     todos.description as description, todos.completed as completed,
      todos.todo_parent_id as todo_parent_id FROM todos
       ORDER BY id ASC OFFSET ${paginationSettings.offset} LIMIT ${paginationSettings.limit};`

  const pgClient = new PgObject()
  await pgClient.connect()
  const allTodos = await pgClient.query(query)
  await pgClient.end()

  return allTodos.rows
}

function validateFindTasksFromTodoId (searchData) {
  if ((typeof searchData.id === 'number') && (typeof searchData.skip === 'number') && (typeof searchData.take === 'number')) {
    return searchData
  } else {
    throw new BadRequestError('searchData is missing')
  }
}

const findTasksFromTodoId = async function (searchData) {
  const verifiedSearchData = validateFindTasksFromTodoId(searchData)

  const query = `;SELECT todos.id as id,todos.name as name,
     todos.description as description, todos.completed as completed,
      todos.todo_parent_id as todo_parent_id FROM todos
      WHERE todos.todo_parent_id=${verifiedSearchData.id} 
        ORDER BY id ASC OFFSET ${verifiedSearchData.skip} LIMIT ${verifiedSearchData.take};`
  // console.log(query);
  const pgClient = new PgObject()
  await pgClient.connect()
  const allTodos = await pgClient.query(query)
  await pgClient.end()

  return allTodos.rows
}

const deleteTodoFromID = async function (idToRemove) {
  const query = `;DELETE FROM TODOS WHERE todos.id=${idToRemove} RETURNING *;`
  // console.log(query);

  const pgClient = new PgObject()
  await pgClient.connect()
  const deletedTodo = await pgClient.query(query)
  await pgClient.end()
  // console.log(deletedTodo.rows);
  if (deletedTodo.rows[0] === undefined) {
    throw new BadRequestError('Esse id não existe')
  }

  return deletedTodo.rows[0]
}

const updateEntireTodoFromID = async function (toEdit) {
  const id = toEdit.id ? toEdit.id : 'Error'
  const newName = toEdit.name ? `'${toEdit.name}'` : 'Error'
  const newDescription = toEdit.description ? `,description='${toEdit.description}'` : ',description= NULL'
  const newTodoParentId = toEdit.todo_parent_id ? `,todo_parent_id= ${todo_parent_id}` : ',todo_parent_id= NULL'
  const completedStatus = toEdit.completed ? `,completed = ${toEdit.completed ? 'TRUE' : 'FALSE'}` : ''

  const query = `;UPDATE todos 
    SET name=${newName} ${newDescription} ${completedStatus} ${newTodoParentId}
     WHERE todos.id=${id};`
  // console.log(query);

  const pgClient = new PgObject()
  await pgClient.connect()
  const editedTodo = await pgClient.query(query)
  await pgClient.end()

  return editedTodo.rows[0]
}

const validateNumberType = function (idTodoObj) {
  if (typeof idTodoObj === 'number') {
    return idTodoObj
  } else {
    throw new BadRequestError('Precisa ser do tipo numerico')
  }
}

const toggleTodoFromID = async function (idTodoObj) {
  const idTodo = validateNumberType(idTodoObj)

  const query1 = `;SELECT * FROM todos
     WHERE todos.id=${idTodoObj};`
  // console.log("query1",query1);

  const pgClient = new PgObject()
  await pgClient.connect()
  const todo = await pgClient.query(query1)
  await pgClient.end()

  const toggle = !todo.rows[0].completed

  const query2 = `;UPDATE todos 
    SET completed=${toggle ? 'TRUE' : 'FALSE'}
     WHERE todos.id=${idTodoObj} RETURNING *;`

  // console.log("query2",query2);

  const pgClient2 = new PgObject()
  await pgClient2.connect()
  const editedTodo = await pgClient2.query(query2)
  await pgClient2.end()

  // console.log("existingTodo",existingTodo);
  return editedTodo
}

module.exports = {
  toggleTodoFromID,
  updateEntireTodoFromID,
  deleteTodoFromID,
  findTasksFromTodoId,
  findAllTodos,
  createEmptyTodo
}
