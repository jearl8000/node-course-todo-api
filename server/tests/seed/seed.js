const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');


const todos = [
    { 
        _id: new ObjectID(),
        text: 'First test todo'
    },
    { 
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 11111111
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => { // removes all items from collection
        return Todo.insertMany(todos) // insert the test data
            .then(() => { done(); });  
    })
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    { // valid user with token
        _id: userOneId,
        email: 'test1@test.test',
        password: 'user1pass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({ _id: userOneId, access: 'auth' }, 'secretsalt').toString(),
        }],
    },
    { // user without token
        _id: userTwoId,
        email: 'test2@test.test',
        password: 'user2pass'
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => { 
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    });
};



module.exports = {todos, populateTodos, users, populateUsers};