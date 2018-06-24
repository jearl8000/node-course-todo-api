const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');

const {User} = require('./../server/models/user.js');

// var id = '5b2f038dbaf30bde14ad43b8';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos:', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('findOne Todo:', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log('ID not found.');
//     }
//     console.log('findbyId Todo:', todo);
// }).catch((err) => {
//     console.log('Invalid ID', err);
// });

var userId = '5b2d698ee0d8327da3b22377';

User.findById(userId).then((user) => {
    if(!user) {
        return console.log('ID not found.');
    }
    console.log('findbyId User:', user);
}).catch((err) => {
    console.log('Invalid ID', err);
});