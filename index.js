const express = require("express");
const env = require('./env.js');

const app = express();

app.listen(env.PORT, () => {
    console.log(`App listening on port ${env.PORT}`);
});