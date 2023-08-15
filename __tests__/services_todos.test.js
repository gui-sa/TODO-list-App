'use strict'

const todos_controller = require('./../controllers/todos');
const todos_services = require('./../services/todos');
const {Prisma} = require('@prisma/client');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();

// You can skip others tests in development by using test.only();
// You can inject things into npm run test by using ' -- '
// Example... If you want to run just one specific file: 
    // npm run test -- ./__tests__/services_todos.test.js 

afterEach(()=>{
    jest.restoreAllMocks();
});

describe("Create a role new Todo",()=>{
    test("Enters userEmail, todoName, todoDescription within object and return http status 201", async ()=>{
        const frontObj = {
            email:"teste@snails.com",
            name:"Fazer um teste",
            description: "Importante testar"
        };
        jest.spyOn(prisma.users,"findFirst").mockReturnValue({id:Math.floor(Math.random()*1000)});
        jest.spyOn(todos_services,"createEmptyTodo").mockImplementation(obj=>obj);
        const req = {body:{...frontObj}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);        
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(201);
        expect(res.send).toBeCalled();
    });
    test("Return http status 400 - bad request user is missing", async ()=>{
        const frontObj = {
            name:"Fazer um teste",
            description: "Importante testar"
        };
        jest.spyOn(prisma.users,"findFirst").mockReturnValue({});
        jest.spyOn(todos_services,"createEmptyTodo").mockImplementation(obj=>obj);
        const req = {body:{...frontObj}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);        
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalled();
    });
    test("Return http status 400 - bad request name is missing", async ()=>{
        const frontObj = {
            email:"teste@snails.com",
            description: "Importante testar"
        };
        jest.spyOn(prisma.users,"findFirst").mockReturnValue({});
        jest.spyOn(todos_services,"createEmptyTodo").mockImplementation(obj=>obj);
        const req = {body:{...frontObj}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);        
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalled();
    });
    test("Return http status 500 - server is down", async ()=>{
        const frontObj = {
            email:"teste@snails.com",
            name:"Fazer um teste",
            description: "Importante testar"
        };
        jest.spyOn(prisma.users,"findFirst").mockImplementation(()=>{
            throw new Prisma.PrismaClientInitializationError("Server is Down");
        });
        jest.spyOn(todos_services,"createEmptyTodo").mockImplementation(()=>{
            throw new Prisma.PrismaClientInitializationError("Server is Down");
        });
        const req = {body:{...frontObj}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);        
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(500);
        expect(res.send).toBeCalled();
    });
});

describe("Get all todos",()=>{
    test.todo("Return http status 200");
    test.todo("Receive prisma error returning 500 ");
});


afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

