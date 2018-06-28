require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)){ 
        Todo.findByIdAndRemove(id).then((todo) => {
            if(todo) {
                res.status(200).send({todo});
            } else {
                res.status(404).send();
            }
        }).catch((e)=> {
            res.status(400).send(e);
        });
    } else {
        res.status(404).send();
    }
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);
    if (!ObjectID.isValid(id)){ 
        return res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } 
        
        res.status(200).send({todo});
        
    }).catch((err) => {
        res.status(400).send();
    });

});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app: app
};
