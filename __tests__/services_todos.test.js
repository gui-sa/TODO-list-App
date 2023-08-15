'use strict'

const todos_controller = require('./../controllers/todos');
const todos_services = require('./../services/todos');
const {Prisma} = require('@prisma/client');
const prismaSingleton = require('./../services/prisma');
const { PrismaClientInitializationError } = require('@prisma/client/runtime/library');
const prisma = prismaSingleton();

// You can skip others tests in development by using test.only();
// You can inject things into npm run test by using ' -- '
// Example... If you want to run just one specific file: 
    // npm run test -- ./__tests__/services_todos.test.js 

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
    jest.restoreAllMocks();
});

// Unit test should test the most possible. You mock only when its not possible to test it.
describe("Tests 'createEmptyTodo' from todos controller: ",()=>{
    test("Enters {email, name, description} returning http status 201", async ()=>{
        const userThere = await prisma.users.create({data:{
            name:"Testenildo",
            email:"teste@snails.com",
            birth: null
        }});
        const req = {body:{
            email:"teste@snails.com",
            name:"Fazer Cafe para seu Teste",
            description:"Isso eh uma descricao"
        }};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(201);
    });
    test("Return http status 409 - bad request user is missing", async ()=>{
        const req = {body:{
            name:"Fazer Cafe para seu Testee",
            description:"Isso eh uma descricaoo"
        }};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(400);
    });
    test("Return http status 400 - bad request name is missing", async ()=>{
        const req = {body:{
            email:"teste@snails.com",
            description:"Isso eh uma descricao"
        }};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(400);
    });
    test("Return http status 409 - email do not exist", async ()=>{
        const req = {body:{
            email:"testeStranger@snails.com",
            name:"Fazer Cafe para seu Testee",
            description:"Isso eh uma descricaoo"
        }};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(409);
    })
    test("Return http status 500 - server is down", async ()=>{
        const req = {body:{
            email:"testeStranger@snails.com",
            name:"Fazer Cafe para seu Testee",
            description:"Isso eh uma descricaoo"
        }};
        jest.spyOn(prisma.users,"findFirstOrThrow").mockImplementation(()=>{
            throw new PrismaClientInitializationError;
        });
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(500);
    });
});

describe("Tests 'findAllTodos' from todos controller: ",()=>{
    test("Return http status 200", async ()=>{
        await prisma.todos.deleteMany({where:{}});
        await prisma.users.deleteMany({where:{}});
        const req = {};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.findAllTodos(req,res);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalled();
        expect(res.send).not.toBeCalledWith(undefined);
    });
    test("Receive prisma error returning 500 ", async ()=>{
        jest.spyOn(prisma.todos,"findMany").mockImplementation(()=>{
            throw new Prisma.PrismaClientInitializationError("Server is down");
        })
        const req = {};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await todos_controller.findAllTodos(req,res);
        expect(res.status).toBeCalledWith(500);
        expect(res.send).toBeCalled();
    });
});


afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

