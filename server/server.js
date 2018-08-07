require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            todos: todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)){ 
        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
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

app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)){ 
        try {
            const todo = await Todo.findOneAndRemove({
                _id: id,
                _creator: req.user._id
            });
            if(todo) {
                res.status(200).send({todo});
            } else {
                res.status(404).send();
            }
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(404).send();
    }
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id, 
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        } 
        
        res.status(200).send({todo});
        
    }).catch((err) => {
        res.status(400).send();
    });

});

app.post('/users', async (req, res) => {
    // console.log(req.body);
    const body = _.pick(req.body, ["email", "password"]);
    const user = new User(body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(200).header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ["email", "password"]);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.status(200).header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try { 
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

// pre-middlewareifying
// app.get('/users/me', (req, res) => {
//     var token = req.header('x-auth');
//     console.log('token: ', token);
//     User.findByToken(token).then((user) => {
//         if (!user) {
//             // freak out
//             console.log('no user returned!');
//             // we COULD do  res.sendStatus(401).send();
//             // or we could be fancy and make the Promise fail
//             return Promise.reject();

//         }
//         console.log('GET /users/me should return something');
//         res.send(user);
//     }).catch((e) => {
//         res.sendStatus(401).send();
//     });
// });

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app: app
};
