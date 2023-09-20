'use strict' 

const app = require('./../index');
const request = require('supertest');
const pgObject = require('./../services/pg');
const users_service = require('./../services/users');
const todos_service = require('./../services/todos');

// Em produção voce possui duas diferenças primordiais: 
// 1 - Voce naturalmente não enxerga ele pois ele estara na VPC
// 2 - Se voce quiser testar, de qualquer maneira terá que subir um DB local

const cleanDatabase = async function(){
    const pgClient = new pgObject();
    await pgClient.connect();
    await pgClient.query(`delete from users;`);
    await pgClient.end();
}

beforeAll( async ()=>{
  jest.clearAllMocks();
  jest.restoreAllMocks();
  await cleanDatabase();
});

afterAll ( async ()=>{
  jest.clearAllMocks();
  jest.restoreAllMocks();
  await cleanDatabase();
  
});    

afterEach(()=>{
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("#1 Tests route: GET /teste", () => {
    test("#1.1 Should return status 200 - OK", async () => {
      const response = await request(app).get('/teste');
      expect(response.statusCode).toBe(200);      
    });
    test("#1.2 Should respond with a HTML 'Teste' in h1", async () => {
      const response = await request(app).get('/teste');
      expect(response.text).toBe("<html><head></head><body><h1>Teste</h1></body></html>");
    });
});

describe("#2 Tests route: GET /asdsa", () => {
  test("Should return status 200 - OK", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.statusCode).toBe(200);      
  });
  test("#2.1 Should respond with a HTML 'Page Not Found' in h1", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.text).toBe("<html><head></head><body><h1>Page Not Found</h1></body></html>");
  });
});


describe("#3 Tests route: POST /users/newuser", ()=>{
  test("#3.1 Should return 201", async ()=>{
    const newUser = {
      name: "Gobinha bacana",
      email: "gobinha.bacana@snail.com",
      birth: "2023-12-10"
    };
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    //console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).not.toBe(undefined);
  });
  test("#3.2 Shouldnt accept email duplicate returning 409 status ", async ()=>{
    const newUser = {
      name: "Gobinha bacana",
      email: "gobinha.bacana@snail.com",
      birth: "2023-12-10"
    };
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(409);
  });
  test("#3.3 Should return 201", async ()=>{
    const newUser = {
      name: "Gobinha bacana2",
      email: "Gobinha2@gmail.com"
    };
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    //console.log(response.body);

    expect(response.statusCode).toBe(201);
  });
  test("#3.4 Should return 400", async ()=>{
    const newUser = {
      email: "gobinha.bacana2@snail.com"
    };
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  });
  test("#3.5 Server is down - returning 500", async ()=>{
    const newUser = {
      name: "Gobinha bacana3",
      email: "gobinha.bacana3@snail.com",
      birth: "2023-12-10"
    };

    jest.spyOn(users_service,"createEmptyUser").mockImplementation(()=>{
      const pgError = new Error("Server is Down");
      pgError.code = "ECONNREFUSED";
      throw pgError;
    })
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(500);
  });
});

// /todos/newtodo
describe("#5 Tests route: POST /todos/newtodo",()=>{
  test("#5.1 Send {email,name,description} receives http status 201", async ()=>{
    const userThere = {
        name:"Testenildo5",
        email:"teste5@snails.com",
        birth: null
    };

    const createdUser = await request(app)
                    .post('/users/newuser')
                    .send(userThere)
                    .set('Content-Type', 'application/json');
    //console.log(response.body);
    expect(createdUser.statusCode).toBe(201);
    expect(createdUser.body).not.toBe(undefined);

    const newTodo = {
        email:"teste5@snails.com",
        name:"Fazer Cafe para seu Teste de Integracao",
        description:"Isso eh uma descricao de Integracao"
    };

    const response = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);
  });

  test("#5.2 Send {email,name, todo_parent_id, description} receives http status 201", async ()=>{

    const newTodo = {
      email:"teste5@snails.com",
      name:"Task2",
      description:"Isso eh uma descricao de Integracao",
      completed:true  
    };

    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);

    const newTodo2 = {
      email:"teste5@snails.com",
      name:"Subtask - Fazer Cafe para seu Teste de Integracao ",
      todo_parent_id: response1.body.id,
      description:"Isso eh uma descricao de Integracao"   
    };

    const response2 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo2)
                  .set('Content-Type', 'application/json');
    expect(response2.statusCode).toBe(201);
  });


  test("#5.3 Send {name, description} receives http status 400", async ()=>{
    const newTodo = {
      name:"Fazer Cafe para seu Teste de Integracao 2 ",
      description:"Isso eh uma descricao de Integracao 2"
    };
    const response = await request(app)
                .post('/todos/newtodo')
                .send(newTodo)
                .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);

  });

  test("#5.4 Send {email, description} receives http status 400", async ()=>{
    const newTodo = {
      email:"teste5@snails.com",
      description:"Isso eh uma descricao de Integracao 2"
    };
    const response = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);

  });

  test("#5.5 Send {email,name} receives http status 201", async ()=>{
    const newTodo = {
      email:"teste5@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao 5.2",
    };

    const response = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);
  });

  test("#5.6 Send {email,name,description} with server down receives http status 500", async ()=>{
    jest.spyOn(todos_service,"createEmptyTodo").mockImplementation(()=>{
      const serverIsDown =  new Error("Server is Down");
      serverIsDown.code = "ECONNREFUSED";
      throw serverIsDown;
    });

    const newTodo = {
      email:"teste5@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao Down",
      description:"Isso eh uma descricao de Integracao Down"
    };

    const response = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(500);
  });
});

// // /todos/allTodos
// describe("#4 GET /todos/allTodos",()=>{
//   test("#4.1 GET [{name,description,todo_parent_id},...] also returning 200", async ()=>{
//     await cleanDatabase();
//     const userThere = {
//       name:"TestenildoIntegration",
//       email:"testeIntegration@snails.com",
//       birth: null
//     };
//     const createdUser = await request(app)
//                     .post('/users/newuser')
//                     .send(userThere)
//                     .set('Content-Type', 'application/json');
//     //console.log(response.body);
//     expect(createdUser.statusCode).toBe(201);
//     expect(createdUser.body).not.toBe(undefined);

//     const todo1 = {
//       email:"testeIntegration@snails.com",
//       name:"Fazer Cafe para seu Teste de Integracao",
//       description:"Isso eh uma descricao do teste de Integracao"
//     };
//     await todos_controller.createEmptyTodo(req,res);
//     expect(res.status).toBeCalledWith(201);

//     const todo2 = {
//       email:"testeIntegration@snails.com",
//       name:"Fazer Cafe para seu Teste de Integracao",
//       description:"Isso eh uma descricao do teste de Integracao"
//     };

//     const res2 = {};
//     res2.status = jest.fn().mockReturnValue(res2);
//     res2.send = jest.fn().mockReturnValue(res2);
//     await todos_controller.createEmptyTodo(req2,res2);
//     expect(res2.status).toBeCalledWith(201);

//     const response = await request(app)
//                     .get('/todos/allTodos')
//                     .send({skip:0,take:10})
//                     .set('Content-Type', 'application/json');

//     expect(response.statusCode).toBe(200);
//     expect(response.body[0].name).toBe("Fazer Cafe para seu Teste de Integracao");
//     expect(response.body[1].name).toBe("Fazer Cafe para seu Teste de Integracao2");
//   });
//   test("#4.2 GET [] also returning 200 - no data in the db", async ()=>{
//     jest.restoreAllMocks();
//     cleanDatabase();
//     const response = await request(app)
//                     .get('/todos/alltodos');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual([]);
//   });
// });
/*


// /todos/fromtodo
describe("#6 Tests 'findTasksFromTodoId' from todos controller with GET /todos/fromtodo",()=>{
  test("#6.1 Deletes all data, creates a user, creates a root todo, creates a task to that todo. Enters {id} and returns status 200", async ()=>{
    cleanDatabase();

    const userThere = await prisma.users.create({data:{
      name:"Testenildo6",
      email:"teste6@snails.com",
      birth: null
    }});

    const newTodo1 = {
        email:"teste6@snails.com",
        name:"Fazer Cafe para seu Teste de Integracao",
        description:"Isso eh uma descricao de Integracao"
    };
    const response = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo1)
                  .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);
    expect(response.body.id).not.toBe(undefined);

    const newTodo2 = {
      email:"teste6@snails.com",
      name:"Sub Task: Fazer Cafe para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao",
      todo_parent_id: response.body.id
    };
    const response2 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo2)
                  .set('Content-Type', 'application/json');
    expect(response2.statusCode).toBe(201);
    expect(response2.body.todo_parent_id).toBe(response.body.id);

    const responseFinal = await request(app)
                  .get('/todos/fromtodo')
                  .send({skip:0,take:10, id:response.body.id})
                  .set('Content-Type', 'application/json');
    expect(responseFinal.statusCode).toBe(200);
  });
  test("#6.2 Enters {} and returns status 400 and a empty []", async ()=>{
    const response = await request(app)
                            .get('/todos/fromtodo')
                            .send({})
                            .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  });
  test("#6.3 Enters {id:notKnown} and returns status 200 and a []", async ()=>{
    const responseFinal = await request(app)
                            .get('/todos/fromtodo')
                            .send({skip:0,take:10, id:Math.floor(Math.random()*1000)})
                            .set('Content-Type', 'application/json');
    expect(responseFinal.statusCode).toBe(200);
    expect(responseFinal.body).toEqual([]);
  });
  test("#6.4 Server is down returning 500", async ()=>{
    jest.spyOn(prisma.todos,"findMany").mockImplementation(()=>{
      throw new Prisma.PrismaClientInitializationError("Server is Down");
    });
    const responseFinal = await request(app)
                          .get('/todos/fromtodo')
                          .send({skip:0,take:10, id:Math.floor(Math.random()*1000)})
                          .set('Content-Type', 'application/json');
    expect(responseFinal.statusCode).toBe(500);
  });
});

// /todos/delete?id
describe("#7 DELETE todo /todos/delete?id=<>",()=>{

  test("#7.1 Enters /todos/delete?validID returning 202", async ()=>{
    cleanDatabase();

    const userThere = await prisma.users.create({data:{
      name:"Testenildo7",
      email:"teste7@snails.com",
      birth: null
    }});

    const newTodo = {
        email:"teste7@snails.com",
        name:"Fazer Cafe para seu Teste de Integracao",
        description:"Isso eh uma descricao de Integracao"
    };
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const response = await request(app)
                        .delete(`/todos/delete?id=${response1.body.id}`);
    expect(response.statusCode).toBe(202);
  });

  test("#7.2 Enters /todos/delete?InvalidID returnin 204", async ()=>{
    const response = await request(app)
                        .delete(`/todos/delete?id=${Math.floor(Math.random()*10000)}`);
    expect(response.statusCode).toBe(409);
  });

  test("#7.3 Server is down returning 500", async ()=>{
    jest.spyOn(prisma.todos,"delete").mockImplementation(()=>{
      throw new Prisma.PrismaClientInitializationError("Server is down");
    })
    const response = await request(app)
                    .delete(`/todos/delete?id=${Math.floor(Math.random()*10000)}`);
    expect(response.statusCode).toBe(500);
  });
});

describe("#8 PUT /todos/edit",()=>{
  test("#8.1 Receives {id,name,description,todo_parent_id,completed}, return 200 and test it by finding it in DB", async ()=>{
    cleanDatabase();

    await prisma.users.create({data:{
      name:"Testenildo8",
      email:"teste8@snails.com",
      birth: null
    }});

    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const newTodo2 = {
      email:"teste8@snails.com",
      name:"Ferver agua paraa o cafe de Integracao2",
      description:"Isso eh uma descricao subtask de Integracao",
      todo_parent_id: response1.body.id,
    }

    const response2 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo2)
                  .set('Content-Type', 'application/json');
    expect(response2.statusCode).toBe(201);
    expect(response2.body.id).not.toEqual(undefined);

    //console.log("response2.body: \n", response2.body);

    const editedTodo = {
      	id:response2.body.id, 
        name:"Essa tarefa foi editada por completo",
        description:"A descricao foi completamente editada",
        todo_parent_id:null,
        completed:true
    };

    const response3 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("response3.body: \n", response3.body);
    //console.log("editedTodo: \n", editedTodo);
    // FIM DO MISTERIO: o 205 PROIBE o envio de PAYLOAD
    // Por isso o express nao enviava o objeto
    expect(response3.statusCode).toBe(200);

    const responseFinal = await request(app)
                  .get('/todos/allTodos')
                  .send({skip:0,take:2})
                  .set('Content-Type', 'application/json');
    //console.log("responseFinal.body: \n", responseFinal.body);
    //console.log("editedTodo: \n", editedTodo);
    expect(responseFinal.statusCode).toBe(200);
    expect(responseFinal.body[1].id).toBe(editedTodo.id);
    expect(responseFinal.body[1].name).toBe(editedTodo.name);
    expect(responseFinal.body[1].description).toBe(editedTodo.description);
    expect(responseFinal.body[1].todo_parent_id).toBe(editedTodo.todo_parent_id);
    expect(responseFinal.body[1].completed).toBe(editedTodo.completed);
  });
  test("#8.2 Receives {id,name,completed} and return 200", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Pao para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com pao"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {
      id:response1.body.id, 
      name:"Essa tarefa foi editada por completo ~ ama pao",
      completed:true
    };
    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte2: ",response2.body);
    expect(response2.statusCode).toBe(200);

  });
  test("#8.3 Receives {id,name} and return 200", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Chocolate para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com chocolate"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {
      id:response1.body.id, 
      name:"Essa tarefa foi editada ~ ama chocolate",
    };
    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte3: ",response2.body);
    expect(response2.statusCode).toBe(200);

  });
  test("#8.3 Receives {strangeId,name} and return 409", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Chocolate para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com cogumelos"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {
      id:902, 
      name:"Essa tarefa foi editada ~ ama cogumelos",
    };
    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte3: ",response2.body);
    expect(response2.statusCode).toBe(409);
  });
  test("#8.4 Receives {id} and return 400", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Chocolate para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com cogumelos"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {
      id:response1.body.id
    };
    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte3: ",response2.body);
    expect(response2.statusCode).toBe(400);
  });
  test("#8.5 Receives {name} and return 400", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Bolo para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com Bolo"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {
      name: "Picar as abobrinhas"
    };
    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte3: ",response2.body);
    expect(response2.statusCode).toBe(400);
  });
  test("#8.6 Receives {} and return 400", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer Bolo para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com Bolo"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {};
    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte3: ",response2.body);
    expect(response2.statusCode).toBe(400);
  });
  test("#8.7 Server is down returning 500", async ()=>{
    const newTodo = {
      email:"teste8@snails.com",
      name:"Fazer churros para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao com chocolate"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const editedTodo = {
      id:response1.body.id, 
      name:"Essa tarefa foi editada ~ ama churros",
    };

    jest.spyOn(prisma.todos,"update").mockImplementation(()=>{
      throw new Prisma.PrismaClientInitializationError("Server is Down");
    });

    const response2 = await request(app)
                  .put('/todos/edit')
                  .send(editedTodo)
                  .set('Content-Type', 'application/json');
    //console.log("parte3: ",response2.body);
    expect(response2.statusCode).toBe(500);
  });
});

describe("#9 PATCH /todos/complete?id=",()=>{
  test("9.1 /todos/complete?id returning 200 and checks if it has been toggled", async ()=>{
    cleanDatabase();

    await prisma.users.create({data:{
      name:"Testenildo9",
      email:"teste9@snails.com",
      birth: null
    }});

    const newTodo = {
      email:"teste9@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const response2 = await request(app)
                  .patch(`/todos/complete?id=${response1.body.id}`)
                  .send();
    expect(response2.statusCode).toBe(200);


    const response3 = await request(app)
                  .get('/todos/allTodos')
                  .send({skip:0,take:1})
                  .set('Content-Type', 'application/json');
    expect(response3.statusCode).toBe(200);
    expect(response3.body[0].completed).toBe(true);

    const response4 = await request(app)
    .patch(`/todos/complete?id=${response1.body.id}`)
    .send();
    expect(response4.statusCode).toBe(200);

    const response5 = await request(app)
                  .get('/todos/allTodos')
                  .send({skip:0,take:1})
                  .set('Content-Type', 'application/json');
    expect(response5.statusCode).toBe(200);
    expect(response5.body[0].completed).toBe(false);
  });
  test("9.2 /todos/complete?invalidID returning 409", async ()=>{
    const newTodo = {
      email:"teste9@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    const response2 = await request(app)
                  .patch(`/todos/complete?id=909`)
                  .send();
    expect(response2.statusCode).toBe(409);
  });
  test("9.3 Server is down returning 500", async ()=>{
    const newTodo = {
      email:"teste9@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao",
      description:"Isso eh uma descricao de Integracao"
    }
    const response1 = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response1.statusCode).toBe(201);
    expect(response1.body.id).not.toEqual(undefined);

    jest.spyOn(prisma.todos,"findFirstOrThrow").mockImplementation(()=>{
      throw new Prisma.PrismaClientInitializationError("Server is down");
    });

    const response2 = await request(app)
                  .patch(`/todos/complete?id=${response1.body.id}`)
                  .send();
    expect(response2.statusCode).toBe(500);
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
*/