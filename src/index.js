const express = require('express');
const rota = require('./roteadores/rotas');
const app = express();

app.use(express.json());
app.use(rota);

app.listen(8080, ()=>{
  console.log("Sua Api está rodando na porta 8080");
});