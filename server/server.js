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

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if (ObjectID.isValid(id)){ 
        Todo.findOneAndRemove({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
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

app.post('/users', (req, res) => {
    // console.log(req.body);
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    user.save().then(() => {
        // console.log("are there tokens??", user.tokens);
        // res.status(200).send(user);
        return user.generateAuthToken();
    }).then((token) => {
        // console.log("is there an auth token??", token);
        res.status(200).header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ["email", "password"]);
    var user = new User(body);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.status(200).header('x-auth', token).send(user);
        });
    }).catch((error) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () =>{
        res.status(400).send();
    });
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
