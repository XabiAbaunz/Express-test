const request = require('supertest');
const PORT = process.env.PORT || 4444;
const url = `http://localhost:${PORT}`;

describe('Testing index', () => {
    it('GET /', async () => {
        const res = await request(url).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe('application/json');
        expect(res.type).toMatch(/json/);
    });

    it('POST /send', async () => {
        // Reset the fakeDB before each test
        await request(url).post('/reset').send();

        let res = await request(url).get('/');
        console.log(res.body.data);
        expect(res.body.data.length).toBe(0);

        res = await request(url).post('/send').send({
            email: 'janire@example.com',
        });

        expect(res.type).toMatch(/json/);
        expect(res.statusCode).toBe(201);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].email).toMatch('janire@example.com');
    });

    it('DELETE /destroy/:id', async () => {
        const res = await request(url).get('/');
        const length = res.body.data.length;
        // The last element will be at position length - 1
        const id = res.body.data[length - 1].id;

        const response = await request(url).delete(`/destroy/${id}`);
        expect(response.type).toMatch(/json/);
        expect(res.statusCode).toBe(200);
        expect(response.body.data.length).toBe(length - 1);
    });

    it('PUT /update/:id', async () => {
        // Reset the fakeDB before each test
        await request(url).post('/reset').send();

        res = await request(url).post('/send').send({
            email: 'janire@example.com',
        });

        expect(res.body.data.length).toBe(1);
        const id = res.body.data[0].id;

        res = await request(url).put(`/update/${id}`).send({
            email: 'erabiltzaile@example.com',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].email).toBe('erabiltzaile@example.com');
    });

});
