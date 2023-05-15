const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms-puc'
    ].join(' ')
}))

app.use(function (req, res, next) {
    console.log("Metodo: ", req.method)
    next()
})

let alunos = []

app.get('/', function (req, res) {
    const nome = req.query.nome
    if (nome) {
        return res.json(alunos.filter(aluno => aluno.nome === nome))
    }
    return res.json(alunos)
})

app.post('/', function (req, res) {
    alunos.push({
        id: alunos.length + 1,
        ...req.body
    })
    res.json(alunos)
})

app.put('/', (req, res) => {
    const index = alunos.findIndex(x => x.id === req.body.id)
    if(index > -1) {
        alunos[index] = req.body
    }
    res.json(alunos)
})


app.delete('/', (req, res) => {
    alunos = alunos.filter(x => x.id !== req.body.id)
    res.json(alunos)
})

app.listen(3000, () => {
    console.log("Esta rodando em http://localhost:3000")
})