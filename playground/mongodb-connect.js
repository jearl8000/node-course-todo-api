// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// example of es6 object destructuring
// var user = {name: 'Tester', age: 1};
// var {name} = user; 

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log("Connected to MongoDB server");

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to add to collection', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });


    // db.collection('Users').insertOne({
    //     name: 'Just Testing',
    //     age: 21,
    //     location: 'Tokyo, JP' 
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to add user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    db.close();
});