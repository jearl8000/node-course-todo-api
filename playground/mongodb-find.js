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

    // db.collection('Todos').find({completed: false})    // returns mongodb cursor
    //     .toArray() // returns a promise
    //     .then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('Unable to fetch todos', err);
    //     }); 

    // querying by ObjectID
    // db.collection('Todos').find({
    //     _id: new ObjectID('5b2725a8c4f8dc881593d0be')
    // })
    //     .toArray()
    //     .then((docs) => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('Unable to fetch todos', err);
    //     }); 

    // getting a count of documents in collection
    // db.collection('Todos').find().count()
    //     .then((count) => {
    //         console.log(`Todos: ${count}`);
    //     }, (err) => {
    //         console.log('Unable to fetch todos', err);
    //     }); 

    db.collection('Users').find({
        name: 'Just Testing'
    }).toArray().then((docs) => {
        console.log('Users found');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to retrieve docs', err);
    });

    // db.close();
});