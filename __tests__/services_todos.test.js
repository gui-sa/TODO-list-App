'use strict'

const { Prisma } = require('@prisma/client');
const {BadRequestError,ErrorHandler} = require('./../services/errors');
const todos_controller = require('./../controllers/todos');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();

// You can skip others tests in development by using test.only();
// You can inject things into npm run test by using ' -- '
// Example... If you want to run just one specific file: 
    // npm run test -- ./__tests__/services_todos.test.js 

afterEach(()=>{
    jest.restoreAllMocks();
});

describe.only("Create a role new Todo",()=>{
    test("Enters userEmail, todoName, todoDescription within object and return http status 201", async ()=>{
        const frontObj = {
            email:"teste@snails.com",
            name:"Fazer um teste",
            description: "Importante testar"
        };
        jest.spyOn(todos_controller,"createEmptyTodo").mockImplementation();
        const req = {body:{...frontObj}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        jest.spyOn() // Tem que simular o retorno do objeto recebendo email e retornando ID do user
        //dentro da funcao ela monta o {data:{}} do todo e envia.
        await todos_controller.createEmptyTodo(req,res);
        expect(res.status).toBeCalledWith(201);
        expect(res.send).toBeCalled();
    });
    test.todo("Return http status 400 - bad request user is missing");
    test.todo("Return http status 400 - bad request name is missing");
    test.todo("Return http status 500 - server is down");
});

describe("Get all todos",()=>{
    test.todo("Return http status 200");
    test.todo("Receive prisma error returning 500 ");
});


afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

