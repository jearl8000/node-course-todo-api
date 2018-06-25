const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

// remove multiple - remove all with empty query
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// will return the found-and-deleted item
// Todo.findOneAndRemove - takes a query object
// Todo.findByIdAndRemove - takes the id as a string

Todo.findByIdAndRemove('5b2f275f43801f096905fbe8').then((todo) => {
    console.log(todo);
});

