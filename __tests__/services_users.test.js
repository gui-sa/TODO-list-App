'use strict'

const { Prisma } = require('@prisma/client');
const {BadRequestError} = require('./../services/errors');
const users_services = require('./../services/users');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();

// You can skip others tests in development by using test.only();
// You can inject things into npm run test by using ' -- '
// Example... If you want to run just one specific file: 
    // npm run test -- ./__tests__/services_users.test.js 

afterEach(()=>{
    jest.restoreAllMocks();
});


describe("Service users - createEmptyUser",()=>{
    test("All params received - Create a new User",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"gui.teste@gmail.com",
            birth: "2020-01-01"
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(prisma.users,"create").mockImplementation(obj=>obj.data)
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(201); 
        expect(res.send).toHaveBeenCalled();
    });
    test("Params needed only - create a new user",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"yeah.snail.com"
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(prisma.users,"create").mockImplementation(obj=>obj.data)
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(201); 
        expect(res.send).toHaveBeenCalled();
    });
    test("Params is missing - return 400",async ()=>{
        // CUIDADO :  nem sempre o que voce espera eh o que acontece
        // A descricao do teste deve ser com base no que foi realmente testado
        const newUser = {
            email:"gui.teste@gmail.com",
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(prisma.users,"create").mockImplementation(obj=>obj.data);
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(400); 
        expect(res.send).toHaveBeenCalled();

    });
    test("Repeating a unique member - return 409",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"gui.teste@gmail.com",
            birth: "2020-01-01"
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(prisma.users,"create").mockImplementation((obj)=>{
            throw new Prisma.PrismaClientKnownRequestError("Same existing client",{code:'KnowRequest'});
        });
        // Quando o mock eh muito aterrorizante uma dica eh criar uma funcao envelope simples.
        // trade: essa funcao envelope nao eh testada... por um outro lado sua baixa complexidade facilita o teste
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(409); 
        expect(res.send).toHaveBeenCalled();

    });
    test("Server is out",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"gui.teste@gmail.com",
            birth: "2020-01-01"
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(prisma.users,"create").mockImplementation((obj)=>{
            throw new Prisma.PrismaClientInitializationError("Database Server is down");
        });
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(500); 
        expect(res.send).toHaveBeenCalled();

    });
});

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });