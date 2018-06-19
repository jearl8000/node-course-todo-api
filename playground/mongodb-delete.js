// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log("Connected to MongoDB server");

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Winco run'})
    //     .then((result) => {
    //         console.log(result);
    //     });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'})
    //     .then((result) => {
    //         console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false})
    //    .then((result) => {
    //        console.log(result);
    //    });


    // challenge
    // db.collection('Users').deleteMany({name: 'Just Testing'})
    //     .then((result) => {
    //         console.log(result);
    //     });
    
    db.collection('Users').findOneAndDelete({
       _id: new ObjectID('5b27c2cdb2b62c5d7033f692')
    }).then((result) => {
           console.log(result);
       });
    

    // db.close();
});