const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');


/* Response must have status code 200 +
The token must be returned in the response +
The response should return a user object with 2 fields email and subscription, having the data type String + */

describe('login', () => {
    let server = null;

    const userData = {
        "email": "new_user6@example.com",
        "password": "new_user6"
      }

    beforeAll(() => {
        const DB_HOST = "mongodb+srv://oleksiikav:Passw0rd@kavcluster0.gy6eejb.mongodb.net/db-contacts?retryWrites=true&w=majority";
        mongoose.set("strictQuery", true);

        mongoose.connect(DB_HOST)
        .then(() => {
            server = app.listen(3000);
        })
        .catch (error => {
            console.log("server error", error.message);
            process.exit(1);
        })
    });

    afterAll(async() => {
        await mongoose.disconnect();
        server.close();
    })

    it('response status is 200 on login with valid user data', async () => {
        
      
        const response = await request(app)
        .post('/api/users/login')
        .send(userData);


        expect(response.status).toBe(200);
    });

    it('token is returned on login with valid data', async () => {

        const response = await(await request(app)
        .post('/api/users/login')
        .send(userData))._body;

        expect(response).toHaveProperty("token");
    });

    it('"user" object is returned on login with valid user data', async () => {

        const response = await(await request(app)
        .post('/api/users/login')
        .send(userData))._body;

        expect(response).toHaveProperty("user");
        expect(typeof response.user).toBe("object");
    });

    it('"user" object returned on login has properties "email" and "subscription"', async () => {

        const {user} = await(await request(app)
        .post('/api/users/login')
        .send(userData))._body;

        expect(user).toMatchObject({
            email: expect.any(String),
            subscription: expect.stringContaining("starter" || "pro" || "business"),

        });
    });
});