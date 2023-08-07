'use strict' 

const app = require('./../index')
const request = require('supertest')



describe("GET /teste", () => {
    it("Should respond with a HTML 'Teste' in h1", async () => {
      const response = await request(app).get('/teste');
      expect(response.statusCode).toBe(200);      
      expect(response.text).toBe("<html><head></head><body><h1>Teste</h1></body></html>");
    });
});

describe("GET /asdsa", () => {
  it("Should respond with a HTML 'Page Not Found' in h1", async () => {
    const response = await request(app).get('/asdsa');
    expect(response.statusCode).toBe(200);      
    expect(response.text).toBe("<html><head></head><body><h1>Page Not Found</h1></body></html>");
  });
});


afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});