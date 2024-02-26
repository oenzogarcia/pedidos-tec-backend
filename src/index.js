require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`Servidor de pé na porta: ${process.env.PORT}`);
});
