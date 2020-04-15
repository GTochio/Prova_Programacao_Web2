const axios = require('axios');
const restify = require('restify');
const errors = require('restify-errors');

const server = restify.createServer({
    name: 'Meu app',
    version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'db',

    }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());



server.post('/create', async (req, res, next) => {
    const { id, item, qtd_man, qtd_wman, qtd_child } = req.body;
    await knex('bbq').insert({ id, item, qtd_man, qtd_wman, qtd_child });
    return res.json('Salvo com sucesso');
});

server.get('/read', function (req, res, next) {
    knex('bbq').then((dados) => {
        res.send(dados)
    }, next);
    return next();
});

server.del('/delete/:id', (req, res, next) => {
    const { id } = req.params;
    knex('bbq')
        .where('id', id)
        .del()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError(`Registro de id ${id} não encontrado !`));
            }
            res.send(`Registro de id ${id} excluido com sucesso !`);
        }, next);
    return next();
});

server.get('/bbq/:id', (req, res, next) => {
    const { id } = req.params;
    knex('bbq')
        .where('id', id).first()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError(`Registro de id ${id} não encontrado !`));
            }
            res.send(dados);
        }, next);
    return next();
});

server.put('/update/:id', (req, res, next) => {
    const { id } = req.params;
    const { item, qtd_man, qtd_wman, qtd_child } = req.body;
    knex('bbq')
        .where('id', id)
        .update({ item, qtd_man, qtd_wman, qtd_child })
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError(`Registro de id ${id} não encontrado !`));
            }
            res.send(`Registro de id ${id} atualizado com sucesso !`);
        }, next);
    return next();
});
server.listen(8080, function () {
    console.log('%s está rodando na porta %s', server.name, server.url);
});

server.get('/', restify.plugins.serveStatic({
    directory: './dist',
    file: 'index.html'
}));