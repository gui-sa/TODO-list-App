'use strict' 

const app = require('./../index');
const request = require('supertest');
const {Prisma} = require('@prisma/client');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();

require('dotenv').config({path:`${__dirname}/../.env-test`});
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTE;

const clearAllTestDatabase = async function(){
  if(process.env.DATABASE_URL === "postgresql://postgres:postgres@localhost:5432/test_app?schema=public"){
    throw new Error("Clear test action not permmited on Production Database");
  }else if(process.env.DATABASE_URL === "postgresql://postgres:postgres@localhost:5432/test_test_app?schema=public"){
    await prisma.users.deleteMany({where:{}});
    await prisma.todos.deleteMany({where:{}});
  }else{
    throw new Error("Strange database URL injected for clear action");
  }
};

beforeAll( async ()=>{
  await clearAllTestDatabase();
});

afterEach(()=>{
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("GET /teste", () => {
    test("Should return status 200 - OK", async () => {
      const response = await request(app).get('/teste');
      expect(response.statusCode).toBe(200);      
    });
    test("Should respond with a HTML 'Teste' in h1", async () => {
      const response = await request(app).get('/teste');
      expect(response.text).toBe("<html><head></head><body><h1>Teste</h1></body></html>");
    });
});

describe("GET /asdsa", () => {
  test("Should return status 200 - OK", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.statusCode).toBe(200);      
  });
  test("Should respond with a HTML 'Page Not Found' in h1", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.text).toBe("<html><head></head><body><h1>Page Not Found</h1></body></html>");
  });
});

describe("POST /users/newuser", ()=>{
  test("should create a complete sending new user 'Gobinha bacana' in the 'test_test_app' database", async ()=>{
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
  test("shouldnt accept email duplicate returnin 409 status ", async ()=>{
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
  test("should create a new user 'Gobinha bacana2' in the 'test_test_app' database", async ()=>{
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
  test("shouldnt create a new user returning 424", async ()=>{
    const newUser = {
      email: "gobinha.bacana2@snail.com"
    };
    const response = await request(app)
                          .post('/users/newuser')
                          .send(newUser)
                          .set('Content-Type', 'application/json');
    expect(response.statusCode).toBe(424);
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


afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});