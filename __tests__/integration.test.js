'use strict' 

const app = require('./../index');
const request = require('supertest');
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

describe("Tests route: GET /teste", () => {
    test("Should return status 200 - OK", async () => {
      const response = await request(app).get('/teste');
      expect(response.statusCode).toBe(200);      
    });
    test("Should respond with a HTML 'Teste' in h1", async () => {
      const response = await request(app).get('/teste');
      expect(response.text).toBe("<html><head></head><body><h1>Teste</h1></body></html>");
    });
});

describe("Tests route: GET /asdsa", () => {
  test("Should return status 200 - OK", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.statusCode).toBe(200);      
  });
  test("Should respond with a HTML 'Page Not Found' in h1", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.text).toBe("<html><head></head><body><h1>Page Not Found</h1></body></html>");
  });
});

describe("Tests route: POST /users/newuser", ()=>{
  test("should return 201", async ()=>{
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
  test("shouldnt accept email duplicate returning 409 status ", async ()=>{
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
  test("should return 201", async ()=>{
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
  test("should return 400", async ()=>{
    const newUser = {
      email: "gobinha.bacana2@snail.com"
    };
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(400);
  });
  test("server is down - returning 500", async ()=>{
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
describe("GET /todos/allTodos",()=>{
  test.todo("GET [{name,description,todo_parent_id},...] also returning 200");
});

// /todos/newTodo
describe("Tests route: POST /todos/newtodo",()=>{
  test.todo("Send {email,name,description} receives http status 201");
  test.todo("Send {name, description} receives http status 400");
  test.todo("Send {email, description} receives http status 400");
  test.todo("Send {email,name} receives http status 201");
  test.todo("Send {email,name,description} with server down receives http status 500");
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});