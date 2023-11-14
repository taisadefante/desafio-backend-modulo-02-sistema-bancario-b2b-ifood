const express = require('express');
const { listarTodasAsContas, criarConta, atualizarUsuario, deletarConta, depositar, realizarSaque, realizarTransferencia, verificarSaldo, exibirExtrato } = require('../controladores/controladores');
const { verificarSenha } = require('../intermediarios/senha');
const roteador = express();


roteador.get('/contas', verificarSenha, listarTodasAsContas);
roteador.post('/contas', verificarSenha, criarConta);
roteador.put('/contas/:numeroConta/usuario', verificarSenha, atualizarUsuario);
roteador.delete('/contas/:numeroConta', verificarSenha, deletarConta);
roteador.post('/transacoes/depositar', verificarSenha, depositar);
roteador.post('/transacoes/sacar', verificarSenha, realizarSaque);
roteador.post('/transacoes/transferir', verificarSenha, realizarTransferencia);
roteador.get('/contas', verificarSenha, verificarSaldo);
roteador.get('/contas', verificarSenha, exibirExtrato);

module.exports = roteador;