'use strict' 

const app = require('./../index');
const request = require('supertest');
const todos_controller = require('./../controllers/todos');
const {Prisma} = require('@prisma/client');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();

require('dotenv').config({path:`${__dirname}/../.env-test`});
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTE;

// Em produção voce possui duas diferenças primordiais: 
// 1 - Voce naturalmente não enxerga ele pois ele estara na VPC
// 2 - Se voce quiser testar, de qualquer maneira terá que subir um DB local


beforeAll( async ()=>{
  await prisma.todos.deleteMany({where:{}});
  await prisma.users.deleteMany({where:{}});
});

afterAll ( async ()=>{
  await prisma.todos.deleteMany({where:{}});
  await prisma.users.deleteMany({where:{}});
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
    expect(response.statusCode).toBe(201);
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
    jest.spyOn(prisma.users,"create").mockImplementation(()=>{
      throw new Prisma.PrismaClientInitializationError;
    })
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(500);
  });
});

// /todos/allTodos
describe("#4 GET /todos/allTodos",()=>{
  test("#4.1 GET [{name,description,todo_parent_id},...] also returning 200", async ()=>{
    await prisma.todos.deleteMany({where:{}});
    await prisma.users.deleteMany({where:{}});
    const userThere = await prisma.users.create({data:{
      name:"TestenildoIntegration",
      email:"testeIntegration@snails.com",
      birth: null
    }});
    const req = {body:{
      email:"testeIntegration@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao",
      description:"Isso eh uma descricao do teste de Integracao"
    }};
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    await todos_controller.createEmptyTodo(req,res);
    expect(res.status).toBeCalledWith(201);
    const userThere2 = await prisma.users.create({data:{
      name:"TestenildoIntegration2",
      email:"testeIntegration2@snails.com",
      birth: null
    }});
    const req2 = {body:{
      email:"testeIntegration2@snails.com",
      name:"Fazer Cafe para seu Teste de Integracao2",
      description:"Isso eh uma descricao do teste de Integracao2"
    }};
    const res2 = {};
    res2.status = jest.fn().mockReturnValue(res2);
    res2.send = jest.fn().mockReturnValue(res2);
    await todos_controller.createEmptyTodo(req2,res2);
    expect(res2.status).toBeCalledWith(201);

    const response = await request(app)
                    .get('/todos/allTodos');

    expect(response.statusCode).toBe(200);
    expect(response.body[0].name).toBe("Fazer Cafe para seu Teste de Integracao");
    expect(response.body[1].name).toBe("Fazer Cafe para seu Teste de Integracao2");
  });
  test("#4.2 GET [] also returning 200 - no data in the db", async ()=>{
    jest.restoreAllMocks();
    await prisma.todos.deleteMany({where:{}});
    await prisma.users.deleteMany({where:{}});
    const response = await request(app)
                    .get('/todos/alltodos');
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

// /todos/newtodo
describe("#5 Tests route: POST /todos/newtodo",()=>{
  test("Send {email,name,description} receives http status 201", async ()=>{
    const userThere = await prisma.users.create({data:{
        name:"Testenildo5",
        email:"teste5@snails.com",
        birth: null
    }});
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

  test("Send {email,name, todo_parent_id, description} receives http status 201", async ()=>{
    const anyExistingTodo = await request(app)
                  .get('/todos/alltodos');
    expect(anyExistingTodo.statusCode).toBe(200);

    const newTodo = {
      email:"teste5@snails.com",
      name:"Subtask - Fazer Cafe para seu Teste de Integracao ",
      todo_parent_id: anyExistingTodo.body[0].id,
      description:"Isso eh uma descricao de Integracao"   
    };

    const response = await request(app)
                  .post('/todos/newtodo')
                  .send(newTodo)
                  .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(201);
  });


  test("Send {name, description} receives http status 400", async ()=>{
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

  test("Send {email, description} receives http status 400", async ()=>{
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

  test("Send {email,name} receives http status 201", async ()=>{
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

  test("Send {email,name,description} with server down receives http status 500", async ()=>{
    jest.spyOn(prisma.users,"findFirstOrThrow").mockImplementation(()=>{
      throw new Prisma.PrismaClientInitializationError("Server is Down");
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

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});