var express = require('express');
var bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos: todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)){ 
        Todo.findById(id).then((todo) => {
            if(todo) {
                res.status(200).send({todo});
            } else {
                res.status(404).send();
            }
        }, (e) => {
            res.status(400).send(e);
        }).catch((e) => {
            res.status(400).send(e);
        });
    } else {
        res.status(404).send();
    }
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {
    app: app
};
