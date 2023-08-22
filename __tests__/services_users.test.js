'use strict'

const { Prisma } = require('@prisma/client');
const {BadRequestError} = require('./../services/errors');
const users_services = require('./../services/users');
const users_controller = require('./../controllers/users');
const prismaSingleton = require('./../services/prisma');
const prisma = prismaSingleton();


require('dotenv').config({path:`${__dirname}/../.env-test`});
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTE;


// You can skip others tests in development by using test.only();
// You can inject things into npm run test by using ' -- '
// Example... If you want to run just one specific file: 
    // npm run test -- ./__tests__/services_users.test.js 

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

describe("#1 Tests without DB real connection 'createEmptyUser' from user services",()=>{
    test("#1.1 All params received - Create a new User",async ()=>{
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
    test("#1.2 Params needed only - create a new user",async ()=>{
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
    test("#1.3 Params is missing - return 400",async ()=>{
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
    test("#1.4 Repeating a unique member - return 409",async ()=>{
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
    test("1.5 Server is out",async ()=>{
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

// Aqui eu testarei o maximo possivel... com banco de dados... Sem necessariamente testar as rotas pois tenho acesso ao banco de dados
// Acima eu simulei o DB fingindo que nao tenho acesso a ele.
// But, now, I am testing with its function... because actually I can
// Remember that You should test the maximum as possible
describe("#2 Tests 'getUserByEmail' from user controller",()=>{
    test("#2.1 Enters {email} and receive the entire user in which has its email with http status 200", async ()=>{
        await prisma.todos.deleteMany({where:{}});
        await prisma.users.deleteMany({where:{}});
        const req = {body:{email:"teste2@snails.com"}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        const userThere = await prisma.users.create({data:{
            name:"Testenildo2",
            email:"teste2@snails.com",
            birth: null
        }});
        await users_controller.getUserByEmail(req,res);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(userThere);
    });
    test("#2.2 Enters not saved {email} and receive {} with http status 409", async ()=>{
        const req = {body:{email:"testeStrange@snails.com"}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await users_controller.getUserByEmail(req,res);
        expect(res.status).toBeCalledWith(409);
        expect(res.send).toBeCalled();
    });
    test("#2.3 Enters {} and receive {} with http status 400 ", async ()=>{
        const req = {body:{}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await users_controller.getUserByEmail(req,res);
        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalled();
    });
    test("#2.4 Enters saved {email} and receive http status 500 - db server is down", async ()=>{
        jest.spyOn(prisma.users,"findFirstOrThrow").mockImplementation(()=>{
            throw new Prisma.PrismaClientInitializationError("Server is down");
        });
        const req = {body:{email:"teste2@snails.com"}};
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        await users_controller.getUserByEmail(req,res);
        expect(res.status).toBeCalledWith(500);
        expect(res.send).toBeCalled();
    });
        
});

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });