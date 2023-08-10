import { test, expect } from '@playwright/test'
// const mongoose = require('mongoose');
const request = require('supertest');
// const app = require('../app');


test.describe.parallel('API Testing', () => {
  const baseUrl = 'https://kav-node-api.onrender.com'

  const userData = {
    "email": "new_user6@example.com",
    "password": "new_user6"
  }

  test('Simple API Test - Assert Response Status. Response status is 200 on login with valid user data', async ({ request }) => {
    
    const response = await request.post(`${baseUrl}/api/users/login`, {data:userData,})
    

    expect(response.status()).toBe(200)

    const responseBody = JSON.parse(await response.text())
    console.log(responseBody)
  })

  test('Simple API Test - Assert Invalid Endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/users/non-existing-endpoint`)
    expect(response.status()).toBe(404)
  })

  test('Simple API Test - token is returned on login with valid data', async ({ request }) => {
    
    const response = await request.post(`${baseUrl}/api/users/login`, {data:userData,})

    const responseBody = JSON.parse(await response.text())
    expect(responseBody.token).toBeTruthy()
    
  })
  
  test('"user" object is returned on login with valid user data and has has properties "email" and "subscription"', async ({ request }) => {

    const response = await request.post(`${baseUrl}/api/users/login`, {data:userData,})
    
    const responseBody = JSON.parse(await response.text())    

    expect(responseBody).toHaveProperty("user");
    expect(typeof responseBody.user).toBe("object");
    expect(responseBody.user).toMatchObject({
      email: expect.any(String),
      subscription: expect.stringContaining("starter" || "pro" || "business"),

  });

});

})
