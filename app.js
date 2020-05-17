const express = require('express');
const bodyParser = require('body-parser');
const env = require('./env.js');
const router = require('./routes');
const usersRouter = require('./routes/users');
const {
    User
} = require('./models/db');
const user = new User();

const app = express();

user.sync();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
    next();
});

app.use('/', router);

app.use('/users', usersRouter);

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