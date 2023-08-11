'use strict'

const { Prisma } = require('@prisma/client');
const {BadRequestError} = require('./../services/errors');
const users_services = require('./../services/users');

afterEach(()=>{
    jest.restoreAllMocks();
});

describe("Service users - createEmptyUser",()=>{
    test("All params received",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"gui.teste@gmail.com",
            birth: "2020-01-01"
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(users_services.prisma.users,"create").mockImplementation(obj=>obj.data)
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(201); 
        expect(res.send).toHaveBeenCalled();
    });
    test("Params needed only",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(users_services.prisma.users,"create").mockImplementation(obj=>obj.data)
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(201); 
        expect(res.send).toHaveBeenCalled();
    });
    test("Params is missing",async ()=>{
        const newUser = {
            email:"gui.teste@gmail.com",
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(users_services.prisma.users,"create").mockImplementation(obj=>obj.data);
        await users_services.createEmptyUser(req,res);
        expect(res.status).toHaveBeenCalledWith(424); 
        expect(res.send).toHaveBeenCalled();

    });
    test("Repeating a unique member",async ()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"gui.teste@gmail.com",
            birth: "2020-01-01"
        };
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const req = {body:{...newUser}};
        jest.spyOn(users_services.prisma.users,"create").mockImplementation((obj)=>{
            throw new Prisma.PrismaClientKnownRequestError("Same existing client",{code:'KnowRequest'});
        });
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
        jest.spyOn(users_services.prisma.users,"create").mockImplementation((obj)=>{
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