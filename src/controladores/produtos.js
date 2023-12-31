const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        if (categoria) {
            const produtos = await knex('produtos')
            .where({ usuario_id: usuario.id })
            .andWhere('categoria', 'ilike', categoria)
            
            return res.status(200).json(produtos);
        }
            const produtos = await knex('produtos')
            .where({ usuario_id: usuario.id })
            
            return res.status(200).json(produtos);
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const obterProduto = await knex('produtos')
            .where({usuario_id: usuario.id})
            .andWhere({ id })
            .first()

        if (!obterProduto) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(obterProduto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {

        const produto = await knex('produtos').insert(
            {
                usuario_id: usuario.id,
                nome,
                estoque,
                preco,
                categoria,
                descricao,
                imagem
            }
        ).returning('*')

        if (!produto[0]) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const produto = await knex('produtos')
            .where({ usuario_id: usuario.id })
            .andWhere({ id })
            .first()

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const body = {};

        nome, estoque, preco, categoria, descricao, imagem

        if (nome) {
            body.nome = nome
        }

        if (estoque) {
            body.estoque = estoque
        }

        if (preco) {
            body.preco = preco
        }

        if (categoria) {
            body.categoria = categoria
        }

        if (descricao) {
            body.descricao = descricao
        }

        if (imagem) {
            body.imagem = imagem
        }

        const produtoAtualizado = await knex('produtos')
            .update(body)
            .where({ id })
            .andWhere({ usuario_id: usuario.id })

        if (produtoAtualizado === 0) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produtoSelecionado = await knex('produtos')
            .where({ usuario_id: usuario.id })
            .andWhere({ id })
            .first()
        
    if (!produtoSelecionado) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produtos').del().where({ id })

        if (produtoExcluido === 0) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}