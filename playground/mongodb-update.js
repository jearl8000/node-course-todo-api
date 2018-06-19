// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log("Connected to MongoDB server");

    // second argument is the update - google mongodb update operators
    // third argument is options - see findOneAndUpdate docs in mongodb for node
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b291772fa0c6121906706c8')
    //     }, {
    //         $set: {completed: true}
    //     }, {
    //         returnOriginal: false
    //     })
    //     .then((result) => {
    //         console.log(result);
    //     });

    // challenge
    db.collection('Users').findOneAndUpdate({
        name: 'Bro Testing'
    }, {
        $set: { name: 'Bro Testing, Esq.' },
        $inc: { age: 1 }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
    

    // db.close();
});