const express = require('express');
const bodyParser = require('body-parser');
const env = require('./env.js');
const router = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', router);

app.use((req, res, next) => {
    const err = new Error('Not Found!');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status);
    res.json({
        message: err.message,
        error: err
    })
})

app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
});