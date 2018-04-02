const express = require('express');
const names = require('starwars-names');
const { Router } = require('./app/Router');

const app = express();
const router = new Router();

router.group('/api', (apiRouter) => {
    apiRouter.group('/v1', (apiV1Router) => {
        apiV1Router.get('/names', (req, res) => {
            res.json(names.all);
        });
        apiV1Router.get('/names', 'SomeController.someMethod');
    });
});

app.use(router.bind(express.Router()));

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
