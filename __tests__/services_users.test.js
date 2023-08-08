'use strict'

const users_services = require('./../services/users');


describe("Service users - createEmptyUser",()=>{
    test("All params received",()=>{
        const newUser = {
            name:"Guilherme Teste",
            email:"gui.teste@gmail.com",
            birth: "2020-01-01"
        };

        const teste = jest.mock('./../services/users').fn);
        console.log(teste);
        //console.log(users_services.createEmptyUser(newUser));
        // Nao rolou... ele retorna uma promise
        // Nao mockou, claramante.
    });
    test("Params needed only",()=>{
        
    });
    test("Params is missing",()=>{
        
    });
    test("Server is out",()=>{
        
    });
});

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });