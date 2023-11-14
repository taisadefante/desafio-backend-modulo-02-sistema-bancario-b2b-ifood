let { identificadorDaConta, saques, contas, depositos, transferencias } = require('../dados/bancodedados');
const { format } = require('date-fns');

const listarTodasAsContas = (req, res) => {
    res.status(200).json(contas);
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório' });
    };
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório' });
    };
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' });
    };
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório' });
    };
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório' });
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' });
    };

    const cpfIgual = contas.find((conta) => {
        conta.usuario.cpf === cpf;
    });
    if (cpfIgual) {
        return res.status(409).json({ mensagem: 'Já existe uma conta com o cpf informado!' });
    };

    const emailIgual = contas.find((conta) => {
        conta.usuario.email === email;
    });
    if (emailIgual) {
        return res.status(409).json({ mensagem: 'Já existe uma conta com o e-mail informado!' });
    };

    const novaConta = {
        numero: identificadorDaConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };

    contas.push(novaConta);
    res.status(201).json();
};

const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const numeroContaValido = contas.find(conta => conta.numero === Number(numeroConta));
    if (!numeroContaValido) {
        return res.status(404).json({ mensagem: 'número da conta invalida' });
    };
    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome é obrigatório' });
    };
    if (!cpf) {
        return res.status(400).json({ mensagem: 'O cpf é obrigatório' });
    };
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'A data de nascimento é obrigatória' });
    };
    if (!telefone) {
        return res.status(400).json({ mensagem: 'O telefone é obrigatório' });
    };
    if (!email) {
        return res.status(400).json({ mensagem: 'O email é obrigatório' });
    };
    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' });
    };

    const conta = contas.filter((conta) => {
        conta.numero !== numeroContaValido.numero
    });

    const cpfIgual = conta.find((conta) => {
        conta.usuario.cpf === cpf
    });
    if (cpfIgual) {
        return res.status(409).json({ mensagem: 'Já existe uma conta com o cpf informado!' });
    };

    const emailIgual = conta.find((conta) => {
        conta.usuario.email === email
    });
    if (emailIgual) {
        return res.status(409).json({ mensagem: 'Já existe uma conta com o email informado!' });
    };

    numeroContaValido.usuario.nome = nome;
    numeroContaValido.usuario.cpf = cpf;
    numeroContaValido.usuario.data_nascimento = data_nascimento;
    numeroContaValido.usuario.telefone = telefone;
    numeroContaValido.usuario.email = email;
    numeroContaValido.usuario.senha = senha;

    return res.status(204).json();
};

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;
    const numeroDeContaValido = contas.find((conta) => {
        conta.numero === Number(numeroConta)
    });

    if (!numeroDeContaValido) {
        return res.status(404).json({ mensagem: 'número da conta invalida' });
    };
    if (numeroDeContaValido.saldo > 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    };

    contas = contas.filter((conta) => {
        conta.numero !== Number(numeroConta)
    });

    return res.status(204).json();
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const contaExiste = contas.find((conta) => {
        conta.numero === Number(numero_conta)
    });
    if (!contaExiste) {
        return res.status(404).json({ mensagem: 'O número da conta é inválido' });
    };
    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero' });
    };
    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios!' });
    };

    contaExiste.saldo += valor;

    const novaData = new Date();
    const dataFormat = format(novaData, "yyyy-MM-dd HH:mm:ss");
    const registrarDeposito = {
        data: dataFormat,
        numero_conta,
        valor
    };
    depositos.push(registrarDeposito);
    return res.status(201).json();
};

const realizarSaque = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const contaExiste = contas.find((conta) => {
        conta.numero === Number(numero_conta)
    });
    if (!contaExiste) {
        return res.status(404).json({ mensagem: 'O número da conta é inválido' });
    };
    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: 'O valor não pode ser menor que zero' });
    };
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'O número da conta, valor e senha são obrigatórios!' });
    };
    if (senha !== contaExiste.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha invalida!' });
    };
    if (valor > contaExiste.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' });
    };
    contaExiste.saldo -= valor;

    const novaData = new Date();
    const dataFormat = format(novaData, "yyyy-MM-dd HH:mm:ss");
    const registroSaque = {
        data: dataFormat,
        numero_conta,
        valor
    };
    saques.push(registroSaque);
    return res.status(201).json();
};

const realizarTransferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !valor || !senha || !numero_conta_destino) {
        return res.status(400).json({ mensagem: 'O número da conta de origem, número da conta de destino, valor e senha são obrigatórios!' });
    }

    const existeContaOrigem = contas.find((conta) => {
        conta.numero === Number(numero_conta_origem)
    });
    if (!existeContaOrigem) {
        return res.status(404).json({ mensagem: 'O número da conta de origem é inválido' });
    };
    const existeContaDestino = contas.find((conta) => {
        conta.numero === Number(numero_conta_destino)
    });
    if (!existeContaDestino) {
        return res.status(404).json({ mensagem: 'O número da conta de destino é inválido' });
    };
    if (senha !== existeContaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha invalida!' });
    };
    if (valor > existeContaOrigem.saldo) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente!' });
    };
    existeContaOrigem.saldo -= valor;
    existeContaDestino.saldo += valor;
    const novaData = new Date();
    const dataFormat = format(novaData, "yyyy-MM-dd HH:mm:ss");
    const registroTransferencia = {
        data: dataFormat,
        numero_conta_origem,
        numero_conta_destino,
        valor
    };
    transferencias.push(registroTransferencia);
    return res.status(201).json();
};

const verificarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    if (!numero_conta || !senha) {
        return res.status(401).json({ mensagem: 'Número da conta e senha precisam ser informados' });
    };

    const existeConta = contas.find((conta) => {
        conta.numero === Number(numero_conta)
    });
    if (!existeConta) {
        return res.status(401).json({ mensagem: 'Conta bancária não encontrada' });
    };

    if (existeConta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha informada invalida' });
    };

    return res.status(200).json({ saldo: existeConta.saldo });
};

const exibirExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e senha precisam ser informados' });
    }

    const existeConta = contas.find(conta => conta.numero === Number(numero_conta));
    if (!existeConta) {
        return res.status(404).json({ mensagem: 'Conta bancária não encontrada' });
    }

    if (existeConta.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: 'Senha informada invalida' });
    }

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        transferencia.numero_conta_destino === numero_conta
    });
    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        transferencia.numero_conta_origem === numero_conta
    });
    const saque = saques.filter((saque) => {
        saque.numero_conta === numero_conta
    });
    const deposito = depositos.filter((deposito) => {
        deposito.numero_conta === numero_conta
    });

    const extrato = {
        deposito,
        saque,
        transferenciasEnviadas,
        transferenciasRecebidas
    }
    return res.status(200).json(extrato)
};

module.exports = {
    listarTodasAsContas,
    criarConta,
    atualizarUsuario,
    deletarConta,
    depositar,
    realizarSaque,
    realizarTransferencia,
    verificarSaldo,
    exibirExtrato
};